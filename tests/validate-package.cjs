const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const failures = [];
const required = [
  'SKILL.md',
  'README.md',
  'README.zh-CN.md',
  'agents/openai.yaml',
  'references/motion-lab-contract.md',
  'assets/drag-spring-motion-lab.html',
  'examples/priority-orbit-motion-lab.html',
  'docs/PUBLISHING.md',
  'docs/images/priority-orbit-cubic-handles-desktop.png',
  'docs/images/priority-orbit-cubic-handles-narrow.png',
  'docs/images/drag-spring-effect-layers.png',
  'docs/images/drag-spring-cubic-mode.jpg'
];

function file(relative) { return path.join(root, relative); }
function fail(message) { failures.push(message); }

function imageSize(relative) {
  const data = fs.readFileSync(file(relative));
  if (data.length >= 24 && data.toString('ascii', 1, 4) === 'PNG') {
    return { format: 'png', width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  }
  if (data.length >= 4 && data[0] === 0xff && data[1] === 0xd8) {
    let offset = 2;
    const sof = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
    while (offset + 8 < data.length) {
      if (data[offset] !== 0xff) { offset += 1; continue; }
      while (data[offset] === 0xff) offset += 1;
      const marker = data[offset++];
      if (marker === 0xd8 || marker === 0xd9) continue;
      const length = data.readUInt16BE(offset);
      if (sof.has(marker)) return { format: 'jpg', height: data.readUInt16BE(offset + 3), width: data.readUInt16BE(offset + 5) };
      offset += length;
    }
  }
  fail(`Unsupported image bytes: ${relative}`);
  return null;
}

function validateHtml(relative) {
  const source = fs.readFileSync(file(relative), 'utf8');
  const scripts = [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]);
  if (!scripts.length) fail(`No inline JavaScript found: ${relative}`);
  try { new Function(scripts.join('\n')); }
  catch (error) { fail(`Inline JavaScript failed: ${relative}: ${error.message}`); }
  if (/<script[^>]+src=["']https?:|<link[^>]+href=["']https?:/i.test(source)) fail(`External runtime dependency found: ${relative}`);
  return scripts.length;
}

for (const relative of required) {
  if (!fs.existsSync(file(relative))) fail(`Missing required file: ${relative}`);
  else if (!fs.statSync(file(relative)).size) fail(`Empty required file: ${relative}`);
}

if (fs.existsSync(file('SKILL.md'))) {
  const skill = fs.readFileSync(file('SKILL.md'), 'utf8');
  if (!/^---\r?\nname: prototype-motion-lab\r?\ndescription: Use when /m.test(skill)) fail('Invalid Skill frontmatter or trigger description');
}

if (fs.existsSync(file('agents/openai.yaml'))) {
  const metadata = fs.readFileSync(file('agents/openai.yaml'), 'utf8');
  if (!/display_name:\s*["']Prototype Motion Lab["']/.test(metadata)) fail('Missing display name metadata');
  if (!/allow_implicit_invocation:\s*true/.test(metadata)) fail('Implicit invocation policy is not enabled');
}

let inlineScripts = 0;
for (const relative of ['assets/drag-spring-motion-lab.html', 'examples/priority-orbit-motion-lab.html']) {
  if (fs.existsSync(file(relative))) inlineScripts += validateHtml(relative);
}

const images = {};
for (const relative of required.filter(name => /\.(?:png|jpe?g)$/i.test(name))) {
  if (!fs.existsSync(file(relative))) continue;
  const size = imageSize(relative);
  if (!size) continue;
  images[relative] = size;
  const extension = path.extname(relative).slice(1).toLowerCase();
  if (extension !== size.format && !(extension === 'jpeg' && size.format === 'jpg')) fail(`Image extension mismatch: ${relative} contains ${size.format}`);
  if (size.width < 390 || size.height < 700) fail(`Screenshot is too small: ${relative} ${size.width}x${size.height}`);
}

for (const readmeName of ['README.md', 'README.zh-CN.md']) {
  if (!fs.existsSync(file(readmeName))) continue;
  const readme = fs.readFileSync(file(readmeName), 'utf8');
  const links = [...readme.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1].split('#')[0]).filter(Boolean);
  const imageLinks = [...readme.matchAll(/!\[[^\]]+\]\(([^)]+\.(?:png|jpe?g))\)/gi)].map(match => match[1]);
  if (imageLinks.length < 4) fail(`${readmeName} must embed at least four case screenshots; found ${imageLinks.length}`);
  for (const link of links) {
    if (/^(?:https?:|mailto:)/i.test(link)) continue;
    if (!fs.existsSync(path.resolve(root, decodeURIComponent(link)))) fail(`Broken ${readmeName} link: ${link}`);
  }
}

if (fs.existsSync(file('README.md'))) {
  const englishReadme = fs.readFileSync(file('README.md'), 'utf8');
  if (!/\[简体中文\]\(README\.zh-CN\.md\)/.test(englishReadme)) fail('README.md must link to README.zh-CN.md');
  if (!/^## Why this exists$/m.test(englishReadme)) fail('README.md must explain why the project exists');
  if (!/^## Problems it solves$/m.test(englishReadme)) fail('README.md must explain the problems it solves');
}

if (fs.existsSync(file('README.zh-CN.md'))) {
  const chineseReadme = fs.readFileSync(file('README.zh-CN.md'), 'utf8');
  if (!/\[English\]\(README\.md\)/.test(chineseReadme)) fail('README.zh-CN.md must link to README.md');
  if (!/[\u3400-\u9fff]/.test(chineseReadme)) fail('README.zh-CN.md must contain Simplified Chinese content');
  if (!/^## 为什么做这个$/m.test(chineseReadme)) fail('README.zh-CN.md must explain why the project exists');
  if (!/^## 解决了什么问题$/m.test(chineseReadme)) fail('README.zh-CN.md must explain the problems it solves');
}

if (failures.length) {
  failures.forEach(message => console.error(message));
  console.error(`FAIL: ${failures.length} package requirement(s)`);
  process.exit(1);
}

console.log(JSON.stringify({
  result: 'PASS',
  requiredFiles: required.length,
  inlineScripts,
  screenshots: images,
  networkDependencies: 0
}, null, 2));
