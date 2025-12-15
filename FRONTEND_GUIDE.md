# Panduan Integrasi Frontend & Penjelasan Fitur

Dokumen ini menjelaskan fungsi setiap fitur di Backend dan bagaimana seharusnya Frontend dibangun untuk mendukung fitur tersebut.

---

## 1. Modul Otentikasi (Login)

**Back-End**: `/api/auth/login`
**Fungsi**: Memverifikasi email & password user, lalu memberikan **Token**.
**Implementasi Frontend**:

- **Halaman Login**: Form sederhana (Email & Password).
- **Penyimpanan Token**: Setelah login sukses, simpan token di _LocalStorage_ atau _Cookies_. Token ini wajib dikirim di setiap request berikutnya.
- **Redirection**:
  - Jika **ADMIN** -> Arahkan ke Dashboard Admin.
  - Jika **KASIR** -> Arahkan ke Halaman Kasir (POS).

---

## 2. Modul Manajemen User (Khusus Admin)

**Back-End**: `/api/users` (Create, Get) & `/api/user-roles` (Assign)
**Fungsi**: Admin bisa membuat user baru dan menentukan apakah dia Kasir, Owner, atau Admin lain.
**Implementasi Frontend (Halaman "Kelola User")**:

- **Tabel User**: Menampilkan daftar user yang ada.
- **Tombol "Tambah User"**: Membuka Modal/Form.
  - Input: Username, Email, Password.
  - **Dropdown Role**: Pilihan "Kasir", "Admin", atau "Owner". (Kirim sebagai `role_id`).
- **Fitur Edit Role**: Checkbox atau dropdown untuk mengubah role user yang sudah ada.

---

## 3. Modul Manajemen Produk (Inventory)

**Back-End**: `/api/products` (CRUD: Create, Read, Update, Delete)
**Fungsi**: Mengelola stok barang dagangan, harga, dan nama produk.
**Implementasi Frontend (Halaman "Produk")**:

- **Hak Akses**: Halaman ini biasanya diakses oleh **Kasir** atau **Owner**.
- **Tabel Produk**: Menampilkan Nama, Harga, Stok.
- **Aksi**: Tombol Edit (ubah harga/stok) dan Hapus.
- **Form Tambah Produk**: Input Nama, Harga, dan Stok Awal.

---

## 4. Modul Transaksi / Kasir (Point of Sales)

**Back-End**: `/api/orders` (Buat Faktur) & `/api/order-items` (Isi Barang)
**Fungsi**: Mencatat penjualan real-time. Prosesnya biasanya: Buat Order Kosong -> Isi Barang -> Selesai.
**Implementasi Frontend (Halaman "Kasir / POS")**:
_Halaman ini adalah yang paling kompleks._

1.  **Katalog Produk**: Tampilkan daftar produk (bisa diklik).
2.  **Keranjang Belanja (Cart)**: List barang yang dipilih user saat ini.
3.  **Proses Checkout**:
    - Saat transaksi dimulai/disimpan, FE memanggil `POST /api/orders`.
    - Untuk setiap barang di keranjang, FE memanggil `POST /api/order-items`.
    - **Total Harga**: Dihitung otomatis atau dikirim saat create order.
4.  **Riwayat Transaksi**: Halaman terpisah untuk melihat penjualan hari ini.

---

## 5. Modul Keamanan & Log (Khusus Admin)

**Back-End**: `/api/access-logs`, `/api/login-attempts`, `/api/system-lock`
**Fungsi**: Memantau siapa yang login, siapa yang gagal login berkali-kali, dan mengunci sistem jika ada bahaya.
**Implementasi Frontend (Halaman "Monitoring System")**:

- **Tabel Log**: Menampilkan riwayat akses (Read-only).
- **Tabel User Terkunci**: Daftar user yang salah password berkali-kali. Ada tombol **"Unlock"** untuk membuka blokir mereka.
- **Tombol Darurat (Lock System)**: Tombol besar berwarna merah untuk mengunci sistem (opsional, untuk keamanan tinggi).

---

## Ringkasan Struktur Frontend

Berdasarkan API diatas, Frontend minimal membutuhkan halaman:

1.  **Login Page**
2.  **Dashboard Admin** (Menu: Kelola User, Log Sistem)
3.  **Dashboard Kasir** (Menu: Mesin Kasir/POS, Kelola Produk, Riwayat Transaksi)
