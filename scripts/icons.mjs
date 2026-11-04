// Builds the site's line icons from the "lucide" npm package (ISC licence).
//
//   npm install -D lucide     (already in package.json after "npm install")
//   npm run icons
//
// Output (assets/icons/):
//   <name>.svg    one file per icon: 24x24, no fill, stroke currentColor, stroke-width 1.5, round caps
//   sprite.svg    the same icons as <symbol>s, for <use href="assets/icons/sprite.svg#arrow-right">
//   LUCIDE-LICENSE.txt
//
// Hand-added files in assets/icons/ (whatsapp.svg, social-*.svg, the logo) are never overwritten.
// whatsapp.svg and social-*.svg (single colour, fill=currentColor) ARE copied into sprite.svg as symbols,
// so <use href="assets/icons/sprite.svg#whatsapp"> works and follows the CSS colour.
// To add or swap an icon, edit ICONS below, then run the script again.

import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// our file name -> Lucide icon name (kebab-case, as shown on https://lucide.dev/icons)
const ICONS = {
  // UI
  'arrow-right': 'arrow-right',
  plus: 'plus',
  close: 'x',
  check: 'check',
  phone: 'phone',
  mail: 'mail',
  'map-pin': 'map-pin',
  menu: 'menu',
  // Services (WhatsApp is not here: it is a hand-added brand glyph, assets/icons/whatsapp.svg)
  'service-website': 'app-window',
  'service-starter': 'layout-template',
  'service-shop': 'store',
  'service-search': 'map-pinned',
  'service-social': 'share-2',
  'service-marketing': 'megaphone',
  'service-data': 'clipboard-list',
  'service-maintenance': 'wrench',
};

const STROKE_WIDTH = '1.5';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'assets', 'icons');
const pkgDir = path.join(root, 'node_modules', 'lucide');

if (!existsSync(path.join(pkgDir, 'package.json'))) {
  console.error('icons: "lucide" is not installed. Run: npm install -D lucide');
  process.exit(1);
}

const mod = await import('lucide');
const set = mod.icons ?? mod;
const pascal = (kebab) =>
  kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

// An icon is a list of [tag, attributes] pairs. Some versions wrap it as ['svg', attrs, children].
function childrenOf(node) {
  if (!Array.isArray(node)) return null;
  return typeof node[0] === 'string' ? (node[2] ?? []) : node;
}

const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function render(children) {
  return children
    .map(([tag, attrs]) => {
      const list = Object.entries(attrs ?? {})
        .filter(([key]) => key !== 'key')
        .map(([key, value]) => `${key}="${esc(value)}"`)
        .join(' ');
      return `<${tag} ${list}/>`;
    })
    .join('');
}

const missing = [];
const built = [];
for (const [name, lucideName] of Object.entries(ICONS)) {
  const children = childrenOf(set[pascal(lucideName)]);
  if (!children) {
    const hint = Object.keys(set)
      .filter((key) => key.toLowerCase().includes(lucideName.split('-')[0]))
      .slice(0, 6);
    missing.push(`  ${name}: Lucide has no "${lucideName}"${hint.length ? `. Similar: ${hint.join(', ')}` : ''}`);
    continue;
  }
  built.push([name, render(children)]);
}

if (missing.length > 0) {
  console.error('icons: some icons were not found. Fix the names at the top of scripts/icons.mjs:');
  console.error(missing.join('\n'));
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const attrs =
  `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${STROKE_WIDTH}" ` +
  'stroke-linecap="round" stroke-linejoin="round"';

for (const [name, body] of built) {
  const file = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ${attrs}>${body}</svg>\n`;
  await writeFile(path.join(outDir, `${name}.svg`), file);
}

const symbols = built.map(([name, body]) => `<symbol id="${name}" ${attrs}>${body}</symbol>`);

// Hand-added single-colour brand glyphs: copy their markup into the sprite.
const brandFiles = (await readdir(outDir)).filter(
  (file) => file === 'whatsapp.svg' || /^social-.+\.svg$/.test(file),
);
for (const file of brandFiles) {
  const source = await readFile(path.join(outDir, file), 'utf8');
  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1];
  const inner = source.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1]?.trim();
  if (!viewBox || !inner) {
    console.warn(`icons: could not read ${file}; it was left out of the sprite.`);
    continue;
  }
  symbols.push(
    `<symbol id="${file.replace(/\.svg$/, '')}" viewBox="${viewBox}" fill="currentColor">${inner}</symbol>`,
  );
}

await writeFile(
  path.join(outDir, 'sprite.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join('\n')}\n</svg>\n`,
);

const licence = path.join(pkgDir, 'LICENSE');
if (existsSync(licence)) {
  await writeFile(path.join(outDir, 'LUCIDE-LICENSE.txt'), await readFile(licence, 'utf8'));
} else {
  console.warn('icons: no LICENSE file found in node_modules/lucide. Copy Lucide\'s licence text into assets/icons/LUCIDE-LICENSE.txt by hand.');
}

const version = JSON.parse(await readFile(path.join(pkgDir, 'package.json'), 'utf8')).version;
console.log(`icons: ${built.length} icons written to assets/icons/ (lucide@${version}, stroke-width ${STROKE_WIDTH})`);
console.log('  ' + built.map(([name]) => name).join(', '));
if (!existsSync(path.join(outDir, 'whatsapp.svg'))) {
  console.log('\nStill needed by hand: assets/icons/whatsapp.svg (official WhatsApp glyph, see assets/icons/README.md).');
}
