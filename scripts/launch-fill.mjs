// Fills in the two launch values the owner supplies: the real domain and the Web3Forms key.
// Lane G (QA and release). Run it once, on launch day, then run  npm run qa:launch.
//
//   node scripts/launch-fill.mjs --domain saviourdigital.mw --key 1234abcd-....
//   node scripts/launch-fill.mjs --domain saviourdigital.mw          (domain only)
//   node scripts/launch-fill.mjs --key 1234abcd-....                 (key only)
//   node scripts/launch-fill.mjs --domain saviourdigital.mw --dry-run (show, change nothing)
//
// What it changes:
//   --domain  every REPLACE-WITH-DOMAIN in index.html, privacy.html, sitemap.xml, and the commented
//             "Sitemap:" line in robots.txt becomes a live line. Pass the bare domain, without
//             https:// and without a trailing slash (www is NOT added: pick one address, see docs/08).
//   --key     the empty value of <input name="access_key"> in index.html.
//
// It never touches the inline script, so the CSP hash in _headers stays valid (it runs
// csp-check logic at the end to prove that). Running it twice is safe.

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);

function opt(name) {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : (args[i + 1] ?? '');
}
const dryRun = args.includes('--dry-run');
const domain = opt('domain');
const key = opt('key');

if (domain === null && key === null) {
  console.error(
    'launch-fill: pass --domain <domain> and/or --key <web3forms key>. See the top of this file.',
  );
  process.exit(1);
}

if (domain !== null) {
  // A bare host name: letters, digits, dots, hyphens, at least one dot. No scheme, path or port.
  if (!/^(?=.{4,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(domain)) {
    console.error(
      `launch-fill: "${domain}" is not a bare domain. Use something like saviourdigital.mw (no https://, no slash).`,
    );
    process.exit(1);
  }
}
if (key !== null) {
  // Web3Forms keys are UUIDs. Anything else is almost certainly a paste mistake.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)) {
    console.error(
      'launch-fill: the key does not look like a Web3Forms access key (a UUID such as 1b2c3d4e-....). Check it.',
    );
    process.exit(1);
  }
}

const changes = [];

async function edit(file, fn) {
  const full = path.join(root, file);
  const before = await readFile(full, 'utf8');
  const after = fn(before);
  if (after !== before) {
    if (!changes.includes(file)) changes.push(file);
    if (!dryRun) await writeFile(full, after);
  }
  return after;
}

if (domain !== null) {
  const host = domain.toLowerCase();
  for (const file of ['index.html', 'privacy.html', 'sitemap.xml']) {
    await edit(file, (text) =>
      text
        // The reminder comments in the three files would read oddly once filled in.
        .replaceAll(
          'Replace REPLACE-WITH-DOMAIN with the real domain before launch',
          'The real domain is filled in (scripts/launch-fill.mjs)',
        )
        .replaceAll('REPLACE-WITH-DOMAIN', host),
    );
  }
  await edit('robots.txt', (text) => {
    // Turn the commented example line into the real one. If already live, leave it alone.
    const line = `Sitemap: https://${host}/sitemap.xml`;
    if (/^Sitemap:/m.test(text)) return text.replace(/^Sitemap:.*$/m, line);
    return text.replace(/^# Sitemap:.*$/m, line);
  });
}

if (key !== null) {
  await edit('index.html', (text) => {
    const re = /(<input\b[^>]*\bname="access_key"[^>]*\bvalue=")[^"]*(")/;
    if (!re.test(text)) {
      console.error(
        'launch-fill: could not find <input name="access_key" value="..."> in index.html.',
      );
      process.exit(1);
    }
    return text.replace(re, `$1${key}$2`);
  });
}

// Prove the inline script (and so the CSP hash) was not disturbed.
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const headers = await readFile(path.join(root, '_headers'), 'utf8');
const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
  (m) => `sha256-${createHash('sha256').update(m[1]).digest('base64')}`,
);
const cspOk = hashes.every((h) => headers.includes(`'${h}'`));

console.log(dryRun ? 'launch-fill (dry run, nothing written):' : 'launch-fill done:');
console.log(changes.length ? `  changed: ${changes.join(', ')}` : '  nothing needed changing');
console.log(
  `  CSP hash still matches the inline script: ${cspOk ? 'yes' : 'NO. Run npm run csp:check'}`,
);
console.log('  Next: npm run qa:launch');
if (!cspOk) process.exit(1);
