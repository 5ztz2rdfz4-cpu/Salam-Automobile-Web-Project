/*
  Salam Automobile – data asal (default) website.
  Harga & tetapan di sini hanya digunakan jika Admin belum menyimpan apa-apa
  ke Google Sheet. Selepas Admin tekan "Simpan", data dari Google Sheet
  (tab "Config Website") akan digunakan.

  price     = Harga OTR tanpa insurans (RM)
  insurance = Anggaran insurans tahun pertama (RM), dari pricelist pengedar
  rate      = Kadar faedah tetap (% setahun) default untuk model
  roadtax   = Cukai jalan tahunan (RM), boleh diatasi pada peringkat varian
  Sumber harga: pricelist Proton, Proton e.MAS 2026 dan Perodua (dikemas kini 26 Nov 2026).
*/
window.SALAM_DEFAULT_CONFIG = {
  "version": 1,
  "updatedAt": "2026-11-26",
  "business": {
    "whatsapp": "601160548161",
    "tiktok": "salamauto.my",
    "sheetUrl": "https://docs.google.com/spreadsheets/d/1L-LWCiD7sOyTgykSZiEPjNZbeY_SN377K7LpjE96Ap8/edit"
  },
  "calculator": {
    "years": [
      5,
      6,
      7,
      8,
      9
    ],
    "defaultYears": 9,
    "defaultDpMode": "pct",
    "defaultDpPct": 10,
    "defaultDpRm": 5000,
    "ncdOptions": [
      0,
      25,
      30,
      38.33,
      45,
      55
    ],
    "showRebate": true
  },
  "brands": [
    {
      "id": "proton",
      "name": "Proton",
      "logo": "assets/img/brand/logo-proton-dark.webp",
      "models": [
        {
          "id": "saga",
          "name": "Saga",
          "image": "assets/img/cars/proton-saga.webp",
          "rate": 3,
          "rebate": 0,
          "roadtax": 90,
          "active": true,
          "variants": [
            {
              "name": "Saga 1.5 Standard",
              "price": 38990,
              "insurance": 1381.2
            },
            {
              "name": "Saga 1.5 Executive",
              "price": 44990,
              "insurance": 1546.5
            },
            {
              "name": "Saga 1.5 Premium",
              "price": 49990,
              "insurance": 1684.3
            }
          ]
        },
        {
          "id": "s70-na",
          "name": "S70 MC2",
          "image": "assets/img/cars/proton-s70.webp",
          "rate": 3,
          "rebate": 0,
          "roadtax": 90,
          "active": true,
          "variants": [
            {
              "name": "S70 1.5 Lite MC2",
              "price": 59800,
              "insurance": 1839.5
            },
            {
              "name": "S70 1.5 Prime MC2",
              "price": 62800,
              "insurance": 1917.5
            }
          ]
        },
        {
          "id": "s70",
          "name": "S70 1.5TD",
          "image": "assets/img/cars/proton-s70.webp",
          "rate": 2.5,
          "rebate": 0,
          "roadtax": 90,
          "active": true,
          "variants": [
            {
              "name": "S70 1.5TD Premium",
              "price": 79800,
              "insurance": 2511.05
            },
            {
              "name": "S70 1.5TD Flagship",
              "price": 89800,
              "insurance": 2786.65
            },
            {
              "name": "S70 1.5TD Flagship X",
              "price": 94800,
              "insurance": 2924.45
            }
          ]
        },
        {
          "id": "s70-rs",
          "name": "S70 1.5T RS",
          "image": "assets/img/cars/proton-s70-rs.webp",
          "rate": 2.5,
          "rebate": 0,
          "roadtax": 90,
          "active": true,
          "comingSoon": true,
          "descMs": "Sedan sport Proton dengan enjin 1.5 Turbo dan gaya RS yang lebih agresif: sport rim gelap, kaliper brek merah dan aksen merah di sekeliling badan.",
          "descEn": "Proton's sport sedan with a 1.5 Turbo engine and a bolder RS look: dark sport rims, red brake calipers and red accents all around.",
          "variants": [
            {
              "name": "S70 1.5T RS",
              "price": 0,
              "insurance": 0
            }
          ]
        },
        {
          "id": "x50",
          "name": "X50",
          "image": "assets/img/cars/proton-x50.webp",
          "rate": 2.5,
          "rebate": 0,
          "roadtax": 120,
          "active": true,
          "variants": [
            {
              "name": "X50 1.5TD Executive",
              "price": 89800,
              "insurance": 2786.7
            },
            {
              "name": "X50 1.5TD Premium",
              "price": 101800,
              "insurance": 3117.4
            },
            {
              "name": "X50 1.5TD Flagship",
              "price": 113300,
              "insurance": 3420.55
            }
          ]
        },
        {
          "id": "x70",
          "name": "X70",
          "image": "assets/img/cars/proton-x70.webp",
          "rate": 2.5,
          "rebate": 0,
          "roadtax": 120,
          "active": true,
          "variants": [
            {
              "name": "X70 1.5TD Executive",
              "price": 106800,
              "insurance": 3255.2
            },
            {
              "name": "X70 1.5TD Premium",
              "price": 119800,
              "insurance": 3613.5
            }
          ]
        },
        {
          "id": "x90",
          "name": "X90",
          "image": "assets/img/cars/proton-x90.webp",
          "rate": 2.5,
          "rebate": 0,
          "roadtax": 120,
          "active": true,
          "variants": [
            {
              "name": "X90 1.5TD Lite",
              "price": 106800,
              "insurance": 3255.2
            },
            {
              "name": "X90 1.5TD Prime",
              "price": 116800,
              "insurance": 3530.8
            },
            {
              "name": "X90 1.5TD Prime X",
              "price": 122800,
              "insurance": 3696.2
            }
          ]
        },
        {
          "id": "emas5",
          "name": "e.MAS 5",
          "image": "assets/img/cars/proton-emas5.webp",
          "rate": 2.3,
          "rebate": 0,
          "roadtax": 30,
          "active": true,
          "variants": [
            {
              "name": "e.MAS 5 Prime",
              "price": 59800,
              "insurance": 2479.07,
              "roadtax": 30
            },
            {
              "name": "e.MAS 5 Premium",
              "price": 72800,
              "insurance": 3067.27,
              "roadtax": 60
            }
          ]
        },
        {
          "id": "emas7",
          "name": "e.MAS 7",
          "image": "assets/img/cars/proton-emas7.webp",
          "rate": 2.3,
          "rebate": 0,
          "roadtax": 180,
          "active": true,
          "variants": [
            {
              "name": "e.MAS 7 Prime",
              "price": 103800,
              "insurance": 3498.48
            },
            {
              "name": "e.MAS 7 Premium",
              "price": 119800,
              "insurance": 4099.39
            }
          ]
        },
        {
          "id": "emas7-phev",
          "name": "e.MAS 7 PHEV",
          "image": "assets/img/cars/proton-emas7-phev.webp",
          "rate": 2.3,
          "rebate": 0,
          "roadtax": 120,
          "active": true,
          "variants": [
            {
              "name": "e.MAS 7 PHEV Prime",
              "price": 109800,
              "insurance": 3567.03
            },
            {
              "name": "e.MAS 7 PHEV Premium",
              "price": 123800,
              "insurance": 4140.51
            },
            {
              "name": "e.MAS 7 PHEV Premium+",
              "price": 129800,
              "insurance": 4414.83
            }
          ]
        }
      ]
    },
    {
      "id": "perodua",
      "name": "Perodua",
      "logo": "assets/img/brand/logo-perodua.webp",
      "models": [
        {
          "id": "axia",
          "name": "Axia",
          "image": "assets/img/cars/perodua-axia.webp",
          "rate": 3.3,
          "rebate": 0,
          "roadtax": 20,
          "active": true,
          "variants": [
            {
              "name": "Axia 1.0 G CVT",
              "price": 40800,
              "insurance": 1116.68
            },
            {
              "name": "Axia 1.0 X CVT",
              "price": 42200,
              "insurance": 1136.48
            },
            {
              "name": "Axia 1.0 SE CVT",
              "price": 46200,
              "insurance": 1215.67
            },
            {
              "name": "Axia 1.0 AV CVT",
              "price": 51700,
              "insurance": 1314.65
            }
          ]
        },
        {
          "id": "bezza",
          "name": "Bezza",
          "image": "assets/img/cars/perodua-bezza.webp",
          "rate": 3.3,
          "rebate": 0,
          "roadtax": 70,
          "active": true,
          "variants": [
            {
              "name": "Bezza 1.0 G Manual",
              "price": 36780,
              "insurance": 963.14,
              "roadtax": 20
            },
            {
              "name": "Bezza 1.0 G Auto",
              "price": 38780,
              "insurance": 1004.88,
              "roadtax": 20
            },
            {
              "name": "Bezza 1.3 X Premium Auto",
              "price": 46180,
              "insurance": 1150.99
            },
            {
              "name": "Bezza 1.3 Advance Auto",
              "price": 52180,
              "insurance": 1276.23
            }
          ]
        },
        {
          "id": "myvi",
          "name": "Myvi",
          "image": "assets/img/cars/perodua-myvi.webp",
          "rate": 3.3,
          "rebate": 0,
          "roadtax": 90,
          "active": true,
          "variants": [
            {
              "name": "Myvi 1.3 G",
              "price": 48700,
              "insurance": 1377.2,
              "roadtax": 70
            },
            {
              "name": "Myvi 1.3 G (PSDA)",
              "price": 50700,
              "insurance": 1421.09,
              "roadtax": 70
            },
            {
              "name": "Myvi 1.5 X (PSDA)",
              "price": 53100,
              "insurance": 1512.67
            },
            {
              "name": "Myvi 1.5 H (PSDA)",
              "price": 57100,
              "insurance": 1600.47
            },
            {
              "name": "Myvi 1.5 AV (PSDA)",
              "price": 62100,
              "insurance": 1710.21
            }
          ]
        },
        {
          "id": "ativa",
          "name": "Ativa",
          "image": "assets/img/cars/perodua-ativa.webp",
          "rate": 2.7,
          "rebate": 0,
          "roadtax": 20,
          "active": true,
          "variants": [
            {
              "name": "Ativa 1.0 Turbo X (Metallic)",
              "price": 64700,
              "insurance": 1629.37
            },
            {
              "name": "Ativa 1.0 Turbo H (Metallic)",
              "price": 69500,
              "insurance": 1739.11
            },
            {
              "name": "Ativa 1.0 Turbo H (S.Metallic)",
              "price": 70000,
              "insurance": 1761.05
            },
            {
              "name": "Ativa 1.0 Turbo AV (Metallic)",
              "price": 74800,
              "insurance": 1870.8
            },
            {
              "name": "Ativa 1.0 Turbo AV (S.Metallic)",
              "price": 75300,
              "insurance": 1870.8
            },
            {
              "name": "Ativa 1.0 Turbo AV (2-Tone)",
              "price": 75600,
              "insurance": 1870.8
            }
          ]
        },
        {
          "id": "alza",
          "name": "Alza",
          "image": "assets/img/cars/perodua-alza.webp",
          "rate": 2.7,
          "rebate": 0,
          "roadtax": 90,
          "active": true,
          "variants": [
            {
              "name": "Alza 1.5 X",
              "price": 65200,
              "insurance": 1615.01
            },
            {
              "name": "Alza 1.5 H",
              "price": 70700,
              "insurance": 1733.79
            },
            {
              "name": "Alza 1.5 AV",
              "price": 78200,
              "insurance": 1872.37
            }
          ]
        },
        {
          "id": "aruz",
          "name": "Aruz",
          "image": "assets/img/cars/perodua-aruz.webp",
          "rate": 2.7,
          "rebate": 0,
          "roadtax": 90,
          "active": true,
          "variants": [
            {
              "name": "Aruz 1.5 X",
              "price": 75100,
              "insurance": 1896.53
            },
            {
              "name": "Aruz 1.5 AV",
              "price": 80100,
              "insurance": 2006.27
            }
          ]
        },
        {
          "id": "traz",
          "name": "Traz",
          "image": "assets/img/cars/perodua-traz.webp",
          "rate": 2.3,
          "rebate": 0,
          "roadtax": 90,
          "active": true,
          "variants": [
            {
              "name": "Traz 1.5 X (S.Metallic)",
              "price": 78300,
              "insurance": 1990.8
            },
            {
              "name": "Traz 1.5 H (S.Metallic)",
              "price": 83200,
              "insurance": 2100.9
            },
            {
              "name": "Traz 1.5 H (S.Metallic) – RM84,200",
              "price": 84200,
              "insurance": 2150.8
            }
          ]
        },
        {
          "id": "qv-e",
          "name": "QV-E",
          "image": "assets/img/cars/perodua-qve.webp",
          "rate": 2.3,
          "rebate": 0,
          "roadtax": 40,
          "active": false,
          "variants": [
            {
              "name": "QV-E",
              "price": 0,
              "insurance": 0
            }
          ]
        }
      ]
    }
  ],
  "delivery": [
    "assets/img/delivery/delivery-01.webp",
    "assets/img/delivery/delivery-02.webp",
    "assets/img/delivery/delivery-03.webp",
    "assets/img/delivery/delivery-04.webp",
    "assets/img/delivery/delivery-05.webp",
    "assets/img/delivery/delivery-06.webp",
    "assets/img/delivery/delivery-07.webp",
    "assets/img/delivery/delivery-08.webp",
    "assets/img/delivery/delivery-09.webp",
    "assets/img/delivery/delivery-10.webp",
    "assets/img/delivery/delivery-11.webp",
    "assets/img/delivery/delivery-12.webp",
    "assets/img/delivery/delivery-13.webp",
    "assets/img/delivery/delivery-14.webp",
    "assets/img/delivery/delivery-15.webp",
    "assets/img/delivery/delivery-16.webp",
    "assets/img/delivery/delivery-17.webp",
    "assets/img/delivery/delivery-18.webp",
    "assets/img/delivery/delivery-19.webp",
    "assets/img/delivery/delivery-20.webp"
  ]
};
