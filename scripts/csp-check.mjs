// Checks that the Content-Security-Policy in _headers allows exactly the inline scripts
// that index.html contains. If you edit the inline script, this tells you the new hash.
//
//   npm run csp:check

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const headers = await readFile(path.join(root, '_headers'), 'utf8');

// Inline classic scripts only: <script> with no attributes. (Module scripts and JSON-LD are separate.)
const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const expected = inline.map(
  (code) => `sha256-${createHash('sha256').update(code).digest('base64')}`,
);
const present = [...headers.matchAll(/'(sha256-[A-Za-z0-9+/=]+)'/g)].map((m) => m[1]);

let problems = 0;
for (const hash of expected) {
  if (!present.includes(hash)) {
    console.error(`csp: _headers is missing 'hash ${hash}' for an inline script in index.html`);
    problems += 1;
  }
}
for (const hash of present) {
  if (!expected.includes(hash)) {
    console.error(`csp: _headers lists a hash that matches no inline script: ${hash}`);
    problems += 1;
  }
}

if (problems > 0) {
  console.error('\nFix: put these in script-src in _headers:');
  expected.forEach((h) => console.error(`  '${h}'`));
  process.exit(1);
}
console.log(
  `csp: OK (${expected.length} inline script hash${expected.length === 1 ? '' : 'es'} match)`,
);
