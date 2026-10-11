# 观鸟打卡 · Bird-watching Check-in

Mobile web app implemented from the Figma draft
([观鸟打卡](https://www.figma.com/design/vmRLTl7NKZnOS0CnmBlfIC/%E8%A7%82%E9%B8%9F%E6%89%93%E5%8D%A1?node-id=0-1)),
restyled in a soft, illustrated travel-app look (sage / cream palette, chunky rounded cards, coral accent).

## Screens
- **地图** – map with bird pins, category chips, selectable spot card
- **任务** – progress ring, filterable task list
- **图鉴** – card collection (habitat / bird / crisis / tool)
- **我的** – profile, team, medals
- **扫描 → 卡片详情** – camera viewfinder, found card, claim button

## Run
Plain HTML/CSS/JS, no build step. Serve the folder with any static server, e.g.

```bash
npx http-server .
```

## Style
Storybook-crayon UI: warm earthy palette (forest green, mustard, brick red, cream), paper-grain background, wobbly crayon-style outlines (SVG displacement filter), rounded childlike type, gold star stickers and hand-drawn doodles. 图鉴 cards are square collectibles (ticket / scalloped / perforated edges); tap to flip.

## Font
Handwritten marker font **851 GBai 马克笔体**, subset to the characters used in the project and bundled in `fonts/`. The original font is free for personal use only; check its licence before any commercial use.
After adding new characters, regenerate with `node tools/subset-font.mjs <font.ttf> fonts/851Marker-subset.woff2` (needs `npm i subset-font`; `FULL=1` also adds 3755 common hanzi).
