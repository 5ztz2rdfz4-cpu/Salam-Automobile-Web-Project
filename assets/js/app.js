/* Salam Automobile – logik laman utama: kalkulator loan, insurans, galeri & borang leads. */
(function () {
  "use strict";

  var SETTINGS = window.SALAM_SETTINGS || {};
  var API = (SETTINGS.appsScriptUrl || "").trim();
  var CACHE_KEY = "salam_config_cache_v1";
  var C = clone(window.SALAM_DEFAULT_CONFIG);

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function $(id) { return document.getElementById(id); }
  function num(v, d) { var n = parseFloat(v); return isFinite(n) ? n : (d || 0); }
  function rm(n) { return "RM" + Math.round(n).toLocaleString("en-MY"); }
  function rm2(n) { return "RM" + (Math.round(n * 100) / 100).toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function pct(n) { return (Math.round(n * 100) / 100) + "%"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- Config: default -> cache -> Google Sheet ---------- */
  function valid(cfg) { return cfg && cfg.brands && cfg.brands.length && cfg.business; }
  function useConfig(cfg) {
    if (!valid(cfg)) return false;
    C = cfg;
    C.calculator = Object.assign(clone(window.SALAM_DEFAULT_CONFIG.calculator), cfg.calculator || {});
    return true;
  }
  var cached = store(CACHE_KEY);
  if (API && cached) { try { useConfig(JSON.parse(cached)); } catch (e) {} }

  /* ---------- State ---------- */
  var S = {};
  function activeModels(brand) { return (brand.models || []).filter(function (m) { return m.active !== false && m.variants && m.variants.length; }); }
  function brandById(id) { return C.brands.filter(function (b) { return b.id === id; })[0] || C.brands[0]; }
  function model() { var b = brandById(S.brand); return activeModels(b).filter(function (m) { return m.id === S.model; })[0] || activeModels(b)[0]; }
  function variant() { var m = model(); return m.variants[Math.min(S.variant, m.variants.length - 1)] || m.variants[0]; }
  function minPrice(m) { return Math.min.apply(null, m.variants.map(function (v) { return num(v.price); }).filter(function (p) { return p > 0; }).concat([Infinity])); }

  function initState() {
    var cc = C.calculator;
    var b = C.brands[0], m = activeModels(b)[0];
    S = {
      brand: b.id, model: m.id, variant: 0,
      dpMode: cc.defaultDpMode === "rm" ? "rm" : "pct",
      dpPct: num(cc.defaultDpPct, 10), dpRm: num(cc.defaultDpRm, 5000),
      years: num(cc.defaultYears, 9), rate: num(m.rate, 3), rebate: num(m.rebate), ncd: 0
    };
  }

  /* ---------- Calculation (same method as the Excel live calculator) ---------- */
  function calc(years) {
    var m = model(), v = variant();
    var price = num(v.price), basic = num(v.insurance), ncd = C.calculator.ncdOptions[S.ncd] || 0;
    var insAfter = basic * (1 - ncd / 100);
    var otrIns = price + insAfter;
    var rebate = Math.max(0, num(S.rebate));
    var base = Math.max(0, otrIns - rebate);
    var dp = S.dpMode === "pct" ? otrIns * S.dpPct / 100 : Math.min(S.dpRm, base);
    var loan = Math.max(0, base - dp);
    var y = years || S.years;
    var interest = loan * S.rate / 100 * y;
    var total = loan + interest;
    return { price: price, basic: basic, ncd: ncd, ncdAmt: basic - insAfter, insAfter: insAfter, otrIns: otrIns, rebate: rebate, dp: dp, loan: loan, interest: interest, total: total, monthly: y ? total / (y * 12) : 0, roadtax: num(v.roadtax != null && v.roadtax !== "" ? v.roadtax : m.roadtax) };
  }

  /* ---------- Render: pickers ---------- */
  function renderBrands() {
    $("brandTabs").innerHTML = C.brands.filter(function (b) { return activeModels(b).length; }).map(function (b) {
      return '<button type="button" class="brand-tab" role="tab" data-brand="' + esc(b.id) + '" aria-selected="' + (b.id === S.brand) + '">' +
        '<span class="plate"><img src="' + esc(b.logo) + '" alt=""></span>' + esc(b.name) + "</button>";
    }).join("");
  }
  function renderModels() {
    var b = brandById(S.brand);
    $("modelGrid").innerHTML = activeModels(b).map(function (m) {
      var p = minPrice(m);
      return '<button type="button" class="model" data-model="' + esc(m.id) + '" aria-pressed="' + (m.id === S.model) + '">' +
        '<img src="' + esc(m.image) + '" alt="">' +
        "<b>" + esc(m.name) + "</b><small>" + (isFinite(p) ? "Dari " + rm(p) : "Hubungi kami") + "</small></button>";
    }).join("");
  }
  function renderVariants() {
    var m = model();
    $("variant").innerHTML = m.variants.map(function (v, i) {
      return '<option value="' + i + '"' + (i === S.variant ? " selected" : "") + ">" + esc(v.name) + (num(v.price) ? " · " + rm(v.price) : "") + "</option>";
    }).join("");
  }
  function renderStage(animate) {
    var b = brandById(S.brand), m = model();
    var car = $("stageCar");
    $("stageLogo").src = b.logo; $("stageLogo").alt = b.name;
    $("stageBrand").textContent = b.name; $("stageModel").textContent = m.name;
    $("insCar").src = m.image; $("insCar").alt = b.name + " " + m.name;
    if (car.getAttribute("src") !== m.image) {
      if (animate) {
        car.classList.add("swap");
        setTimeout(function () { car.src = m.image; car.alt = b.name + " " + m.name; car.onload = function () { car.classList.remove("swap"); }; setTimeout(function () { car.classList.remove("swap"); }, 400); }, 180);
      } else { car.src = m.image; car.alt = b.name + " " + m.name; }
    }
  }
  function segButtons(el, list, current, fmt, key) {
    el.innerHTML = list.map(function (x, i) {
      var val = key === "idx" ? i : x;
      return '<button type="button" data-v="' + val + '" aria-pressed="' + (val === current) + '">' + fmt(x) + "</button>";
    }).join("");
  }

  /* ---------- Render: numbers ---------- */
  var lastMonthly = null;
  function render() {
    var m = model(), v = variant(), r = calc();
    var cc = C.calculator;
    $("pOtr").textContent = rm(r.price);
    $("pOtrIns").textContent = rm(r.otrIns);
    if (document.activeElement !== $("rebate")) $("rebate").value = S.rebate ? Math.round(S.rebate) : "";

    // Deposit controls
    $("dpModePct").setAttribute("aria-pressed", S.dpMode === "pct");
    $("dpModeRm").setAttribute("aria-pressed", S.dpMode === "rm");
    $("dpPctBox").hidden = S.dpMode !== "pct";
    $("dpRmBox").hidden = S.dpMode !== "rm";
    $("dpPct").value = S.dpPct;
    $("dpPctTxt").textContent = S.dpPct + "%";
    $("dpPctRm").textContent = rm(r.dp);
    if (document.activeElement !== $("dpRm")) $("dpRm").value = Math.round(S.dpRm);
    $("dpRmPct").textContent = (r.otrIns ? (r.dp / r.otrIns * 100).toFixed(1) : 0) + "% daripada harga OTR termasuk insurans";

    segButtons($("years"), cc.years, S.years, function (y) { return y + " thn"; });
    if (document.activeElement !== $("rate")) $("rate").value = S.rate.toFixed(2);
    segButtons($("ncd"), cc.ncdOptions, S.ncd, pct, "idx");
    segButtons($("ncd2"), cc.ncdOptions, S.ncd, pct, "idx");

    // Slip
    var mo = $("monthly");
    mo.innerHTML = rm(r.monthly) + "<small>/bulan</small>";
    if (lastMonthly !== null && Math.round(lastMonthly) !== Math.round(r.monthly)) { mo.classList.remove("pop"); void mo.offsetWidth; mo.classList.add("pop"); }
    lastMonthly = r.monthly;
    $("slipMeta").textContent = v.name + " · " + S.years + " tahun (" + S.years * 12 + " bulan) · " + S.rate.toFixed(2) + "% fixed";
    $("rOtr").textContent = rm(r.price);
    $("rInsLbl").textContent = "Insurans (NCD " + pct(r.ncd) + ")";
    $("rIns").textContent = "+ " + rm(r.insAfter);
    $("rOtrIns").textContent = rm(r.otrIns);
    $("rRebateRow").hidden = !r.rebate;
    $("rRebate").textContent = "− " + rm(r.rebate);
    $("rDp").textContent = "− " + rm(r.dp);
    $("rLoan").textContent = rm(r.loan);
    $("rIntLbl").textContent = "Jumlah faedah (" + S.rate.toFixed(2) + "% × " + S.years + " thn)";
    $("rInt").textContent = rm(r.interest);
    $("rTotal").textContent = rm(r.total);

    var all = cc.years.map(function (y) { return { y: y, mo: calc(y).monthly }; });
    var mx = Math.max.apply(null, all.map(function (a) { return a.mo; })) || 1;
    $("bars").innerHTML = all.map(function (a) {
      return '<button type="button" data-y="' + a.y + '" aria-pressed="' + (a.y === S.years) + '"><span>' + a.y + ' thn</span><i style="width:' + (a.mo / mx * 100).toFixed(1) + '%"></i><span>' + rm(a.mo) + "</span></button>";
    }).join("");

    // Insurance section
    $("insModel").textContent = brandById(S.brand).name + " " + v.name;
    $("iBasic").textContent = rm2(r.basic);
    $("iNcdLbl").textContent = "Diskaun NCD (" + pct(r.ncd) + ")";
    $("iNcd").textContent = "− " + rm2(r.ncdAmt);
    $("iNet").textContent = rm2(r.insAfter);
    $("iRoad").textContent = rm2(r.roadtax);
    $("iTotal").textContent = rm2(r.insAfter + r.roadtax);

    updateLinks();
  }

  function renderAll(animate) { renderBrands(); renderModels(); renderVariants(); renderStage(animate); render(); }

  /* ---------- WhatsApp links ("Hubungi Kami") ---------- */
  function waNumber() { return String(C.business.whatsapp || "").replace(/\D/g, ""); }
  function wa(text) { return "https://wa.me/" + waNumber() + "?text=" + encodeURIComponent(text); }
  function calcSummary() {
    var r = calc(), v = variant(), b = brandById(S.brand);
    return b.name + " " + v.name + "\n" +
      "Harga OTR (tanpa insurans): " + rm(r.price) + "\n" +
      "Harga OTR (termasuk insurans, NCD " + pct(r.ncd) + "): " + rm(r.otrIns) + "\n" +
      (r.rebate ? "Rebat/diskaun: " + rm(r.rebate) + "\n" : "") +
      "Deposit: " + rm(r.dp) + "\n" +
      "Jumlah pinjaman: " + rm(r.loan) + "\n" +
      "Tempoh: " + S.years + " tahun @ " + S.rate.toFixed(2) + "% fixed\n" +
      "Anggaran ansuran: " + rm(r.monthly) + "/bulan";
  }
  function updateLinks() {
    var general = wa("Assalamualaikum Salam Automobile, saya ingin bertanya tentang kereta baharu Proton / Perodua.");
    document.querySelectorAll(".js-wa").forEach(function (a) { a.href = general; });
    document.querySelectorAll(".js-wa-calc").forEach(function (a) { a.href = wa("Assalamualaikum Salam Automobile, saya berminat dengan kiraan ini:\n\n" + calcSummary() + "\n\nBoleh bantu semak kelayakan saya?"); });
    document.querySelectorAll(".js-wa-trade").forEach(function (a) { a.href = wa("Assalamualaikum Salam Automobile, saya ingin menyemak nilai trade-in kereta lama saya. Butiran dan gambar geran akan saya kongsikan."); });
    var n = waNumber();
    $("waTxt").textContent = "WhatsApp " + (n ? "+" + n.replace(/^(60)(\d{2})(\d{3,4})(\d{4})$/, "$1 $2-$3 $4") : "");
    var tt = String(C.business.tiktok || "").replace(/^@/, "");
    $("ttLink").hidden = !tt;
    $("ttLink").href = "https://www.tiktok.com/@" + encodeURIComponent(tt);
    $("ttTxt").textContent = "@" + tt;
  }

  /* ---------- Gallery ---------- */
  function renderGallery() {
    var g = $("gallery");
    var list = (C.delivery || []).filter(Boolean);
    g.innerHTML = list.map(function (src, i) {
      return '<button type="button" data-src="' + esc(src) + '" aria-label="Besarkan gambar delivery ' + (i + 1) + '"><img src="' + esc(src) + '" alt="Serahan kereta baharu kepada pelanggan Salam Automobile" loading="lazy" width="600" height="800"></button>';
    }).join("");
    $("delivery").hidden = !list.length;
  }
  function slide(d) { var g = $("gallery"), f = g.firstElementChild; g.scrollBy({ left: d * ((f ? f.offsetWidth : 280) + 16) * 2, behavior: "smooth" }); }

  /* ---------- Lead form ---------- */
  function fillModelSelect() {
    var sel = $("fModel"), cur = sel.value;
    var html = '<option value="">Pilih model</option>';
    C.brands.forEach(function (b) {
      var ms = activeModels(b); if (!ms.length) return;
      html += '<optgroup label="' + esc(b.name) + '">' + ms.map(function (m) { var val = b.name + " " + m.name; return '<option value="' + esc(val) + '">' + esc(val) + "</option>"; }).join("") + "</optgroup>";
    });
    html += '<option value="Belum pasti">Belum pasti / perlukan cadangan</option>';
    sel.innerHTML = html;
    if (cur) sel.value = cur;
  }
  function normPhone(p) { return String(p || "").replace(/[\s\-()]/g, "").replace(/^\+?60(?=1)/, "0"); }
  function phoneOk(p) { return /^(\+?60|0)1[0-9]{8,9}$/.test(normPhone(p)); }

  function validate() {
    var f = $("leadForm"), ok = true, first = null;
    function mark(el, bad) { var fld = el.closest(".field"); if (fld) fld.classList.toggle("err", bad); if (bad) { ok = false; first = first || el; } }
    mark($("fNama"), $("fNama").value.trim().length < 2);
    mark($("fLokasi"), $("fLokasi").value.trim().length < 2);
    mark($("fModel"), !$("fModel").value);
    mark($("fPhone"), !phoneOk($("fPhone").value));
    mark($("fKerja1"), !f.querySelector('input[name="kerja"]:checked'));
    mark($("fGaji"), !(num($("fGaji").value) > 0));
    var consent = $("fConsent").checked; if (!consent) { ok = false; first = first || $("fConsent"); }
    var err = $("formErr");
    if (!ok) {
      err.textContent = !phoneOk($("fPhone").value) && $("fPhone").value ? "Sila semak No. Phone (contoh: 012-345 6789)." : (!consent && first === $("fConsent") ? "Sila tandakan persetujuan untuk dihubungi." : "Sila lengkapkan semua maklumat yang bertanda merah.");
      err.hidden = false; if (first) first.focus();
    } else err.hidden = true;
    return ok;
  }

  function leadData() {
    var f = $("leadForm");
    return {
      action: "lead",
      nama: $("fNama").value.trim(),
      lokasi: $("fLokasi").value.trim(),
      model: $("fModel").value,
      phone: normPhone($("fPhone").value),
      kerja: (f.querySelector('input[name="kerja"]:checked') || {}).value || "",
      gaji: num($("fGaji").value),
      calc: calcSummary().replace(/\n/g, " | "),
      website: $("fWebsite").value,
      page: location.href.split("#")[0]
    };
  }
  function leadWaText(d) {
    return "Assalamualaikum Salam Automobile, saya ingin semak kelayakan loan.\n\n" +
      "Nama: " + d.nama + "\nLokasi: " + d.lokasi + "\nModel kereta: " + d.model + "\nNo. phone: " + d.phone +
      "\nJenis pekerjaan: " + d.kerja + "\nPendapatan bersih: " + rm(d.gaji) + "\n\nKiraan di website:\n" + calcSummary();
  }

  function submitLead(e) {
    e.preventDefault();
    if (!validate()) return;
    var d = leadData();
    if (d.website) return; // bot
    var btn = $("fSubmit"), err = $("formErr");
    var waLink = wa(leadWaText(d));
    document.querySelectorAll(".js-wa-lead").forEach(function (a) { a.href = waLink; });

    function done() {
      btn.hidden = true; $("formOk").hidden = false;
      $("leadForm").querySelectorAll("input, select").forEach(function (el) { if (el.type !== "radio" && el.type !== "checkbox") el.disabled = true; });
    }
    if (!API) {
      // Belum disambung ke Google Sheet: terus ke WhatsApp dengan semua butiran.
      done();
      $("formOk").querySelector("strong").textContent = "Satu langkah lagi: hantar butiran anda melalui WhatsApp.";
      return;
    }
    btn.disabled = true; btn.textContent = "Menghantar…";
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
    fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(d), signal: ctrl ? ctrl.signal : undefined })
      .then(function (res) { return res.json(); })
      .then(function (j) { clearTimeout(timer); if (!j || !j.ok) throw new Error((j && j.error) || "gagal"); done(); })
      .catch(function () {
        clearTimeout(timer);
        btn.disabled = false; btn.textContent = "Hantar & Semak Kelayakan";
        err.innerHTML = 'Maaf, borang tidak dapat dihantar sekarang. Sila <a href="' + esc(waLink) + '" target="_blank" rel="noopener">hantar butiran melalui WhatsApp</a> atau cuba lagi.';
        err.hidden = false;
      });
  }

  /* ---------- Events ---------- */
  function bind() {
    $("brandTabs").addEventListener("click", function (e) {
      var b = e.target.closest("[data-brand]"); if (!b || b.dataset.brand === S.brand) return;
      S.brand = b.dataset.brand; var m = activeModels(brandById(S.brand))[0];
      S.model = m.id; S.variant = 0; S.rate = num(m.rate, S.rate); S.rebate = num(m.rebate); renderAll(true);
    });
    $("modelGrid").addEventListener("click", function (e) {
      var b = e.target.closest("[data-model]"); if (!b) return;
      S.model = b.dataset.model; S.variant = 0; S.rate = num(model().rate, S.rate); S.rebate = num(model().rebate);
      renderModels(); renderVariants(); renderStage(true); render();
      var sel = $("fModel"), m = model(), val = brandById(S.brand).name + " " + m.name;
      if (!sel.dataset.touched) sel.value = val;
    });
    $("variant").addEventListener("change", function (e) { S.variant = +e.target.value; render(); });
    $("rebate").addEventListener("input", function (e) { S.rebate = Math.max(0, num(e.target.value)); render(); });
    $("rebate").addEventListener("blur", render);
    $("dpModePct").addEventListener("click", function () { if (S.dpMode === "rm") { var r = calc(); S.dpPct = r.otrIns ? Math.min(50, Math.round(r.dp / r.otrIns * 100)) : S.dpPct; } S.dpMode = "pct"; render(); });
    $("dpModeRm").addEventListener("click", function () { if (S.dpMode === "pct") S.dpRm = Math.round(calc().dp / 100) * 100; S.dpMode = "rm"; render(); });
    $("dpPct").addEventListener("input", function (e) { S.dpPct = +e.target.value; render(); });
    $("dpRm").addEventListener("input", function (e) { S.dpRm = Math.max(0, num(e.target.value)); render(); });
    $("dpRm").addEventListener("blur", function () { render(); });
    $("years").addEventListener("click", function (e) { var b = e.target.closest("[data-v]"); if (b) { S.years = +b.dataset.v; render(); } });
    $("bars").addEventListener("click", function (e) { var b = e.target.closest("[data-y]"); if (b) { S.years = +b.dataset.y; render(); } });
    $("rate").addEventListener("input", function (e) { var v = num(e.target.value, NaN); if (isFinite(v) && v >= 0 && v <= 15) { S.rate = v; render(); } });
    $("rate").addEventListener("blur", render);
    $("rateDown").addEventListener("click", function () { S.rate = Math.max(0, +(S.rate - 0.05).toFixed(2)); render(); });
    $("rateUp").addEventListener("click", function () { S.rate = Math.min(15, +(S.rate + 0.05).toFixed(2)); render(); });
    function ncdClick(e) { var b = e.target.closest("[data-v]"); if (b) { S.ncd = +b.dataset.v; render(); } }
    $("ncd").addEventListener("click", ncdClick);
    $("ncd2").addEventListener("click", ncdClick);
    $("toForm").addEventListener("click", function () { var sel = $("fModel"); if (!sel.dataset.touched) sel.value = brandById(S.brand).name + " " + model().name; });
    $("fModel").addEventListener("change", function (e) { e.target.dataset.touched = "1"; });
    $("leadForm").addEventListener("submit", submitLead);
    $("leadForm").addEventListener("input", function (e) { var f = e.target.closest(".field"); if (f) f.classList.remove("err"); });
    $("galPrev").addEventListener("click", function () { slide(-1); });
    $("galNext").addEventListener("click", function () { slide(1); });
    $("gallery").addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") slide(-1); if (e.key === "ArrowRight") slide(1); });
    $("gallery").addEventListener("click", function (e) {
      var b = e.target.closest("[data-src]"); if (!b) return;
      var lb = $("lightbox"); $("lbImg").src = b.dataset.src;
      if (lb.showModal) lb.showModal(); else window.open(b.dataset.src, "_blank");
    });
    $("lbClose").addEventListener("click", function () { $("lightbox").close(); });
    $("lightbox").addEventListener("click", function (e) { if (e.target === e.currentTarget) e.currentTarget.close(); });
    $("year").textContent = new Date().getFullYear();
  }

  /* ---------- Boot ---------- */
  function boot() {
    initState(); renderAll(false); renderGallery(); fillModelSelect();
  }
  bind(); boot();

  if (API) {
    var ctrl = window.AbortController ? new AbortController() : null;
    setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
    fetch(API + (API.indexOf("?") > -1 ? "&" : "?") + "action=config", { signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.ok && j.config && useConfig(j.config)) {
          var str = JSON.stringify(j.config);
          if (str !== cached) { store(CACHE_KEY, str); boot(); }
        }
      })
      .catch(function () { /* guna data default/cache */ });
  }
})();
