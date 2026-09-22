#!/usr/bin/env node
// md2site v1.1.0 — Markdown -> site statique autonome (un seul fichier HTML)
// Usage: node md2site.js <input.md|dir> [-o out.html] [--title "Titre"]
//        node md2site.js --help | --version
// Zero dependance.
const fs = require('fs');
const path = require('path');

const VERSION = '1.1.0';
const USAGE = 'Usage: node md2site.js <input.md|dir> [-o out.html] [--title "Titre"]\nOptions:\n  -o <fichier>    fichier de sortie unique\n  --title <t>     titre du document\n  --help          afficher cette aide\n  --version       afficher la version';

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function parseFrontMatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: md };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: md.slice(m[0].length) };
}

function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  let html = '', inCode = false, codeBuf = [];
  const listStack = []; // niveaux d'indentation ouverts
  const closeLists = () => { while (listStack.length) { html += '</ul>'; listStack.pop(); } };
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCode) { html += '<pre><code>' + esc(codeBuf.join('\n')) + '</code></pre>'; codeBuf = []; inCode = false; }
      else { closeLists(); inCode = true; }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { closeLists(); const l = h[1].length; html += `<h${l}>${inline(h[2])}</h${l}>`; continue; }
    const li = line.match(/^(\s*)[-*+]\s+(.*)$/);
    if (li) {
      const indent = li[1].replace(/\t/g, '    ').length;
      if (!listStack.length) { html += '<ul>'; listStack.push(indent); }
      else if (indent > listStack[listStack.length - 1]) { html += '<ul>'; listStack.push(indent); }
      else { while (listStack.length && indent < listStack[listStack.length - 1]) { html += '</ul>'; listStack.pop(); } }
      html += `<li>${inline(li[2])}</li>`;
      continue;
    }
    if (/^\s*$/.test(line)) { closeLists(); continue; }
    closeLists();
    html += `<p>${inline(line)}</p>`;
  }
  if (inCode) html += '<pre><code>' + esc(codeBuf.join('\n')) + '</code></pre>';
  closeLists();
  return html;
}

function inline(s) {
  // les entites HTML du Markdown source sont d'abord rendues a leur caractere,
  // puis tout est re-echappe une seule fois: &amp; affiche '&' et pas '&amp;amp;'
  s = s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  s = esc(s);
  // images: ![alt](src "titre") — les guillemets sont deja &quot; apres esc
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g, '<img src="$2" alt="$1"$3 ? ` title="$3"` : ""}>')
       .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return s;
}

function page(body, title) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>body{max-width:760px;margin:40px auto;padding:0 20px;font:16px/1.6 system-ui,sans-serif;color:#222}
img{max-width:100%;border-radius:8px}
pre{background:#f4f4f4;padding:12px;border-radius:8px;overflow-x:auto}
code{background:#eee;padding:2px 5px;border-radius:4px}pre code{background:none;padding:0}
a{color:#0b62c4}@media(prefers-color-scheme:dark){body{color:#ddd;background:#141414}pre{background:#1e1e1e}code{background:#2a2a2a}}</style>
</head><body>${body}</body></html>`;
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) { console.log(USAGE); process.exit(0); }
  if (args.includes('--version')) { console.log('md2site ' + VERSION); process.exit(0); }
  const oi = args.indexOf('-o'); const ti = args.indexOf('--title');
  const outFile = oi > -1 ? args[oi + 1] : null;
  const title = ti > -1 ? args[ti + 1] : null;
  const skip = new Set();
  if (oi > -1) { skip.add(oi); skip.add(oi + 1); }
  if (ti > -1) { skip.add(ti); skip.add(ti + 1); }
  const inputs = args.filter((a, i) => !skip.has(i));
  if (!inputs.length) { console.error('Erreur: fichier d\'entree manquant.\n' + USAGE); process.exit(1); }
  const input = inputs[0];
  if (!fs.existsSync(input)) { console.error(`Erreur: "${input}" n'existe pas.`); process.exit(1); }
  let pages = [];
  const st = fs.statSync(input);
  if (st.isDirectory()) {
    const files = fs.readdirSync(input).filter(f => f.endsWith('.md'));
    if (!files.length) { console.error(`Erreur: aucun fichier .md dans "${input}".`); process.exit(1); }
    for (const f of files) pages.push({ name: path.basename(f, '.md'), md: fs.readFileSync(path.join(input, f), 'utf8') });
  } else {
    pages.push({ name: path.basename(input, '.md'), md: fs.readFileSync(input, 'utf8') });
  }
  if (pages.length === 1 || outFile) {
    const p = pages[0];
    const { meta, body } = parseFrontMatter(p.md);
    const out = page(mdToHtml(body), title || meta.title || p.name);
    const dest = outFile || (p.name + '.html');
    fs.writeFileSync(dest, out);
    console.log('OK ->', dest, `(${out.length} octets)`);
  } else {
    const dir = path.dirname(path.resolve(input));
    for (const p of pages) {
      const { meta, body } = parseFrontMatter(p.md);
      fs.writeFileSync(path.join(dir, p.name + '.html'), page(mdToHtml(body), meta.title || p.name));
      console.log('OK ->', path.join(dir, p.name + '.html'));
    }
  }
}
main();