# Laporan Implementasi Konsep A5 pada Sistem Informasi Kasir

Laporan ini mendokumentasikan implementasi 5 pilar keamanan (Authentication, Authorization, Access Control, Accountability, dan Auditing) dalam kode sumber (source code) aplikasi kasir.

## 1. Authentication (Otentikasi)

Otentikasi adalah proses verifikasi identitas pengguna (siapa Anda?). Dalam sistem ini, otentikasi diimplementasikan menggunakan:

- **Identifikasi**: Menggunakan _Username_.
- **Verifikasi**: Menggunakan _Password_ yang di-hash dengan `bcrypt`.
- **Token**: Menggunakan JSON Web Token (JWT) untuk sesi stateless.

**File Utama:**

- `server/src/controllers/authController.js`: Menangani logika login.
- `server/src/middleware/auth.js`: Middleware untuk memverifikasi validitas token pada setiap request yang membutuhkan otentikasi.

**Penjelasan Method:**

- `login` (pada `authController.js`):

  1.  Mencari user berdasarkan username.
  2.  Memeriksa apakah akun sedang terkunci (`SystemLock`).
  3.  Memverifikasi password menggunakan `bcrypt.compare`.
  4.  Jika gagal, mencatat ke `LoginAttempts`. Jika gagal 5x berturut-turut, membuat record di `SystemLock` (Account Lockout Policy).
  5.  Jika berhasil, membuat JWT token yang berisi ID user dan Role ID.

- `verifyToken` (pada `middleware/auth.js`):
  1.  Mengambil token dari header `Authorization: Bearer <token>`.
  2.  Memverifikasi signature token menggunakan `jwt.verify` dan secret key.
  3.  Menyimpan data user (`req.user`) ke dalam object request untuk digunakan oleh middleware/controller selanjutnya.

## 2. Authorization (Otorisasi)

Otorisasi adalah proses menentukan hak akses pengguna setelah berhasil login (apa yang boleh Anda lakukan?). Sistem ini menggunakan _Role-Based Access Control (RBAC)_.

**Role ID:**

- 1: Admin (Akses penuh)
- 2: Kasir (Akses transaksi)
- 3: Owner (Akses laporan & manajemen produk)

**File Utama:**

- `server/src/middleware/roleCheck.js`: Middleware untuk membatasi akses endpoint berdasarkan role.
- `server/src/controllers/userRoleController.js`: Mengelola penetapan role ke user.

**Penjelasan Method:**

- `requireRole(allowedRoles)` (pada `middleware/roleCheck.js`):
  1.  Menerima array role ID yang diizinkan (misal: `[1, 3]`).
  2.  Mengambil role yang dimiliki user saat ini dari database (`UserRoles`).
  3.  Mengecek apakah user memiliki setidaknya satu dari role yang diizinkan.
  4.  Jika tidak, mengembalikan error 403 (Unauthorized/Forbidden).

## 3. Access Control (Kontrol Akses)

Kontrol akses adalah penerapan otorisasi pada level antarmuka (Frontend) dan alur data. Ini memastikan pengguna hanya melihat menu dan fitur yang relevan dengan hak akses mereka.

**File Utama:**

- `src/components/ProtectedRoute.jsx`: Komponen React Wrapper untuk melindungi halaman.
- `src/layouts/RootLayout.jsx` / `Sidebar.jsx`: Menampilkan menu navigasi secara kondisional.

**Penjelasan Kode:**

- `ProtectedRoute` component:

  1.  Mengecek status login (`user` object). Jika null, redirect ke Login.
  2.  Mengecek `hasRole`. Jika user tidak memiliki role yang dibutuhkan untuk halaman tersebut, menampilkan pesan "Akses Tidak Tersedia" (Access Denied UI).

- _Integrasi Route Backend (Contoh)_:
  ```javascript
  // Hanya Admin (1) yang boleh menghapus user
  router.delete("/:id", verifyToken, requireRole([1]), controller.delete);
  ```

## 4. Accountability (Akuntabilitas)

Akuntabilitas memastikan setiap tindakan dalam sistem dapat dikaitkan kembali dengan individu tertentu. Tidak ada tindakan anonim untuk operasi kritis.

**Implementasi:**

1.  **User ID pada Data**: Setiap data transaksi (`Orders`), produk (`Products`), atau log selalu menyimpan `user_id` pembuatnya.
2.  **Identitas di Token**: Token JWT membawa `id` pengguna yang diverifikasi pada setiap request.

**File Utama:**

- `server/src/controllers/orderController.js`
- `server/src/controllers/accessLogController.js`

**Penjelasan Kode:**

- `createOrder`:
  ```javascript
  const user_id = req.user.id; // Diambil dari token yang sudah diverifikasi
  const order = await Orders.create({ ...req.body, user_id });
  ```
  Code di atas menjamin bahwa order yang dibuat otomatis terikat dengan akun yang sedang login, tanpa perlu input manual yang bisa dimanipulasi.

## 5. Auditing (Audit)

Auditing adalah perekaman jejak aktivitas sistem secara kronologis untuk tujuan pemeriksaan keamanan dan operasional.

**Jenis Log:**

1.  **Access Logs**: Mencatat aktivitas Login/Logout (Berhasil/Gagal).
2.  **DB Change Logs / CRUD Logs**: Mencatat perubahan data (Create, Update, Delete) pada tabel penting (User, Product, Role).
3.  **Login Attempts / System Lock**: Mencatat upaya login mencurigakan.

**File Utama:**

- `server/src/controllers/accessLogController.js`
- `server/src/controllers/dbChangeLogController.js`
- `src/pages/admin/DashboardAdmin.jsx`: Interface visual untuk memantau log.

**Penjelasan Method:**

- `logChange` (pada `dbChangeLogController.js`):
  Dipanggil setiap kali ada operasi CUD (Create/Update/Delete).
  Contoh pada `RoleController`:

  ```javascript
  await dbChangeLogController.logChange({
    table_name: "Roles",
    action: "UPDATE",
    record_id: id,
    user_id: req.user.id,
    description: `Role ${role.name} updated`,
  });
  ```

- `createLog` (pada `accessLogController.js`):
  Dipanggil otomatis saat login sukses, gagal password, atau user terkunci. Mencatat Timestamp, User ID, IP Address, dan Action.

---

_Laporan ini disusun berdasarkan analisis source code terkini pada tanggal 14 Desember 2025._
