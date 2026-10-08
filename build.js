// build.js —— 解析 ../术语总表.md，生成内嵌数据的 index.html
const fs = require("fs");
const path = require("path");

const md = fs.readFileSync(path.join(__dirname, "..", "术语总表.md"), "utf8");
const lines = md.split("\n");

let domain = "", category = "";
const terms = [];
const seen = new Set();

for (const line of lines) {
  const h1 = line.match(/^#\s+第[一二]部分[：:](.+?)（/);
  if (h1) { domain = h1[1].includes("AI") ? "AI" : "制造"; continue; }
  const h2 = line.match(/^##\s+(.+)/);
  if (h2) { category = h2[1].replace(/^[一二三四五六七八九十]+、/, "").trim(); continue; }
  const m = line.match(/^\|(.+?)\|(.+?)\|(.+?)\|\s*$/);
  if (!m) continue;
  const abbr = m[1].trim(), full = m[2].trim(), meaning = m[3].trim();
  if (abbr.startsWith("英文缩写") || abbr.startsWith("---")) continue;
  const key = abbr + "|" + full;
  if (seen.has(key)) continue;
  seen.add(key);
  terms.push({ abbr, full, meaning, domain, category });
}

console.log(`解析到 ${terms.length} 条术语（制造 ${terms.filter(t=>t.domain==="制造").length} / AI ${terms.filter(t=>t.domain==="AI").length}）`);

const template = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");
const html = template.replace("/*__DATA__*/", JSON.stringify(terms));
fs.writeFileSync(path.join(__dirname, "index.html"), html);
console.log("已生成 index.html，大小:", (html.length/1024).toFixed(1), "KB");
