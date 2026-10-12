# Pemeriksaan UI HQF 2026

## Pemeriksaan otomatis

- `npm run typecheck`: TypeScript aplikasi dan konfigurasi.
- `npm run lint`: ESLint, React Hooks, dan Fast Refresh.
- `npm test`: 26 tes untuk kalender WITA, penutupan 23.59 WITA, status timeline, bootstrap splash setiap reload, urutan entrance/exit, reduced motion, storage diblokir, timeout, state scroll reveal, cleanup StrictMode, fallback API, fokus keyboard, ketentuan pedoman, anchor navigasi, ID unik, relasi accordion ARIA, dimensi/alt logo, tema resmi, copy informatif, dan tautan resmi.
- `npm run build`: output statis dengan aset relatif untuk GitHub Pages.
- Pemeriksaan HTTP lokal terhadap dokumen dan aset output produksi.

Bootstrap splash diuji dengan timer dan storage simulasi terhadap script asli di `index.html`. Markup React dirender untuk memeriksa relasi navigasi/accordion. Pemeriksaan tersebut tidak menjalankan layout CSS, animasi visual, maupun interaksi browser.

## Pengujian browser dan screenshot

Browser terintegrasi tidak terhubung. Setelah pengguna mengizinkan pengunduhan, Playwright dan Chromium dipasang dalam direktori sementara yang terisolasi. Tidak ada dependency produksi ataupun perubahan package-lock.

Skrip `scripts/visual-qa.mjs` dijalankan terhadap build produksi pada `http://localhost:4173/`. Hasil Chromium:

- Lebar 320, 360, 375, 390, 430, 768, 1024, 1280, dan 1440 px: `document.scrollWidth` sama dengan lebar viewport; tidak ada horizontal overflow halaman, gambar gagal, atau konten non-kartu tertinggal tersembunyi setelah scroll.
- Nama event terlihat di viewport pertama pada seluruh ukuran tersebut.
- Splash tampil pada kunjungan awal dan refresh tab yang sama; logo masuk sebelum fade-out; overlay dihapus. Reduced motion melewati splash, termasuk setelah refresh.
- Kartu masuk saat section mendekati viewport; rail mobile maju/mundur melalui tombol panah. Bug kartu menyusut pada iterasi pertama ditemukan melalui browser dan diperbaiki.
- Emulasi layar sentuh berhasil menggeser deretan lomba melalui swipe; fallback tanpa JavaScript menampilkan informasi resmi dan tautan pendaftaran tanpa splash yang menghalangi.
- Hamburger membuka menu, Escape mengembalikan fokus, navigasi menutup menu dan mengembalikan scroll. Perpindahan section tidak mengulang splash.
- Semua 14 FAQ diuji buka/tutup; state ARIA dan tinggi panel sesuai. Enter/Space dapat membuka/menutup FAQ.
- Semua tujuan eksternal resmi dipertahankan dengan target tab baru dan noopener; tombol daftar membuka tab baru tanpa mengirim formulir.
- Tidak ada console error, failed asset response, atau failed request pada run yang berhasil.
- Screenshot hero setiap breakpoint, splash, menu, kompetisi, footer, reduced motion, serta halaman penuh 390/1440 px dihasilkan dan diperiksa. Artefak dan laporan JSON tersimpan di direktori `results` pada instalasi QA sementara.

Ini merupakan pengujian Chromium, bukan pengujian perangkat fisik iPhone/Android atau Safari/WebKit. Core Web Vitals produksi belum diukur.

Untuk mengulang tanpa menambah dependency aplikasi:

```powershell
$hqfQa = Join-Path $env:TEMP ('hqf-playwright-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $hqfQa | Out-Null
npm.cmd install --prefix $hqfQa --no-save --no-package-lock playwright
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $hqfQa 'browsers'
node (Join-Path $hqfQa 'node_modules/playwright/cli.js') install chromium
# Pada terminal lain: npm run build; npm run preview
node scripts/visual-qa.mjs $hqfQa
```

## Pemeriksaan manual tambahan

Jalankan `npm run dev` dan buka URL lokal yang dicetak Vite. Periksa:

1. Nama event dan tema terbaca; seluruh logo proporsional tanpa cropping; tidak ada horizontal overflow.
2. Intro menampilkan logo secara penuh sebelum fade-out; setiap refresh pada tab yang sama mengulangnya. Perpindahan section tidak mengulang intro.
3. Preferensi reduced motion menampilkan konten langsung. Simulasikan koneksi lambat/error aplikasi untuk memastikan watchdog dan informasi fallback tetap bekerja.
4. Menu seluler: buka/tutup, Escape, Tab/Shift+Tab, klik backdrop, pindah section, dan resize ke desktop.
5. FAQ: buka semua pertanyaan secara bergantian, tutup kembali, dan gunakan Enter/Space dari keyboard.
6. Tombol pendaftaran/pedoman, WhatsApp, dan Instagram membuka tujuan resmi; navigasi anchor tidak mengulang intro.
7. Status WITA pada hari terakhir dan setelah 7 November 2026 pukul 23.59 WITA tidak menampilkan angka 00 seolah deadline belum lewat.
8. Console tidak memiliki error; permintaan logo, CSS, JS, dan font berhasil. Nilai CWV perlu diukur pada deployment nyata.

## Integritas deployment

Workflow `.github/workflows/deploy.yml`, `vite.config.ts` dengan `base: "./"`, dan logo sumber asli tetap dipertahankan. Copy telah dirapikan; tema, tanggal, biaya, narahubung, dan tautan resmi tidak berubah. Jam penutupan mengikuti konfirmasi pengguna; persyaratan dan FAQ mengikuti pedoman. Custom domain tetap dikelola melalui pengaturan GitHub Pages yang sudah ada.

## Rujukan konten

Dokumen pengguna: `Pedoman_HQF_2026_Paling Terbaru.pdf`. Bagian 2.3 (halaman PDF 9) menjadi rujukan ketentuan identitas, satu cabang, regu, grup peserta, dan Instagram. Halaman PDF 10 memuat e-sertifikat. Ketentuan MTQ, MHQ, dan MSQ dirangkum dari halaman PDF 14–18. Maqra dan seluruh tema MSQ tetap tersedia melalui tombol pedoman, tanpa membuat section panjang baru.

Formulir dalam PDF berbeda dengan tautan yang ditetapkan pengguna. Konfirmasi pengguna: tetap gunakan `https://forms.gle/FnJdV3HPni5MUwqJA`. Tahapan MHQ di beberapa paragraf pedoman tidak konsisten; website tidak menambahkan jadwal semifinal atau mengubah lima tahapan resmi.
