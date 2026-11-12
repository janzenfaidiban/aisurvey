# Survei Teknologi & AI di Jayapura/Papua

Form survei statis untuk GitHub Pages. Setiap jawaban disimpan ke Google Spreadsheet melalui Google Apps Script, lalu ditampilkan sebagai laporan analisa dan diagram di `hasil.html`.

- **Form survei:** https://janzenfaidiban.github.io/aisurvey/
- **Laporan hasil:** https://janzenfaidiban.github.io/aisurvey/hasil.html (data contoh: [`hasil.html?demo=1`](https://janzenfaidiban.github.io/aisurvey/hasil.html?demo=1))
- **Penanggung jawab (PIC) survei:** [Ester Numbre](https://esternumbre.github.io/)
- **Target responden:** 100 peserta

**File:**
- `index.html`: halaman form yang dipasang di GitHub Pages.
- `hasil.html`: halaman laporan hasil survei (ringkasan temuan, diagram per pertanyaan, analisa silang, filter, cetak PDF, unduh CSV).
- `pertanyaan.js`: pengaturan bersama untuk `index.html` dan `hasil.html`: `SCRIPT_URL`, PIC survei (`PIC`), target responden (`TARGET_RESPONDEN`), dan daftar pertanyaan.
- `Code.gs`: skrip penerima jawaban (dan penyedia data laporan) yang dipasang di Google Apps Script.
## 1. Pasang skrip di spreadsheet

1. Buka spreadsheet: https://docs.google.com/spreadsheets/d/1cRjo19_Xqm62ndoRoX4hPINc4VUNRElIO2XyM47ekb0/edit
2. Pilih menu **Ekstensi → Apps Script**.
3. Hapus isi `Code.gs` yang ada, lalu tempel seluruh isi file `Code.gs` dari folder ini. Simpan.
4. (Opsional) Pilih fungsi `setup` di toolbar, lalu klik **Jalankan**. Berikan izin akses saat diminta. Sheet **Jawaban** beserta judul kolomnya akan dibuat.

## 2. Terbitkan sebagai Web App

1. Klik **Terapkan → Deployment baru**.
2. Klik ikon roda gigi, lalu pilih **Aplikasi web**.
3. Atur **Jalankan sebagai** ke **Saya** dan **Siapa yang memiliki akses** ke **Siapa saja**.
4. Klik **Terapkan**, berikan izin, lalu salin **URL aplikasi web** (berakhiran `/exec`).
5. Uji dengan membuka URL itu di browser. Jika muncul `{"ok":true,"pesan":"Penerima survei aktif."}`, skrip sudah aktif.

> Jika nanti `Code.gs` diubah, buka **Terapkan → Kelola deployment → Edit (ikon pensil) → Versi: Versi baru → Terapkan**. Dengan cara ini URL-nya tetap sama.

## 3. Hubungkan form

Buka `pertanyaan.js` dan ganti baris berikut dengan URL dari langkah 2:

```js
const SCRIPT_URL = "PASTE_URL_WEB_APP_DI_SINI";
```

## 4. Terbitkan di GitHub Pages

1. Repositori: https://github.com/janzenfaidiban/aisurvey. Pastikan `index.html`, `hasil.html`, dan `pertanyaan.js` ikut diunggah (push ke branch `main`).
2. Buka **Settings → Pages**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu **Save**.
3. Setelah 1–2 menit, form bisa diakses di https://janzenfaidiban.github.io/aisurvey/

## Halaman hasil (laporan)

Buka https://janzenfaidiban.github.io/aisurvey/hasil.html. Isinya:

- **Capaian target responden**: jumlah terkumpul dibanding target 100, sisa responden, jawaban hari ini dan 7 hari terakhir, rata-rata per hari, serta perkiraan tanggal target tercapai.
- Angka utama (jumlah responden, % pengguna AI, dan lainnya) beserta **ringkasan temuan** yang ditulis otomatis dari data.
- Tren jumlah jawaban per hari dan perbandingan saluran penyebaran (`?src=`).
- **Analisa silang**: penggunaan AI menurut usia dan pekerjaan, kualitas internet menurut domisili, kebiasaan memeriksa jawaban AI menurut usia.
- Diagram untuk setiap pertanyaan. Pertanyaan setuju/tidak setuju dan skala kualitas memakai diagram divergen, sedangkan pertanyaan lain memakai diagram batang. Setiap diagram dilengkapi tabel angka.
- Filter menurut usia, jenis kelamin, domisili, pekerjaan, dan sumber tautan. Tersedia juga tombol **Cetak / simpan PDF** dan **Unduh rekap (CSV)**.

Agar halaman ini bisa membaca data, `Code.gs` versi terbaru harus diterapkan sebagai **versi baru** (lihat catatan di langkah 2). Untuk melihat tampilan laporan dengan data acak, buka `hasil.html?demo=1`.

**Privasi:** Web App hanya mengirim tanggal (bukan jam), pilihan jawaban, dan tanda apakah pertanyaan 29 diisi. Isian bebas "Lainnya: …" dan cerita responden tidak pernah dikirim ke halaman laporan. Jika laporan tidak boleh dibuka umum, isi `KUNCI_HASIL` di `Code.gs` dengan kata sandi, lalu buka laporan dengan `hasil.html?kunci=KATA_SANDI`. Data laporan di-cache selama 5 menit (`CACHE_DETIK`).

## Melacak saluran penyebaran

Tambahkan `?src=...` di akhir tautan untuk mencatat dari mana responden datang. Nilainya akan masuk ke kolom **Sumber Tautan**. Contoh:

- `https://janzenfaidiban.github.io/aisurvey/?src=wa-uncen`
- `https://janzenfaidiban.github.io/aisurvey/?src=umkm`
- `https://janzenfaidiban.github.io/aisurvey/?src=gereja`

## Catatan

- Form memiliki navigasi bulatan nomor pertanyaan (sidebar kanan di layar lebar, deretan di bawah bar progres di HP): hijau = sudah dijawab, garis putus-putus = opsional, pudar = dilewati otomatis, merah = wajib tetapi belum dijawab saat tombol Kirim ditekan. Klik nomor untuk langsung menuju pertanyaannya.
- Pertanyaan 9–18 otomatis dilewati jika responden memilih "Belum pernah menggunakan AI". Pertanyaan 16–17 dilewati jika responden tidak bekerja. Pertanyaan yang dilewati tercatat sebagai `(dilewati)`, sehingga bisa dibedakan dari jawaban kosong.
- Jawaban dengan pilihan ganda disimpan dalam satu sel, dipisahkan tanda `; `. Untuk menghitung persentase per opsi, gunakan rumus seperti `=COUNTIF(J:J,"*ChatGPT*")` (kolom J = pertanyaan 8).
- Form ini tidak menyimpan nama, email, atau nomor HP. Kolom tersembunyi (honeypot) dipakai untuk menyaring kiriman bot.
