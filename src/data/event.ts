export const event = {
  name: "Hasanuddin Qur'an Fest",
  year: 2026,
  organizer: "UKM Pengembangan Seni Al-Qur'an Universitas Hasanuddin",
  theme:
    "Membumikan Nilai Qur'ani, Menumbuhkan Jiwa Intelektual, Membangun Peradaban Mulia",
  audience: "Siswa dan mahasiswa seluruh Indonesia, usia 16–22 tahun",
  registration: {
    start: "2026-10-11",
    end: "2026-11-07",
    label: "11 Oktober–7 November 2026",
    shortLabel: "11 Okt–7 Nov 2026",
    endLabel: "7 November 2026",
    closingTime: "23.59 WITA",
    deadline: "2026-11-07T23:59:00+08:00",
    timezone: "Asia/Makassar",
  },
  fees: { individual: 35000, team: 60000 },
  links: {
    registration: "https://forms.gle/FnJdV3HPni5MUwqJA",
    guide:
      "https://drive.google.com/file/d/1P7u-2Wwhr4NrrHgCJooaUvcAxYdNnEHI/view?usp=drivesdk",
  },
  social: [
    {
      handle: "@hasanuddinquranfest",
      url: "https://www.instagram.com/hasanuddinquranfest/",
    },
    {
      handle: "@ukm_psq_unhas",
      url: "https://www.instagram.com/ukm_psq_unhas/",
    },
  ],
  contacts: [
    {
      name: "Muh. Abista Nugraha Risyada",
      phone: "082348353632",
      whatsapp: "https://wa.me/6282348353632",
    },
    {
      name: "Nursafitri",
      phone: "085933498442",
      whatsapp: "https://wa.me/6285933498442",
    },
  ],
} as const;

