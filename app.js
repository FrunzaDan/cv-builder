"use strict";

/**
 * CV Builder — reads form input, keeps it in a small in-memory state object,
 * and re-renders the CV preview on every change. No build step / framework.
 */
(() => {
  /* ── State ─────────────────────────────────────────────── */
  const state = {
    exp: [],
    edu: [],
    skills: [],
    langs: [],
  };
  let nextId = 0;
  const uid = () => ++nextId;
  let photoData = null;

  const PERSONAL_FIELD_IDS = {
    name: "f-name",
    role: "f-role",
    email: "f-email",
    phone: "f-phone",
    address: "f-address",
    linkedin: "f-linkedin",
    website: "f-website",
    dob: "f-dob",
    license: "f-license",
    summary: "f-summary",
    misc: "f-misc",
  };

  const ENTRY_META = {
    exp: {
      cardLabel: "Work Experience Entry",
      titleLabel: "Job Title",
      titlePlaceholder: "Software Engineer",
      subLabel: "Company / Organization",
      subPlaceholder: "Acme Corp",
      periodPlaceholder: "Jan 2021 – Present",
      descPlaceholder: "Key responsibilities and achievements…",
    },
    edu: {
      cardLabel: "Education Entry",
      titleLabel: "Degree / Field of Study",
      titlePlaceholder: "BSc Computer Science",
      subLabel: "Institution",
      subPlaceholder: "MIT",
      periodPlaceholder: "2018 – 2022",
      descPlaceholder: "Relevant coursework, thesis, honors…",
    },
  };

  /* ── DOM helpers ───────────────────────────────────────── */
  const el = (id) => document.getElementById(id);
  const val = (id) => el(id)?.value || "";

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s || "";
    return d.innerHTML;
  }

  function nl2br(s) {
    return esc(s).replace(/\n/g, "<br>");
  }

  /* ── Photo Upload ──────────────────────────────────────── */
  function setPhoto(dataUrl) {
    photoData = dataUrl || null;
    const thumb = el("photo-thumb");
    thumb.innerHTML = "";
    if (photoData) {
      const img = document.createElement("img");
      img.src = photoData;
      img.alt = "photo";
      thumb.appendChild(img);
    } else {
      const plus = document.createElement("span");
      plus.className = "photo-thumb-plus";
      plus.textContent = "+";
      thumb.appendChild(plus);
    }
    el("photo-remove").style.display = photoData ? "block" : "none";
  }

  function handlePhotoInput(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      render();
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhoto(null);
    render();
  }

  /* ── JSON Import ───────────────────────────────────────── */
  function handleJSONImport(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        loadDataFromJSON(JSON.parse(ev.target.result));
        alert("CV data imported successfully!");
      } catch (err) {
        alert(`Error parsing JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
  }

  function normalizeEntries(list) {
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
      id: uid(),
      title: item.title || "",
      sub: item.sub || item.subtitle || "",
      period: item.period || "",
      desc: item.desc || item.description || "",
    }));
  }

  function loadDataFromJSON(data) {
    Object.entries(PERSONAL_FIELD_IDS).forEach(([key, id]) => {
      if (data[key]) el(id).value = data[key];
    });

    setPhoto(data.photo || null);

    nextId = 0;
    state.exp = normalizeEntries(data.experience);
    state.edu = normalizeEntries(data.education);
    state.skills = Array.isArray(data.skills) ? [...data.skills] : [];
    state.langs = Array.isArray(data.languages)
      ? data.languages.map((lang) => ({
          id: uid(),
          name: lang.name || "",
          level: lang.level || "",
        }))
      : [];

    renderEntryList("exp");
    renderEntryList("edu");
    renderLangList();
    renderTags();
    render();
  }

  /* ── Experience / Education entries ───────────────────── */
  function createEntryCard(type, entry) {
    const meta = ENTRY_META[type];
    const card = document.createElement("div");
    card.className = "entry-card";
    card.dataset.id = entry.id;
    card.innerHTML = `
      <div class="entry-card-header">
        <span class="entry-card-label">${meta.cardLabel}</span>
        <button class="btn-remove" type="button" data-action="remove">×</button>
      </div>
      <div class="form-group">
        <label>${meta.titleLabel}</label>
        <input type="text" data-field="title" placeholder="${meta.titlePlaceholder}">
      </div>
      <div class="form-group">
        <label>${meta.subLabel}</label>
        <input type="text" data-field="sub" placeholder="${meta.subPlaceholder}">
      </div>
      <div class="form-group">
        <label>Period</label>
        <input type="text" data-field="period" placeholder="${meta.periodPlaceholder}">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea data-field="desc" placeholder="${meta.descPlaceholder}"></textarea>
      </div>`;
    card.querySelector('[data-field="title"]').value = entry.title;
    card.querySelector('[data-field="sub"]').value = entry.sub;
    card.querySelector('[data-field="period"]').value = entry.period;
    card.querySelector('[data-field="desc"]').value = entry.desc;
    return card;
  }

  function renderEntryList(type) {
    const list = el(`${type}-list`);
    list.innerHTML = "";
    state[type].forEach((entry) => list.appendChild(createEntryCard(type, entry)));
  }

  function addEntry(type) {
    const entry = { id: uid(), title: "", sub: "", period: "", desc: "" };
    state[type].push(entry);
    el(`${type}-list`).appendChild(createEntryCard(type, entry));
  }

  function setEntryField(type, id, field, value) {
    const entry = state[type].find((e) => e.id === id);
    if (!entry) return;
    entry[field] = value;
    render();
  }

  function removeEntry(type, id) {
    state[type] = state[type].filter((e) => e.id !== id);
    el(`${type}-list`).querySelector(`[data-id="${id}"]`)?.remove();
    render();
  }

  /* ── Languages ─────────────────────────────────────────── */
  function createLangCard(lang) {
    const card = document.createElement("div");
    card.className = "entry-card";
    card.dataset.id = lang.id;
    card.innerHTML = `
      <div class="entry-card-header">
        <span class="entry-card-label">Language Entry</span>
        <button class="btn-remove" type="button" data-action="remove">×</button>
      </div>
      <div class="row-2">
        <div class="form-group">
          <label>Language</label>
          <input type="text" data-field="name" placeholder="English">
        </div>
        <div class="form-group">
          <label>Proficiency</label>
          <input type="text" data-field="level" placeholder="Fluent / Native">
        </div>
      </div>`;
    card.querySelector('[data-field="name"]').value = lang.name;
    card.querySelector('[data-field="level"]').value = lang.level;
    return card;
  }

  function renderLangList() {
    const list = el("lang-list");
    list.innerHTML = "";
    state.langs.forEach((lang) => list.appendChild(createLangCard(lang)));
  }

  function addLang() {
    const lang = { id: uid(), name: "", level: "" };
    state.langs.push(lang);
    el("lang-list").appendChild(createLangCard(lang));
  }

  function setLangField(id, field, value) {
    const lang = state.langs.find((l) => l.id === id);
    if (!lang) return;
    lang[field] = value;
    render();
  }

  function removeLang(id) {
    state.langs = state.langs.filter((l) => l.id !== id);
    el("lang-list").querySelector(`[data-id="${id}"]`)?.remove();
    render();
  }

  /* ── Skills (tags) ─────────────────────────────────────── */
  function createSkillTag(skill, index) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.dataset.index = index;
    tag.append(skill);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.action = "remove";
    btn.innerHTML = "&times;";
    tag.appendChild(btn);
    return tag;
  }

  function renderTags() {
    const list = el("skills-list");
    list.innerHTML = "";
    state.skills.forEach((skill, i) => list.appendChild(createSkillTag(skill, i)));
  }

  function addSkill() {
    const input = el("skill-input");
    const value = input.value.trim();
    input.value = "";
    if (!value || state.skills.includes(value)) return;
    state.skills.push(value);
    renderTags();
    render();
  }

  function removeSkillAt(index) {
    state.skills.splice(index, 1);
    renderTags();
    render();
  }

  /* ── Event delegation for dynamic lists ───────────────── */
  function bindEntryList(containerId, onRemove, onFieldChange) {
    const container = el(containerId);
    container.addEventListener("click", (e) => {
      if (!e.target.closest('[data-action="remove"]')) return;
      const card = e.target.closest(".entry-card");
      onRemove(Number(card.dataset.id));
    });
    container.addEventListener("input", (e) => {
      const field = e.target.dataset.field;
      if (!field) return;
      const card = e.target.closest(".entry-card");
      onFieldChange(Number(card.dataset.id), field, e.target.value);
    });
  }

  function bindSkillList() {
    el("skills-list").addEventListener("click", (e) => {
      if (!e.target.closest('[data-action="remove"]')) return;
      const tag = e.target.closest(".tag");
      removeSkillAt(Number(tag.dataset.index));
    });
  }

  /* ── CV Preview rendering ──────────────────────────────── */
  function contact(icon, text) {
    return `<div class="cv-contact-item">
      <div class="cv-contact-icon">${icon}</div>
      <div class="cv-contact-text">${text}</div>
    </div>`;
  }

  function mainSec(title, content) {
    return `<div class="cv-main-section">
      <div class="cv-main-title">${title}</div>
      ${content}
    </div>`;
  }

  function entryHtml(e) {
    return `<div class="cv-entry">
      <div class="cv-entry-head">
        <div class="cv-entry-title">${esc(e.title) || '<em style="color:#ccc">Untitled</em>'}</div>
        ${e.period ? `<div class="cv-entry-period">${esc(e.period)}</div>` : ""}
      </div>
      ${e.sub ? `<div class="cv-entry-sub">${esc(e.sub)}</div>` : ""}
      ${e.desc ? `<div class="cv-entry-desc">${nl2br(e.desc)}</div>` : ""}
    </div>`;
  }

  function renderSidebar(contactFields) {
    const { email, phone, address, linkedin, website, dob, license } = contactFields;
    const hasContact = email || phone || address || linkedin || website || dob || license;
    const langsOk = state.langs.filter((l) => l.name);

    let h = `<div class="cv-sidebar">`;

    if (hasContact) {
      h += `<div class="cv-sb-section"><div class="cv-sb-title">Contact</div>`;
      if (email) h += contact("✉", esc(email));
      if (phone) h += contact("✆", esc(phone));
      if (address) h += contact("◎", esc(address));
      if (dob) h += contact("⊛", esc(dob));
      if (license) h += contact("⊡", esc(license));
      if (linkedin) h += contact("in", esc(linkedin));
      if (website) h += contact("↗", esc(website));
      h += `</div>`;
    }

    if (state.skills.length) {
      h += `<div class="cv-sb-section">
        <div class="cv-sb-title">Skills</div>
        <div class="cv-sb-tags">
          ${state.skills.map((s) => `<span class="cv-sb-tag">${esc(s)}</span>`).join("")}
        </div>
      </div>`;
    }

    if (langsOk.length) {
      h += `<div class="cv-sb-section"><div class="cv-sb-title">Languages</div>`;
      langsOk.forEach((l) => {
        h += `<div class="cv-lang-row">
          <div class="cv-lang-name">${esc(l.name)}</div>
          ${l.level ? `<div class="cv-lang-level">${esc(l.level)}</div>` : ""}
        </div>`;
      });
      h += `</div>`;
    }

    if (!hasContact && !state.skills.length && !langsOk.length) {
      h += `<div class="cv-empty-hint">Contact, skills, and languages will appear here.</div>`;
    }

    h += `</div>`;
    return h;
  }

  function renderMain(summary, misc) {
    const expFilled = state.exp.filter((e) => e.title || e.sub || e.desc);
    const eduFilled = state.edu.filter((e) => e.title || e.sub || e.desc);

    let h = `<div class="cv-main">`;

    if (summary) {
      h += mainSec("Profile", `<div class="cv-summary">${nl2br(summary)}</div>`);
    }
    if (expFilled.length) {
      h += mainSec("Work Experience", expFilled.map(entryHtml).join(""));
    }
    if (eduFilled.length) {
      h += mainSec("Education", eduFilled.map(entryHtml).join(""));
    }
    if (misc) {
      h += mainSec("Additional Information", `<div class="cv-misc">${nl2br(misc)}</div>`);
    }
    if (!summary && !expFilled.length && !eduFilled.length && !misc) {
      h += `<div class="cv-empty-hint">Your profile, experience, and education will appear here.</div>`;
    }

    h += `</div>`;
    return h;
  }

  function render() {
    const name = val("f-name");
    const role = val("f-role");
    const fields = {
      email: val("f-email"),
      phone: val("f-phone"),
      address: val("f-address"),
      linkedin: val("f-linkedin"),
      website: val("f-website"),
      dob: val("f-dob"),
      license: val("f-license"),
    };
    const summary = val("f-summary");
    const misc = val("f-misc");

    let h = `
      <div class="cv-hdr">
        <div class="cv-hdr-inner">
          <div class="cv-hdr-text">
            <div class="cv-hdr-name">${name ? esc(name) : '<span class="cv-empty-name">Your Name</span>'}</div>
            ${role ? `<div class="cv-hdr-divider"></div><div class="cv-hdr-role">${esc(role)}</div>` : '<div class="cv-hdr-divider"></div>'}
          </div>
          ${photoData ? `<img class="cv-hdr-photo" src="${photoData}" alt="profile photo">` : ""}
        </div>
      </div>
      <div class="cv-body">
        ${renderSidebar(fields)}
        ${renderMain(summary, misc)}
      </div>
      <div class="cv-footer">Organized learning. Clear communication. Lasting impact.</div>`;

    el("cv-source").innerHTML = h;
    paginate(h);
  }

  /* ── Pagination (live preview) ────────────────────────────
     The PDF export slices the CV into A4 pages, sliding page breaks up
     to the nearest safe boundary so a break never lands mid-entry. The
     live preview mirrors that exact logic here so what's on screen
     always matches what gets exported: measure #cv-source (the hidden,
     continuous render) for safe break points, then rebuild #cv-pages
     as a stack of fixed-height sheets, each showing the slice of the
     content that belongs on that page. */
  const PAGE_H = 1122; // A4 height in px @ 96dpi, matches the PDF export's page size
  const PAGE_BREAK_AVOID = ".cv-hdr, .cv-entry, .cv-sb-section, .cv-contact-item, .cv-lang-row";

  function computePageBreaks(sourceEl) {
    const total = sourceEl.scrollHeight;
    const baseTop = sourceEl.getBoundingClientRect().top;
    const avoidRects = Array.from(sourceEl.querySelectorAll(PAGE_BREAK_AVOID)).map((elm) => {
      const r = elm.getBoundingClientRect();
      return { top: r.top - baseTop, bottom: r.bottom - baseTop };
    });

    const breaks = [0];
    let cursor = 0;
    while (total - cursor > PAGE_H && breaks.length < 100) {
      let candidate = cursor + PAGE_H;
      const blocker = avoidRects.find((r) => candidate > r.top && candidate < r.bottom);
      if (blocker) candidate = blocker.top;
      if (candidate <= cursor) candidate = cursor + PAGE_H; // single element taller than a page: force the cut
      breaks.push(candidate);
      cursor = candidate;
    }
    breaks.push(total);
    return breaks;
  }

  function paginate(contentHtml) {
    const source = el("cv-source");
    const breaks = computePageBreaks(source);
    const pageCount = breaks.length - 1;

    let pagesHtml = "";
    for (let i = 0; i < pageCount; i++) {
      const top = breaks[i];
      pagesHtml += `
        <div class="cv-sheet cv-page">
          <div class="cv-page-inner" style="transform: translateY(-${top}px)">${contentHtml}</div>
          ${pageCount > 1 ? `<div class="cv-page-number">Page ${i + 1} of ${pageCount}</div>` : ""}
        </div>`;
    }
    el("cv-pages").innerHTML = pagesHtml;
  }

  /* ── PDF Export ────────────────────────────────────────── */
  function exportPDF() {
    const preview = el("cv-source");
    const name = val("f-name").replace(/\s+/g, "_") || "CV";
    const btn = el("btn-export");

    const originalBtnText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "⏳ Generating…";
    const reset = () => {
      btn.disabled = false;
      btn.textContent = originalBtnText;
    };

    html2pdf()
      .set({
        margin: 0,
        filename: `${name}_CV.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowHeight: preview.scrollHeight,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
        // "css" respects the break-inside:avoid rules on .cv-hdr, .cv-entry,
        // .cv-sb-section etc. (see styles.css) so page breaks never slice
        // through an entry or the header; "legacy" adds sensible automatic
        // break points for everything else so the CV can span N pages.
        pagebreak: {
          mode: ["css", "legacy"],
          avoid: [
            ".cv-hdr",
            ".cv-entry",
            ".cv-sb-section",
            ".cv-contact-item",
            ".cv-lang-row",
          ],
        },
      })
      .from(preview)
      .toContainer()
      .toCanvas()
      .then(trimTrailingSliver)
      .toPdf()
      .save()
      .then(reset)
      .catch((err) => {
        reset();
        alert(`PDF export failed: ${err.message}`);
      });
  }

  // html2pdf computes each page's pixel height from the PDF page size, and
  // that conversion doesn't land on a whole number (e.g. ~1122.02px for
  // A4 @ 96dpi) — so content that fills a page almost exactly overflows by
  // a sub-pixel sliver and spawns an entire extra, nearly-blank page. If
  // the overflow past the last full page is negligible, trim it away
  // instead of letting it allocate a whole new page.
  function trimTrailingSliver() {
    const canvas = this.prop.canvas;
    const pageHeightPx = (canvas.width * this.prop.pageSize.inner.height) / this.prop.pageSize.inner.width;
    const remainder = canvas.height % pageHeightPx;
    const TOLERANCE_PX = 20; // canvas px at export scale — a few CSS px, well under one text line
    if (remainder > 0 && remainder < TOLERANCE_PX) {
      const trimmed = document.createElement("canvas");
      trimmed.width = canvas.width;
      trimmed.height = Math.round(canvas.height - remainder);
      trimmed.getContext("2d").drawImage(canvas, 0, 0);
      this.prop.canvas = trimmed;
    }
  }

  /* ── Wiring ────────────────────────────────────────────── */
  function bindPersonalFields() {
    Object.values(PERSONAL_FIELD_IDS).forEach((id) => {
      el(id).addEventListener("input", render);
    });
  }

  function bindStaticControls() {
    el("btn-import").addEventListener("click", () => el("json-input").click());
    el("json-input").addEventListener("change", handleJSONImport);

    el("btn-export").addEventListener("click", exportPDF);

    el("photo-upload").addEventListener("click", () => el("photo-input").click());
    el("photo-input").addEventListener("change", handlePhotoInput);
    el("photo-remove").addEventListener("click", (e) => {
      e.stopPropagation();
      removePhoto();
    });

    el("btn-add-exp").addEventListener("click", () => addEntry("exp"));
    el("btn-add-edu").addEventListener("click", () => addEntry("edu"));
    el("btn-add-lang").addEventListener("click", addLang);

    el("btn-add-skill").addEventListener("click", addSkill);
    el("skill-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkill();
      }
    });
  }

  function init() {
    bindPersonalFields();
    bindStaticControls();
    bindEntryList("exp-list", (id) => removeEntry("exp", id), (id, field, value) =>
      setEntryField("exp", id, field, value),
    );
    bindEntryList("edu-list", (id) => removeEntry("edu", id), (id, field, value) =>
      setEntryField("edu", id, field, value),
    );
    bindEntryList("lang-list", removeLang, setLangField);
    bindSkillList();
    render();
  }

  init();
})();
