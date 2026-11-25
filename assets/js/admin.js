/* Salam Automobile – halaman Admin */
(function () {
  "use strict";
  var API = ((window.SALAM_SETTINGS || {}).appsScriptUrl || "").trim();
  var PW_KEY = "salam_admin_pw";
  var C = JSON.parse(JSON.stringify(window.SALAM_DEFAULT_CONFIG));
  var brandIdx = 0, dirty = false, pw = "";

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function num(v) { var n = parseFloat(v); return isFinite(n) ? n : 0; }
  function rm(n) { return "RM" + Math.round(n).toLocaleString("en-MY"); }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { return null; } }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || ("model-" + Date.now()); }

  function post(body) {
    body.password = pw;
    return fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (!j || !j.ok) throw new Error((j && j.error) || "Ralat tidak diketahui"); return j; });
  }
  function setDirty(v) { dirty = v; $("saveMsg").textContent = v ? "Ada perubahan belum disimpan." : "Semua perubahan telah disimpan."; }

  /* ---------- Harga kereta ---------- */
  function renderBrands() {
    $("brandSeg").innerHTML = C.brands.map(function (b, i) {
      return '<button type="button" class="btn ' + (i === brandIdx ? "btn-dark" : "btn-line") + '" data-bi="' + i + '">' + esc(b.name) + " (" + b.models.length + ")</button>";
    }).join("");
  }
  function minPrice(m) { var p = m.variants.map(function (v) { return num(v.price); }).filter(function (x) { return x > 0; }); return p.length ? Math.min.apply(null, p) : 0; }
  function renderModels(openIdx) {
    var b = C.brands[brandIdx];
    $("models").innerHTML = b.models.map(function (m, mi) {
      var on = m.active !== false;
      return '<details class="mcard" data-mi="' + mi + '"' + (mi === openIdx ? " open" : "") + ">" +
        '<summary><img src="' + esc(m.image) + '" alt=""><div><b>' + esc(m.name) + "</b><small>" + m.variants.length + " varian" + (minPrice(m) ? " · dari " + rm(minPrice(m)) : "") + " · " + num(m.rate).toFixed(2) + '% fixed</small></div><span class="pill' + (on ? "" : " off") + '">' + (on ? "Dipaparkan" : "Disembunyikan") + "</span></summary>" +
        '<div class="mbody">' +
          '<div class="grid2">' +
            '<label>Nama model<input type="text" data-k="name" value="' + esc(m.name) + '"></label>' +
            '<label>Kadar faedah tetap (%)<input type="number" step="0.05" data-k="rate" value="' + esc(m.rate) + '"></label>' +
            '<label>Cukai jalan setahun (RM)<input type="number" step="1" data-k="roadtax" value="' + esc(m.roadtax || 0) + '"></label>' +
            '<label class="check"><input type="checkbox" data-k="active"' + (on ? " checked" : "") + "> Paparkan di website</label>" +
          "</div>" +
          '<div class="img-row"><label class="lbl" style="margin:0">Gambar kereta (URL, latar lutsinar .webp/.png)<input type="text" data-k="image" value="' + esc(m.image) + '"></label>' +
            '<label class="btn btn-line">Upload gambar<input type="file" accept="image/png,image/webp,image/jpeg" data-upload-car hidden></label></div>' +
          '<div class="vtable-wrap"><table class="vtable"><thead><tr><th>Varian</th><th>Harga OTR tanpa insurans (RM)</th><th>Insurans / premium asas (RM)</th><th>Roadtax varian (RM)</th><th></th></tr></thead><tbody>' +
            m.variants.map(function (v, vi) {
              return '<tr data-vi="' + vi + '"><td><input type="text" data-vk="name" value="' + esc(v.name) + '" aria-label="Nama varian"></td>' +
                '<td><input type="number" step="1" data-vk="price" value="' + esc(v.price) + '" aria-label="Harga OTR tanpa insurans"></td>' +
                '<td><input type="number" step="0.01" data-vk="insurance" value="' + esc(v.insurance) + '" aria-label="Insurans"></td>' +
                '<td><input type="number" step="1" data-vk="roadtax" value="' + esc(v.roadtax == null ? "" : v.roadtax) + '" placeholder="ikut model" aria-label="Roadtax varian"></td>' +
                '<td><button type="button" class="icon-btn" data-del-variant aria-label="Padam varian">✕</button></td></tr>';
            }).join("") +
          "</tbody></table></div>" +
          '<div class="row-actions"><button type="button" class="btn btn-line btn-sm" data-add-variant>+ Tambah varian</button>' +
            '<button type="button" class="btn btn-line btn-sm" data-move="-1">↑ Naik</button><button type="button" class="btn btn-line btn-sm" data-move="1">↓ Turun</button>' +
            '<button type="button" class="btn btn-danger btn-sm" data-del-model>Padam model</button></div>' +
        "</div></details>";
    }).join("");
  }
  function modelAt(el) { var d = el.closest("[data-mi]"); return d ? { mi: +d.dataset.mi, m: C.brands[brandIdx].models[+d.dataset.mi] } : null; }

  function bindHarga() {
    $("brandSeg").addEventListener("click", function (e) { var b = e.target.closest("[data-bi]"); if (b) { brandIdx = +b.dataset.bi; renderBrands(); renderModels(); } });
    $("models").addEventListener("input", function (e) {
      var t = e.target, at = modelAt(t); if (!at) return;
      if (t.dataset.k) {
        var k = t.dataset.k;
        if (k === "active") at.m.active = t.checked;
        else if (k === "name" || k === "image") at.m[k] = t.value;
        else at.m[k] = num(t.value);
        if (k === "image") { var img = t.closest("details").querySelector("summary img"); img.src = t.value; }
      } else if (t.dataset.vk) {
        var v = at.m.variants[+t.closest("[data-vi]").dataset.vi], vk = t.dataset.vk;
        if (vk === "name") v.name = t.value;
        else if (vk === "roadtax") { if (t.value === "") delete v.roadtax; else v.roadtax = num(t.value); }
        else v[vk] = num(t.value);
      }
      setDirty(true);
    });
    $("models").addEventListener("change", function (e) {
      var t = e.target;
      if (t.dataset.k === "active" || t.dataset.k === "name" || t.dataset.k === "rate") { var at = modelAt(t); renderModels(at.mi); }
      if (t.hasAttribute("data-upload-car") && t.files[0]) {
        var at2 = modelAt(t);
        if (!API) { alertMsg("Sambung Google Sheet dahulu untuk upload gambar."); return; }
        readFile(t.files[0], 1400, "image/webp").then(function (dataUrl) {
          alertMsg("Memuat naik gambar…");
          return post({ action: "uploadPhoto", dataUrl: dataUrl });
        }).then(function (j) { at2.m.image = j.url; setDirty(true); renderModels(at2.mi); alertMsg("Gambar dimuat naik. Tekan Simpan."); })
          .catch(function (err) { alertMsg("Upload gagal: " + err.message); });
      }
    });
    $("models").addEventListener("click", function (e) {
      var t = e.target, at = modelAt(t); if (!at) return;
      var list = C.brands[brandIdx].models;
      if (t.hasAttribute("data-add-variant")) { at.m.variants.push({ name: at.m.name + " ", price: 0, insurance: 0 }); setDirty(true); renderModels(at.mi); }
      else if (t.hasAttribute("data-del-variant")) {
        if (at.m.variants.length < 2) { alertMsg("Model perlu sekurang-kurangnya satu varian."); return; }
        at.m.variants.splice(+t.closest("[data-vi]").dataset.vi, 1); setDirty(true); renderModels(at.mi);
      } else if (t.hasAttribute("data-del-model")) {
        if (t.dataset.confirm !== "1") { t.dataset.confirm = "1"; t.textContent = "Tekan sekali lagi untuk padam"; return; }
        list.splice(at.mi, 1); setDirty(true); renderBrands(); renderModels();
      } else if (t.dataset.move) {
        var to = at.mi + +t.dataset.move; if (to < 0 || to >= list.length) return;
        list.splice(to, 0, list.splice(at.mi, 1)[0]); setDirty(true); renderModels(to);
      }
    });
    $("addModel").addEventListener("click", function () {
      var b = C.brands[brandIdx];
      b.models.push({ id: slug(b.id + "-baru-" + Date.now()), name: "Model baharu", image: b.models[0] ? b.models[0].image : "", rate: 3, rebate: 0, roadtax: 90, active: false, variants: [{ name: "Varian 1", price: 0, insurance: 0 }] });
      setDirty(true); renderBrands(); renderModels(b.models.length - 1);
    });
  }

  /* ---------- Tetapan ---------- */
  function renderSettings() {
    var b = C.business, c = C.calculator;
    $("settingsForm").innerHTML =
      '<label>No. WhatsApp (format 60xxxxxxxxx)<input type="tel" data-s="business.whatsapp" value="' + esc(b.whatsapp) + '"></label>' +
      '<label>TikTok (tanpa @)<input type="text" data-s="business.tiktok" value="' + esc(b.tiktok) + '"></label>' +
      '<label>Link Google Sheet database<input type="url" data-s="business.sheetUrl" value="' + esc(b.sheetUrl || "") + '"></label>' +
      '<label>Deposit asal<select data-s="calculator.defaultDpMode"><option value="pct"' + (c.defaultDpMode !== "rm" ? " selected" : "") + '>Ikut %</option><option value="rm"' + (c.defaultDpMode === "rm" ? " selected" : "") + ">Ikut RM</option></select></label>" +
      '<label>Deposit asal (%)<input type="number" step="1" data-s="calculator.defaultDpPct" data-n value="' + esc(c.defaultDpPct) + '"></label>' +
      '<label>Deposit asal (RM)<input type="number" step="100" data-s="calculator.defaultDpRm" data-n value="' + esc(c.defaultDpRm) + '"></label>' +
      '<label>Tempoh asal (tahun)<input type="number" step="1" data-s="calculator.defaultYears" data-n value="' + esc(c.defaultYears) + '"></label>' +
      '<label>Pilihan tempoh (tahun, pisah dengan koma)<input type="text" data-s="calculator.years" data-list value="' + esc((c.years || []).join(", ")) + '"></label>' +
      '<label>Pilihan NCD (%, pisah dengan koma)<input type="text" data-s="calculator.ncdOptions" data-list value="' + esc((c.ncdOptions || []).join(", ")) + '"></label>';
  }
  function bindSettings() {
    $("settingsForm").addEventListener("input", function (e) {
      var t = e.target, path = t.dataset.s; if (!path) return;
      var parts = path.split("."), obj = C[parts[0]], k = parts[1], v;
      if (t.type === "checkbox") v = t.checked;
      else if (t.hasAttribute("data-n")) v = num(t.value);
      else if (t.hasAttribute("data-list")) v = t.value.split(",").map(function (x) { return parseFloat(x); }).filter(function (x) { return isFinite(x); });
      else if (k === "whatsapp") v = t.value.replace(/\D/g, "");
      else v = t.value.trim();
      obj[k] = v; setDirty(true);
    });
  }

  /* ---------- Gambar delivery ---------- */
  function renderPhotos() {
    var list = C.delivery || [];
    $("photos").innerHTML = list.length ? list.map(function (src, i) {
      return '<figure data-pi="' + i + '"><img src="' + esc(src) + '" alt="Gambar delivery ' + (i + 1) + '" loading="lazy"><figcaption>' +
        '<button type="button" data-pm="-1" aria-label="Ke kiri">←</button><button type="button" data-pm="1" aria-label="Ke kanan">→</button><button type="button" data-pdel aria-label="Buang">✕</button></figcaption></figure>';
    }).join("") : '<p class="muted">Tiada gambar lagi.</p>';
  }
  function bindPhotos() {
    $("photos").addEventListener("click", function (e) {
      var t = e.target, f = t.closest("[data-pi]"); if (!f) return;
      var i = +f.dataset.pi, list = C.delivery;
      if (t.hasAttribute("data-pdel")) {
        if (t.dataset.confirm !== "1") { t.dataset.confirm = "1"; t.textContent = "Pasti?"; return; }
        list.splice(i, 1);
      } else if (t.dataset.pm) { var to = i + +t.dataset.pm; if (to < 0 || to >= list.length) return; list.splice(to, 0, list.splice(i, 1)[0]); }
      else return;
      setDirty(true); renderPhotos();
    });
    $("photoFile").addEventListener("change", function (e) { var f = e.target.files[0]; e.target.value = ""; if (f) openEditor(f); });
  }

  /* Editor kabur no. plate */
  var ed = { img: null, boxes: [], drag: null, scale: 1 };
  function openEditor(file) {
    var url = URL.createObjectURL(file), img = new Image();
    img.onload = function () {
      var max = 1400, s = Math.min(1, max / Math.max(img.width, img.height));
      var cv = $("edCanvas"); cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
      ed = { img: img, boxes: [], drag: null, scale: s };
      drawEditor(); $("editor").showModal();
    };
    img.src = url;
  }
  function pixelate(ctx, x, y, w, h) {
    if (w < 4 || h < 4) return;
    var tmp = document.createElement("canvas"), sw = Math.max(2, Math.round(w / 14)), sh = Math.max(2, Math.round(h / 6));
    tmp.width = sw; tmp.height = sh;
    tmp.getContext("2d").drawImage(ctx.canvas, x, y, w, h, 0, 0, sw, sh);
    ctx.save(); ctx.imageSmoothingEnabled = true; ctx.filter = "blur(" + Math.max(2, h / 6) + "px)";
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.drawImage(tmp, 0, 0, sw, sh, x - 4, y - 4, w + 8, h + 8); ctx.restore();
  }
  function drawEditor(outline) {
    var cv = $("edCanvas"), ctx = cv.getContext("2d");
    ctx.filter = "none"; ctx.drawImage(ed.img, 0, 0, cv.width, cv.height);
    ed.boxes.forEach(function (b) { pixelate(ctx, b.x, b.y, b.w, b.h); });
    if (outline !== false) {
      ctx.lineWidth = 3; ctx.strokeStyle = "#c49a5a";
      ed.boxes.concat(ed.drag ? [ed.drag] : []).forEach(function (b) { ctx.strokeRect(b.x, b.y, b.w, b.h); });
    }
  }
  function pt(e) { var cv = $("edCanvas"), r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height }; }
  function bindEditor() {
    var cv = $("edCanvas"), start = null;
    cv.addEventListener("pointerdown", function (e) { start = pt(e); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", function (e) { if (!start) return; var p = pt(e); ed.drag = { x: Math.min(start.x, p.x), y: Math.min(start.y, p.y), w: Math.abs(p.x - start.x), h: Math.abs(p.y - start.y) }; drawEditor(); });
    cv.addEventListener("pointerup", function () { if (ed.drag && ed.drag.w > 8 && ed.drag.h > 6) ed.boxes.push(ed.drag); ed.drag = null; start = null; drawEditor(); });
    $("edUndo").addEventListener("click", function () { ed.boxes.pop(); drawEditor(); });
    $("edCancel").addEventListener("click", function () { $("editor").close(); });
    $("edUpload").addEventListener("click", function () {
      if (!API) { $("photoMsg").textContent = "Sambung Google Sheet dahulu untuk upload gambar."; $("editor").close(); return; }
      drawEditor(false);
      var dataUrl = $("edCanvas").toDataURL("image/jpeg", 0.85);
      $("editor").close(); $("photoMsg").textContent = "Memuat naik…";
      post({ action: "uploadPhoto", dataUrl: dataUrl })
        .then(function (j) { C.delivery = C.delivery || []; C.delivery.unshift(j.url); setDirty(true); renderPhotos(); $("photoMsg").textContent = "Gambar ditambah. Tekan Simpan & terbitkan."; })
        .catch(function (err) { $("photoMsg").textContent = "Upload gagal: " + err.message; });
    });
  }
  function readFile(file, max, type) {
    return new Promise(function (res, rej) {
      var img = new Image(); img.onerror = function () { rej(new Error("Gambar tidak dapat dibaca")); };
      img.onload = function () {
        var s = Math.min(1, max / Math.max(img.width, img.height)), cv = document.createElement("canvas");
        cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        var out = cv.toDataURL(type, 0.9); if (out.indexOf("data:" + type) !== 0) out = cv.toDataURL("image/png");
        res(out);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /* ---------- Leads ---------- */
  function loadLeads() {
    if (!API) { $("leadsMsg").textContent = "Sambung Google Sheet dahulu."; return; }
    $("leadsMsg").textContent = "Memuatkan…";
    post({ action: "leads", limit: 100 }).then(function (j) {
      $("sheetLink").href = j.sheetUrl || C.business.sheetUrl;
      $("leadsMsg").textContent = j.leads.length + " leads.";
      $("leadsBody").innerHTML = j.leads.length ? j.leads.map(function (l) {
        var d = new Date(l.tarikh), ds = isNaN(d) ? esc(l.tarikh) : d.toLocaleString("ms-MY", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
        return "<tr><td>" + ds + "</td><td>" + esc(l.nama) + '</td><td><a href="' + esc(l.wa) + '" target="_blank" rel="noopener">' + esc(l.phone) + "</a></td><td>" + esc(l.lokasi) + "</td><td>" + esc(l.model) + "</td><td>" + esc(l.kerja) + "</td><td>" + (l.gaji ? rm(l.gaji) : "") + "</td><td>" + esc(l.status) + "</td></tr>";
      }).join("") : '<tr><td colspan="8">Belum ada leads.</td></tr>';
    }).catch(function (err) { $("leadsMsg").textContent = "Gagal: " + err.message; });
  }

  /* ---------- Simpan ---------- */
  function alertMsg(t) { $("saveMsg").textContent = t; }
  function save() {
    if (!API) { alertMsg("Belum disambung ke Google Sheet. Guna \"Salin data\"."); return; }
    var btn = $("saveBtn"); btn.disabled = true; btn.textContent = "Menyimpan…";
    post({ action: "saveConfig", config: C })
      .then(function () { setDirty(false); alertMsg("Disimpan. Website kini guna data terbaru."); })
      .catch(function (err) { alertMsg("Tidak berjaya simpan: " + err.message); })
      .then(function () { btn.disabled = false; btn.textContent = "Simpan & terbitkan"; });
  }
  function copyJson() {
    var txt = JSON.stringify(C, null, 2);
    var fallback = function () {
      var ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); alertMsg("Data disalin."); } catch (e) { alertMsg("Tidak dapat menyalin."); } ta.remove();
    };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { alertMsg("Data disalin ke clipboard."); }, fallback); else fallback();
  }

  /* ---------- Boot ---------- */
  function showApp() {
    $("loginBox").hidden = true; $("app").hidden = false; $("saveBar").hidden = false;
    $("sheetLink").href = C.business.sheetUrl || "#";
    renderBrands(); renderModels(); renderSettings(); renderPhotos(); setDirty(false);
    alertMsg(API ? "Tiada perubahan." : "Mod cubaan: perubahan tidak disimpan ke Google Sheet.");
  }
  function loadConfig() {
    return fetch(API + "?action=config").then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.ok && j.config && j.config.brands) {
        C = j.config;
        C.calculator = Object.assign(JSON.parse(JSON.stringify(window.SALAM_DEFAULT_CONFIG.calculator)), C.calculator || {});
        C.delivery = C.delivery || [];
      }
    }).catch(function () {});
  }

  document.querySelectorAll(".tabs [data-tab]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".tabs [data-tab]").forEach(function (x) { x.setAttribute("aria-selected", x === b); });
      document.querySelectorAll(".panel").forEach(function (p) { p.hidden = p.id !== "tab-" + b.dataset.tab; });
      if (b.dataset.tab === "leads" && API && $("leadsBody").children.length < 2) loadLeads();
    });
  });
  bindHarga(); bindSettings(); bindPhotos(); bindEditor();
  $("saveBtn").addEventListener("click", save);
  $("copyJson").addEventListener("click", copyJson);
  $("loadLeads").addEventListener("click", loadLeads);
  window.addEventListener("beforeunload", function (e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

  if (!API) { $("noApi").hidden = false; showApp(); return; }
  $("loginBox").hidden = false;
  function tryLogin(p) {
    pw = p;
    return post({ action: "login" }).then(function () { ss(PW_KEY, p); return loadConfig(); }).then(showApp);
  }
  $("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = $("loginBtn"); btn.disabled = true; $("loginErr").hidden = true;
    tryLogin($("pw").value).catch(function (err) { $("loginErr").textContent = err.message; $("loginErr").hidden = false; })
      .then(function () { btn.disabled = false; });
  });
  var saved = ss(PW_KEY);
  if (saved) tryLogin(saved).catch(function () { ss(PW_KEY, null); });
})();
