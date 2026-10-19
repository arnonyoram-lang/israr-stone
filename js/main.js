/* ישראר סטון מארבל — התנהגות האתר */
(() => {
  "use strict";
  const C = window.SITE_CONTACT, PRODUCTS = window.SITE_PRODUCTS, CATS = window.SITE_CATS;
  const GRANITE = window.SITE_GRANITE, PROJECTS = window.SITE_PROJECTS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- פרטי קשר ---------- */
  const digits = (s) => (s || "").replace(/\D/g, "");
  const waNumber = (() => {
    let d = digits(C.whatsapp || C.phone);
    if (!d) return "";
    if (d.startsWith("972")) d = d.slice(3);
    return "972" + d.replace(/^0+/, "");
  })();
  const contact = {
    phone: { href: C.phone ? "tel:" + C.phone.replace(/[^\d+]/g, "") : "", text: C.phone },
    whatsapp: { href: waNumber ? "https://wa.me/" + waNumber : "", text: "וואטסאפ" },
    email: { href: C.email ? "mailto:" + C.email : "", text: C.email },
  };
  $$("[data-needs]").forEach((el) => { if (!contact[el.dataset.needs].href) el.hidden = true; });
  $$("[data-link]").forEach((el) => { const c = contact[el.dataset.link]; if (c.href) el.href = c.href; });
  $$("[data-text]").forEach((el) => { el.textContent = contact[el.dataset.text].text || ""; });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- כותרת עליונה ותפריט ---------- */
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const menuBtn = $(".menu-toggle"), menu = $("#mobileMenu");
  const setMenu = (open) => {
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "סגירת תפריט" : "פתיחת תפריט");
  };
  menuBtn.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

  const navLinks = $$(".main-nav a");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => io.observe(s));
  }

  /* ---------- פתיח: מצגת תמונות ---------- */
  const slides = $$(".hero-slide"), dotsWrap = $(".hero-dots");
  let slide = 0, slideTimer;
  const showSlide = (i) => {
    slides[slide].classList.remove("is-active");
    dotsWrap.children[slide].setAttribute("aria-selected", "false");
    slide = (i + slides.length) % slides.length;
    slides[slide].loading = "eager";
    slides[slide].classList.add("is-active");
    dotsWrap.children[slide].setAttribute("aria-selected", "true");
  };
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `תמונה ${i + 1}`);
    b.setAttribute("aria-selected", String(i === 0));
    b.addEventListener("click", () => { showSlide(i); restart(); });
    dotsWrap.appendChild(b);
  });
  const restart = () => { clearInterval(slideTimer); slideTimer = setInterval(() => { if (!document.hidden) showSlide(slide + 1); }, 6500); };
  restart();

  /* ---------- רשימת הצעת מחיר ---------- */
  const KEY = "israr-quote";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY) || "[]"); if (!Array.isArray(cart)) cart = []; } catch { cart = []; }
  const saveCart = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* אחסון לא זמין */ } };
  const toastEl = $("#toast");
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  };
  let contactInView = false;
  const renderCart = () => {
    const pill = $("#quotePill");
    pill.hidden = cart.length === 0 || contactInView;
    $("#quoteCount").textContent = cart.length;
    const list = $("#pickedList");
    list.innerHTML = cart.length
      ? cart.map((n) => `<span class="picked-item">${esc(n)}<button type="button" data-remove="${esc(n)}" aria-label="הסרת ${esc(n)}">✕</button></span>`).join("")
      : "<em>עדיין לא נבחרו מוצרים — אפשר להוסיף מהקטלוג בלחיצה על \"להצעת מחיר\".</em>";
    $$("[data-add]").forEach((b) => {
      const on = cart.includes(b.dataset.add);
      b.setAttribute("aria-pressed", String(on));
      b.textContent = on ? "✓ ברשימה" : "+ להצעת מחיר";
    });
  };
  const toggleCart = (name) => {
    if (cart.includes(name)) { cart = cart.filter((n) => n !== name); toast(`"${name}" הוסר מהרשימה`); }
    else { cart.push(name); toast(`"${name}" נוסף לבקשת הצעת המחיר`); }
    saveCart(); renderCart();
  };
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) { toggleCart(add.dataset.add); return; }
    const rm = e.target.closest("[data-remove]");
    if (rm) { cart = cart.filter((n) => n !== rm.dataset.remove); saveCart(); renderCart(); }
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => { contactInView = en.isIntersecting; renderCart(); }, { threshold: 0.15 }).observe($("#contact"));
  }
  $("#quotePill").addEventListener("click", () => $("#contact").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- קטלוג ---------- */
  const imgPath = (dir, n, small) => `images/${dir}/${n}${small ? "-sm" : ""}.webp`;
  const camIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/></svg>';
  $("#catalogGrid").innerHTML = PRODUCTS.map((p, i) => `
    <article class="card reveal" data-cat="${p.cat}">
      <button class="card-media" type="button" data-product="${i}" aria-label="גלריית תמונות: ${esc(p.name)}">
        <img src="${imgPath(p.dir, p.images[0], true)}" alt="${esc(p.name)}" loading="lazy" width="720" height="900">
        <span class="card-count">${camIcon}${p.images.length} תמונות</span>
      </button>
      <div class="card-body">
        <div class="card-meta">${p.origin ? `<span>${esc(p.origin)}</span>` : ""}<span>${esc(CATS[p.cat])}</span></div>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.short)}</p>
        <div class="card-actions">
          <button class="link-btn" type="button" data-product="${i}">לגלריה <span aria-hidden="true">←</span></button>
          <button class="add-btn" type="button" data-add="${esc(p.name)}" aria-pressed="false">+ להצעת מחיר</button>
        </div>
      </div>
    </article>`).join("") + `
    <div class="card-cta reveal">
      <img src="images/about/07-sm.webp" alt="" loading="lazy">
      <p class="eyebrow eyebrow-light">לא מצאתם?</p>
      <h3>כל אבן, מכל יצרן בעולם.</h3>
      <p>אתם בוחרים מוצר מיצרן בעולם — ואנחנו דואגים ליבוא, לחיתוך ולאספקה עד הבית.</p>
      <a class="btn btn-gold" href="#contact">דברו איתנו</a>
    </div>`;

  const filters = $(".filters");
  Object.entries(CATS).forEach(([key, label]) => {
    const count = PRODUCTS.filter((p) => p.cat === key).length;
    filters.insertAdjacentHTML("beforeend", `<button class="chip" type="button" data-filter="${key}" aria-pressed="false">${esc(label)}<small>${count}</small></button>`);
  });
  const applyFilter = (key) => {
    $$(".chip", filters).forEach((c) => { const on = c.dataset.filter === key; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
    $$("#catalogGrid .card").forEach((card) => {
      const show = key === "all" || card.dataset.cat === key;
      card.classList.toggle("is-hidden", !show);
      if (show) card.classList.add("in");
    });
  };
  filters.addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) applyFilter(c.dataset.filter); });
  $$("[data-jump]").forEach((a) => a.addEventListener("click", () => applyFilter(a.dataset.jump)));

  /* ---------- גרניט ---------- */
  $("#graniteGrid").innerHTML = GRANITE.map((g, i) => `
    <button class="swatch reveal" type="button" data-granite="${i}" aria-label="הגדלה: גרניט ${esc(g.name)}">
      <span class="swatch-img"><img src="images/granite/${g.id}-sm.webp" alt="גרניט ${esc(g.name)}" loading="lazy" width="420" height="420"></span>
      <span class="swatch-name">${esc(g.name)}</span>
      <span class="swatch-cta">לחצו להגדלה</span>
    </button>`).join("") + `
    <div class="granite-more reveal"><p>מחפשים גוון אחר? נאתר עבורכם כל גרניט מכל מחצבה בעולם.</p><a href="#contact">דברו איתנו ←</a></div>`;

  /* ---------- פרויקטים ---------- */
  $("#projectsGrid").innerHTML = PROJECTS.map((n, i) => `
    <button class="reveal" type="button" data-project="${i}" aria-label="הגדלת תמונת פרויקט ${i + 1}">
      <img src="images/projects/${n}-sm.webp" alt="פרויקט בחיפוי אבן ושיש ${i + 1}" loading="lazy">
    </button>`).join("");

  /* ---------- גלריה (Lightbox) ---------- */
  const lb = $("#lightbox"), lbImg = $(".lb-img", lb), lbThumbs = $(".lb-thumbs", lb);
  const lbTitle = $(".lb-title", lb), lbDesc = $(".lb-desc", lb), lbMeta = $(".lb-meta", lb), lbAdd = $(".lb-add", lb), lbCounter = $(".lb-counter", lb);
  let items = [], idx = 0, lastFocus = null;

  const renderLb = () => {
    const it = items[idx];
    lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
    lbImg.src = it.src;
    lbImg.alt = it.title;
    lbTitle.textContent = it.title;
    lbDesc.textContent = it.desc || "";
    lbDesc.hidden = !it.desc;
    lbMeta.textContent = it.meta || "";
    lbAdd.hidden = !it.add;
    if (it.add) {
      lbAdd.dataset.add = it.add;
      const on = cart.includes(it.add);
      lbAdd.setAttribute("aria-pressed", String(on));
      lbAdd.textContent = on ? "✓ ברשימה" : "+ להצעת מחיר";
    }
    lbCounter.textContent = `${idx + 1} / ${items.length}`;
    $$("button", lbThumbs).forEach((b, i) => b.classList.toggle("is-active", i === idx));
    const active = lbThumbs.children[idx];
    if (active) active.scrollIntoView({ block: "nearest", inline: "center", behavior: reduceMotion ? "auto" : "smooth" });
    $$(".lb-nav", lb).forEach((b) => (b.hidden = items.length < 2));
    // טעינה מוקדמת של התמונה הבאה
    if (items.length > 1) { const pre = new Image(); pre.src = items[(idx + 1) % items.length].src; }
  };
  const openLb = (list, start = 0) => {
    items = list; idx = start; lastFocus = document.activeElement;
    lbThumbs.innerHTML = items.map((it, i) => `<button type="button" data-thumb="${i}" aria-label="תמונה ${i + 1}"><img src="${it.thumb}" alt="" loading="lazy"></button>`).join("");
    lbThumbs.hidden = items.length < 2;
    lb.hidden = false;
    document.body.classList.add("lb-open");
    renderLb();
    $(".lb-close", lb).focus();
  };
  const closeLb = () => {
    lb.hidden = true;
    document.body.classList.remove("lb-open");
    lbImg.removeAttribute("src");
    if (lastFocus) lastFocus.focus();
  };
  const go = (d) => { if (items.length < 2) return; idx = (idx + d + items.length) % items.length; renderLb(); };

  lb.addEventListener("click", (e) => {
    if (e.target.closest(".lb-close") || e.target === lb || e.target.classList.contains("lb-stage")) return closeLb();
    if (e.target.closest(".lb-prev")) return go(-1);
    if (e.target.closest(".lb-next")) return go(1);
    const t = e.target.closest("[data-thumb]");
    if (t) { idx = +t.dataset.thumb; renderLb(); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) setMenu(false);
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowLeft") go(1);   // מימין לשמאל: שמאלה = הבא
    else if (e.key === "ArrowRight") go(-1);
    else if (e.key === "Tab") {
      const f = $$("button:not([hidden]), [href]", lb).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  let touchX = null;
  lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) go(dx > 0 ? 1 : -1); // החלקה ימינה = הבא (כיוון עברית)
    touchX = null;
  });

  document.addEventListener("click", (e) => {
    const p = e.target.closest("[data-product]");
    if (p) {
      const prod = PRODUCTS[+p.dataset.product];
      const meta = [prod.origin, CATS[prod.cat]].filter(Boolean).join(" · ");
      openLb(prod.images.map((n) => ({ src: imgPath(prod.dir, n), thumb: imgPath(prod.dir, n, true), title: prod.name, desc: prod.desc, meta, add: prod.name })));
      return;
    }
    const g = e.target.closest("[data-granite]");
    if (g) {
      openLb(GRANITE.map((x) => ({ src: `images/granite/${x.id}.webp`, thumb: `images/granite/${x.id}-sm.webp`, title: `גרניט ${x.name}`, desc: "גרניט טבעי לריצוף, למדרגות, לחיפוי ולמשטחי מטבח. זמין בלוחות, באריחים ובחיתוך לפי מידה.", meta: "גרניט בינלאומי", add: `גרניט ${x.name}` })), +g.dataset.granite);
      return;
    }
    const pr = e.target.closest("[data-project]");
    if (pr) {
      openLb(PROJECTS.map((n, i) => ({ src: `images/projects/${n}.webp`, thumb: `images/projects/${n}-sm.webp`, title: "פרויקטים ועבודות", desc: "מבחר עבודות בחיפוי אבן ושיש — בנייני מגורים, וילות ושחזור מבנים.", meta: `תמונה ${i + 1} מתוך ${PROJECTS.length}` })), +pr.dataset.project);
    }
  });

  /* ---------- טופס הצעת מחיר ---------- */
  const form = $("#quoteForm"), status = $("#formStatus");
  const buildMessage = () => {
    const d = new FormData(form);
    const lines = [
      "שלום, אשמח לקבל הצעת מחיר.",
      "",
      `שם: ${d.get("name")}`,
      `טלפון: ${d.get("phone")}`,
    ];
    if (d.get("email")) lines.push(`אימייל: ${d.get("email")}`);
    if (d.get("type")) lines.push(`סוג הפרויקט: ${d.get("type")}`);
    if (cart.length) lines.push("", "מוצרים שבחרתי:", ...cart.map((n) => `• ${n}`));
    if (d.get("message")) lines.push("", "פרטים נוספים:", d.get("message"));
    return lines.join("\n");
  };
  const validate = () => {
    let ok = true;
    ["name", "phone"].forEach((n) => {
      const el = form.elements[n];
      const valid = el.checkValidity() && el.value.trim() !== "";
      el.setAttribute("aria-invalid", String(!valid));
      if (!valid) ok = false;
    });
    const em = form.elements.email;
    if (em.value && !em.checkValidity()) { em.setAttribute("aria-invalid", "true"); ok = false; } else em.removeAttribute("aria-invalid");
    if (!ok) {
      status.className = "form-status err";
      status.textContent = "נא למלא שם וטלפון תקינים (ואימייל תקין אם הוזן).";
      $("[aria-invalid='true']", form).focus();
    }
    return ok;
  };
  form.addEventListener("input", (e) => { if (e.target.getAttribute("aria-invalid") === "true" && e.target.checkValidity()) e.target.setAttribute("aria-invalid", "false"); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = `בקשת הצעת מחיר — ${form.elements.name.value.trim()}`;
    window.location.href = `mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildMessage())}`;
    status.className = "form-status ok";
    status.textContent = "תוכנת המייל נפתחה עם הפרטים — נשאר רק ללחוץ \"שליחה\". תודה!";
  });
  const waBtn = $("#sendWa");
  if (waBtn && waNumber) {
    waBtn.addEventListener("click", () => {
      if (!validate()) return;
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener");
      status.className = "form-status ok";
      status.textContent = "וואטסאפ נפתח עם ההודעה — נשאר רק לשלוח. תודה!";
    });
  }

  renderCart();

  /* ---------- הופעה בגלילה ---------- */
  const revealEls = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); rio.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min((i % 4) * 70, 210)}ms`;
      rio.observe(el);
    });
  }
})();
