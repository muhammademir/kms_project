# Dokumentasi Knowledge Management System (KMS) SEAQIS

Dokumentasi ini menjelaskan struktur, alur data, dan kebutuhan sistem untuk aplikasi KMS SEAQIS.

## 1. Kebutuhan Instalasi (Prerequisites)

Untuk menjalankan proyek ini di lingkungan pengembangan lokal, Anda membutuhkan perangkat lunak berikut:

### Kebutuhan Server (Backend)
- **PHP** (Versi >= 8.2)
- **Composer** (Package Manager untuk PHP)
- **MySQL/MariaDB** (Database - dapat menggunakan XAMPP/Laragon)
- **Ekstensi PHP**: PDO, Mbstring, OpenSSL, XML, Ctype, JSON, BCMath.

### Kebutuhan Klien (Frontend)
- **Node.js** (Versi >= 18.x)
- **NPM** atau **Yarn** (Package Manager untuk JavaScript)

### Stack Teknologi
- **Backend:** Laravel 11
- **Frontend:** React 18, TypeScript, Inertia.js
- **Styling:** Tailwind CSS, Shadcn UI (Radix UI)
- **Animasi:** Framer Motion
- **Build Tool:** Vite

---

## 2. Struktur Folder & File Utama

Aplikasi ini menggunakan struktur bawaan Laravel yang dimodifikasi untuk mengakomodasi Inertia.js dan React.

### Struktur Backend (Laravel)
- `/app/Http/Controllers/` - Berisi logika bisnis utama (mis: `DokumenController`, `UserController`).
- `/app/Http/Middleware/` - Berisi filter request seperti `EnsureUserHasRole` (Cek hak akses).
- `/app/Models/` - Representasi tabel database (mis: `User`, `Dokumen`, `Kategori`, `LogAktivitas`).
- `/database/migrations/` - Skema pembuatan tabel database.
- `/database/seeders/` - Data awal dummy (termasuk pembuatan akun Admin, Panitia, Divisi IDE, Pimpinan).
- `/routes/web.php` - Daftar semua URL/Endpoint aplikasi dan pemetaan ke Controller.
- `/storage/app/public/dokumen/` - Tempat penyimpanan fisik file PDF/Word yang diunggah pengguna.

### Struktur Frontend (React & Inertia)
- `/resources/js/app.tsx` - Entry point (titik awal) aplikasi React dan konfigurasi Inertia.
- `/resources/js/Layouts/` - Berisi *template* tata letak seperti `AppLayout.tsx` (Sidebar, Header, Animasi Transisi).
- `/resources/js/Pages/` - Berisi tampilan (View) untuk setiap halaman:
  - `/Auth/Login.tsx` - Halaman masuk.
  - `Dashboard.tsx` - Halaman utama statistik.
  - `Upload.tsx`, `Validasi.tsx`, `Review.tsx` - Halaman sesuai fase dokumen.
  - `KelolaPengguna.tsx`, `KelolaRepository.tsx` - Halaman manajemen (Admin).
- `/resources/js/components/` - Komponen kecil yang dapat digunakan berulang kali:
  - `/ui/` - Komponen standar bentukan Shadcn (Dialog, Button, Input, dll).
  - `FaseBadge.tsx`, `StatusDokumen.tsx` - Komponen khusus aplikasi KMS.

---

## 3. Alur Data (Data Flow)

KMS SEAQIS menggunakan konsep **Monolith Modern** dengan bantuan Inertia.js. Inertia.js bertindak sebagai jembatan yang menghubungkan Laravel (Backend) langsung ke React (Frontend) tanpa perlu membuat REST API yang terpisah.

### Alur Siklus *Request-Response* (Cara Kerja Umum):
1. **User (Klien):** Pengguna mengklik tautan atau mengirim formulir di antarmuka React.
2. **Inertia.js:** Menangkap aksi tersebut dan mengirim *AJAX Request* (secara di belakang layar) ke server Laravel.
3. **Routes (`web.php`):** Rute Laravel menerima *request* tersebut dan meneruskannya ke Middleware.
4. **Middleware:** Memeriksa apakah pengguna sudah *login* dan apakah peran/hak aksesnya (`role`) diizinkan untuk rute tersebut.
5. **Controller:** Jika diizinkan, Controller akan memproses data. Controller akan memanggil **Model** untuk mengambil/menyimpan data ke **Database (MySQL)**.
6. **Inertia Response:** Controller tidak mereturn file HTML/Blade, melainkan mengirimkan response via `Inertia::render('NamaPage', [data_props])`.
7. **React (Frontend):** Inertia menangkap JSON dari server, memperbarui komponen *state*, lalu React me-*render* ulang (DOM) halaman secara halus tanpa memuat ulang (*reload*) seluruh halaman web.

### Alur Proses Dokumen (Bisnis Logika)
Aplikasi ini melacak *Knowledge Management* melalui 4 Fase:

1. **Fase 1: Upload (Oleh Panitia)**
   - Panitia mengunggah file. Status dokumen: `menunggu_validasi`.
   - Data mengalir ke `DokumenController@store` -> File disimpan di `/storage` -> Record masuk ke tabel `dokumens`.
2. **Fase 2: Validasi (Oleh Admin)**
   - Admin melihat dokumen dari Panitia. 
   - Jika disetujui, status berubah menjadi `menunggu_review`. 
   - Jika ditolak, status menjadi `revisi` (dikembalikan ke Panitia).
3. **Fase 3: Review (Oleh Divisi IDE)**
   - Divisi IDE meninjau dokumen yang lolos Validasi.
   - Jika disetujui, status berubah menjadi `terbit` (Publikasi).
   - Jika ditolak, status kembali ke `revisi`.
4. **Fase 4: Terbit (Dilihat oleh Pimpinan)**
   - Pimpinan dapat melihat semua dokumen yang berstatus `terbit` di halaman Laporan/Repository.

Setiap perubahan fase di atas dicatat secara otomatis oleh sistem ke dalam tabel `log_aktivitas`.
