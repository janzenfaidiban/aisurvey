# Survei Teknologi & AI di Jayapura/Papua

Form survei statis untuk GitHub Pages. Setiap jawaban disimpan ke Google Spreadsheet melalui Google Apps Script.

**File:**
- `index.html`: halaman form yang dipasang di GitHub Pages.
- `Code.gs`: skrip penerima jawaban yang dipasang di Google Apps Script.

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

Buka `index.html` dan ganti baris berikut dengan URL dari langkah 2:

```js
const SCRIPT_URL = "PASTE_URL_WEB_APP_DI_SINI";
```

## 4. Terbitkan di GitHub Pages

1. Buat repositori baru di GitHub, misalnya `survei-ai-papua`, lalu unggah `index.html`.
2. Buka **Settings → Pages**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu **Save**.
3. Setelah 1–2 menit, form bisa diakses di `https://<username>.github.io/survei-ai-papua/`.

## Melacak saluran penyebaran

Tambahkan `?src=...` di akhir tautan untuk mencatat dari mana responden datang. Nilainya akan masuk ke kolom **Sumber Tautan**. Contoh:

- `.../survei-ai-papua/?src=wa-uncen`
- `.../survei-ai-papua/?src=umkm`
- `.../survei-ai-papua/?src=gereja`

## Catatan

- Pertanyaan 9–18 otomatis dilewati jika responden memilih "Belum pernah menggunakan AI". Pertanyaan 16–17 dilewati jika responden tidak bekerja. Pertanyaan yang dilewati tercatat sebagai `(dilewati)`, sehingga bisa dibedakan dari jawaban kosong.
- Jawaban dengan pilihan ganda disimpan dalam satu sel, dipisahkan tanda `; `. Untuk menghitung persentase per opsi, gunakan rumus seperti `=COUNTIF(J:J,"*ChatGPT*")` (kolom J = pertanyaan 8).
- Form ini tidak menyimpan nama, email, atau nomor HP. Kolom tersembunyi (honeypot) dipakai untuk menyaring kiriman bot.
