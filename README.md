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
"Stamp-collectible" UI: clean white ground, chunky heavy display type, saturated flat tints (blue / red / yellow / green) with light tinted fills, soft blue-tinted shadows and dashed perforation lines. 图鉴 cards are square polaroids; tap to flip and read the function on the back.
