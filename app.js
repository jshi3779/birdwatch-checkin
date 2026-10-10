(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- data ---------- */
  const PINS = [
    { id: 0, name: "水鸟爱好者", kind: "water", img: "pin-main.png", x: 173, y: 400, s: 76, tag: "鸟类卡" },
    { id: 1, name: "春日舞者", kind: "forest", img: "pin-1.png", x: 62, y: 482, s: 34, tag: "鸟类卡" },
    { id: 2, name: "城市挚友", kind: "city", img: "pin-2.png", x: 268, y: 500, s: 34, tag: "鸟类卡" },
    { id: 3, name: "小雀幸", kind: "forest", img: "pin-3.png", x: 316, y: 380, s: 34, tag: "鸟类卡" },
    { id: 4, name: "苇间歌者", kind: "water", img: "pin-4.png", x: 97, y: 215, s: 34, tag: "鸟类卡" },
  ];
  const TASKS = [
    { name: "小雀幸", cat: "道具卡收集", done: true },
    { name: "水鸟爱好者", cat: "鸟类卡收集", done: false },
    { name: "春日舞者", cat: "道具卡收集", done: true },
    { name: "城市挚友", cat: "鸟类卡收集", done: false },
    { name: "城市挚友", cat: "鸟类卡收集", done: false },
  ];

  /* ---------- navigation ---------- */
  const screens = $$(".screen");
  const tabbar = $("#tabbar");
  let current = "map", prev = "map";

  function show(name) {
    prev = current; current = name;
    screens.forEach(s => s.classList.toggle("is-active", s.dataset.screen === name));
    const isTab = ["map", "tasks", "cards", "me"].includes(name);
    tabbar.classList.toggle("hide", !isTab);
    $$("button[data-tab]", tabbar).forEach(b => b.classList.toggle("is-on", b.dataset.tab === name));
    if (name === "tasks" && typeof animateRing === "function") animateRing();
    $(".fab").style.display = isTab ? "" : "none";
  }
  $$("button[data-tab]", tabbar).forEach(b => b.addEventListener("click", () => show(b.dataset.tab)));
  $("#fab").addEventListener("click", () => show("scan"));
  $$("[data-back]").forEach(b => b.addEventListener("click", () => show(current === "detail" ? (prev === "scan" ? "scan" : "cards") : "map")));
  $("#foundNext").addEventListener("click", () => show("detail"));
  $("#spotGo").addEventListener("click", () => show("scan"));

  /* ---------- map ---------- */
  const pinsEl = $("#pins");
  PINS.forEach(p => {
    const el = document.createElement("button");
    el.className = "pin";
    el.style.cssText = `left:${p.x}px;top:${p.y}px;--s:${p.s}px`;
    el.dataset.id = p.id;
    el.innerHTML = `<div class="head"><img src="assets/${p.img}" alt="${p.name}"></div><div class="ground"></div>`;
    el.addEventListener("click", () => select(p.id));
    pinsEl.appendChild(el);
  });
  function select(id) {
    const p = PINS.find(x => x.id === id);
    $$(".pin").forEach(e => e.classList.toggle("is-sel", +e.dataset.id === id));
    $("#spotName").textContent = p.name;
    $("#spotTag").textContent = p.tag;
    $("#spotImg").src = `assets/${p.id === 0 ? "bird-round.png" : p.img}`;
  }
  select(0);
  $("#mapChips").addEventListener("click", e => {
    const c = e.target.closest(".chip"); if (!c) return;
    $$("#mapChips .chip").forEach(x => x.classList.toggle("is-on", x === c));
    $$(".pin").forEach(el => {
      const p = PINS[+el.dataset.id];
      el.classList.toggle("is-hidden", c.dataset.k !== "all" && p.kind !== c.dataset.k);
    });
  });

  /* ---------- tasks ---------- */
  function renderTasks(filter = "all") {
    const list = $("#taskList");
    list.innerHTML = "";
    TASKS.filter(t => filter === "all" || (filter === "done") === t.done).forEach((t, i) => {
      const li = document.createElement("li");
      li.className = "task " + (t.done ? "done" : "doing");
      li.style.animationDelay = i * 50 + "ms";
      li.innerHTML = `<img src="assets/bird-round.png" alt="">
        <div class="body"><span class="tag">${t.cat}</span><h3>${t.name}</h3>
        <p class="loc"><svg class="ic sm"><use href="#i-pin"/></svg><span>北京市，昌平区，……</span></p></div>
        <span class="state">${t.done ? "已完成" : "进行中"}</span>`;
      list.appendChild(li);
    });
  }
  renderTasks();
  $("#taskTabs").addEventListener("click", e => {
    const c = e.target.closest(".chip"); if (!c) return;
    $$("#taskTabs .chip").forEach(x => x.classList.toggle("is-on", x === c));
    renderTasks(c.dataset.k);
  });
  const doneN = TASKS.filter(t => t.done).length, pct = Math.round(doneN / TASKS.length * 100);
  $("#progressSub").textContent = `${doneN} / ${TASKS.length} 已完成`;
  $("#ringTxt").textContent = pct + "%";
  const ring = $("#ringFg");
  const animateRing = () => {
    ring.style.strokeDashoffset = 314;
    setTimeout(() => ring.style.strokeDashoffset = 314 * (1 - pct / 100), 120);
  };

  /* ---------- cards ---------- */
const grid = $("#cardGrid");
  /* One page (6 cards) per board. Names and facts come from the 《森羽特工》 design doc. */
  const BOARDS = {
    habitat: { label: "栖息地卡", back: "特色", cards: [
      { name: "蟒山森林公园", funcs: ["青山为屏", "林鸟丰富", "灰喜鹊啄木鸟"] },
      { name: "沙河水库", funcs: ["346种鸟类", "观鸟天堂", "飞鸟集公园"] },
      { name: "十三陵水库", funcs: ["碧波荡漾", "珍稀鸟现身", "黑鹳鹈鹕"] },
      { name: "白浮泉公园", funcs: ["观鸟基地", "约30种鸟", "水面广阔"] },
      { name: "滨河森林公园", funcs: ["京北湿地", "黑翅长脚鹬", "休闲健身"] },
      { name: "三角地公园", funcs: ["街心花园", "北红尾鸲", "灵感来源"] },
    ] },
    bird: { label: "鸟类卡", back: "简介", cards: [
      { name: "红隼", funcs: ["国家二级", "空中悬停", "捕食鼠类"] },
      { name: "鹗", funcs: ["国家二级", "白头黑带", "以鱼为食"] },
      { name: "黑翅长脚鹬", funcs: ["红腿娘子", "粉红长腿", "浅水涉禽"] },
      { name: "北红尾鸲", funcs: ["配色艳丽", "较为罕见", "三角地常客"] },
      { name: "黑鹳", funcs: ["国家一级", "十三陵现身", "珍稀候鸟"] },
      { name: "卷羽鹈鹕", funcs: ["国家一级", "冬季来访", "水库稀客"] },
    ] },
    crisis: { label: "生态危机", back: "威胁", cards: [
      { name: "塑料山", funcs: ["环境污染", "人为压力", "清理任务"] },
      { name: "毒藻", funcs: ["环境污染", "水质恶化", "需净水鸟类"] },
      { name: "沙尘暴", funcs: ["自然灾害", "气候驱动", "需植被修复"] },
      { name: "热浪", funcs: ["自然灾害", "气温骤升", "需水域降温"] },
      { name: "外来入侵", funcs: ["系统退化", "入侵植物", "清理任务"] },
      { name: "无声的春天", funcs: ["生物灾害", "虫害蔓延", "需灭虫鸟类"] },
    ] },
    tool: { label: "道具卡", back: "功能", cards: [
      { name: "生态循环", funcs: ["识别鸟类", "记录足迹", "解锁成就"] },
      { name: "红翅旋壁雀拱门", funcs: ["街景装置", "扫码打卡", "获得食物"] },
      { name: "长尾山雀排排坐", funcs: ["街景装置", "扫码打卡", "获得食物"] },
      { name: "夜鹭矗立", funcs: ["街景装置", "扫码打卡", "获得食物"] },
      { name: "珠颈斑鸠孵蛋", funcs: ["街景装置", "扫码打卡", "获得食物"] },
      { name: "望远镜", funcs: ["远距观察", "提高识别", "租赁道具"] },
    ] },
  };
  const LOOKS = [["ticket", "sky"], ["scallop", "ink"], ["stamp", "paper"], ["scallop", "leaf"], ["ticket", "coral"], ["stamp", "paper"]];
  const BOARD_KEYS = Object.keys(BOARDS);

  function renderCards(key) {
    const board = BOARDS[key];
    const off = BOARD_KEYS.indexOf(key);
    grid.innerHTML = "";
    board.cards.forEach((c, i) => {
      const [shape, color] = LOOKS[(i + off) % LOOKS.length];
      const d = document.createElement("div");
      d.className = `pola v-${shape} c-${color}`;
      d.tabIndex = 0; d.setAttribute("role", "button"); d.setAttribute("aria-label", c.name);
      d.style.animationDelay = i * 60 + "ms";
      const long = c.name.length > 5 ? " long" : "";
      d.innerHTML = `<div class="inner">
        <div class="face front"><div class="shape"><div class="panel">
          <span class="name${long}">${c.name}</span><span class="sub">${board.label}</span>
          <div class="ph"><svg class="ic"><use href="#i-image"/></svg></div>
          <span class="date">NO.${String(i + 1).padStart(2, "0")}</span></div></div><span class="badge">#${i + 1}</span></div>
        <div class="face back"><div class="shape"><div class="panel">
          <h4>${board.back}</h4><ul>${c.funcs.map(f => "<li>" + f + "</li>").join("")}</ul>
          <span class="more" data-more>详情 ›</span></div></div></div>
      </div>`;
      const flip = () => d.classList.toggle("flipped");
      d.addEventListener("click", e => {
        if (e.target.closest("[data-more]")) {
          $("#detailTitle").textContent = c.name;
          $(".big-card .tag").textContent = board.label;
          show("detail");
        } else flip();
      });
      d.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
      grid.appendChild(d);
    });
  }
  renderCards("tool");
  $("#catRow").addEventListener("click", e => {
    const c = e.target.closest(".cat"); if (!c) return;
    $$("#catRow .cat").forEach(x => x.classList.toggle("is-on", x === c));
    renderCards(c.dataset.k);
  });

  
  /* ---------- detail ---------- */
  const claim = $("#claimBtn");
  claim.addEventListener("click", () => {
    const done = claim.classList.toggle("done");
    claim.textContent = done ? "已领取 ✓" : "领取";
  });

  show("map");
})();

/* fit the phone frame into short desktop viewports */
(() => {
  const phone = document.getElementById("phone");
  const fit = () => {
    const k = innerWidth > 460 ? Math.min(1, (innerHeight - 40) / 832) : 1;
    phone.style.zoom = k;
  };
  addEventListener("resize", fit); fit();
})();

/* icon-only tab bar: keep accessible names */
document.querySelectorAll("#tabbar button[data-tab]").forEach(b => b.setAttribute("aria-label", b.querySelector("span").textContent));
