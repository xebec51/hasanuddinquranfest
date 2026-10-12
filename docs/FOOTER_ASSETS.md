# Aset footer transparan

File sumber resmi di root tidak ditimpa. `src/assets/unhas.png` tetap memakai alpha asli. Hanya footer menggunakan dua versi turunan berikut:

- `src/assets/psq-footer-transparent.webp`: 360 px, sekitar 38 KB.
- `src/assets/hqf-footer-transparent.webp`: 240 px, sekitar 21 KB.

Penghilangan latar menggunakan tool bawaan imagegen, bukan CLI/API dengan kredensial. Hasil diperiksa sebagai gambar, lalu diperkecil ke WebP memakai Sharp CLI sementara. File hasil ini merupakan turunan visual untuk footer, bukan pengganti file master resmi. Hero, navbar, favicon, dan splash tetap memakai aset sebelumnya.

Footer memakai latar hijau muda agar teks hitam pada logo PSQ tetap terbaca tanpa panel putih; backing terang di dalam lambang HQF dipertahankan sebagai bagian logo.

## Prompt PSQ

Use case: background-extraction. Input image 1 is the edit target, the official UKM Pengembangan Seni Al-Qur’an Universitas Hasanuddin logo. Remove ONLY the external flat gray canvas and gray empty gaps outside the logo to genuine alpha transparency. Keep the original red and green mosque arch, patterned book, intricate gold geometric fill inside the arch, the miniature Unhas emblem, all shapes, colors, proportions, and exact original black wordmark unchanged. Exact lettering remains: Pengembangan Seni Al-Qur’an / UNIVERSITAS HASANUDDIN. Do not redesign, redraw, recolor, invent, omit text, add shadows or a white panel. Keep full logo and both text lines visible, tightly framed with a small safe transparent margin. This is background removal, NOT new logo creation.

## Prompt HQF

Use case: background-extraction. Input image 1 is the edit target, the existing official HQF emblem. Remove ONLY the surrounding gold/olive gradient canvas to true alpha transparency. Preserve the complete exact existing emblem: red outer pointed arch, green inner arch, elegant green HQF calligraphy, gold accents, gold open book, and the white/light central backing that is part of the emblem. Keep the white inner backing inside the emblem so green letters remain readable. Preserve original curves, lettering, proportions and colors without redesign or recreation. Do not add text, embellishments, rectangular background, or shadows. Full emblem with book must be visible and not cropped, centered and tightly framed with a small safe transparent margin.
