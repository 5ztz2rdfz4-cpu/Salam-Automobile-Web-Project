# Salam Automobile – Website

Website rasmi Salam Automobile (Muhammad Nabil Ahnaf, Authorised Sales Advisor Proton & Perodua).

**Kandungan website**
- Hero dengan gambar founder (berbingkai) dan nama di bawah gambar
- Galeri serahan kunci pelanggan (no. plate dikaburkan, tiada nama pelanggan)
- Kalkulator loan: pilih jenama → model (gambar kereta keluar) → varian
  - Harga OTR tanpa insurans & harga OTR termasuk insurans
  - Deposit ikut **%** atau **RM**
  - Kadar faedah **tetap (fixed)**, tempoh 5–9 tahun, NCD 0–55%
  - Kiraan sama seperti Excel "Live Calculator" (rebat ditolak, faedah tetap × tempoh)
- Anggaran insurans & cukai jalan tahunan (premium asas, diskaun NCD, roadtax)
- Borang leads → terus masuk Google Sheet **SALAM AUTOMOBILE – DATABASE**
- Halaman **Admin** (`admin.html`) untuk ubah harga, kadar, rebat, roadtax, no. WhatsApp, gambar delivery dan lihat leads

## Struktur fail

```
index.html               Laman utama (pengenalan, perkhidmatan, trade-in)
kalkulator.html          Kalkulator loan + anggaran insurans & cukai jalan
delivery.html            Galeri serahan kunci pelanggan
admin.html               Halaman Admin
assets/css/style.css     Reka bentuk
assets/js/app.js         Kalkulator, galeri, borang
assets/js/i18n.js        Pilihan bahasa BM / EN (teks EN pada atribut data-en dalam HTML)
assets/js/admin.js       Logik Admin
assets/js/data.js        Harga asal (dari Excel PROTON/PERODUA LIVE CALCULATOR)
assets/js/settings.js    URL Apps Script (sambungan Google Sheet)
assets/img/              Logo, gambar founder, kereta (tanpa latar), delivery
apps-script/Code.gs      Kod Google Apps Script (penghubung Google Sheet)
```

## Langkah 1 – Hidupkan website (GitHub Pages, percuma)

1. Gabungkan (merge) branch ini ke `main`.
2. GitHub → repo ini → **Settings → Pages**.
3. *Source*: **Deploy from a branch** → Branch **main**, folder **/ (root)** → **Save**.
4. Selepas 1–2 minit, website boleh dibuka di:
   `https://5ztz2rdfz4-cpu.github.io/Salam-Automobile-Web-Project/`
   (Admin: tambah `admin.html` di hujung link.)

## Langkah 2 – Sambung ke Google Sheet (untuk leads & Admin)

Buat sekali sahaja, lebih mudah guna komputer.

1. Buka Google Sheet **SALAM AUTOMOBILE – DATABASE**.
   Tab **Leads Website** dan **Config Website** telah disediakan.
2. Menu **Extensions → Apps Script**.
3. Padam semua kod dalam `Code.gs`, kemudian tampal isi fail [`apps-script/Code.gs`](apps-script/Code.gs).
4. Pada baris `const ADMIN_PASSWORD = 'TUKAR-PASSWORD-INI';` tukar kepada password Admin anda (minimum 8 aksara). Tekan **Save** (ikon disket).
5. Pilih fungsi **setup** di toolbar → tekan **Run** → **Review permissions** → pilih akaun Google → **Advanced → Go to project (unsafe) → Allow**.
   (Amaran "unsafe" ini biasa untuk skrip sendiri.)
6. **Deploy → New deployment** → ikon gear → **Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   - Tekan **Deploy** dan salin **Web app URL** (berakhir dengan `/exec`).
7. Buka [`assets/js/settings.js`](assets/js/settings.js) dan tampal URL tersebut:
   ```js
   window.SALAM_SETTINGS = { appsScriptUrl: "https://script.google.com/macros/s/XXXX/exec" };
   ```
   Commit perubahan. (Atau hantar URL kepada pembangun untuk dimasukkan.)

Siap. Mulai sekarang:
- Setiap borang yang diisi masuk ke tab **Leads Website** (status "Lead baru", dropdown status, link WhatsApp terus) **dan** tab **Live** (Sumber Lead: Website) supaya ikut kiraan tab Ringkasan.
- Setiap lead baru juga dihantar sebagai emel ke akaun Google yang deploy skrip (boleh tutup dengan `NOTIFY_BY_EMAIL = false`).

> Jika anda ubah kod Apps Script kemudian: **Deploy → Manage deployments → Edit (pensel) → Version: New version → Deploy**. URL kekal sama.

## Langkah 3 – Guna Admin

1. Buka `.../admin.html` → masukkan password Admin.
2. **Harga Kereta**: ubah harga OTR tanpa insurans, insurans (premium asas), kadar faedah tetap, rebat, roadtax; tambah/padam varian atau model; sembunyikan model.
3. **Tetapan**: no. WhatsApp (untuk semua butang "Hubungi Kami"), TikTok, deposit & tempoh asal.
4. **Gambar Delivery**: tambah gambar → lukis kotak pada no. plate untuk dikaburkan → upload (disimpan dalam Google Drive folder "Salam Automobile – Gambar Website").
5. **Leads**: senarai 100 leads terkini + butang buka Google Sheet.
6. Tekan **Simpan & terbitkan**. Website terus guna data baharu (disimpan dalam tab *Config Website*).

## Nota data

- Harga & insurans diambil dari `PROTON LIVE CALCULATOR.xlsx` dan `PERODUA LIVE NEW.xlsx` (Nov 2026).
- Rebat/diskaun dan kadar faedah ikut nilai dalam sheet kiraan setiap model.
- Roadtax kereta petrol ikut kadar Semenanjung mengikut cc. Roadtax EV (e.MAS 5, e.MAS 7, QV-E) ialah **anggaran**; sila semak dan kemas kini di Admin.
- Perodua QV-E disembunyikan kerana tiada harga dalam sheet. Isi harga di Admin dan tandakan "Paparkan di website".
- Harga Traz dalam sheet sama dengan Aruz; sila semak.
