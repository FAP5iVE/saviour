// Replaces "latest" in package.json with the exact version npm installed, as ^x.y.z.
// Run once after the first "npm install", then commit package.json and package-lock.json.
//
//   npm install && npm run pin

import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'package.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

const UNPINNED = new Set(['latest', '*', 'next']);
const rows = [];
let missing = 0;

for (const section of ['dependencies', 'devDependencies']) {
  for (const [name, spec] of Object.entries(manifest[section] ?? {})) {
    if (!UNPINNED.has(spec)) continue;
    const installed = path.join(root, 'node_modules', ...name.split('/'), 'package.json');
    if (!existsSync(installed)) {
      console.error(`pin: ${name} is not installed. Run "npm install" first.`);
      missing += 1;
      continue;
    }
    const { version } = JSON.parse(await readFile(installed, 'utf8'));
    manifest[section][name] = `^${version}`;
    rows.push([section === 'dependencies' ? 'dep' : 'dev', name, spec, `^${version}`]);
  }
}

if (missing > 0) process.exit(1);

if (rows.length === 0) {
  console.log('pin: nothing to pin (no "latest" entries left).');
} else {
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  const width = Math.max(...rows.map((r) => r[1].length));
  console.log('pin: package.json updated');
  for (const [kind, name, from, to] of rows) {
    console.log(`  ${kind}  ${name.padEnd(width)}  ${from} -> ${to}`);
  }
  console.log('\nNow commit package.json and package-lock.json together.');
}
