import subsetFont from "subset-font";
import fs from "fs";
const root = "C:/Users/96155/Desktop/birdwatch-checkin";
let chars = new Set();
// ASCII + common punctuation
for (let i = 32; i < 127; i++) chars.add(String.fromCharCode(i));
"，。、；：？！“”‘’（）《》·…—～￥％＋－×÷→←↑↓✓›‹".split("").forEach(c => chars.add(c));
// GB2312 level 1 (3755 common hanzi)
const dec = new TextDecoder("gbk");
for (let hi = 0xb0; hi <= 0xd7; hi++) for (let lo = 0xa1; lo <= 0xfe; lo++) {
  const s = dec.decode(new Uint8Array([hi, lo]));
  if (s.length === 1 && s !== "\ufffd") chars.add(s);
}
// every char used in the project sources
for (const f of ["index.html", "app.js"]) for (const c of fs.readFileSync(`${root}/${f}`, "utf8")) chars.add(c);
const text = [...chars].join("");
const buf = await subsetFont(fs.readFileSync("zcool.ttf"), text, { targetFormat: "woff2" });
fs.writeFileSync(`${root}/fonts/ZCOOLKuaiLe-subset.woff2`, buf);
console.log(chars.size, buf.length);
