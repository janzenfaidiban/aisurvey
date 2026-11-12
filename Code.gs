/**
 * Google Apps Script — penerima jawaban Survei Teknologi & AI di Jayapura/Papua
 * Menyimpan setiap jawaban sebagai satu baris di sheet "Jawaban".
 *
 * Cara pasang: lihat README.md.
 */

const SPREADSHEET_ID = '1cRjo19_Xqm62ndoRoX4hPINc4VUNRElIO2XyM47ekb0';
const SHEET_NAME = 'Jawaban';

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

// Buka URL Web App di browser untuk memastikan skrip aktif
function doGet() {
  return json_({ ok: true, pesan: 'Penerima survei aktif.' });
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
