/* =========================================================
   Data bersama untuk index.html (form) dan hasil.html (laporan).
   Ubah pertanyaan di sini saja agar kedua halaman tetap sinkron.
   ========================================================= */

/* =========================================================
   KONFIGURASI
   Ganti SCRIPT_URL dengan URL Web App dari Google Apps Script
   (lihat README.md, langkah 3).
   ========================================================= */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz6_TFDSpaJGTLrT-ZxWuW330swpkXu9R1EtQ2ZhgSfRBekXM2qoZysI75bqkilQVio/exec";

// AKfycbz6_TFDSpaJGTLrT-ZxWuW330swpkXu9R1EtQ2ZhgSfRBekXM2qoZysI75bqkilQVio

// Penanggung jawab (PIC) survei, tampil di form dan laporan
const PIC = { nama: "Ester Numbre", url: "https://esternumbre.github.io/" };

// Target jumlah responden, dipakai untuk statistik capaian di hasil.html
const TARGET_RESPONDEN = 100;

/* ---------- Daftar pertanyaan ---------- */
const AGREE4 = ["Sangat tidak setuju", "Tidak setuju", "Setuju", "Sangat setuju"];
const SCALE5 = ["Sangat buruk", "Buruk", "Cukup", "Baik", "Sangat baik"];
const NEVER_AI = "Belum pernah menggunakan AI";
const NOT_WORKING = "Tidak bekerja atau berusaha";

