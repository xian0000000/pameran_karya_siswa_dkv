export const EXHIBITS = [

  // ══════════════════════════════════════════════════════════════
  //  LUKISAN (type: "painting")
  // ══════════════════════════════════════════════════════════════

  // ── [0-2] Dinding Utara ────────────────────────────────────
  {
    type:   "painting",
    style:  "arduino",
    title:  "Mobil Radar Pendeteksi Suhu",
    artist: "Xina",
    year:   "2026",
    desc:   "Proyek Arduino: mobil pintar berbasis sensor ultrasonik & suhu DHT. Deteksi objek + monitoring suhu real-time via Tinkercad.",
    colors: ["#0a1a0a", "#003300", "#00aa44", "#00ff88"],
  },
  {
    type:   "painting",
    style:  "cuaca",
    title:  "Perkiraan Cuaca Bekasi",
    artist: "Xina",
    year:   "2026",
    desc:   "Aplikasi cuaca real-time untuk Kota Bekasi — tampilkan suhu, kelembaban, dan prakiraan harian.",
    colors: ["#0a1628", "#1a3a6b", "#38bdf8", "#7dd3fc"],
  },
  {
    type:   "painting",
    style:  "detektif",
    title:  "Detektif Produktivitas",
    artist: "Xina",
    year:   "2026",
    desc:   "Lacak dan analisis produktivitasmu layaknya seorang detektif — temukan kebiasaan tersembunyi, pecahkan kasus prokrastinasi.",
    colors: ["#0d0d0d", "#1a1a2e", "#c8a050", "#f0d080"],
  },

  // ── [3-4] Dinding Timur ────────────────────────────────────
  {
    type:   "painting",
    style:  "chatocean",
    title:  "Chat Ocean",
    artist: "Xina",
    year:   "2026",
    desc:   "Platform obrolan inovatif berbasis web.",
    colors: ["#007bff", "#0056b3", "#003366", "#001133"],
  },
  {
    type:   "painting",
    style:  "library",
    title:  "Perpustakaan Kuno",
    artist: "Xina",
    year:   "2026",
    desc:   "Koleksi buku, artikel, dan referensi digital.",
    colors: ["#0a1628", "#1a3a6b", "#2d6abf", "#7eb8f7"],
  },

  // ── [5-6] Dinding Barat ────────────────────────────────────
  {
    type:   "painting",
    style:  "lifedashboard",
    title:  "Life Dashboard",
    artist: "Xina",
    year:   "2026",
    desc:   "Dashboard kehidupan interaktif — pantau kebiasaan, target, dan progres harianmu.",
    colors: ["#0a0f1e", "#0d2137", "#7c3aed", "#a855f7"],
  },
  {
    type:   "painting",
    style:  "statistic",
    title:  "StatLab",
    artist: "Xina",
    year:   "2026",
    desc:   "Platform analisis statistik interaktif — riset, lab, dan keuangan.",
    colors: ["#0a1628", "#0d2137", "#00e5c8", "#00aaf5"],
  },

  // ══════════════════════════════════════════════════════════════
  //  PATUNG (type: "sculpture") — hanya Music
  // ══════════════════════════════════════════════════════════════

  {
    type:   "sculpture",
    style:  "music",
    title:  "Music",
    artist: "Xina",
    year:   "2026",
    desc:   "Putar musik museum dan nikmati visualizer audio 3D yang mengelilingi patung.",
    icon:   "\u266a",
    bg:     "#0e0a04",
    accent: "#c8a050",
    videoId: "5uDY6hEYfPc",
    url:    "https://youtu.be/5uDY6hEYfPc",
  },


// ── Galeri Foto ────────────────────────────────────────────
// idx 7  — Utara kiri (-8)
  { type:"painting", style:"gallery", title:"Clearnov Soap – Shafira", artist:"Shafira", year:"2026",
    desc:"Aspek Penilaian: Komunikasi Edukatif & Gaya 2D. Karya yang sangat komunikatif dan interaktif. Penggunaan ilustrasi kartun 2D yang ceria berhasil mengubah kemasan produk menjadi media edukasi kesehatan yang menarik dan mudah dipahami oleh semua kalangan.", colors:["#111111","#222222","#888888","#aaaaaa"], png:"assets/shafira.jpeg" },

// idx 8  — Utara kiri-tengah (-4) — TOP 3: Malika
  { type:"painting", style:"gallery", title:"Dawne – Malika", artist:"Malika", year:"2026", top3:true, rank:2,
    desc:"Estetika & Karakter Ilustrasi. Karya ini memiliki nilai seni dan kepekaan estetika yang paling tinggi. Malika berani keluar dari template desain kaku dengan ilustrasi bergaya hand-drawn yang organik dan puitis. Pemilihan warna, coretan dedaunan yang estetik, serta presentasi produk dalam bentuk poster digital berhasil membangun brand image yang sangat kuat, premium, dan ramah lingkungan. Malika menang di estetika seni & keunikan ilustrasi.", colors:["#111111","#222222","#888888","#aaaaaa"], png:"assets/malika.jpeg" },

// idx 9  — Utara tengah (0) — TOP 3: Azra ★ #1
  { type:"painting", style:"gallery", title:"Terapure – Azra", artist:"Azra", year:"2026", top3:true, rank:1,
    desc:"Kelengkapan Informasi & Kematangan Konsep. Ini adalah karya dengan paket paling lengkap dan profesional. Desain jaring kemasannya tidak hanya memikirkan estetika warna (earth tone yang sangat tren), tetapi juga sangat fungsional. Azra sukses menyusun hierarki informasi yang rumit—mulai dari slogan, tujuan produk (isu lingkungan minyak jelantah), komposisi, cara pakai, hingga QR Code dan tanggal kedaluwarsa—secara rapi dan seimbang tanpa terlihat penuh sesak.", colors:["#111111","#222222","#888888","#aaaaaa"], png:"assets/azra.jpeg" },

// idx 10 — Utara kanan-tengah (+4) — TOP 3: Khanza
  { type:"painting", style:"gallery", title:"LOTUSOAP – Khanza", artist:"Khanza", year:"2026", top3:true, rank:3,
    desc:"Komposisi & Eksekusi Layout. Desain ini memiliki kesan komersial yang sangat kuat dan siap cetak. Kombinasi warna biru tua dengan aksen kurva emas/kuning memberikan kesan yang bersih, elegan, dan tepercaya—sangat cocok untuk produk higienitas. Khanza sangat detail dalam merancang teks panduan penggunaan di bagian samping kemasan dengan tata letak yang rapi dan mudah dibaca. Khanza menang di eksekusi layout & kesan komersial yang elegan.", colors:["#111111","#222222","#888888","#aaaaaa"], png:"assets/khanza.jpeg" },

// idx 11 — Utara kanan (+8)
  { type:"painting", style:"gallery", title:"Bubbli Soap – Alsha", artist:"Alsha", year:"2026",
    desc:"Aspek Penilaian: Harmoni Visual. Karya ini menunjukkan kekuatan pada pemilihan palet warna biru pastel yang konsisten dan menenangkan. Desain jaring-jaring kemasan rapi dengan penempatan tipografi yang proporsional, berhasil menyampaikan kesan produk yang lembut dan higienis.", colors:["#111111","#222222","#888888","#aaaaaa"], png:"assets/alsha.jpeg" },

// idx 12–15 — Dinding Timur
  { type:"painting", style:"gallery", title:"CLARE SOAP – Sean", artist:"Sean", year:"2026",
    desc:"Aspek Penilaian: Kreativitas Pola & Estetika Pastel. Keunggulan karya ini ada pada penggunaan pola gelombang organik berwarna jingga pastel yang estetik. Komposisi gambar sabun bertekstur busa di tiap sisi kemasan memberikan kesan visual yang menyatu dan manis.", colors:["#111111","#222222","#888888","#aaaaaa"], png:"assets/sean.jpeg" },
  { type:"painting", style:"gallery", title:"Desain Sabun Yasmin", artist:"Yasmin", year:"2026",
    desc:"Uprak desain sabun karya Yasmin — kreasi unik dengan konsep segar dan estetika modern.", colors:["#111111","#222222","#888888","#aaaaaa"], png:"assets/yasmin.jpeg" },
  { type:"painting", style:"gallery", title:"Pure Lush – Meyda", artist:"Meyda", year:"2026",
    desc:"Aspek Penilaian: Presentasi Produk & Detail Grafis. Penilaian menonjol pada kemampuan menyajikan visualisasi produk utama (sabun di atas tatakan kayu) yang terlihat nyata dan menarik. Ilustrasi floral di sudut kemasan memberikan sentuhan dekoratif yang seimbang.", colors:["#111111","#222222","#888888","#aaaaaa"], png:"assets/meyda.jpeg" },
  { type:"painting", style:"gallery", title:"CYCLEA – Prya", artist:"Prya", year:"2026",
    desc:"Aspek Penilaian: Tipografi & Gaya Urban. Desain ini berani tampil beda dengan menonjolkan tipografi hijau tebal yang kuat dan modern. Pendekatan minimalis pada latar belakang krem berhasil membuat nama merek menjadi pusat perhatian utama.", colors:["#111111","#222222","#888888","#aaaaaa"], png:"assets/prya.jpeg" },

// idx 16–19 — Dinding Barat
  { type:"painting", style:"gallery", title:"LoFresh – Samuel", artist:"Samuel", year:"2026",
    desc:"Aspek Penilaian: Konseptual & Desain Logo. Karya ini menunjukkan kemampuan yang matang dalam merancang identitas visual (branding). Logo bunga teratai monokrom yang bersih dikombinasikan dengan font Serif menghasilkan kesan merek yang tepercaya dan profesional.", colors:["#111111","#222222","#888888","#aaaaaa"], png:"assets/samuel.jpeg" },
  { type:"painting", style:"gallery", title:"Desain Sabun Susan", artist:"Susan", year:"2026",
    desc:"Uprak desain sabun karya Susan — kreasi unik dengan konsep segar dan estetika modern.", colors:["#111111","#222222","#888888","#aaaaaa"], png:"assets/susan.jpeg" },
  { type:"painting", style:"gallery", title:"Fabulo – Filo", artist:"Filo", year:"2026",
    desc:"Aspek Penilaian: Kekuatan Ilustrasi & Identitas. Desain berhasil menarik perhatian lewat kontras warna cyan yang segar. Penggunaan ilustrasi tangan yang memegang sabun memberikan fokus visual yang kuat, didukung oleh penempatan logo sertifikasi yang memperkuat validitas produk.", colors:["#111111","#222222","#888888","#aaaaaa"], png:"assets/filo.jpeg" },
  { type:"painting", style:"gallery", title:"Desain Sabun Vina", artist:"Vina", year:"2026",
    desc:"Uprak desain sabun karya Vina — kreasi unik dengan konsep segar dan estetika modern.", colors:["#111111","#222222","#888888","#aaaaaa"], png:"assets/vina.jpeg" },
];
