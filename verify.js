const h = require('fs').readFileSync(__dirname + '/test-edge.html', 'utf8');
const checks = [
  ['front-matter non recrache', !(h.includes('---') && h.includes('title: Test'))],
  ['& non double-echappe', !h.includes('&amp;amp;')],
  ['balise HTML brute neutralisee', !/<(b|strong)>HTML brut<\/(b|strong)>/.test(h)],
  ['image convertie en img', /<img src="logo\.png"/.test(h)],
  ['liste imbriquee >=2 ul', (h.match(/<ul>/g) || []).length >= 2],
  ['ul equilibrees', (h.match(/<ul>/g) || []).length === (h.match(/<\/ul>/g) || []).length],
  ['code block ok', h.includes('<pre><code>')],
];
let fail = 0;
for (const [n, ok] of checks) { console.log(ok ? 'OK   ' : 'ECHEC', n); if (!ok) fail++; }
process.exit(fail ? 1 : 0);