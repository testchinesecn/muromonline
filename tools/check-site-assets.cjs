const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const dist = path.resolve(__dirname, '../dist');
let checked = 0;
function check(reference, directory = dist) {
  if (/^(?:https?:|data:|#|mailto:)/.test(reference)) return;
  const file = path.resolve(directory, reference.split(/[?#]/)[0]);
  assert(file.startsWith(dist + path.sep), `Asset outside dist: ${reference}`);
  assert(fs.existsSync(file) && fs.statSync(file).isFile(), `Missing asset: ${reference}`);
  assert(fs.statSync(file).size > 0, `Empty asset: ${reference}`);
  checked++;
}
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
assert(html.includes('<main>') && html.includes('hero-canvas'), 'Publish the game website, not README.');
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) check(match[1]);
const css = fs.readFileSync(path.join(dist, 'style.css'), 'utf8');
assert(!/@import\s+url\(['"]?https?:/.test(css), 'Do not block page styling on an external font stylesheet.');
for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) check(match[1]);
const characters = path.join(dist, 'assets/characters');
for (const folder of fs.readdirSync(characters)) {
  const directory = path.join(characters, folder);
  if (!fs.statSync(directory).isDirectory()) continue;
  JSON.parse(fs.readFileSync(path.join(directory, 'skeleton.json'), 'utf8'));
  const atlas = fs.readFileSync(path.join(directory, 'skeleton.atlas'), 'utf8');
  for (const match of atlas.matchAll(/^([^\r\n]+\.(?:webp|png|jpg))\r?$/gm)) check(match[1], directory);
}
console.log(`Verified ${checked} local asset references, character atlases and self-hosted fonts.`);
