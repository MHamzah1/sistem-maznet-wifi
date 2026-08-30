# Maznet Berkah Billing

Aplikasi billing ISP berbasis React 19, Vite 8, Tailwind CSS 4, Vercel Functions, dan Postgres opsional. Proyek sudah dikonfigurasi untuk build Vercel standar dengan output `dist`, SPA deep-link fallback, security headers, endpoint API, serta cron billing harian.

## Deploy cepat ke Vercel

1. Push folder ini ke repository GitHub, GitLab, atau Bitbucket.
2. Di Vercel pilih **Add New → Project**, lalu import repository tersebut.
3. Vercel akan membaca `vercel.json`; biarkan Build Command dan Output Directory mengikuti konfigurasi repository.
4. Klik **Deploy**.

Frontend demo dapat dibuka tanpa environment variable. Endpoint `/api/health` akan mengembalikan `mode: "demo"` ketika database belum dipasang.

## Mengaktifkan database dan automation

Gunakan database Postgres yang dapat diakses dari Vercel. Neon dari Vercel Marketplace adalah pilihan yang paling langsung. Setelah database ditautkan, pastikan environment variable `DATABASE_URL` tersedia untuk Production dan Preview.

Salin `.env.example` menjadi `.env.local` untuk penggunaan lokal, isi nilai yang diperlukan, lalu jalankan migrasi:

```powershell
npm install
npm run db:migrate:vercel
```

Tambahkan secret berikut melalui **Vercel → Project Settings → Environment Variables**:

- `DATABASE_URL` — connection string Postgres.
- `XENDIT_WEBHOOK_TOKEN` — callback token untuk verifikasi webhook Xendit.
- `XENDIT_SECRET_KEY` — menandai integrasi Xendit sebagai aktif; jangan diberi prefix `VITE_`.
- `CRON_SECRET` — secret acak minimal 16 karakter untuk Vercel Cron.
- `BILLING_API_SECRET` — secret terpisah untuk menjalankan billing manual.

Sesudah environment variable ditambahkan, lakukan redeploy. Cron menjalankan `/api/cron/billing` setiap hari pukul **17:15 UTC**, setara **00:15 WIB pada hari berikutnya**. Ubah ekspresi di `vercel.json` bila waktu tersebut bukan jadwal yang diinginkan.

## Endpoint

- `GET /api/health` — status aplikasi dan koneksi database.
- `GET /api/integrations` — status konfigurasi integrasi tanpa membocorkan secret.
- `GET|POST /api/items` — endpoint contoh persistence Postgres.
- `POST /api/xendit/webhook` — receiver webhook idempotent dengan header `x-callback-token`.
- `POST /api/billing/run` — billing manual dengan header `Authorization: Bearer <BILLING_API_SECRET>`.
- `GET /api/cron/billing` — target Vercel Cron dengan `CRON_SECRET`.

## Pengembangan dan verifikasi

```powershell
npm install
npm run dev
npm run check
npm run preview
```

`npm run check` menjalankan TypeScript typecheck dan build produksi. Gunakan `vercel dev` bila ingin menjalankan frontend dan folder `api/` dalam satu runtime lokal.

## Batasan penting

Antarmuka saat ini adalah **demo fungsional**, bukan sistem billing produksi. Login memilih role demo dan belum memvalidasi password di server. Data customer, invoice, pembayaran, paket, dan perubahan dari UI masih berada di React state sehingga kembali ke data awal setelah refresh. Database Vercel sudah tersedia untuk Functions dan cron, tetapi UI belum dihubungkan ke CRUD database.

Sebelum digunakan untuk data pelanggan atau transaksi nyata, implementasikan autentikasi server-side, RBAC per endpoint, session cookie aman, penyimpanan bukti bayar, sinkronisasi Xendit lengkap, audit transaksi atomik, serta pemindahan data demo dari bundle browser.

Konfigurasi Cloudflare lama (`worker/`, `wrangler.jsonc`, serta migrasi D1) dipertahankan sebagai referensi migrasi dan tidak diunggah oleh `.vercelignore`.
