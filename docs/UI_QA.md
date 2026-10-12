# Pemeriksaan UI HQF 2026

## Pemeriksaan otomatis

- `npm run typecheck`: TypeScript aplikasi dan konfigurasi.
- `npm run lint`: ESLint, React Hooks, dan Fast Refresh.
- `npm test`: 11 tes untuk kalender WITA, status pendaftaran/timeline, bootstrap splash, reload per sesi, reduced motion, storage diblokir, timeout, anchor navigasi, ID unik, relasi accordion ARIA, dimensi/alt logo, dan tautan resmi.
- `npm run build`: output statis dengan aset relatif untuk GitHub Pages.
- Pemeriksaan HTTP lokal terhadap dokumen dan aset output produksi.

Bootstrap splash diuji dengan timer dan storage simulasi terhadap script asli di `index.html`. Markup React dirender untuk memeriksa relasi navigasi/accordion. Pemeriksaan tersebut tidak menjalankan layout CSS, animasi visual, maupun interaksi browser.

## Keterbatasan visual QA

Browser automation tidak terhubung dalam sesi implementasi ini. Belum ada screenshot atau pengukuran overflow/CWV di browser. Viewport sasaran untuk verifikasi manual: 320, 360, 375, 390, 430, 768, 1024, 1280, dan 1440 px.

Jalankan `npm run dev` dan buka URL lokal yang dicetak Vite. Periksa:

1. Nama event dan tema terbaca; seluruh logo proporsional tanpa cropping; tidak ada horizontal overflow.
2. Intro pertama muncul, lalu overlay hilang; reload pada tab yang sama tidak mengulangnya. Gunakan tab/sesi baru atau hapus hanya key `hqf-intro-2026` untuk mengulang pengujian.
3. Preferensi reduced motion menampilkan konten langsung. Simulasikan koneksi lambat/error aplikasi untuk memastikan watchdog dan informasi fallback tetap bekerja.
4. Menu seluler: buka/tutup, Escape, Tab/Shift+Tab, klik backdrop, pindah section, dan resize ke desktop.
5. FAQ: buka semua pertanyaan secara bergantian, tutup kembali, dan gunakan Enter/Space dari keyboard.
6. Tombol pendaftaran/pedoman, WhatsApp, dan Instagram membuka tujuan resmi; navigasi anchor tidak mengulang intro.
7. Status WITA pada hari terakhir dan setelah periode berakhir tidak menampilkan angka 00 seolah deadline belum lewat.
8. Console tidak memiliki error; permintaan logo, CSS, JS, dan font berhasil. Nilai CWV perlu diukur pada deployment nyata.

## Integritas deployment

Workflow `.github/workflows/deploy.yml`, `vite.config.ts` dengan `base: "./"`, data resmi `src/data/event.ts`, dan logo sumber asli tidak diubah oleh polishing. Custom domain tetap dikelola melalui pengaturan GitHub Pages yang sudah ada.
