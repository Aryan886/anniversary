(() => {
  const M = window.MAGAZINE;
  const mag = document.getElementById("mag");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= helpers ================= */
  const days = (() => {
    const start = new Date(M.startDate + "T00:00:00");
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.max(0, Math.round((now - start) / 86400000));
  })();

  const norm = (s) => (typeof s === "string" ? { src: s } : s || { src: "" });
  const photoCount = new Set(
    M.pages.flatMap((p) => [...(p.images || []), p.inset].filter(Boolean).map((s) => norm(s).src))
  ).size;

  const t = (s = "") =>
    String(s)
      .replace(/\{days\}/g, days)
      .replace(/\{photos\}/g, photoCount)
      .replace(/\{name\}/g, M.herName)
      .replace(/\{nickname\}/g, M.nickname)
      .replace(/\{yourName\}/g, M.yourName);

  const pad = (n) => String(n).padStart(2, "0");
  const attr = (s = "") => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const strip = (s = "") => String(s).replace(/<[^>]+>/g, "");
  const arNum = (ar) => {
    if (!ar) return 0.8;
    const [a, b] = String(ar).split("/").map(Number);
    return b ? a / b : a;
  };

  // a photo frame. zoom → opens in the photo viewer
  const fig = (spec, cls = "", { eager = false, zoom = false, style = "" } = {}) => {
    const s = norm(spec);
    const styles = [style, s.ar ? `--ar:${s.ar};--arn:${arNum(s.ar).toFixed(4)}` : ""].filter(Boolean).join(";");
    const src = encodeURI(s.src || "");
    return (
      `<figure class="ph ${cls}" data-path="${attr(s.src)}"` +
      (zoom ? ` data-zoom data-src="${attr(src)}" data-cap="${attr(t(s.caption || ""))}" tabindex="0" role="button" aria-label="Open photo"` : "") +
      (styles ? ` style="${styles}"` : "") +
      `><img src="${attr(src)}" alt="" ${eager ? "" : 'loading="lazy"'} decoding="async"` +
      (s.pos ? ` style="object-position:${s.pos}"` : "") +
      `></figure>`
    );
  };

  // stagger children: adds .reveal + a delay to each top-level tag in a list
  const stagger = (bits, start = 0.1, step = 0.1) =>
    bits
      .filter(Boolean)
      .map((b, k) => b.replace(/^<(\w+)( class="([^"]*)")?/, (m, tag, _c, cls = "") =>
        `<${tag} style="--d:${(start + k * step).toFixed(2)}s" class="reveal ${cls}"`))
      .join("");

  const folio = (n) =>
    `<footer class="folio"><span>${t(M.masthead)} — ${t(M.issueName)}</span><span>p. ${pad(n)}</span></footer>`;

  const head = (p, titleCls = "sec-title") => [
    `<p class="kicker">${t(p.kicker || "")}</p>`,
    `<h2 class="${titleCls}">${t(p.title)}</h2>`,
    p.text ? `<p class="sec-text">${t(p.text)}</p>` : "",
  ];

  /* ================= page renderers ================= */
  const R = {};

  R.cover = () => `
    ${fig(M.cover.image, "parallax", { eager: true })}
    <div class="cover-inner">
      <div class="issue-line">
        <span>${t(M.issue)}</span><span>${t(M.issueName)}</span><span>${t(M.issueDate)}</span>
      </div>
      <h1 class="masthead">${t(M.masthead)}</h1>
      <div class="cover-bottom">
        <div class="cover-feature">
          <p class="kicker">The cover story</p>
          <h2 class="cover-headline">${t(M.cover.headline)}</h2>
          <p class="cover-sub">${t(M.cover.sub)}</p>
        </div>
        <ul class="coverlines">${M.cover.lines.map((l) => `<li>${t(l)}</li>`).join("")}</ul>
      </div>
    </div>
    <a class="scroll-cue" href="#contents">Turn the page</a>`;

  R.contents = (p, n) => {
    const toc = pages.filter((x) => x.toc);
    return `
    <div>
      <p class="kicker reveal">In this issue</p>
      <h2 class="contents-title reveal">Contents</h2>
      <div class="stats reveal">
        ${M.stats.map((s) => `<div class="stat"><b>${t(s.value)}</b><span>${t(s.label)}</span></div>`).join("")}
      </div>
      <div class="editor reveal">
        ${fig(M.editorsNote.image)}
        <div>
          <p class="kicker">From the editor</p>
          <p class="editor-text">${t(M.editorsNote.text)}</p>
          <p class="sig">${t(M.yourName)}</p>
        </div>
      </div>
    </div>
    <ol class="toc">
      ${toc
        .map(
          (x, i) => `<li class="reveal" style="--d:${(i * 0.05).toFixed(2)}s"><a href="#${x.id}">
            <span class="toc-num">${pad(x.n)}</span><span class="toc-title">${x.toc.title}</span><span class="toc-meta">${x.toc.meta}</span></a></li>`
        )
        .join("")}
    </ol>
    ${folio(n)}`;
  };

  R.chapter = (p, n) => {
    const imgs = p.images || [];
    let layout = p.layout || "left";
    if (layout === "duo" && imgs.length < 2) layout = "left";
    p._layout = layout;

    let media;
    if (layout === "duo") {
      media = `<div class="ch-media">${fig(imgs[0], "a reveal parallax")}${fig(imgs[1], "b reveal parallax", { style: "--d:.25s" })}</div>`;
    } else if (layout === "full") {
      media = `<div class="ch-media">${fig(imgs[0], "parallax")}</div>` + (p.inset ? fig(p.inset, "inset reveal", { style: "--d:.5s" }) : "");
    } else {
      media = `<div class="ch-media">${fig(imgs[0], "reveal parallax")}</div>`;
    }

    const text = `<div class="ch-text">${stagger([
      p.num ? `<span class="ch-num" aria-hidden="true">${p.num}</span>` : "",
      `<p class="kicker">${t(p.kicker || "")}</p>`,
      `<h2 class="ch-title">${t(p.title)}</h2>`,
      `<p class="ch-body">${t(p.text)}</p>`,
      p.quote ? `<blockquote class="pull">${t(p.quote)}</blockquote>` : "",
    ], 0.15, 0.12)}</div>`;

    return media + text + folio(n);
  };

  R.opener = (p, n) => `
    <div class="opener-inner">
      ${stagger([
        `<p class="kicker">${t(p.kicker || "")}</p>`,
        `<h2 class="opener-title">${t(p.title)}</h2>`,
        p.text ? `<p class="sec-text">${t(p.text)}</p>` : "",
      ])}
      <div class="parts">
        ${(p.parts || [])
          .map(
            (part, i) => `<a class="part reveal" style="--d:${(0.35 + i * 0.15).toFixed(2)}s" href="${part.href}">
              ${fig(part.image)}
              <span class="part-label"><span class="kicker">Part ${pad(i + 1)}</span>${t(part.title)}</span></a>`
          )
          .join("")}
      </div>
    </div>
    ${folio(n)}`;

  R.collage = (p, n) => {
    const imgs = (p.images || []).map(norm);
    const rows = [];
    let i = 0;
    for (const size of p.rows && p.rows.length ? p.rows : [imgs.length]) {
      rows.push(imgs.slice(i, i + size));
      i += size;
    }
    if (i < imgs.length) rows.push(imgs.slice(i));
    // height of the grid as a multiple of its width → lets CSS keep it on one screen
    const hf = rows.reduce((h, row) => h + 1 / row.reduce((s, x) => s + arNum(x.ar), 0), 0);
    return `
      <div class="sec-head">${stagger(head(p))}</div>
      <div class="cgrid" style="--hf:${hf.toFixed(4)}">
        ${rows
          .map((row, r) => `<div class="crow">${row
            .map((s, k) => fig(s, "reveal", { zoom: true, style: `--d:${(0.1 + (r * 3 + k) * 0.08).toFixed(2)}s` }))
            .join("")}</div>`)
          .join("")}
      </div>
      ${folio(n)}`;
  };

  R.exhibits = (p, n) => `
    <div class="sec-head center">${stagger(head(p))}</div>
    <div class="exhibits-grid">
      ${(p.images || [])
        .map(
          (s, i) => `<div class="exhibit reveal" style="--d:${(0.15 + i * 0.1).toFixed(2)}s">
            ${fig(s, "", { zoom: true })}
            <p class="kicker">Exhibit ${String.fromCharCode(65 + i)}</p></div>`
        )
        .join("")}
    </div>
    ${folio(n)}`;

  R.pair = (p, n) => {
    const [a, b] = p.images || [];
    return `
      <div class="pair-media">
        ${fig(a, "a reveal", { zoom: true })}
        ${fig(b, "b reveal", { zoom: true, style: "--d:.3s" })}
      </div>
      <div class="sec-head">${stagger(head(p))}</div>
      ${folio(n)}`;
  };

  R.gallery = (p, n) => {
    const ratios = ["3 / 4", "1 / 1", "4 / 5", "2 / 3", "4 / 3", "3 / 4"];
    return `
      <header class="archive-head">
        ${stagger([...head(p, "archive-title"), `<span class="archive-heart" aria-hidden="true">♡</span>`], 0, 0.1)}
      </header>
      <div class="masonry">
        ${(p.images || [])
          .map(norm)
          .map(
            (s, i) => `<div class="tile reveal" style="--d:${((i % 4) * 0.07).toFixed(2)}s">
              ${fig(s, "", { zoom: true, style: `--ar:${ratios[i % ratios.length]}` })}
              ${s.caption ? `<p class="cap">${t(s.caption)}</p>` : ""}
            </div>`
          )
          .join("")}
      </div>
      ${folio(n)}`;
  };

  R.letter = (p, n) => {
    const L = M.letter;
    return `
      <article class="paper reveal">
        <div class="stamp" aria-hidden="true"><span><b>♡</b>with<br>love</span></div>
        <p class="kicker">${t(L.kicker)}</p>
        <h2>${t(L.title)}</h2>
        <p class="greeting">${t(L.greeting)}</p>
        ${L.paragraphs.map((x, i) => `<p${i === 0 ? ' class="first"' : ""}>${t(x)}</p>`).join("")}
        <p class="signoff">${t(L.signoff)}</p>
        <p class="signature">${t(L.signature)}</p>
      </article>
      ${folio(n)}`;
  };

  R.back = () => {
    const B = M.backCover;
    return stagger([
      `<p class="back-mast">${t(M.masthead)}</p>`,
      `<h2 class="back-title">${t(B.title)}</h2>`,
      `<p class="back-line">${t(B.line)}</p>`,
      B.nextIssue && B.nextIssue.length ? `<p class="kicker">${t(B.nextIssueKicker)}</p>` : "",
      B.nextIssue && B.nextIssue.length ? `<ul class="next">${B.nextIssue.map((x) => `<li>${t(x)}</li>`).join("")}</ul>` : "",
      `<a class="again" href="#cover">Read it again ↑</a>`,
    ], 0, 0.1);
  };

  /* ================= assemble ================= */
  const pages = [
    { type: "cover", id: "cover" },
    { type: "contents", id: "contents" },
    ...M.pages.map((p) => ({ ...p, _user: true })),
    { type: "letter", id: "letter", toc: { title: t(M.letter.title), meta: "A letter" } },
    { type: "back", id: "back" },
  ];
  pages.forEach((p, i) => {
    p.n = i + 1;
    p.id = p.id || `p-${p.n}`;
    if (p._user) {
      p.toc = p.toc === false ? null : {
        title: strip(t(p.tocTitle || p.title)),
        meta: strip(t(p.kicker || "")).split("·")[0].trim(),
      };
    }
  });

  mag.innerHTML = pages
    .map((p) => {
      const inner = R[p.type](p, p.n);
      const dark = p.n % 2 === 1; // odd pages dark: cover, p3, p5…
      const photoDark = p.type === "cover" || p._layout === "full";
      const cls = [
        "page",
        p.type === "gallery" ? "archive" : "spread",
        p.type,
        p._layout || "",
        p.flip ? "flip" : "",
        dark ? "dark" : "light",
      ].join(" ");
      return `<section class="${cls}" id="${p.id}" data-page="${p.n}"${dark || photoDark ? ' data-tone="dark"' : ""}>${inner}</section>`;
    })
    .join("");
  const totalPages = pages.length;

  /* ================= missing-photo placeholders ================= */
  document.querySelectorAll(".ph img").forEach((img) => {
    const f = img.parentElement;
    if (!img.getAttribute("src")) return f.classList.add("missing");
    img.addEventListener("error", () => f.classList.add("missing"));
    img.addEventListener("load", () => f.classList.remove("missing"));
  });

  /* ================= reveal on scroll ================= */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ================= running header + page counter ================= */
  const runner = document.querySelector(".runner");
  document.querySelector(".runner-mast").textContent = strip(t(M.masthead)).trim();
  const runnerPage = document.querySelector(".runner-page");
  const pageEls = [...document.querySelectorAll("[data-page]")];
  let current = null;
  const updateRunner = () => {
    let el = pageEls[0];
    for (const p of pageEls) if (p.getBoundingClientRect().top <= 40) el = p;
    if (el === current) return;
    current = el;
    runnerPage.textContent = `${pad(el.dataset.page)} / ${pad(totalPages)}`;
    runner.classList.toggle("hide", el.id === "cover");
    runner.classList.toggle("dark", el.dataset.tone === "dark");
  };

  /* ================= progress bar + parallax ================= */
  const progress = document.querySelector(".progress");
  const px = [...document.querySelectorAll(".parallax img")];
  let ticking = false;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.setProperty("--p", max > 0 ? (scrollY / max).toFixed(4) : 0);
    updateRunner();
    if (!reduced) {
      const vh = innerHeight;
      for (const img of px) {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const k = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
        img.style.setProperty("--py", `${(k * -5).toFixed(2)}%`);
      }
    }
    ticking = false;
  };
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  /* ================= photo viewer ================= */
  const lb = document.querySelector(".lightbox");
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector("figcaption");
  const lbCount = lb.querySelector(".lb-count");
  let list = [];
  let cur = 0;
  let lastFocus = null;

  const show = (i) => {
    cur = (i + list.length) % list.length;
    const f = list[cur];
    lbImg.src = f.dataset.src;
    lbCap.textContent = f.dataset.cap || "";
    lbCount.textContent = `${cur + 1} / ${list.length}`;
  };
  const open = (f) => {
    if (f.classList.contains("missing")) return;
    list = [...f.closest("[data-page]").querySelectorAll("[data-zoom]")].filter((x) => !x.classList.contains("missing"));
    lastFocus = f;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    show(list.indexOf(f));
    lb.querySelector(".lb-close").focus();
  };
  const close = () => {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };

  mag.addEventListener("click", (e) => {
    const f = e.target.closest("[data-zoom]");
    if (f) open(f);
  });
  mag.addEventListener("keydown", (e) => {
    const f = e.target.closest("[data-zoom]");
    if (f && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(f); }
  });
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", () => show(cur - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  let x0 = null;
  lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