export const competitions = [
  {
    code: "MTQ",
    title: "Musabaqah Tilawatil Qur'an",
    description:
      "Video penyisihan membaca Surah Al-A'raf ayat 31–33 dengan tiga lagu. Wajah peserta harus terlihat.",
    category: "Individu",
    detail: "Qiraat Imam Ashim, riwayat Hafsh",
    icon: "mic",
  },
  {
    code: "MHQ",
    title: "Musabaqah Hifzhil Qur'an",
    description:
      "Video hafalan berdurasi 4–5 menit, di luar perkenalan. Rekaman tanpa potongan, dengan penutup mata saat membaca.",
    category: "Individu",
    detail: "Pilihan juz 1–10 atau 21–30",
    icon: "book",
  },
  {
    code: "MSQ",
    title: "Musabaqah Syarhil Qur'an",
    description:
      "Video penyisihan berformat landscape, maksimal 15 menit. Regu terdiri dari qari, pembaca terjemah, dan pensyarah.",
    category: "Beregu · 3 orang",
    detail: "3 orang per regu",
    icon: "users",
  },
] as const;
// Pedoman HQF 2026, bagian 2.3. Tautan formulir mengikuti konfirmasi panitia.
export const requirements = [
  "Siswa atau mahasiswa berusia 16–22 tahun",
  "Melampirkan kartu pelajar, KTM, atau KTP sebagai bukti identitas",
  "Setiap peserta hanya mengikuti satu cabang lomba",
  "Regu MSQ terdiri dari 3 orang dari institusi yang sama, seluruhnya putra atau seluruhnya putri",
  "Bergabung dalam grup peserta yang disediakan panitia setelah mendaftar",
  "Mengikuti Instagram @hasanuddinquranfest dan @ukm_psq_unhas",
] as const;
export const timeline = [
  {
    date: "11 Okt–7 Nov",
    title: "Pendaftaran & video",
    start: "2026-10-11",
    end: "2026-11-07",
  },
  {
    date: "8–10 Nov",
    title: "Penilaian",
    start: "2026-11-08",
    end: "2026-11-10",
  },
  {
    date: "11 Nov",
    title: "Pengumuman finalis",
    start: "2026-11-11",
    end: "2026-11-11",
  },
  {
    date: "12 Nov",
    title: "Technical Meeting",
    start: "2026-11-12",
    end: "2026-11-12",
  },
  {
    date: "15 Nov",
    title: "Final online",
    start: "2026-11-15",
    end: "2026-11-15",
  },
] as const;
export const faqs = [
  {
    question: "Siapa yang dapat mengikuti HQF 2026?",
    answer: `HQF 2026 terbuka untuk ${event.audience.toLowerCase()}. Peserta melampirkan kartu pelajar, KTM, atau KTP sebagai bukti identitas.`,
  },
  {
    question: "Apa saja cabang lomba yang tersedia?",
    answer:
      "Terdapat tiga cabang: MTQ, MHQ 10 Juz dengan pilihan juz 1–10 atau 21–30, serta MSQ yang diikuti oleh tim beranggotakan 3 orang.",
  },
  {
    question: "Bolehkah mengikuti lebih dari satu cabang?",
    answer:
      "Tidak. Setiap peserta hanya diperbolehkan mengikuti satu cabang lomba.",
  },
  {
    question: "Apa ketentuan anggota regu MSQ?",
    answer:
      "Satu regu terdiri dari 3 orang dari institusi yang sama, seluruhnya putra atau seluruhnya putri. Perannya adalah qari, pembaca terjemah atau sari tilawah, dan pensyarah.",
  },
  {
    question: "Berapa biaya pendaftarannya?",
    answer:
      "Biaya pendaftaran individu adalah Rp35.000 dan biaya pendaftaran tim adalah Rp60.000. Ikuti informasi pembayaran pada formulir pendaftaran dan pedoman.",
  },
  {
    question: "Kapan batas pendaftaran dan pengumpulan video?",
    answer: `Pendaftaran dan pengumpulan video berlangsung pada ${event.registration.label}. Batas pengumpulan adalah ${event.registration.endLabel}, pukul ${event.registration.closingTime}.`,
  },
  {
    question: "Apa ketentuan video penyisihan MTQ?",
    answer:
      "Peserta membaca Surah Al-A'raf ayat 31–33 dengan tiga lagu dan wajah terlihat jelas. Tilawah menggunakan qiraat Imam Ashim riwayat Hafsh. Ketentuan penampilan final tersedia dalam pedoman.",
  },
  {
    question: "Bagaimana ketentuan video MHQ 10 Juz?",
    answer:
      "Pilih satu maqra penyisihan dalam pedoman sesuai rentang juz yang didaftarkan. Durasi hafalan 4–5 menit, tidak termasuk perkenalan. Video direkam sekali tanpa potongan, penggantian audio, atau musik latar. Saat membaca, peserta menggunakan penutup mata tanpa mushaf, teks, atau bantuan orang lain. Wajah terlihat dan suara terdengar jelas; tautan video harus dapat diakses hingga penilaian selesai.",
  },
  {
    question: "Apakah pilihan juz MHQ dapat diubah?",
    answer:
      "Pilihan juz 1–10 atau 21–30 ditentukan saat pendaftaran dan digunakan pada penyisihan maupun final. Pilihan tidak dapat diubah setelah batas pendaftaran.",
  },
  {
    question: "Apa ketentuan video penyisihan MSQ?",
    answer:
      "Video berformat landscape dengan durasi maksimal 15 menit. Regu memilih salah satu dari enam tema MSQ yang tercantum dalam pedoman resmi.",
  },
  {
    question: "Apakah babak final dilaksanakan secara online?",
    answer:
      "Ya, babak final dilaksanakan secara online pada 15 November 2026, dengan Technical Meeting pada 12 November 2026.",
  },
  {
    question: "Apa yang perlu dilakukan setelah mendaftar?",
    answer:
      "Bergabunglah dalam grup peserta yang disediakan panitia dan ikuti Instagram @hasanuddinquranfest serta @ukm_psq_unhas. Informasi teknis disampaikan melalui grup peserta. Pastikan video dikumpulkan dalam periode yang ditentukan.",
  },
  {
    question: "Apakah peserta mendapatkan sertifikat?",
    answer: "Ya, seluruh peserta dan pemenang mendapatkan e-sertifikat.",
  },
  {
    question: "Bagaimana cara mendaftar dan mendapatkan pedoman?",
    answer:
      "Klik tombol “Daftar sekarang” untuk membuka formulir resmi. Pedoman dapat diakses melalui tombol “Baca pedoman”. Hubungi panitia jika membutuhkan bantuan.",
  },
] as const;
export const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
export function witaDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: event.registration.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function calendarDaysToRegistrationEnd(now = new Date()) {
  return Math.round(
    (Date.parse(event.registration.end) - Date.parse(witaDate(now))) / 86400000,
  );
}
