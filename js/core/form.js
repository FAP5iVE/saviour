// Contact form for both modes (Lane E).
//
//   1. Checks the fields in the page (inline messages, never an alert box).
//   2. Sends the request to Web3Forms with fetch, then shows a success or failure state in the page.
//   3. Keeps every "WhatsApp" link in the form up to date with what the visitor has typed, so the
//      message is ready to send even if the form fails. These are real links: they also work
//      without scripts and when the visitor opens one in a new tab.
//   4. Pre-fills the form when a visitor clicks a package, service or showcase link:
//        <a href="#contact" data-package="starter|business|growth">   selects the package
//        <a href="#contact" data-service="<slug>">                    ticks the add-on, or adds a line
//        <a href="#contact" data-demo="<slug>">                       adds a line to the message
//      js/core/nav.js scrolls to #contact; this file only fills in the form.
//   5. On a mouse device, clicking the phone number also copies it (there is often no phone app).
//
// Without scripts the same <form> posts straight to Web3Forms (action and method are in the markup).
// This file must not import from desktop/ or mobile/.

import { hasFinePointer } from './env.js';

const ENDPOINT = 'https://api.web3forms.com/submit';
const TIMEOUT_MS = 20000; // mobile data can be slow; after this we show the fallbacks
const WHATSAPP_TEXT_MAX = 700; // keeps the wa.me link a sensible length
const COPIED_MS = 3000;

const GREETING = "Hello Saviour Digital Solutions, I'd like a quote";

// A phone number: 9 to 15 digits, with an optional leading +. Spaces, dashes, dots and brackets are
// ignored. Deliberately loose: it covers 0886 023 482, +265 886 023 482 and numbers from abroad.
const PHONE_PATTERN = /^\+?\d{9,15}$/;

const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1);
const tidy = (text) => text.trim().replace(/\s+/g, ' ');
const endWithStop = (text) => (/[.!?]$/.test(text) ? text : `${text}.`);

