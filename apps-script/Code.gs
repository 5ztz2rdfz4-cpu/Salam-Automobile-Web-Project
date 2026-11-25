/**
 * SALAM AUTOMOBILE – Penghubung Website <-> Google Sheet
 *
 * Fungsi:
 *  1. Terima leads dari borang website -> tab "Leads Website" (+ tab "Live" sebagai "Lead baru")
 *  2. Simpan & baca tetapan website (harga kereta, no. WhatsApp, gambar delivery) -> tab "Config Website"
 *  3. Halaman Admin: log masuk, senarai leads, upload gambar delivery ke Google Drive
 *
 * CARA PASANG: rujuk README.md (Langkah 2). Ringkasnya:
 *  - Buka Google Sheet "SALAM AUTOMOBILE – DATABASE" > Extensions > Apps Script
 *  - Tampal kod ini, tukar ADMIN_PASSWORD, tekan Save
 *  - Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone)
 *  - Salin URL /exec ke assets/js/settings.js
 */

// ====== TETAPAN – UBAH DI SINI ======
const ADMIN_PASSWORD = 'TUKAR-PASSWORD-INI';      // WAJIB tukar. Minimum 8 aksara.
const SPREADSHEET_ID = '1L-LWCiD7sOyTgykSZiEPjNZbeY_SN377K7LpjE96Ap8';
const ADD_TO_LIVE = true;                          // true = lead baru juga masuk tab "Live"
const NOTIFY_BY_EMAIL = true;                      // true = emel notifikasi lead baru ke akaun Google yang deploy skrip ini
const PHOTO_FOLDER_NAME = 'Salam Automobile – Gambar Website';
// ====================================

const LEADS_SHEET = 'Leads Website';
const LIVE_SHEET = 'Live';
const CONFIG_SHEET = 'Config Website';
const LEADS_HEADERS = ['Tarikh Masuk', 'Nama', 'No. Telefon', 'Lokasi', 'Model Kereta', 'Jenis Pekerjaan',
  'Pendapatan Bersih (RM)', 'Kiraan Loan (dari website)', 'Status', 'Tarikh Follow-up', 'Nota', 'WhatsApp', 'ID'];

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'config';
  try {
    if (action === 'config') return out({ ok: true, config: readConfig() });
    if (action === 'ping') return out({ ok: true, time: new Date().toISOString() });
    return out({ ok: false, error: 'Tindakan tidak dikenali' });
  } catch (err) {
    return out({ ok: false, error: String(err && err.message || err) });
  }
}

function doPost(e) {
  let body = {};
  try { body = JSON.parse((e && e.postData && e.postData.contents) || '{}'); }
  catch (err) { return out({ ok: false, error: 'Data tidak sah' }); }

  try {
    switch (body.action) {
      case 'lead': return out(saveLead(body));
      case 'login': return out(auth(body) ? { ok: true } : { ok: false, error: 'Password salah' });
      case 'saveConfig': requireAuth(body); return out(saveConfig(body.config));
      case 'leads': requireAuth(body); return out({ ok: true, leads: listLeads(body.limit || 100), sheetUrl: ss().getUrl() });
      case 'uploadPhoto': requireAuth(body); return out(uploadPhoto(body));
      default: return out({ ok: false, error: 'Tindakan tidak dikenali' });
    }
  } catch (err) {
    return out({ ok: false, error: String(err && err.message || err) });
  }
}

// ---------- Helpers ----------
function out(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function ss() { return SpreadsheetApp.openById(SPREADSHEET_ID); }
function clean(v, max) {
  let s = String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max || 200);
  if (/^[=+\-@]/.test(s)) s = "'" + s;            // elak formula injection dalam Sheet
  return s;
}

function auth(body) {
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('fails') || 0);
  if (fails >= 10) throw new Error('Terlalu banyak cubaan. Cuba lagi selepas 10 minit.');
  if (ADMIN_PASSWORD === 'TUKAR-PASSWORD-INI' || ADMIN_PASSWORD.length < 8) throw new Error('Sila tukar ADMIN_PASSWORD dalam Apps Script dahulu.');
  const ok = typeof body.password === 'string' && body.password === ADMIN_PASSWORD;
  if (!ok) cache.put('fails', String(fails + 1), 600);
  return ok;
}
function requireAuth(body) { if (!auth(body)) throw new Error('Password salah'); }

function sheet(name, headers) {
  const s = ss();
  let sh = s.getSheetByName(name);
  if (!sh) {
    sh = s.insertSheet(name);
    if (headers) { sh.appendRow(headers); sh.setFrozenRows(1); sh.getRange(1, 1, 1, headers.length).setFontWeight('bold'); }
  }
  return sh;
}

