# Mamuri Member Area (Fullstack)

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Framer Motion, React Router
- Backend: Express.js (MVC), JWT Auth, MySQL
- State: React Context
- API: RESTful

## Struktur Folder
- `frontend/` aplikasi React
- `backend/` API Express
- `backend/sql/schema.sql` skema database

## Setup Database (Otomatis)
Saat backend dijalankan, sistem akan otomatis:
- membuat database jika belum ada
- menjalankan schema tabel dari `backend/sql/schema.sql`
- membuat akun admin default jika email admin belum terdaftar

## Setup Environment
1. Backend:
   - Copy `backend/.env.example` menjadi `backend/.env`
   - Isi kredensial MySQL dan `JWT_SECRET`
   - Isi `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` untuk admin awal
2. Frontend:
   - Copy `frontend/.env.example` menjadi `frontend/.env`

## Menjalankan Project
1. Backend:
   - `cd backend`
   - `npm install`
   - `npm run dev`
2. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Login Admin Pertama
- Gunakan email/password dari `.env`:
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`

## Deploy ke Coolify (Docker)

Project ini sudah dilengkapi `Dockerfile` untuk backend & frontend, plus
`docker-compose.yml` di root yang men-jalankan **MySQL + Backend + Frontend (Nginx)**
sekaligus. Frontend (Nginx) bertindak sebagai entrypoint publik dan mem-proxy
`/api` + `/uploads` ke service backend di dalam Docker network, jadi cukup 1 domain
saja yang di-expose ke internet.

### 1. Persiapan repository
- Push project ini ke Git provider yang sudah terkoneksi ke Coolify
  (GitHub / GitLab / Gitea / dll).
- Pastikan file berikut ikut ter-commit:
  - `docker-compose.yml`
  - `backend/Dockerfile`, `backend/.dockerignore`
  - `frontend/Dockerfile`, `frontend/.dockerignore`, `frontend/nginx.conf`
  - `.env.example`
- File `.env` (berisi secret) **JANGAN** di-commit; isi langsung di Coolify.

### 2. Buat resource di Coolify
1. Di Coolify dashboard pilih **+ New Resource → Docker Compose Empty** (atau
   "Public Repository" / "Private Repository" sesuai sumber repo).
2. Pilih repository ini, branch yang di-deploy (mis. `main`), dan set
   **Docker Compose file** ke `docker-compose.yml`.
3. Di tab **Environment Variables**, isi semua variabel dari `.env.example`:
   - `MYSQL_ROOT_PASSWORD`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   - `JWT_SECRET` (acak, minimal 64 karakter), `JWT_EXPIRES_IN`
   - `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (akun admin pertama)
   - `VITE_API_URL=/api` (default, sudah cukup untuk setup 1 domain)
   - `CORS_ORIGINS` (opsional; hanya jika ada domain lain panggil API)
4. Di tab **Domains**, set domain (mis. `member.mamuri.id`) pada **service
   `frontend`** saja. Coolify otomatis memasang label Traefik + sertifikat
   Let's Encrypt.
5. Klik **Deploy**. Build pertama butuh beberapa menit (npm install + build Vite).

### 3. Volume persisten (otomatis)
Compose sudah mendefinisikan named volume:
- `mysql_data` → data MySQL (jangan dihapus saat redeploy)
- `backend_uploads` → file upload `/uploads`

Coolify akan mempertahankan keduanya di antara deployment.

### 4. Update / redeploy
Setiap kali ada perubahan kode, tinggal push ke branch yang dipilih lalu klik
**Redeploy** di Coolify (atau aktifkan auto-deploy via webhook).

### 5. Test lokal sebelum deploy (opsional)
```bash
cp .env.example .env   # lalu isi nilainya
docker compose up -d --build
# buka http://localhost  -> SPA
# health check API     -> http://localhost/api/health
```

### Catatan domain terpisah backend & frontend
Jika ingin backend di domain berbeda (mis. `api.mamuri.id`):
1. Tambah block `expose: 5000` tetap, lalu pasang domain `api.mamuri.id` di
   service `backend` lewat Coolify.
2. Hapus / komentari block `location /api/` dan `/uploads/` pada
   `frontend/nginx.conf`.
3. Set `VITE_API_URL=https://api.mamuri.id/api` dan `VITE_PUBLIC_ORIGIN=https://api.mamuri.id`.
4. Tambah origin frontend ke env `CORS_ORIGINS` backend.

## API Endpoint Utama
- `POST /api/auth/login`
- `POST /api/users` (admin, create user)
- `GET /api/users` (admin)
- `PUT /api/users/:id` (admin)
- `DELETE /api/users/:id` (admin)
- `GET /api/courses` (public)
- `GET /api/courses/:id` (member/admin via token)
- `POST /api/courses` (admin)
- `PUT /api/courses/:id` (admin)
- `DELETE /api/courses/:id` (admin)
- `GET /api/content`
- `POST /api/content/contact` (public contact form)
- `POST /api/content` (admin)
- `PUT /api/content/:id` (admin)
- `DELETE /api/content/:id` (admin)
