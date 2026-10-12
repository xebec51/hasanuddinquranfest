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

`src/data/event.ts` menyimpan informasi event, jadwal, biaya, kontak, FAQ, dan tautan resmi. Countdown menghitung selisih hari kalender WITA (Asia/Makassar) menuju 7 November 2026. Tidak ada jam penutupan yang diasumsikan; pada tanggal tersebut ditampilkan hari terakhir, dan setelahnya periode berakhir.

Logo resmi di root tetap dipertahankan. Salinan berukuran web di `src/assets` digunakan melalui `src/assets/logos.ts`; HQF menggunakan WebP sekitar 40 KB dan favicon PNG terpisah sekitar 11 KB. Regenerasi salinan pada Windows: `powershell -File scripts/optimize-logos.ps1`. Sharp CLI hanya digunakan sementara untuk menghasilkan aset, bukan sebagai dependency aplikasi/build. Tidak ada backend, database, authentication, atau sponsor tambahan.

Verifikasi batas tanggal WITA dan tautan kontak: `npm test`.

## UI dan motion

- Hero menampilkan nama event sebagai heading utama; tagline dan tema resmi tetap hadir.
- Layout mobile-first menggunakan breakpoint 360, 600, 768, 1024, dan 1280 px; container maksimal 1180 px. Teks utama 15–16 px dan tombol minimal 52 px.
- Intro branded muncul sekali per sesi melalui `sessionStorage` (`hqf-intro-2026`). Animasi keluar dimulai segera setelah React dan logo utama siap, tanpa durasi minimum. Watchdog independen menghapus overlay setelah maksimal 1,9 detik jika pemuatan gagal. Intro dilewati saat reduced motion aktif.
- Font Google dimuat tanpa menghalangi konten awal. Logo, judul, dan informasi sederhana tetap tersedia ketika JavaScript gagal atau dinonaktifkan.
- Scroll reveal satu kali, entrance hero bertahap, feedback hover/tap, menu dengan fokus keyboard dan Escape, serta accordion dengan ARIA state. Semua motion mengikuti `prefers-reduced-motion`.
- Countdown menampilkan status hari terakhir/pendaftaran berakhir; indikator timeline menggunakan hari kalender WITA, tanpa mengasumsikan jam penutupan.

`npm test` memverifikasi batas tanggal, bootstrap splash (kunjungan awal, reload, reduced motion, storage diblokir), watchdog, markup navigasi, relasi ARIA, dan tautan resmi. Pengujian ini bukan pengganti visual QA di browser. Catatan pemeriksaan: `docs/UI_QA.md`.

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
