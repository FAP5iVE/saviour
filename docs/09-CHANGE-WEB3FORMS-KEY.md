# 09. How to change the Web3Forms key later

Written Fri 6 Nov 2026. Plain steps, no coding knowledge needed for method A or C.

## What the key is

The quote form on the site sends every request through **Web3Forms**. Web3Forms needs an **access key** to know which inbox the request goes to. The key is tied to the email address it was made for.

- The key is **public by design**. It sits in the page code of every site that uses Web3Forms. It is not a password, and it is safe to keep in this project and to share with whoever helps you build the site.
- It lives in **one place only**: `index.html`, in this line (search the file for `access_key`):

  ```html
  <input type="hidden" name="access_key" value="THE-KEY-IS-HERE" />
  ```

- The key currently in the site was set on 6 Nov 2026 and ends in `76fe`.
- Nothing else needs changing when you swap the key. The security policy (`_headers`) already allows the form to talk to `api.web3forms.com`.

## When you would change it

- You want requests to go to a **different email address** (for example a new business email).
- The key was **misused** (you start getting spam through the form) and you want a fresh one.
- You moved the project to a new Web3Forms account.

## Step 1: get the new key

1. Go to **web3forms.com**.
2. In the "Create your Access Key" box, type the email address that **should receive the requests from now on**.
3. Web3Forms emails you a new access key (a long code like `1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e`). Verify the address first if it asks you to.
4. Copy the key exactly. No spaces before or after.

## Step 2: put the new key in the site (pick one method)

### Method A: ask Claude (easiest)

Paste the new key into the chat and say "change the Web3Forms key". Claude replaces it, runs the checks and gives you a new zip.

### Method B: one command (needs Node 20 or newer)

From the project folder:

```bash
npm run launch:fill -- --key PASTE-THE-NEW-KEY-HERE
```

The command checks that the key looks right (a UUID), replaces the old one, and proves the security hash was not disturbed. You can run it as many times as you like. Add `--dry-run` to see what it would do without changing anything.

### Method C: edit by hand

1. Open `index.html` in any text editor (Notepad is fine, VS Code is better).
2. Search for `access_key`.
3. Replace only the code between the quotes after `value=`. Keep the quotes.
4. Save the file.

## Step 3: check it

If you have Node installed:

```bash
npm run qa:launch
```

It should end with `0 failure(s)`. (Before the domain is set it also lists the domain warnings. Those are normal until launch.)

## Step 4: put the change on the live site

The change only reaches visitors once the site is published again.

- **Cloudflare Pages connected to GitHub:** commit the changed `index.html` and push. Cloudflare rebuilds on its own.
- **Uploaded by hand:** run `npm run build`, then upload the `dist` folder again.

See `docs/08-LAUNCH-RUNBOOK.md` for the full deploy steps.

## Step 5: test the real form (do not skip)

1. Open the **live** site on your phone.
2. Fill in the quote form with your own name and number, tick the consent box, press "Send request".
3. The page should show "Thank you, we received your message."
4. Within a minute or two the request should arrive in the **new** inbox. Check the spam or junk folder too, and mark it "not spam" the first time.

If the old inbox still gets requests, the site has not been republished yet, or your phone is showing a saved copy. Reload the page, or open it in a private window.

## If something goes wrong

| What you see | Likely cause | Fix |
|---|---|---|
| The form says "Sorry, that didn't send" and offers WhatsApp and call links | The key is empty, mistyped, or Web3Forms did not accept it | Check there are no spaces or missing characters in the key. Make a fresh key at web3forms.com and repeat step 2 |
| "Thank you" shows but no email arrives | The inbox address was not verified, or the email went to spam | Check spam. Make sure you verified the address with Web3Forms. Send another test |
| Nothing changed after you edited `index.html` | The site was not republished, or the browser kept an old copy | Do step 4, then reload in a private window |
| `npm run launch:fill` says the key "does not look like a Web3Forms access key" | A character was lost when copying | Copy the full key again from the Web3Forms email |

While the form is broken, visitors can still reach you: the failure message shows the WhatsApp, phone and email links, and the WhatsApp button and the phone link work on their own.

## Do not

- Do not put the key anywhere except that one `access_key` field.
- Do not delete the field. If the key is empty the form cannot send, and the page logs a warning in the browser console.
- Do not change the other two hidden fields (`subject`, `from_name`) unless you want a different email subject line.
