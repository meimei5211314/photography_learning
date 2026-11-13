'use strict';

// Publish only browser runtime files and required photo credits.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const output = path.resolve(root, '_site');
const files = new Set(['index.html', 'docs/07-media-credits.md', 'docs/12-v3-media-credits.md']);
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

for (const match of html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)=["']([^"']+)["']/gi)) {
  const relative = match[1];
  if (!/^[\w.-]+\.(?:js|css)$/.test(relative)) {
    throw new Error(`Expected a local root-level JS/CSS resource: ${relative}`);
  }
  files.add(relative);
}

function collectAssets(directory) {
  const absolute = path.join(root, directory);
  if (fs.lstatSync(absolute).isSymbolicLink()) throw new Error(`Symlink is not publishable: ${directory}`);
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const relative = `${directory}/${entry.name}`;
    if (entry.isSymbolicLink()) throw new Error(`Symlink is not publishable: ${relative}`);
    if (entry.isDirectory()) collectAssets(relative);
    else if (entry.isFile() && /\.(?:jpg|jpeg|png|webp|avif|gif|svg)$/i.test(entry.name)) files.add(relative);
    else throw new Error(`Unexpected file in public assets: ${relative}`);
  }
}
collectAssets('assets');

// Validate every input before replacing a previous local build.
for (const relative of files) {
  const absolute = path.resolve(root, relative);
  if (!absolute.startsWith(root + path.sep) || !fs.lstatSync(absolute).isFile()) {
    throw new Error(`Invalid public file: ${relative}`);
  }
  const real = fs.realpathSync(absolute);
  if (real !== absolute) throw new Error(`Symlink or redirected path is not publishable: ${relative}`);
}
if (path.dirname(output) !== root || path.basename(output) !== '_site') throw new Error('Invalid output directory');
if (fs.existsSync(output)) {
  if (fs.lstatSync(output).isSymbolicLink()) throw new Error('Refusing to replace a linked output directory');
  fs.rmSync(output, { recursive: true });
}
fs.mkdirSync(output);
for (const relative of files) {
  const destination = path.join(output, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, relative), destination);
}
fs.writeFileSync(path.join(output, '.nojekyll'), '');
let commit = process.env.GITHUB_SHA || '';
if (!commit) {
  try { commit = execFileSync('git', ['-c', `safe.directory=${root.replaceAll('\\', '/')}`, 'rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { commit = 'local'; }
}
if (commit !== 'local' && !/^[a-f0-9]{40,64}$/i.test(commit)) throw new Error('Invalid commit identifier');
fs.writeFileSync(path.join(output, 'version.json'), JSON.stringify({ commit, builtAt: new Date().toISOString() }, null, 2) + '\n');
const bytes = [...files].reduce((sum, relative) => sum + fs.statSync(path.join(output, relative)).size, 0);
console.log(`Built ${files.size + 2} public files (${bytes.toLocaleString('en-US')} runtime/credit bytes) in _site/`);
console.log(`Source commit: ${commit}`);