const SECTIONS = [
  { code: "A", title: "Profil Responden", questions: [
    { id: "q1", text: "Berapa usia Anda?", type: "radio", required: true,
      options: ["Di bawah 18 tahun", "18–28 tahun (Gen Z)", "29–44 tahun (Milenial)", "45 tahun ke atas"] },
    { id: "q2", text: "Apa jenis kelamin Anda?", type: "radio", required: true,
      options: ["Laki-laki", "Perempuan"] },
    { id: "q3", text: "Di mana Anda tinggal saat ini?", type: "radio", required: true,
      options: ["Kota Jayapura", "Kabupaten Jayapura (Sentani dan sekitarnya)", "Kabupaten Keerom", "Kabupaten lain di Papua"],
      other: "Kabupaten lain di Papua", otherPlaceholder: "Sebutkan kabupatennya" },
    { id: "q4", text: "Apa pekerjaan atau status Anda saat ini?", type: "radio", required: true,
      options: ["Pelajar atau mahasiswa", "ASN, TNI, atau Polri", "Karyawan swasta atau BUMN", "Wirausaha atau pelaku UMKM",
                "Guru atau dosen", "Tenaga kesehatan", "Pekerja gereja, LSM, atau lembaga adat", "Belum atau tidak bekerja", "Lainnya"],
      other: "Lainnya" },
    { id: "q5", text: "Jika bekerja atau berusaha, di sektor apa?", type: "radio", required: false,
      hint: "Lewati jika tidak bekerja atau berusaha.",
      options: ["Digital, media, atau kreatif", "Pendidikan", "Perdagangan dan jasa konsumen", "Pemerintahan", "Kesehatan",
                "Pertanian, perikanan, atau kehutanan", "Lainnya"],
      other: "Lainnya" },
  ]},
  { code: "B", title: "Penggunaan AI", questions: [
    { id: "q6", text: "Seberapa besar peran AI dalam kehidupan sehari-hari Anda?", type: "radio", required: true,
      options: ["Tidak berperan sama sekali", "Sedikit berperan", "Cukup berperan", "Sangat berperan"] },
    { id: "q7", text: "Seberapa setuju Anda dengan pernyataan \"Saya bergantung pada AI untuk aktivitas sehari-hari\"?",
      type: "radio", required: true, options: AGREE4 },
    { id: "q8", text: "Aplikasi AI apa saja yang Anda gunakan dalam 6 bulan terakhir?", type: "checkbox", required: true,
      options: ["ChatGPT", "Meta AI (di WhatsApp, Instagram, atau Facebook)", "Google Gemini", "Microsoft Copilot",
                "DeepSeek", "Perplexity", "Lainnya", NEVER_AI],
      other: "Lainnya", exclusive: NEVER_AI },
    { id: "q9", text: "Seberapa sering Anda memakai chatbot AI?", type: "radio", required: true, aiUser: true,
      options: ["Kurang dari sekali seminggu", "1–3 kali seminggu", "Lebih dari 3 kali seminggu", "Setiap hari"] },
    { id: "q10", text: "Untuk keperluan apa Anda memakai AI?", type: "checkbox", required: true, aiUser: true,
      options: ["Mencari informasi atau merangkum jawaban", "Tugas sekolah atau kuliah",
                "Pekerjaan kantor (surat, laporan, presentasi)", "Membuat konten media sosial", "Jualan atau promosi usaha",
                "Menerjemahkan bahasa", "Menyiapkan bahan ibadah, khotbah, atau kegiatan gereja", "Hiburan", "Lainnya"],
      other: "Lainnya" },
    { id: "q11", text: "Secara umum, bagaimana dampak AI bagi hidup Anda?", type: "radio", required: true, aiUser: true,
      options: ["Lebih banyak negatif", "Seimbang", "Lebih banyak positif"] },
  ]},
  { code: "C", title: "Keterampilan dan Cara Belajar", aiOnly: true, questions: [
    { id: "q12", text: "Bagaimana Anda menilai kemampuan Anda menggunakan AI?", type: "radio", required: true, aiUser: true,
      options: ["Pemula", "Menengah", "Mahir", "Ahli"] },
    { id: "q13", text: "Dari mana Anda belajar menggunakan AI?", type: "checkbox", required: true, aiUser: true,
      options: ["Media sosial atau YouTube", "Teman atau keluarga", "Sekolah atau kampus", "Kursus formal atau pelatihan", "Mencoba sendiri"] },
    { id: "q14", text: "Apakah Anda memeriksa kebenaran jawaban AI, misalnya dengan buku, jurnal, atau sumber lain?",
      type: "radio", required: true, aiUser: true, options: ["Selalu", "Kadang-kadang", "Jarang", "Tidak pernah"] },
  ]},
  { code: "D", title: "AI di Tempat Kerja dan Usaha", aiOnly: true, questions: [
    { id: "q15", text: "Apakah Anda memakai AI untuk pekerjaan atau usaha Anda?", type: "radio", required: true, aiUser: true,
      options: ["Ya, rutin", "Ya, sesekali", "Tidak", NOT_WORKING] },
    { id: "q16", text: "Bagaimana sikap kantor atau organisasi Anda terhadap penggunaan AI?", type: "radio", required: true,
      aiUser: true, worker: true,
      options: ["Melarang", "Netral (tidak ada aturan)", "Mendorong", "Mewajibkan", "Tidak tahu"] },
    { id: "q17", text: "Seberapa setuju Anda dengan pernyataan \"Pekerjaan saya bisa sepenuhnya digantikan AI dalam 5 tahun ke depan\"?",
      type: "radio", required: true, aiUser: true, worker: true, options: AGREE4 },
    { id: "q18", text: "Khusus pelaku usaha atau UMKM: di bagian apa AI paling membantu usaha Anda?", type: "checkbox",
      required: false, aiUser: true, hint: "Lewati jika Anda tidak punya usaha.",
      options: ["Promosi dan konten media sosial", "Melayani pelanggan", "Pembukuan atau perhitungan", "Mencari ide produk",
                "Belum memakai AI untuk usaha"] },
  ]},
  { code: "E", title: "Tantangan dan Kekhawatiran", questions: [
    { id: "q19", text: "Apa hambatan terbesar Anda dalam memakai AI?", type: "checkbox", required: true,
      options: ["Keamanan data pribadi", "Jawaban AI tidak akurat", "Biaya atau akses",
                "Bahasa atau tampilan aplikasi sulit dipahami", "Sulit memakai fitur lanjutan",
                "Internet lambat atau tidak stabil", "Perangkat (HP atau laptop) kurang memadai"] },
    { id: "q20", text: "Apa yang paling Anda khawatirkan dari AI?", type: "checkbox", required: true,
      options: ["Foto, suara, atau video palsu (deepfake)", "Penyalahgunaan data pribadi", "Informasi yang salah atau hoaks",
                "Kehilangan pekerjaan", "Lainnya"],
      other: "Lainnya" },
    { id: "q21", text: "Seberapa setuju Anda dengan pernyataan \"Informasi dari AI aman dipakai untuk keperluan sehari-hari\"?",
      type: "radio", required: true, options: AGREE4 },
  ]},
  { code: "F", title: "Konteks Papua", questions: [
    { id: "q22", text: "Bagaimana kualitas internet yang Anda pakai sehari-hari?", type: "radio", required: true, options: SCALE5 },
    { id: "q23", text: "Berapa pengeluaran Anda untuk kuota atau internet per bulan?", type: "radio", required: true,
      options: ["Kurang dari Rp50.000", "Rp50.000–Rp100.000", "Rp100.001–Rp200.000", "Lebih dari Rp200.000"] },
    { id: "q24", text: "Menurut Anda, seberapa baik AI memahami konteks Papua, seperti nama tempat, istilah lokal, logat Melayu Papua, atau bahasa daerah?",
      type: "radio", required: true, options: SCALE5.concat(["Tidak tahu"]) },
    { id: "q25", text: "Seberapa setuju Anda dengan pernyataan \"Media sosial dan AI membuat saya lebih banyak mengonsumsi budaya luar daripada budaya Papua\"?",
      type: "radio", required: true, options: AGREE4 },
    { id: "q26", text: "Dalam setahun terakhir, apakah Anda pernah melihat foto, suara, atau video palsu buatan AI beredar di grup WhatsApp atau media sosial lokal?",
      type: "radio", required: true, options: ["Ya", "Tidak", "Tidak yakin"] },
  ]},
  { code: "G", title: "Harapan dan Kebijakan", questions: [
    { id: "q27", text: "Seberapa setuju Anda dengan pernyataan \"Papua siap secara ekonomi memanfaatkan AI\"?",
      type: "radio", required: true, options: AGREE4 },
    { id: "q28", text: "Apa yang paling perlu dilakukan pemerintah di Papua terkait AI?", type: "checkbox", required: true, max: 3,
      hint: "Pilih paling banyak 3.",
      options: ["Pelatihan AI dan keterampilan digital untuk pekerja", "Literasi digital untuk masyarakat",
                "Aturan yang melindungi pekerja", "Pemerataan internet dan infrastruktur",
                "Pengembangan AI dan konten berbahasa daerah Papua", "Perlindungan data pribadi dan pencegahan deepfake"] },
    { id: "q29", text: "Ceritakan singkat pengalaman Anda, baik yang membantu maupun yang merugikan, saat menggunakan AI di Papua.",
      type: "textarea", required: false, hint: "Opsional." },
  ]},
];
