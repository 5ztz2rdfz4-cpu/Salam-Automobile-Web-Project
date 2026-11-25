/* Salam Automobile – pilihan bahasa BM / EN.
   Teks BM ialah teks asal dalam HTML; teks EN disimpan pada atribut data-en
   (dan data-en-placeholder / data-en-aria-label untuk atribut). */
(function () {
  "use strict";
  var KEY = "salam_lang";
  var ATTRS = ["placeholder", "aria-label"];

  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }
  function camel(a) { return a.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); }); }

  var q = (location.search.match(/[?&]lang=(en|ms)\b/) || [])[1];
  if (q) save(q);
  var lang = q || saved() || "ms";

  function apply(l) {
    lang = l === "en" ? "en" : "ms";
    window.SALAM_LANG = lang;
    document.documentElement.lang = lang === "en" ? "en" : "ms";
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (el.dataset.ms === undefined) el.dataset.ms = el.textContent;
      el.textContent = lang === "en" ? el.dataset.en : el.dataset.ms;
    });
    ATTRS.forEach(function (a) {
      var enKey = camel("en-" + a), msKey = camel("ms-" + a);
      document.querySelectorAll("[data-en-" + a + "]").forEach(function (el) {
        if (el.dataset[msKey] === undefined) el.dataset[msKey] = el.getAttribute(a) || "";
        el.setAttribute(a, lang === "en" ? el.dataset[enKey] : el.dataset[msKey]);
      });
    });
    document.querySelectorAll(".lang [data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
  }

  window.SALAM_LANG = lang;
  window.SALAM_I18N = {
    set: function (l) {
      if (l === lang) return;
      save(l); apply(l);
      document.dispatchEvent(new CustomEvent("salam:lang", { detail: { lang: lang } }));
    }
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".lang [data-lang]");
    if (b) window.SALAM_I18N.set(b.dataset.lang);
  });
  apply(lang);
})();
