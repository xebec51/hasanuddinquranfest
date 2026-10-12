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
    description: "Lomba tilawah Al-Qur'an untuk peserta individu.",
    category: "Individu",
    detail: "Seni membaca Al-Qur’an",
    icon: "mic",
  },
  {
    code: "MHQ",
    title: "Musabaqah Hifzhil Qur'an",
    description: "Lomba hafalan Al-Qur'an kategori 10 juz.",
    category: "Individu",
    detail: "Pilihan juz 1–10 atau 21–30",
    icon: "book",
  },
  {
    code: "MSQ",
    title: "Musabaqah Syarhil Qur'an",
    description:
      "Lomba syarhil Al-Qur'an yang diikuti regu beranggotakan 3 orang.",
    category: "Beregu · 3 orang",
    detail: "3 orang per regu",
    icon: "users",
  },
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
    answer: `HQF 2026 terbuka untuk ${event.audience.toLowerCase()}. Persyaratan lengkap tersedia pada pedoman lomba.`,
  },
  {
    question: "Apa saja cabang lomba yang tersedia?",
    answer:
      "Terdapat tiga cabang: MTQ, MHQ 10 Juz dengan pilihan juz 1–10 atau 21–30, serta MSQ yang diikuti oleh tim beranggotakan 3 orang.",
  },
  {
    question: "Berapa biaya pendaftarannya?",
    answer:
      "Biaya pendaftaran individu adalah Rp35.000 dan biaya pendaftaran tim adalah Rp60.000. Ikuti informasi pembayaran pada formulir pendaftaran dan pedoman.",
  },
  {
    question: "Kapan batas pendaftaran dan pengumpulan video?",
    answer: `Pendaftaran dan pengumpulan video berlangsung pada ${event.registration.label}. Untuk jam penutupan, konfirmasikan kepada panitia.`,
  },
  {
    question: "Apakah babak final dilaksanakan secara online?",
    answer:
      "Ya, babak final dilaksanakan secara online pada 15 November 2026, dengan Technical Meeting pada 12 November 2026.",
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
