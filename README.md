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

Logo resmi di root tetap dipertahankan. Salinan PNG berukuran web di `src/assets` digunakan melalui `src/assets/logos.ts`. Regenerasi salinan pada Windows: `powershell -File scripts/optimize-logos.ps1`. Tidak ada backend, database, authentication, atau sponsor tambahan.

Verifikasi batas tanggal WITA dan tautan kontak: `npm test`.

## Cloudflare Pages

- Hubungkan repository GitHub `xebec51/hasanuddinquranfest`.
- Production branch: `main`.
- Root directory: root repository (kosong).
- Build command: `npm run build`.
- Build output directory: `dist`.
- Environment variable: `NODE_VERSION=24`.

Navigasi single-page menggunakan anchor sehingga tidak memerlukan konfigurasi router. File `public/_headers` disalin Vite ke output. Tetapkan domain produksi sebelum menambahkan URL canonical dan URL absolut gambar Open Graph.

## Workflow Git

Gunakan Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`), jalankan pemeriksaan relevan, lalu push ke `origin/main`. Identitas commit menggunakan akun pemilik repository tanpa co-author tambahan.
