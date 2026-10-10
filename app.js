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
  const LOCKED = new Set([4, 5]);

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
  const CARDS = [
    { name: "生态循环", shape: "ticket",  color: "sky",   funcs: ["识别鸟类", "记录足迹", "解锁成就"] },
    { name: "候鸟迁徙", shape: "scallop", color: "ink",   funcs: ["迁徙路线", "季节提醒", "分享打卡"] },
    { name: "湿地守望", shape: "stamp",   color: "paper", funcs: ["水质监测", "栖息地图", "守护任务"] },
    { name: "林间歌者", shape: "scallop", color: "leaf",  funcs: ["鸣声识别", "录音收藏", "声谱对比"] },
    { name: "城市挚友", shape: "ticket",  color: "coral", funcs: ["城市观鸟", "好友同行", "每日挑战"] },
    { name: "未解锁",   shape: "stamp",   color: "paper", funcs: ["???", "???", "???"] },
  ];
  CARDS.forEach((c, i) => {
    const locked = LOCKED.has(i);
    const d = document.createElement("div");
    d.className = `pola v-${c.shape} c-${c.color}` + (locked ? " locked" : "");
    d.tabIndex = 0; d.setAttribute("role", "button"); d.setAttribute("aria-label", c.name);
    d.style.animationDelay = i * 60 + "ms";
    const no = String(i + 1).padStart(2, "0");
    d.innerHTML = `<div class="inner">
      <div class="face front"><div class="shape"><div class="panel">
        <span class="name">${c.name}</span><span class="sub">道具卡</span>
        <div class="ph"><svg class="ic"><use href="#i-image"/></svg></div>
        <span class="date">NO.${no}</span></div></div><span class="badge">#${i + 1}</span></div>
      <div class="face back"><div class="shape"><div class="panel">
        <h4>功能</h4><ul>${c.funcs.map(f => "<li>" + f + "</li>").join("")}</ul>
        ${locked ? "" : '<span class="more" data-more>详情 ›</span>'}</div></div></div>
    </div>`;
    const flip = () => d.classList.toggle("flipped");
    d.addEventListener("click", e => e.target.closest("[data-more]") ? show("detail") : flip());
    d.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
    grid.appendChild(d);
  });
  $("#catRow").addEventListener("click", e => {
    const c = e.target.closest(".cat"); if (!c) return;
    $$("#catRow .cat").forEach(x => x.classList.toggle("is-on", x === c));
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