// ---------- Leads ----------
function saveLead(b) {
  if (b.website) return { ok: true };                       // honeypot (bot)
  const nama = clean(b.nama, 80), phone = clean(b.phone, 16).replace(/[^\d+]/g, '');
  if (nama.length < 2 || !/^(\+?60|0)1\d{8,9}$/.test(phone)) return { ok: false, error: 'Nama atau No. Phone tidak sah' };

  const cache = CacheService.getScriptCache();
  if (cache.get('lead_' + phone)) return { ok: true, duplicate: true };   // elak hantar berganda dalam 2 minit
  cache.put('lead_' + phone, '1', 120);

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const now = new Date();
    const id = Utilities.getUuid().slice(0, 8);
    const intl = phone.replace(/^\+/, '').replace(/^0/, '60');
    const phoneText = "'" + phone;                  // simpan sebagai teks supaya 0 di depan kekal
    const row = [now, nama, phoneText, clean(b.lokasi, 80), clean(b.model, 80), clean(b.kerja, 30),
      Number(b.gaji) || '', clean(b.calc, 600), 'Lead baru', '', '', 'https://wa.me/' + intl, id];
    sheet(LEADS_SHEET, LEADS_HEADERS).appendRow(row);

    if (ADD_TO_LIVE) {
      const live = ss().getSheetByName(LIVE_SHEET);
      if (live) {
        const nota = 'Lead website. Lokasi: ' + row[3] + ' | Kerja: ' + row[5] + ' | Gaji bersih: RM' + (row[6] || '-') + ' | ' + row[7];
        live.appendRow([now, nama, phoneText, row[4], 'Website', 'Lead baru', '', 'Belum', 'Belum', now, nota]);
      }
    }
    const notifyTo = NOTIFY_BY_EMAIL ? Session.getEffectiveUser().getEmail() : '';
    if (notifyTo) {
      MailApp.sendEmail(notifyTo, 'Lead baru website: ' + nama + ' (' + row[4] + ')',
        'Nama: ' + nama + '\nTelefon: ' + phone + '\nLokasi: ' + row[3] + '\nModel: ' + row[4] +
        '\nPekerjaan: ' + row[5] + '\nPendapatan bersih: RM' + row[6] + '\n\n' + row[7] + '\n\nWhatsApp: ' + row[11] + '\nSheet: ' + ss().getUrl());
    }
  } finally { lock.releaseLock(); }
  return { ok: true };
}

function listLeads(limit) {
  const sh = sheet(LEADS_SHEET, LEADS_HEADERS);
  const last = sh.getLastRow();
  if (last < 2) return [];
  const n = Math.min(Number(limit) || 100, last - 1);
  const vals = sh.getRange(last - n + 1, 1, n, 12).getValues();
  return vals.reverse().map(function (r) {
    return { tarikh: r[0] instanceof Date ? r[0].toISOString() : String(r[0]), nama: r[1], phone: String(r[2]), lokasi: r[3],
      model: r[4], kerja: r[5], gaji: r[6], status: r[8], nota: r[10], wa: r[11] };
  });
}

// ---------- Config ----------
function readConfig() {
  const sh = ss().getSheetByName(CONFIG_SHEET);
  if (!sh) return null;
  const raw = sh.getRange('B2').getValue();
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}
function saveConfig(cfg) {
  if (!cfg || !cfg.brands || !cfg.business) throw new Error('Config tidak lengkap');
  cfg.updatedAt = new Date().toISOString();
  const json = JSON.stringify(cfg);
  if (json.length > 45000) throw new Error('Config terlalu besar');
  const sh = sheet(CONFIG_SHEET);
  sh.getRange('A1').setValue('CONFIG WEBSITE – jangan edit sel B2 secara manual. Guna halaman Admin website.');
  sh.getRange('A2:B3').setValues([['config_json', json], ['dikemas kini', new Date()]]);
  return { ok: true, updatedAt: cfg.updatedAt };
}

// ---------- Gambar delivery ----------
function photoFolder() {
  const it = DriveApp.getFoldersByName(PHOTO_FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(PHOTO_FOLDER_NAME);
}
function uploadPhoto(b) {
  const m = /^data:(image\/(jpeg|png|webp));base64,(.+)$/.exec(b.dataUrl || '');
  if (!m) throw new Error('Format gambar tidak disokong');
  const bytes = Utilities.base64Decode(m[3]);
  if (bytes.length > 4 * 1024 * 1024) throw new Error('Gambar terlalu besar (maks 4MB)');
  const ext = m[2] === 'jpeg' ? 'jpg' : m[2];
  const file = photoFolder().createFile(Utilities.newBlob(bytes, m[1], 'delivery-' + Date.now() + '.' + ext));
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { ok: true, id: file.getId(), url: 'https://lh3.googleusercontent.com/d/' + file.getId() + '=w1200' };
}

/** Jalankan sekali dari editor untuk beri kebenaran (Run > setup). */
function setup() {
  sheet(LEADS_SHEET, LEADS_HEADERS);
  sheet(CONFIG_SHEET);
  photoFolder();
  Logger.log('Sedia. Spreadsheet: ' + ss().getUrl());
}