/** @returns {() => void} cleanup */
export function initForm() {
  const form = document.querySelector('[data-form]');
  if (!form) return () => {};

  const wrap = form.parentElement;
  const success = wrap.querySelector('[data-form-success]');
  const fail = form.querySelector('[data-form-fail]');
  const note = form.querySelector('[data-form-note]');
  const submit = form.querySelector('[data-form-submit]');
  const submitLabel = form.querySelector('[data-form-submit-label]');
  const resetButton = wrap.querySelector('[data-form-reset]');
  const whatsappLinks = [...form.querySelectorAll('[data-form-whatsapp]')];
  const copyStatus = document.querySelector('[data-copy-status]');
  const title = form.querySelector('.sv-form__title');
  const whatsappNumber = form.dataset.whatsapp ?? '';

  const control = (name) => form.elements.namedItem(name);
  const addOns = [...form.querySelectorAll('input[name="add_ons"]')];
  const packageSelect = control('package');
  const messageBox = control('message');

  const sendLabel = submitLabel?.textContent ?? 'Send request';
  let sending = false;
  let copiedTimer = 0;

  // Kept on the form, not in variables: the page swaps between desktop and mobile code when the
  // window is resized, and this must survive that. `source` is which button brought the visitor
  // here (for the email); `autofill` is the last line we wrote into the message box.
  const getSource = () => form.dataset.source || 'form';
  const setSource = (value) => (form.dataset.source = value);
  const getAutofill = () => form.dataset.autofill || '';
  const setAutofill = (value) => (form.dataset.autofill = value);

  // The browser's own pop-up messages are replaced by the inline ones below.
  form.noValidate = true;

  // Field rules. Each returns null when fine, or 'empty' / 'invalid' for the message to show.
  const rules = {
    name: (field) => (field.value.trim() ? null : 'empty'),
    phone: (field) => {
      const value = field.value.trim();
      if (!value) return 'empty';
      return PHONE_PATTERN.test(value.replace(/[\s\-().]/g, '')) ? null : 'invalid';
    },
    email: (field) => (field.validity.typeMismatch ? 'invalid' : null),
    consent: (field) => (field.checked ? null : 'empty'),
  };
  const checked = Object.keys(rules);

  // The page holds the wording. Keep the default text of each message so it can be put back.
  const messages = new Map();
  for (const key of checked) {
    const el = form.querySelector(`#e-${key}`);
    if (el) messages.set(key, { el, empty: tidy(el.textContent), invalid: el.dataset.invalidText });
  }

  function clearError(key) {
    const field = control(key);
    const message = messages.get(key);
    if (!field || !message) return;
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    message.el.hidden = true;
  }

  function showError(key, problem) {
    const field = control(key);
    const message = messages.get(key);
    if (!field || !message) return;
    message.el.textContent =
      problem === 'invalid' && message.invalid ? message.invalid : message.empty;
    message.el.hidden = false;
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', message.el.id);
  }

  /** Checks one field and shows or clears its message. Returns true when the field is fine. */
  function validate(key) {
    const field = control(key);
    if (!field) return true;
    const problem = rules[key](field);
    if (problem) showError(key, problem);
    else clearError(key);
    return !problem;
  }

  /** Checks every field. Returns the first field with a problem, or null. */
  function validateAll() {
    let first = null;
    for (const key of checked) {
      if (!validate(key) && !first) first = control(key);
    }
    return first;
  }

  // --- Status line (also read out by screen readers) ---

  function setNote(text) {
    if (note) note.textContent = text;
  }

  // --- WhatsApp message built from the form ---

  const selectedPackage = () => {
    const option = packageSelect?.selectedOptions[0];
    return option && packageSelect.value !== 'not-sure' ? option.textContent.trim() : '';
  };
  const addOnLabel = (box) =>
    box.closest('label')?.querySelector('span')?.textContent.trim() ?? box.value;
  const selectedAddOns = () => addOns.filter((box) => box.checked).map(addOnLabel);

  function whatsappText() {
    const pkg = selectedPackage();
    const extras = selectedAddOns().join(', ');
    let text = GREETING;
    if (pkg && extras) text += ` for the ${pkg} package with: ${extras}`;
    else if (pkg) text += ` for the ${pkg} package`;
    else if (extras) text += ` for: ${extras}`;
    text += '.';

    // Each line the visitor wrote becomes its own sentence.
    const about = (messageBox?.value ?? '')
      .split('\n')
      .map(tidy)
      .filter(Boolean)
      .map(endWithStop)
      .join(' ')
      .slice(0, WHATSAPP_TEXT_MAX);
    if (about) text += ` ${about}`;
    const budget = tidy(control('budget_range')?.value ?? '');
    if (budget) text += ` My budget in kwacha: ${endWithStop(budget)}`;
    const name = tidy(control('name')?.value ?? '');
    if (name) text += ` My name is ${endWithStop(name)}`;
    return text;
  }

  function updateWhatsapp() {
    if (!whatsappNumber) return;
    const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText())}`;
    whatsappLinks.forEach((link) => link.setAttribute('href', href));
  }

  // --- States: form, sending, success, failure ---

  function setSending(on) {
    sending = on;
    submit.disabled = on;
    form.setAttribute('aria-busy', String(on));
    if (submitLabel) submitLabel.textContent = on ? 'Sending' : sendLabel;
  }

  function showForm() {
    success.hidden = true;
    form.hidden = false;
  }

  function showSuccess() {
    fail.hidden = true;
    form.hidden = true;
    success.hidden = false;
    success.querySelector('[tabindex="-1"]')?.focus();
  }

  function showFailure() {
    updateWhatsapp();
    fail.hidden = false;
    fail.querySelector('[tabindex="-1"]')?.focus();
  }

  const packageName = () => selectedPackage() || 'Not sure yet';

  function payload() {
    const data = {
      access_key: control('access_key').value.trim(),
      subject:
        control('subject').value + (selectedPackage() ? ` (${selectedPackage()} package)` : ''),
      from_name: control('from_name').value,
      name: tidy(control('name').value),
      phone: tidy(control('phone').value),
      package: packageName(),
      source: getSource(),
      consent: 'yes',
      consent_at: new Date().toISOString(),
    };
    const email = control('email').value.trim();
    const extras = selectedAddOns().join(', ');
    const budget = tidy(control('budget_range').value);
    const message = messageBox.value.trim();
    if (email) data.email = email;
    if (extras) data.add_ons = extras;
    if (budget) data.budget_range = budget;
    if (message) data.message = message;
    return data;
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (sending) return;
    fail.hidden = true;

    const firstProblem = validateAll();
    if (firstProblem) {
      setNote('Please check the fields marked below.');
      firstProblem.focus();
      return;
    }
    setNote('');

    // A bot ticked the hidden box. Look like a success and send nothing.
    if (control('botcheck')?.checked) {
      showSuccess();
      return;
    }

    if (!control('access_key').value.trim()) {
      // The owner has not pasted the Web3Forms key into index.html yet. Do not pretend it worked.
      console.warn('Saviour form: no Web3Forms access_key in index.html, so nothing was sent.');
      showFailure();
      return;
    }

    setSending(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload()),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (response.ok && result?.success === true) showSuccess();
      else showFailure();
    } catch {
      showFailure(); // offline, blocked or timed out
    } finally {
      clearTimeout(timer);
      setSending(false);
    }
  }

  function onReset() {
    form.reset();
    ['name', 'phone', 'email', 'consent'].forEach(clearError);
    delete form.dataset.autofill;
    delete form.dataset.source;
    setNote('');
    fail.hidden = true;
    showForm();
    updateWhatsapp();
    title?.setAttribute('tabindex', '-1');
    title?.focus();
  }

  // --- Pre-fill from package, service and showcase links ---

  function fillMessage(line) {
    const current = messageBox.value.trim();
    if (!current || current === getAutofill()) {
      messageBox.value = line;
      setAutofill(line);
    } else if (!current.includes(line)) {
      messageBox.value = `${current}\n${line}`; // never overwrite what the visitor typed
    }
  }

  function chooseCard(slug) {
    if (!packageSelect || ![...packageSelect.options].some((option) => option.value === slug))
      return;
    packageSelect.value = slug;
    setSource(`package:${slug}`);
    setNote(`${selectedPackage()} package selected. Add your details below, then send.`);
  }

  function chooseService(slug, link) {
    const box = addOns.find((item) => item.value === slug);
    if (box) {
      box.checked = true;
      setSource(`service:${slug}`);
      setNote(`${addOnLabel(box)} added. Add your details below, then send.`);
    } else if (slug === 'starter') {
      chooseCard('starter'); // the Starter service is the Starter package
      setSource('service:starter');
    } else {
      const name = link
        .closest('[data-accordion-item]')
        ?.querySelector('.sv-svc__name')?.textContent;
      if (name) fillMessage(`I would like to ask about ${lowerFirst(tidy(name))}.`);
      setSource(`service:${slug}`);
      setNote('We added a line to your message. Change it if you like.');
    }
  }

  function chooseDemo(slug, link) {
    const name = link.closest('.sv-demo__text')?.querySelector('.sv-demo__name')?.textContent;
    const live = link.hasAttribute('data-demo-live'); // a real project, not a concept
    if (name) {
      fillMessage(
        live
          ? `I would like a site like the ${tidy(name)}.`
          : `I would like a site like the ${lowerFirst(tidy(name))} concept.`,
      );
    }
    setSource(`demo:${slug}`);
    setNote('We added a line to your message. Change it if you like.');
  }

  function onDocumentClick(event) {
    if (event.button !== 0) return;

    const phone = event.target.closest?.('[data-copy]');
    if (phone && hasFinePointer() && navigator.clipboard) {
      navigator.clipboard.writeText(phone.dataset.copy).then(
        () => {
          if (!copyStatus) return;
          copyStatus.textContent = 'Number copied.';
          clearTimeout(copiedTimer);
          copiedTimer = setTimeout(() => (copyStatus.textContent = ''), COPIED_MS);
        },
        () => {}, // copying is a courtesy; the tel: link still works
      );
      return;
    }

    const link = event.target.closest?.('a[data-package], a[data-service], a[data-demo]');
    if (!link) return;
    showForm(); // a visitor who already sent a request can start another
    if (link.dataset.package) chooseCard(link.dataset.package);
    else if (link.dataset.service) chooseService(link.dataset.service, link);
    else chooseDemo(link.dataset.demo, link);
    updateWhatsapp();
  }

  // --- Wiring ---

  function onFocusOut(event) {
    const key = event.target.name;
    if (!checked.includes(key)) return;
    // Do not scold an empty field just because the visitor tabbed past it. Check what was typed.
    const field = event.target;
    const hasValue = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
    if (hasValue || field.hasAttribute('aria-invalid')) validate(key);
  }

  function onInput(event) {
    const key = event.target.name;
    if (checked.includes(key) && event.target.hasAttribute('aria-invalid')) validate(key);
    updateWhatsapp();
  }

  form.addEventListener('submit', onSubmit);
  form.addEventListener('focusout', onFocusOut);
  form.addEventListener('input', onInput);
  form.addEventListener('change', onInput);
  resetButton?.addEventListener('click', onReset);
  document.addEventListener('click', onDocumentClick);
  updateWhatsapp(); // the browser may have restored or autofilled values

  return function destroy() {
    form.removeEventListener('submit', onSubmit);
    form.removeEventListener('focusout', onFocusOut);
    form.removeEventListener('input', onInput);
    form.removeEventListener('change', onInput);
    resetButton?.removeEventListener('click', onReset);
    document.removeEventListener('click', onDocumentClick);
    clearTimeout(copiedTimer);
    form.noValidate = false;
  };
}
