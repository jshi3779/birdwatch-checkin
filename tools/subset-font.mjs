import subsetFont from "subset-font";
import fs from "fs";
const [, , input = "font.ttf", output = "fonts/subset.woff2", root = process.cwd()] = process.argv; // usage: node subset-font.mjs <in.ttf> <out.woff2> [projectRoot]
let chars = new Set();
// ASCII + common punctuation
for (let i = 32; i < 127; i++) chars.add(String.fromCharCode(i));
"，。、；：？！“”‘’（）《》·…—～￥％＋－×÷→←↑↓✓›‹".split("").forEach(c => chars.add(c));
// GB2312 level 1 (3755 common hanzi) is added only with FULL=1 (big files!)
const dec = new TextDecoder("gbk");
if (process.env.FULL) for (let hi = 0xb0; hi <= 0xd7; hi++) for (let lo = 0xa1; lo <= 0xfe; lo++) {
  const s = dec.decode(new Uint8Array([hi, lo]));
  if (s.length === 1 && s !== "\ufffd") chars.add(s);
}
// every char used in the project sources
for (const f of ["index.html", "app.js"]) for (const c of fs.readFileSync(`${root}/${f}`, "utf8")) chars.add(c);
const text = [...chars].join("");
const buf = await subsetFont(fs.readFileSync(input), text, { targetFormat: "woff2" });
fs.writeFileSync(`${root}/${output}`, buf);
console.log(chars.size, buf.length);
