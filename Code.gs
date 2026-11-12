/**
 * Google Apps Script — penerima jawaban Survei Teknologi & AI di Jayapura/Papua
 * Menyimpan setiap jawaban sebagai satu baris di sheet "Jawaban".
 *
 * Cara pasang: lihat README.md.
 */

const SPREADSHEET_ID = '1cRjo19_Xqm62ndoRoX4hPINc4VUNRElIO2XyM47ekb0';
const SHEET_NAME = 'Jawaban';

// Isi dengan kata sandi bebas jika laporan hasil.html tidak boleh dibuka umum.
// Lalu buka laporan dengan alamat: hasil.html?kunci=KATA_SANDI
const KUNCI_HASIL = '';
// Lama data laporan disimpan di cache (detik) agar spreadsheet tidak dibaca terus-menerus.
const CACHE_DETIK = 300;

// [kunci dari form, judul kolom di spreadsheet]
const COLUMNS = [
  ['timestamp', 'Waktu Kirim'],
  ['sumber', 'Sumber Tautan'],
  ['q1', '1. Usia'],
  ['q2', '2. Jenis kelamin'],
  ['q3', '3. Domisili'],
  ['q4', '4. Pekerjaan/status'],
  ['q5', '5. Sektor kerja'],
  ['q6', '6. Peran AI sehari-hari'],
  ['q7', '7. Bergantung pada AI'],
  ['q8', '8. Aplikasi AI (6 bulan terakhir)'],
  ['q9', '9. Frekuensi chatbot'],
  ['q10', '10. Keperluan memakai AI'],
  ['q11', '11. Dampak AI'],
  ['q12', '12. Tingkat kemampuan AI'],
  ['q13', '13. Sumber belajar AI'],
  ['q14', '14. Memeriksa jawaban AI'],
  ['q15', '15. AI untuk kerja/usaha'],
  ['q16', '16. Sikap organisasi'],
  ['q17', '17. Pekerjaan tergantikan AI (5 thn)'],
  ['q18', '18. AI untuk UMKM'],
  ['q19', '19. Hambatan'],
  ['q20', '20. Kekhawatiran'],
  ['q21', '21. Info AI aman'],
  ['q22', '22. Kualitas internet'],
  ['q23', '23. Pengeluaran internet/bulan'],
  ['q24', '24. AI paham konteks Papua'],
  ['q25', '25. Konsumsi budaya luar'],
  ['q26', '26. Melihat konten palsu AI'],
  ['q27', '27. Papua siap secara ekonomi'],
  ['q28', '28. Prioritas kebijakan'],
  ['q29', '29. Pengalaman (isian bebas)'],
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const p = (e && e.parameter) || {};

    // Honeypot: bot biasanya mengisi kolom tersembunyi ini
    if (p.website) return json_({ ok: true });

    const sheet = getSheet_();
    const row = COLUMNS.map(([key]) => key === 'timestamp' ? new Date() : clean_(p[key]));
    sheet.appendRow(row);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// GET tanpa parameter  : cek apakah skrip aktif.
// GET ?aksi=hasil      : data jawaban untuk hasil.html (sudah dianonimkan).
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.aksi === 'hasil') return hasil_(p);
  return json_({ ok: true, pesan: 'Penerima survei aktif.' });
}

/**
 * Mengirim semua jawaban dalam bentuk ringkas untuk halaman laporan.
 * Demi privasi: waktu kirim dipotong menjadi tanggal, isian bebas
 * "Lainnya: ..." hanya disimpan sebagai "Lainnya", dan cerita pertanyaan 29
 * hanya ditandai 1 (diisi) atau 0 (kosong). Isi teksnya tidak pernah dikirim.
 */
function hasil_(p) {
  if (KUNCI_HASIL && p.kunci !== KUNCI_HASIL) {
    return json_({ ok: false, error: 'Kunci akses laporan salah atau belum diisi.' });
  }
  const cache = CacheService.getScriptCache();
  const cached = cache.get('hasil');
  if (cached) return text_(cached);

  const sheet = getSheet_();
  const keys = COLUMNS.map(c => c[0]);
  const last = sheet.getLastRow();
  const tz = Session.getScriptTimeZone();
  let rows = [];
  if (last > 1) {
    rows = sheet.getRange(2, 1, last - 1, COLUMNS.length).getValues().map(r => keys.map((k, i) => {
      const v = r[i];
      if (k === 'timestamp') return v instanceof Date ? Utilities.formatDate(v, tz, 'yyyy-MM-dd') : String(v).slice(0, 10);
      if (k === 'q29') return String(v).trim() && v !== '(dilewati)' ? 1 : 0;
      return anonim_(String(v));
    }));
  }
  const out = JSON.stringify({ ok: true, diperbarui: new Date().toISOString(), kolom: keys, baris: rows });
  try { cache.put('hasil', out, CACHE_DETIK); } catch (_) { /* data terlalu besar untuk cache, abaikan */ }
  return text_(out);
}

// "Lainnya: Merauke" -> "Lainnya"; "Kabupaten lain di Papua: Biak" -> "Kabupaten lain di Papua"
function anonim_(s) {
  return s.split('; ').map(x => x.replace(/^(Lainnya|Kabupaten lain di Papua):.*$/, '$1')).join('; ');
}

// Jalankan sekali dari editor (opsional) untuk membuat sheet dan judul kolom
function setup() {
  getSheet_();
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(c => c[1]));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#e3f1ee');
  }
  return sheet;
}

// Batasi panjang teks dan cegah formula injection (=, +, -, @)
function clean_(v) {
  if (v === undefined || v === null) return '';
  let s = String(v).slice(0, 2000);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function text_(s) {
  return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.JSON);
}
