(function () {
  "use strict";

  const SITE = window.SITE || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value == null || value === false) continue;
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, value === true ? "" : value);
    }
    for (const child of [].concat(children)) if (child) node.append(child);
    return node;
  };

  const icons = () => {
    if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.5 } });
  };

  function initNav() {
    const nav = $(".nav");
    const hero = $(".hero");
    const toggle = $(".nav__toggle");
    const menu = $("#mobile-menu");

    const update = () => {
      const limit = hero ? hero.offsetHeight - nav.offsetHeight - 48 : 0;
      nav.dataset.solid = String(window.scrollY > limit);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.dataset.open = String(open);
      menu.hidden = !open;
      toggle.innerHTML = `<span class="sr-only">${open ? "Закрыть меню" : "Открыть меню"}</span><i data-lucide="${open ? "x" : "menu"}" aria-hidden="true"></i>`;
      icons();
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => e.matches && setOpen(false));

    const links = $$(".nav__links a");
    const targets = links
      .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
      .filter(Boolean);
    let ticking = false;
    const markCurrent = () => {
      ticking = false;
      const line = window.scrollY + window.innerHeight * 0.4;
      let current = targets[0];
      for (const t of targets) if (t.getBoundingClientRect().top + window.scrollY <= line) current = t;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = targets[targets.length - 1];
      links.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + current.id)));
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(markCurrent); }
    }, { passive: true });
    markCurrent();
  }

  function initReveal() {
    const items = $$(".reveal");
    const groups = new Map();
    items.forEach((item) => {
      const parent = item.parentElement;
      const index = groups.get(parent) || 0;
      groups.set(parent, index + 1);
      item.style.setProperty("--d", Math.min(index, 5) * 60 + "ms");
    });

    if (!("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((i) => io.observe(i));
  }

  function initCarousel() {
    const scroller = $("#audience-carousel");
    if (!scroller) return;
    const prev = $('[data-carousel="prev"]');
    const next = $('[data-carousel="next"]');
    const step = () => {
      const card = $(".audience-card", scroller);
      return card ? card.getBoundingClientRect().width + 24 : 320;
    };
    const update = () => {
      const max = scroller.scrollWidth - scroller.clientWidth - 2;
      prev.disabled = scroller.scrollLeft <= 2;
      next.disabled = scroller.scrollLeft >= max;
    };
    prev.addEventListener("click", () => scroller.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }));
    next.addEventListener("click", () => scroller.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }));
    scroller.addEventListener("scroll", update, { passive: true });
    scroller.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev.click(); }
    });
    window.addEventListener("resize", update);
    update();
  }

  const plural = (n, one, few, many) => {
    const a = Math.abs(n) % 100;
    const b = a % 10;
    if (a > 10 && a < 20) return many;
    if (b > 1 && b < 5) return few;
    if (b === 1) return one;
    return many;
  };

  const tbd = (text, tag = "span") => el(tag, { class: "tbd", text });
  const valueOr = (value, fallback, tag = "span") =>
    value ? el(tag, { text: String(value) }) : tbd(fallback, tag);

  function initProject() {
    const p = SITE.project || {};
    if (p.name) {
      $$('[data-site="name"]').forEach((node) => (node.textContent = p.name));
      document.title = `${p.name} — машинный перевод для языков коренных народов`;
      $$(".logo").forEach((a) => a.setAttribute("aria-label", `${p.name} — на главную`));
    }
    if (p.nameEn) $$('[data-site="name-en"]').forEach((node) => (node.textContent = p.nameEn));
  }

  function project(lon, lat) {
    const p = window.RU_MAP.projection;
    const rad = Math.PI / 180;
    const sy0 = Math.sin(p.phi0 * rad);
    const n = (sy0 + Math.sin(p.phi1 * rad)) / 2;
    const c = 1 + sy0 * (2 * n - sy0);
    const r0 = Math.sqrt(c) / n;
    let lam = lon - p.lambda0;
    lam = ((((lam + 180) % 360) + 360) % 360) - 180;
    const r = Math.sqrt(Math.max(0, c - 2 * n * Math.sin(lat * rad))) / n;
    const x = r * Math.sin(lam * rad * n);
    const y = r0 - r * Math.cos(lam * rad * n);
    return [p.tx + p.k * x, p.ty - p.k * y];
  }

  const circlePath = (x, y, r) =>
    `M${(x - r).toFixed(1)} ${y}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0`;

  const SVG = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}) => {
    const node = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  };

  const nobreak = (text) => (text ? text.replace(/ — /g, "\u00a0— ").replace(/ (\S{1,3})$/, "\u00a0$1") : text);

  function initMap() {
    const M = window.RU_MAP;
    const svg = $("#ru-map");
    const cards = $("#region-cards");
    const caption = $("#geo-caption");
    if (!M || !svg) return;

    const regions = (SITE.regions || []).map((r, i) => {
      const placed = typeof r.lat === "number" && typeof r.lon === "number";
      const [x, y] = placed ? project(r.lon, r.lat) : [0, 0];
      return {
        ...r,
        index: i,
        num: String(i + 1).padStart(2, "0"),
        label: nobreak(r.name) || `Регион ${i + 1}`,
        placed,
        x,
        y,
        radius: r.radius || 34,
      };
    });
    const placed = regions.filter((r) => r.placed);

    const fullBox = [0, 0, M.width, M.height];
    const focusBox = () => {
      if (!placed.length) return fullBox;
      const pad = 48;
      let x0 = Math.min(...placed.map((r) => r.x)) - pad;
      let x1 = Math.max(...placed.map((r) => r.x)) + pad;
      let y0 = Math.min(...placed.map((r) => r.y)) - pad;
      let y1 = Math.max(...placed.map((r) => r.y)) + pad;
      const w = Math.max(x1 - x0, (y1 - y0) * 1.1);
      const cx = (x0 + x1) / 2;
      x0 = Math.max(0, cx - w / 2);
      return [x0, Math.max(0, y0), Math.min(M.width - x0, w), y1 - Math.max(0, y0)];
    };
    let box = fullBox;
    const compact = window.matchMedia("(max-width: 640px)");
    const applyBox = () => {
      box = compact.matches ? focusBox() : fullBox;
      svg.setAttribute("viewBox", box.map((v) => v.toFixed(1)).join(" "));
    };
    applyBox();

    svg.append(svgEl("path", { class: "map-dot", d: M.dots.map(([x, y, r]) => circlePath(x, y, r)).join("") }));
    const glowLayer = svgEl("g", { "aria-hidden": "true" });
    const pinLayer = svgEl("g");
    const labelLayer = svgEl("g", { class: "map-label", "aria-hidden": "true" });
    const labelRect = svgEl("rect", { class: "map-label__bg", rx: 15, height: 30 });
    const labelText = svgEl("text", { class: "map-label__text", "text-anchor": "middle", "dominant-baseline": "central" });
    labelLayer.append(labelRect, labelText);
    svg.append(glowLayer, pinLayer, labelLayer);

    const glowFor = (region) => {
      const bands = [[], [], []];
      for (const [x, y, r] of M.dots) {
        const dist = Math.hypot(x - region.x, y - region.y);
        if (dist > region.radius) continue;
        const t = dist / region.radius;
        bands[t < 0.4 ? 0 : t < 0.72 ? 1 : 2].push(circlePath(x, y, Math.min(3.6, r * (1 + 0.45 * (1 - t)))));
      }
      return bands.map((b, i) => svgEl("path", { class: "map-glow", d: b.join(""), "fill-opacity": [0.9, 0.62, 0.34][i] }));
    };

    const showLabel = (region) => {
      if (!region || !region.placed) {
        labelLayer.setAttribute("visibility", "hidden");
        return;
      }
      labelLayer.setAttribute("visibility", "visible");
      labelText.textContent = region.label;
      const width = (labelText.getComputedTextLength() || region.label.length * 8) + 28;
      const height = 30;
      let cx = region.x;
      cx = Math.max(box[0] + width / 2 + 6, Math.min(box[0] + box[2] - width / 2 - 6, cx));
      let cy = region.y - 36;
      if (cy - height / 2 < box[1] + 4) cy = region.y + 36;
      labelRect.setAttribute("x", (cx - width / 2).toFixed(1));
      labelRect.setAttribute("y", (cy - height / 2).toFixed(1));
      labelRect.setAttribute("width", width.toFixed(1));
      labelText.setAttribute("x", cx.toFixed(1));
      labelText.setAttribute("y", cy.toFixed(1));
    };

    let current = 0;
    const pins = regions.map((region) => {
      if (!region.placed) return null;
      const g = svgEl("g", {
        class: "map-pin",
        transform: `translate(${region.x.toFixed(1)} ${region.y.toFixed(1)})`,
        tabindex: "0",
        role: "button",
        "aria-pressed": "false",
        "aria-label": `${region.num}. ${region.label}`,
      });
      const num = svgEl("text", { class: "map-pin__num", "text-anchor": "middle", "dominant-baseline": "central" });
      num.textContent = String(region.index + 1);
      g.append(
        svgEl("circle", { class: "map-pin__hit", r: 18 }),
        svgEl("circle", { class: "map-pin__ring", r: 15 }),
        svgEl("circle", { class: "map-pin__dot", r: 11 }),
        num
      );
      g.addEventListener("click", () => select(region.index));
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(region.index); }
      });
      g.addEventListener("mouseenter", () => showLabel(region));
      g.addEventListener("mouseleave", () => showLabel(regions[current]));
      g.addEventListener("focus", () => showLabel(region));
      g.addEventListener("blur", () => showLabel(regions[current]));
      pinLayer.append(g);
      return g;
    });

    const fact = (label, value, fallback) => el("div", {}, [el("dt", { text: label }), valueOr(value, fallback, "dd")]);
    const items = regions.map((region) => {
      const button = el("button", { type: "button", "aria-pressed": "false" }, region.name ? region.label : tbd(region.label));
      const card = el("li", { class: "region-card" }, [
        el("span", { class: "region-card__num", text: region.num }),
        el("h3", { class: "region-card__name" }, button),
        el("dl", { class: "region-card__facts" }, [
          fact("Народы", region.peoples, "Уточняется"),
          fact("Языки на сайте", region.languages, "Уточняется"),
          fact("Статус", region.status, "Уточняется"),
          region.activity ? fact("Деятельность проекта", region.activity) : null,
        ]),
      ]);
      card.addEventListener("click", () => select(region.index));
      cards.append(card);
      return { card, button };
    });

    function select(index) {
      const region = regions[index];
      if (!region) return;
      current = index;
      glowLayer.replaceChildren(...(region.placed ? glowFor(region) : []));
      pins.forEach((p, i) => p && p.setAttribute("aria-pressed", String(i === index)));
      items.forEach(({ card, button }, i) => {
        card.classList.toggle("is-active", i === index);
        button.setAttribute("aria-pressed", String(i === index));
      });
      if (pins[index]) pinLayer.append(pins[index]);
      showLabel(region);
      if (caption) caption.textContent = `${region.num} · ${region.label}`;
    }

    compact.addEventListener("change", () => {
      applyBox();
      showLabel(regions[current]);
    });

    if (regions.length) select(0);
  }

  function initTranslator() {
    const form = $("#translator-form");
    if (!form) return;
    const bar = $("#tr-bar");
    const slotFrom = $('[data-slot="from"]', bar);
    const slotTo = $('[data-slot="to"]', bar);
    const baseBox = $("#tr-base");
    const select = $("#tr-lang");
    const direction = $("#tr-direction");
    const input = $("#tr-input");
    const output = $("#tr-output");
    const count = $("#tr-count");
    const swap = $("#tr-swap");
    const submit = $("#tr-submit");
    const clear = $("#tr-clear");
    const copy = $("#tr-copy");
    const notice = $("#tr-notice");
    const status = $("#tr-status");
    const credit = $("#tr-credit");
    const max = Number(input.getAttribute("maxlength")) || 2000;

    const cfg = SITE.translator || {};
    const provider = cfg.provider || {};
    const domain = cfg.domain || "general";
    const BASE = cfg.base || "rus";
    const all = (SITE.languages || []).slice();
    const baseName = (all.find((l) => l.id === BASE) || {}).name || "Русский";
    baseBox.textContent = baseName;

    let langs = all.filter((l) => l.id !== BASE);
    let pairs = null;
    let dir = cfg.direction === "to-base" ? "to-base" : "from-base";

    const groups = [
      ["small", "Коренные малочисленные народы России"],
      ["peoples", "Другие народы России"],
      ["world", "Другие языки"],
    ];
    const nameOf = (id) => (id === BASE ? baseName : (all.find((l) => l.id === id) || {}).name || id);
    const has = (id) => langs.some((l) => l.id === id);
    const pair = () => (dir === "from-base" ? [BASE, select.value] : [select.value, BASE]);
    const available = (src, tgt) => (src === BASE || tgt === BASE) && src !== tgt && (!pairs || pairs.has(`${src}-${tgt}`));

    const build = (value) => {
      const nodes = groups
        .map(([group, label]) => {
          const options = langs
            .filter((l) => (l.group || "world") === group)
            .map((l) => el("option", { value: l.id, text: l.name }));
          return options.length ? el("optgroup", { label }, options) : null;
        })
        .filter(Boolean);
      select.replaceChildren(...nodes);
      if (value && has(value)) select.value = value;
    };

    const show = (text, state) => {
      output.textContent = text;
      output.dataset.state = state || "";
      copy.disabled = state !== "done";
    };
    const reset = () => show("Здесь появится перевод", "");

    const setNotice = (content) => {
      notice.hidden = !content;
      notice.replaceChildren(...(content ? [].concat(content) : []));
    };

    const layout = () => {
      if (dir === "from-base") {
        slotFrom.append(baseBox);
        slotTo.append(select);
        select.setAttribute("aria-labelledby", "tr-label-to");
      } else {
        slotFrom.append(select);
        slotTo.append(baseBox);
        select.setAttribute("aria-labelledby", "tr-label-from");
      }
      const [src, tgt] = pair();
      bar.dataset.direction = dir;
      direction.replaceChildren("Направление: ", el("strong", { text: `${nameOf(src)} → ${nameOf(tgt)}` }));
      swap.setAttribute("aria-label", `Поменять направление. Сейчас: ${nameOf(src)} → ${nameOf(tgt)}`);
      input.setAttribute("aria-label", `Текст для перевода, язык: ${nameOf(src)}`);
    };

    const check = () => {
      if (!cfg.endpoint) {
        submit.disabled = true;
        setNotice(el("p", { text: "Сервис перевода пока не подключён — это прототип интерфейса. Перевод не выполняется" }));
        return false;
      }
      const [src, tgt] = pair();
      if (available(src, tgt)) {
        submit.disabled = false;
        setNotice(null);
        return true;
      }
      submit.disabled = true;
      const content = [el("p", { text: `Направление «${nameOf(src)} → ${nameOf(tgt)}» пока недоступно` })];
      if (available(tgt, src)) {
        const flip = el("button", { type: "button", class: "chip", text: `Перевести ${nameOf(tgt)} → ${nameOf(src)}` });
        flip.addEventListener("click", () => swap.click());
        content.push(el("div", { class: "translator__choices" }, flip));
      }
      setNotice(content);
      return false;
    };

    const updateCount = () => {
      count.textContent = `${input.value.length} / ${max}`;
    };

    build(has(cfg.language) ? cfg.language : (langs[0] || {}).id);
    layout();
    updateCount();
    check();

    if (provider.name && credit) {
      credit.replaceChildren("Перевод: ", provider.url ? el("a", { href: provider.url, target: "_blank", rel: "noopener", text: provider.name }) : provider.name);
    }

    select.addEventListener("change", () => {
      layout();
      reset();
      check();
    });

    swap.addEventListener("click", () => {
      dir = dir === "from-base" ? "to-base" : "from-base";
      if (output.dataset.state === "done") {
        const translated = output.textContent;
        show(input.value, "done");
        input.value = translated;
        updateCount();
      } else {
        reset();
      }
      layout();
      check();
    });

    input.addEventListener("input", updateCount);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        form.requestSubmit();
      }
    });

    clear.addEventListener("click", () => {
      input.value = "";
      updateCount();
      reset();
      input.focus();
    });

    copy.addEventListener("click", async () => {
      const text = output.textContent;
      const label = $("span", copy);
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        const range = document.createRange();
        range.selectNodeContents(output);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand("copy");
        sel.removeAllRanges();
      }
      label.textContent = "Скопировано";
      setTimeout(() => (label.textContent = "Копировать"), 1600);
    });

    const statusText = () => {
      const distinct = new Set(langs.map((l) => l.same || l.id)).size;
      let directions = 0;
      for (const l of langs) {
        if (pairs.has(`${BASE}-${l.id}`)) directions++;
        if (pairs.has(`${l.id}-${BASE}`)) directions++;
      }
      const parts = [
        `Сейчас доступно ${distinct} ${plural(distinct, "язык", "языка", "языков")} в паре с русским — ${directions} ${plural(directions, "направление", "направления", "направлений")} перевода. Список обновляется по данным сервиса.`,
      ];
      if (provider.name) parts.push(`Перевод выполняют открытые модели ${provider.name}${provider.org ? ` (${provider.org})` : ""}, введённый текст передаётся на их серверы.`);
      parts.push("Машинный перевод может ошибаться.");
      return parts.join(" ");
    };

    if (cfg.endpoint) {
      fetch(cfg.endpoint)
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((data) => {
          const list = (data.domains || []).filter((d) => d.code === domain).flatMap((d) => d.languages || []);
          if (!list.length) throw new Error("empty");
          pairs = new Set(list);
          const keep = select.value;
          langs = all.filter((l) => l.id !== BASE && (pairs.has(`${BASE}-${l.id}`) || pairs.has(`${l.id}-${BASE}`)));
          build(has(keep) ? keep : (langs[0] || {}).id);
          layout();
          status.textContent = statusText();
          check();
        })
        .catch(() => {
          status.textContent = "Не удалось загрузить список языков сервиса. Перевод может быть временно недоступен — попробуйте обновить страницу позже.";
        });
    } else {
      status.textContent = "Сервис перевода не подключён. Адрес API указывается в файле data.js";
    }

    let busy = false;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (busy || !check()) return;
      const [src, tgt] = pair();
      if (src !== BASE && tgt !== BASE) return;
      const text = input.value.trim();
      if (!text) {
        show("Введите текст, чтобы перевести его", "info");
        input.focus();
        return;
      }

      busy = true;
      submit.disabled = true;
      output.setAttribute("aria-busy", "true");
      show("Переводим…", "pending");
      try {
        const res = await fetch(cfg.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, src, tgt, domain, application: cfg.application }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        const result = Array.isArray(data.result) ? data.result.join("\n") : data.result || data.translation || "";
        if (result) show(result, "done");
        else show("Сервис не вернул перевод. Попробуйте изменить текст", "error");
      } catch (err) {
        show("Не удалось получить перевод. Проверьте подключение к интернету и попробуйте ещё раз", "error");
      } finally {
        busy = false;
        output.removeAttribute("aria-busy");
        check();
      }
    });
  }

  function renderEvidence() {
    const list = $("#evidence");
    if (!list) return;
    list.replaceChildren(
      ...(SITE.evidence || []).filter((f) => f.value != null && f.value !== "").map((f) => {
        return el("li", { class: "fact" }, [
          f.kind ? el("p", { class: "fact__kind", text: f.kind }) : null,
          el("span", { class: "fact__value", text: f.value }),
          el("p", { class: "fact__text", text: f.text }),
          f.source
            ? el("p", { class: "fact__source" }, f.url ? el("a", { href: f.url, target: "_blank", rel: "noopener", text: f.source }) : f.source)
            : null,
        ]);
      })
    );
  }

  const initials = (name) =>
    (name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  function renderTeam() {
    const list = $("#team-list");
    if (!list) return;
    list.replaceChildren(
      ...(SITE.team || []).map((m) => {
        const photo = el("div", { class: "member__photo" });
        if (m.photo) photo.append(el("img", { src: m.photo, alt: m.name || "Фото участника", loading: "lazy", width: 480, height: 600 }));
        else photo.append(el("span", { class: "member__initials", "aria-hidden": "true", text: m.name ? initials(m.name) : "ФИО" }));
        const name = valueOr(m.name, "Фамилия Имя Отчество", "h3");
        name.classList.add("member__name");
        const role = valueOr(m.role, "Должность / роль в проекте", "p");
        role.classList.add("member__role");
        return el("li", { class: "member reveal" }, [
          photo,
          name,
          role,
          m.bio ? el("p", { class: "member__bio", text: m.bio }) : null,
        ]);
      })
    );
  }

  function renderContacts() {
    const c = SITE.contacts || {};
    const email = $("#contact-email");
    if (email) {
      email.replaceChildren(c.email ? el("a", { href: "mailto:" + c.email, text: c.email }) : tbd("Почта проекта уточняется"));
    }
    const fillColumn = (list, items) => {
      if (!list) return;
      list.replaceChildren(...items);
      list.parentElement.hidden = !items.length;
    };
    fillColumn(
      $("#contact-links"),
      (c.links || [])
        .filter((l) => l.href)
        .map((l) => el("li", {}, el("a", { href: l.href, target: "_blank", rel: "noopener", text: l.label })))
    );
    fillColumn(
      $("#contact-authors"),
      (SITE.team || [])
        .filter((m) => m.name)
        .map((m) => el("li", {}, [m.name, m.role ? el("span", { class: "footer__role", text: m.role }) : null]))
    );
    const grid = $(".footer__grid");
    if (grid) {
      const visible = Array.from(grid.children).filter((d) => !d.classList.contains("footer__brand") && !d.hidden);
      grid.dataset.cols = String(visible.length);
    }
    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function initHalftone() {
    const canvas = $("#halftone");
    if (!canvas || !canvas.getContext) return;
    const ink = "#4a2c1f";
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      img.src = canvas.dataset.src;
    };
    new IntersectionObserver((entries, io) => {
      if (entries.some((e) => e.isIntersecting)) { start(); io.disconnect(); }
    }, { rootMargin: "600px 0px" }).observe(canvas);

    const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    const fallback = () => {
      const photo = el("img", {
        class: "halftone-fallback",
        src: canvas.dataset.src,
        alt: canvas.getAttribute("aria-label") || "",
        loading: "lazy",
      });
      canvas.replaceWith(photo);
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const W = Math.round(rect.width);
      const H = Math.round(rect.height);
      if (!W || !H) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const cell = W < 640 ? 6 : W < 1100 ? 7 : 8;
      const sw = Math.ceil((W / cell) * 2);
      const sh = Math.ceil((H / cell) * 2);
      const sample = document.createElement("canvas");
      sample.width = sw;
      sample.height = sh;
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      const scale = Math.max(sw / img.naturalWidth, sh / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      sctx.drawImage(img, (sw - dw) * 0.46, (sh - dh) * 0.7, dw, dh);
      let px;
      try {
        px = sctx.getImageData(0, 0, sw, sh).data;
      } catch (err) {
        fallback();
        return;
      }

      const angle = Math.PI / 4;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const cx = W / 2;
      const cy = H / 2;
      const half = Math.hypot(W, H) / 2 + cell;
      const wide = W >= 640 && canvas.getBoundingClientRect().left <= 1;
      const fadeLeft = wide ? 1 : W * 0.06;
      const fadeRight = W * 0.16;
      const fadeTop = H * 0.12;
      const fadeBottom = H * 0.1;

      ctx.fillStyle = ink;
      ctx.beginPath();
      for (let v = -half; v <= half; v += cell) {
        for (let u = -half; u <= half; u += cell) {
          const x = cx + u * cos - v * sin;
          const y = cy + u * sin + v * cos;
          if (x < 0 || y < 0 || x >= W || y >= H) continue;
          const ix = Math.min(sw - 1, Math.floor((x / W) * sw));
          const iy = Math.min(sh - 1, Math.floor((y / H) * sh));
          const i = (iy * sw + ix) * 4;
          const light = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
          let d = clamp((0.43 - light) / 0.32);
          const edge = Math.min(x / fadeLeft, (W - x) / fadeRight, y / fadeTop, (H - y) / fadeBottom);
          d *= clamp(edge);
          if (d < 0.06) continue;
          const r = Math.sqrt(d) * cell * 0.62;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    };

    img.addEventListener("load", () => {
      draw();
      let t;
      let lastW = canvas.getBoundingClientRect().width;
      new ResizeObserver(() => {
        const w = canvas.getBoundingClientRect().width;
        if (Math.abs(w - lastW) < 2) return;
        lastW = w;
        clearTimeout(t);
        t = setTimeout(draw, 160);
      }).observe(canvas);
    });
    img.addEventListener("error", fallback);
  }

  initProject();
  renderEvidence();
  renderTeam();
  renderContacts();
  initMap();
  initTranslator();
  icons();
  initNav();
  initCarousel();
  initReveal();
  initHalftone();
})();
