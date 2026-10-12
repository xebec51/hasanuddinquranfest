# Hasanuddin Qur'an Fest 2026

Landing page resmi HQF menggunakan React, Vite, TypeScript, Tailwind CSS melalui `@tailwindcss/vite`, dan Lucide React.

## Menjalankan secara lokal

Gunakan Node.js 22.12+ (atau Node.js 24 LTS) dan npm.

```sh
npm ci
npm run dev
```

Vite menampilkan URL lokal, biasanya http://localhost:5173.

```sh
npm run typecheck
npm run lint
npm run build
npm run preview
```

Preview build produksi biasanya http://localhost:4173.

## Konten dan aset

`src/data/event.ts` menyimpan informasi event, jadwal, biaya, kontak, persyaratan, FAQ, dan tautan resmi. Countdown menghitung selisih hari kalender WITA (Asia/Makassar) menuju 7 November 2026. Jam penutupan dikonfirmasi pemilik website: **7 November 2026, pukul 23.59 WITA**. Status berubah menjadi berakhir pada batas waktu tersebut, termasuk bila halaman tetap terbuka.

Logo resmi di root tetap dipertahankan. Salinan berukuran web di `src/assets` digunakan melalui `src/assets/logos.ts`; HQF menggunakan WebP sekitar 40 KB dan favicon PNG terpisah sekitar 11 KB. Regenerasi salinan pada Windows: `powershell -File scripts/optimize-logos.ps1`. Sharp CLI hanya digunakan sementara untuk menghasilkan aset, bukan sebagai dependency aplikasi/build. Tidak ada backend, database, authentication, atau sponsor tambahan.

Footer memakai versi transparan PSQ dan HQF, tanpa kotak putih. Logo Unhas sudah transparan. Ukuran PSQ di footer 76 × 76 px agar seimbang; navbar dan splash juga memakai HQF transparan. Logo penyelenggara di atas headline hero dihapus sesuai arahan; seluruh logo tetap tersedia di footer. Catatan aset turunan dan prompt: `docs/FOOTER_ASSETS.md`.

Persyaratan dan 14 FAQ dirangkum dari `Pedoman_HQF_2026_Paling Terbaru.pdf` yang diberikan pengguna. Tautan pendaftaran tetap `FnJdV3HPni5MUwqJA` sesuai konfirmasi pengguna, meskipun dokumen mencantumkan tautan lain. Tidak ada tambahan tahap semifinal, nominal hadiah, atau jam dari asumsi.

Verifikasi batas tanggal WITA dan tautan kontak: `npm test`.

## UI dan motion

- Hero menampilkan nama event dan tema resmi. Copy halaman menggunakan judul dan informasi kegiatan langsung, tanpa tagline tambahan atau slogan buatan.
- Layout mobile-first menggunakan breakpoint 360, 600, 768, 1024, dan 1280 px; container maksimal 1180 px. Teks utama 15–16 px dan tombol minimal 52 px.
- Intro branded muncul setiap halaman dibuka atau di-refresh, sesuai arahan terbaru pengguna, tanpa bergantung pada sessionStorage. Navigasi anchor antarseksi tidak mengulang intro. Setelah React dan logo siap, entrance selesai (maksimal 470 ms) sebelum fade-out 420 ms, tanpa jeda diam tambahan. Watchdog independen menghapus overlay setelah maksimal 1,9 detik jika pemuatan gagal. Intro dilewati saat reduced motion aktif.
- Font Google dimuat tanpa menghalangi konten awal. Logo, judul, dan informasi sederhana tetap tersedia ketika JavaScript gagal atau dinonaktifkan.
- Scroll reveal memakai IntersectionObserver berulang setiap elemen masuk viewport, termasuk setelah pengunjung mencapai footer lalu kembali ke atas. Fade-up, reveal heading, stagger kartu, dan garis timeline berdurasi 500–600 ms; stagger dibatasi 140 ms. State direset hanya setelah elemen keluar layar dengan buffer 32 px agar tidak berkedip. Tanpa API atau saat reduced motion, konten langsung terlihat. Elemen dengan fokus keyboard tidak disembunyikan; cleanup aman untuk React StrictMode.
- Cabang lomba tersusun horizontal: deretan scroll-snap dan tombol panah pada mobile/tablet, tiga kolom mulai 1024 px. Area geser terisolasi agar halaman tidak mengalami horizontal overflow.
- Countdown dan indikator timeline tetap menggunakan hari kalender WITA. Status penutupan menggunakan jam yang telah dikonfirmasi.

`npm test` memverifikasi batas tanggal/jam, bootstrap splash setiap reload, reduced motion, watchdog, state scroll reveal, markup navigasi, relasi ARIA, dan tautan resmi. Pengujian ini bukan pengganti visual QA di browser. Catatan pemeriksaan dan skrip Playwright terpisah: `docs/UI_QA.md`.

## GitHub Pages (hosting utama)

Website di-deploy otomatis melalui GitHub Actions setiap push ke `main`.

1. Di repository, buka **Settings → Pages → Build and deployment → Source: GitHub Actions** (aktifkan sekali saja).
2. Buka tab **Actions** untuk memantau workflow `Deploy HQF to GitHub Pages`. Bila diperlukan jalankan melalui tombol **Run workflow**.
3. Setelah deployment sukses, buka: https://xebec51.github.io/hasanuddinquranfest/

Workflow menjalankan `npm ci`, typecheck, lint, test, dan build dengan Node.js 24 lalu mengunggah folder `dist` ke GitHub Pages. `vite.config.ts` menggunakan `base: "./"` agar URL aset bekerja di alamat project GitHub Pages dan di domain mandiri.

### Menghubungkan domain .tech

- Di **Settings → Pages → Custom domain**, isi `hasanuddinquranfest.tech` dan simpan.
- Pada registrar domain .TECH, pasang empat record A untuk apex/root `@` menuju IPv4 GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, dan `185.199.111.153`. Hapus record A/AAAA yang berkonflik jika ada, jangan menghapus record MX email.
- Opsional: subdomain `www` berupa CNAME ke `xebec51.github.io` (tanpa nama repository), bila ingin memakai `www`.
- Tunggu verifikasi DNS, kemudian aktifkan **Enforce HTTPS** di GitHub Pages jika sudah tersedia.
- Jangan menambahkan file `CNAME` untuk workflow GitHub Actions ini; custom domain dikonfigurasi melalui pengaturan GitHub Pages.

## Cloudflare Pages (alternatif)

- Hubungkan repository GitHub `xebec51/hasanuddinquranfest`.
- Production branch: `main`.
- Root directory: root repository (kosong).
- Build command: `npm run build`.
- Build output directory: `dist`.
- Environment variable: `NODE_VERSION=24`.

Navigasi single-page menggunakan anchor sehingga tidak memerlukan konfigurasi router. File `public/_headers` disalin Vite ke output. Tetapkan domain produksi sebelum menambahkan URL canonical dan URL absolut gambar Open Graph.

## Workflow Git

Gunakan Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`), jalankan pemeriksaan relevan, lalu push ke `origin/main`. Identitas commit menggunakan akun pemilik repository tanpa co-author tambahan.
