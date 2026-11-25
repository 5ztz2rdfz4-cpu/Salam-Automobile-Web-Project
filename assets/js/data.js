/*
  Salam Automobile – data asal (default) website.
  Harga & tetapan di sini hanya digunakan jika Admin belum menyimpan apa-apa
  ke Google Sheet. Selepas Admin tekan "Simpan", data dari Google Sheet
  (tab "Config Website") akan digunakan.

  price     = Harga OTR tanpa insurans (RM)
  insurance = Anggaran premium asas insurans tahunan pada NCD 0% (RM)
  rate      = Kadar faedah tetap (% setahun) default untuk model
  rebate    = Rebat / diskaun asal (RM). Default 0; boleh diisi terus di kalkulator
  roadtax   = Cukai jalan tahunan (RM), boleh diatasi pada peringkat varian
*/
window.SALAM_DEFAULT_CONFIG = {
  version: 1,
  updatedAt: "2026-11-25",
  business: {
    whatsapp: "601160548161",
    tiktok: "salamauto.my",
    sheetUrl: "https://docs.google.com/spreadsheets/d/1L-LWCiD7sOyTgykSZiEPjNZbeY_SN377K7LpjE96Ap8/edit"
  },
  calculator: {
    years: [5, 6, 7, 8, 9],
    defaultYears: 9,
    defaultDpMode: "pct",
    defaultDpPct: 10,
    defaultDpRm: 5000,
    ncdOptions: [0, 25, 30, 38.33, 45, 55],
    showRebate: true
  },
  brands: [
    {
      id: "proton",
      name: "Proton",
      logo: "assets/img/brand/logo-proton-dark.webp",
      models: [
        { id: "saga", name: "Saga", image: "assets/img/cars/proton-saga.webp", rate: 3.0, rebate: 0, roadtax: 90, active: true,
          variants: [
            { name: "Saga 1.5 AT Standard", price: 38405, insurance: 1992 },
            { name: "Saga 1.5 AT Executive", price: 44405, insurance: 2160.45 },
            { name: "Saga 1.5 AT Premium", price: 49405, insurance: 2300.85 }
          ] },
        { id: "s70-na", name: "S70 NA", image: "assets/img/cars/proton-s70.webp", rate: 3.0, rebate: 0, roadtax: 90, active: true,
          variants: [
            { name: "S70 NA Lite", price: 59800, insurance: 1996.65 },
            { name: "S70 NA Prime", price: 62800, insurance: 2080.9 }
          ] },
        { id: "s70", name: "S70 1.5T", image: "assets/img/cars/proton-s70.webp", rate: 2.5, rebate: 0, roadtax: 90, active: true,
          variants: [
            { name: "S70 1.5T Executive", price: 73165, insurance: 3024.8 },
            { name: "S70 1.5T Premium", price: 79165, insurance: 3193.25 },
            { name: "S70 1.5T Flagship", price: 87565, insurance: 5074.05 },
            { name: "S70 1.5T Flagship X", price: 88686, insurance: 9093.45 }
          ] },
        { id: "s70-rs", name: "S70 1.5T RS", image: "assets/img/cars/proton-s70-rs.webp", rate: 2.5, rebate: 0, roadtax: 90, active: true, comingSoon: true,
          descMs: "Sedan sport Proton dengan enjin 1.5 Turbo dan gaya RS yang lebih agresif: sport rim gelap, kaliper brek merah dan aksen merah di sekeliling badan.",
          descEn: "Proton's sport sedan with a 1.5 Turbo engine and a bolder RS look: dark sport rims, red brake calipers and red accents all around.",
          variants: [
            { name: "S70 1.5T RS", price: 0, insurance: 0 }
          ] },
        { id: "x50", name: "X50", image: "assets/img/cars/proton-x50.webp", rate: 2.5, rebate: 0, roadtax: 90, active: true,
          variants: [
            { name: "X50 1.5 TGDi Executive", price: 89120, insurance: 3519.05 },
            { name: "X50 1.5 TGDi Premium", price: 96520, insurance: 8456.05 },
            { name: "X50 1.5 TGDi Flagship", price: 107855, insurance: 8929.9 }
          ] },
        { id: "x70", name: "X70", image: "assets/img/cars/proton-x70.webp", rate: 2.5, rebate: 0, roadtax: 90, active: true,
          variants: [
            { name: "X70 1.5 TGDi Executive", price: 106123, insurance: 3993.45 },
            { name: "X70 1.5 TGDi Premium", price: 117323, insurance: 6158.45 }
          ] },
        { id: "x90", name: "X90", image: "assets/img/cars/proton-x90.webp", rate: 2.5, rebate: 0, roadtax: 90, active: true,
          variants: [
            { name: "X90 1.5 TD Lite", price: 106093, insurance: 4023.4 },
            { name: "X90 1.5 TD Prime", price: 114293, insurance: 6104.2 },
            { name: "X90 1.5 TD Prime X", price: 119544, insurance: 7021.7 }
          ] },
        { id: "emas5", name: "e.MAS 5", image: "assets/img/cars/proton-emas5.webp", rate: 2.3, rebate: 0, roadtax: 40, active: true,
          variants: [
            { name: "e.MAS 5 Prime", price: 59800, insurance: 2400 },
            { name: "e.MAS 5 Premium", price: 72800, insurance: 2700 }
          ] },
        { id: "emas7", name: "e.MAS 7", image: "assets/img/cars/proton-emas7.webp", rate: 2.3, rebate: 0, roadtax: 200, active: true,
          variants: [
            { name: "e.MAS 7 Prime", price: 103800, insurance: 3050 },
            { name: "e.MAS 7 Premium", price: 119800, insurance: 4100 }
          ] },
        { id: "emas7-phev", name: "e.MAS 7 PHEV", image: "assets/img/cars/proton-emas7-phev.webp", rate: 2.3, rebate: 0, roadtax: 90, active: true,
          variants: [
            { name: "e.MAS 7 PHEV Prime", price: 109800, insurance: 3100 },
            { name: "e.MAS 7 PHEV Premium", price: 123800, insurance: 3400 },
            { name: "e.MAS 7 PHEV Premium+", price: 129800, insurance: 3600 }
          ] }
      ]
    },
    {
      id: "perodua",
      name: "Perodua",
      logo: "assets/img/brand/logo-perodua.webp",
      models: [
        { id: "axia", name: "Axia", image: "assets/img/cars/perodua-axia.webp", rate: 3.3, rebate: 0, roadtax: 20, active: true,
          variants: [
            { name: "Axia X 1.0 CVT", price: 38905, insurance: 1544.86 },
            { name: "Axia SE 1.0 CVT", price: 43405, insurance: 1706.32 },
            { name: "Axia AV 1.0 CVT", price: 49405, insurance: 1900.08 }
          ] },
        { id: "bezza", name: "Bezza", image: "assets/img/cars/perodua-bezza.webp", rate: 3.3, rebate: 0, roadtax: 70, active: true,
          variants: [
            { name: "Bezza 1.0 GX AT", price: 36730, insurance: 1392, roadtax: 20 },
            { name: "Bezza 1.3 X AT", price: 44130, insurance: 1644 },
            { name: "Bezza 1.3 AV AT", price: 50130, insurance: 1740 }
          ] },
        { id: "myvi", name: "Myvi", image: "assets/img/cars/perodua-myvi.webp", rate: 3.3, rebate: 0, roadtax: 90, active: true,
          variants: [
            { name: "Myvi 1.3 G", price: 48650, insurance: 1660, roadtax: 70 },
            { name: "Myvi 1.5 X", price: 51050, insurance: 1760 },
            { name: "Myvi 1.5 H", price: 55050, insurance: 1870 },
            { name: "Myvi 1.5 AV", price: 60060, insurance: 2010 }
          ] },
        { id: "ativa", name: "Ativa", image: "assets/img/cars/perodua-ativa.webp", rate: 2.7, rebate: 0, roadtax: 20, active: true,
          variants: [
            { name: "Ativa 1.0 Turbo X", price: 62660, insurance: 2100 },
            { name: "Ativa 1.0 Turbo H", price: 67960, insurance: 2226 },
            { name: "Ativa 1.0 Turbo AV", price: 73560, insurance: 2426 }
          ] },
        { id: "alza", name: "Alza", image: "assets/img/cars/perodua-alza.webp", rate: 2.7, rebate: 0, roadtax: 90, active: true,
          variants: [
            { name: "Alza 1.5 X", price: 62600, insurance: 2015 },
            { name: "Alza 1.5 H", price: 68160, insurance: 2181 },
            { name: "Alza 1.5 AV", price: 75660, insurance: 2374 }
          ] },
        { id: "aruz", name: "Aruz", image: "assets/img/cars/perodua-aruz.webp", rate: 2.7, rebate: 0, roadtax: 90, active: true,
          variants: [
            { name: "Aruz 1.5 X", price: 73060, insurance: 2502 },
            { name: "Aruz 1.5 AV", price: 78060, insurance: 2604 }
          ] },
        { id: "traz", name: "Traz", image: "assets/img/cars/perodua-traz.webp", rate: 2.3, rebate: 0, roadtax: 90, active: true,
          variants: [
            { name: "Traz 1.5 X", price: 73060, insurance: 2502 },
            { name: "Traz 1.5 H", price: 78060, insurance: 2604 }
          ] },
        { id: "qv-e", name: "QV-E", image: "assets/img/cars/perodua-qve.webp", rate: 2.3, rebate: 0, roadtax: 40, active: false,
          variants: [
            { name: "QV-E", price: 0, insurance: 0 }
          ] }
      ]
    }
  ],
  delivery: [
    "assets/img/delivery/delivery-01.webp", "assets/img/delivery/delivery-02.webp",
    "assets/img/delivery/delivery-03.webp", "assets/img/delivery/delivery-04.webp",
    "assets/img/delivery/delivery-05.webp", "assets/img/delivery/delivery-06.webp",
    "assets/img/delivery/delivery-07.webp", "assets/img/delivery/delivery-08.webp",
    "assets/img/delivery/delivery-09.webp", "assets/img/delivery/delivery-10.webp",
    "assets/img/delivery/delivery-11.webp", "assets/img/delivery/delivery-12.webp",
    "assets/img/delivery/delivery-13.webp", "assets/img/delivery/delivery-14.webp",
    "assets/img/delivery/delivery-15.webp", "assets/img/delivery/delivery-16.webp",
    "assets/img/delivery/delivery-17.webp", "assets/img/delivery/delivery-18.webp",
    "assets/img/delivery/delivery-19.webp", "assets/img/delivery/delivery-20.webp"
  ]
};
