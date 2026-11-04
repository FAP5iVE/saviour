// Copies ONLY the public site files into dist/, so docs, scripts, plans and config
// are never published. Point the host (Cloudflare Pages / Netlify) at dist/.
//
//   npm run build
//
// Host settings:  build command = npm run build   |   output directory = dist

import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

// Anything not listed here is NOT deployed.
const PUBLIC = [
  'index.html',
  'privacy.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  '_headers',
  '_redirects',
  'css',
  'js',
  'assets',
];

// Files that live in public folders but must not be published.
// hero-poster.png and hero-og.mp4 are the raw sources the optimised hero files are made from.
const SKIP_NAMES = new Set([
  '.gitkeep',
  'README.md',
  '.DS_Store',
  'Thumbs.db',
  'hero-poster.png',
  'hero-og.mp4',
]);

if (!existsSync(path.join(root, 'index.html'))) {
  console.error('build: index.html not found.');
  process.exit(1);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const entry of PUBLIC) {
  const from = path.join(root, entry);
  if (!existsSync(from)) continue;
  await cp(from, path.join(dist, entry), {
    recursive: true,
    filter: (source) => !SKIP_NAMES.has(path.basename(source)),
  });
}

async function sizeOf(dir) {
  let total = 0;
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    total += item.isDirectory() ? await sizeOf(full) : (await stat(full)).size;
  }
  return total;
}

const total = await sizeOf(dist);
console.log(`build: dist/ ready (${(total / 1024).toFixed(1)} KB in total, includes any video)`);

if (!existsSync(path.join(dist, 'assets', 'vendor', 'vendor.js'))) {
  console.warn('build: assets/vendor/vendor.js is missing. Run "npm run vendor" first.');
}
