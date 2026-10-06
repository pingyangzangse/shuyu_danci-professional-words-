// merge.js —— 合并 data/*.json 详解数据到 TERMS，重新生成 index.html
const fs = require("fs");
const path = require("path");
const base = path.join(__dirname, "..");
const appDir = __dirname;

const terms = JSON.parse(fs.readFileSync(path.join(appDir, "data", "_terms.json"), "utf8"));
const extra = {};
for (const f of fs.readdirSync(path.join(appDir, "data"))) {
  if (!/^\d+\.json$/.test(f)) continue;
  for (const e of JSON.parse(fs.readFileSync(path.join(appDir, "data", f), "utf8"))) {
    extra[e.abbr] = e;
  }
}
let withDetail = 0;
for (const t of terms) {
  const e = extra[t.abbr];
  if (e) {
    t.ipa = e.ipa || "";
    t.detail = e.detail || "";
    t.related = Array.isArray(e.related) ? e.related : [];
    if (t.detail) withDetail++;
  }
}
console.log(`总词条 ${terms.length}，有详解 ${withDetail}，缺失 ${terms.length - withDetail}`);
if (withDetail < terms.length) {
  console.log("缺失详解的词条:", terms.filter(t => !t.detail).map(t => t.abbr).join(", "));
}
const template = fs.readFileSync(path.join(appDir, "template.html"), "utf8");
fs.writeFileSync(path.join(appDir, "index.html"), template.replace("/*__DATA__*/[]", JSON.stringify(terms)));
console.log("index.html 已生成");
