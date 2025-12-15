# Backend KI - Sistem Manajemen Kasir & Inventory

Backend API untuk sistem manajemen kasir dan inventory dengan fitur keamanan lengkap, role-based access control (RBAC), dan audit logging.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Struktur Proyek](#struktur-proyek)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Role & Permission](#role--permission)

## 🚀 Fitur Utama

### Keamanan
- **JWT Authentication** - Token-based authentication untuk semua endpoint
- **Role-Based Access Control (RBAC)** - Sistem role untuk Admin dan Kasir
- **Login Attempt Tracking** - Pencatatan percobaan login gagal
- **Auto User Lock** - Kunci user otomatis setelah 5x login gagal (30 menit)
- **Password Hashing** - Enkripsi password menggunakan bcrypt

### Audit & Logging
- **Access Logs** - Pencatatan semua aktivitas user (IP, User Agent, Action)
- **Database Change Logs** - Tracking semua perubahan data (CREATE, UPDATE, DELETE)
- **Login Attempt Logs** - Monitoring percobaan login

### Manajemen Data
- **User Management** - CRUD user dengan role assignment
- **Product Management** - Manajemen produk dan stok
- **Order Management** - Sistem pembuatan faktur/order
- **Order Items** - Detail item dalam setiap order

## 🛠 Teknologi

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: PostgreSQL
- **ORM**: Sequelize v6.37.7
- **Authentication**: JSON Web Token (JWT) v9.0.3
- **Password Hashing**: bcrypt v6.0.0
- **Environment Variables**: dotenv v17.2.3
- **CORS**: cors v2.8.5

### Dev Dependencies
- **nodemon** v3.1.11 - Auto-restart server saat development

## 📁 Struktur Proyek

```
backend_ki/
├── config/
│   └── database.js          # Konfigurasi koneksi database PostgreSQL
├── src/
│   ├── controllers/         # Business logic
│   │   ├── accessLogController.js
│   │   ├── authController.js
│   │   ├── dbChangeLogController.js
│   │   ├── loginAttemptController.js
│   │   ├── orderController.js
│   │   ├── orderItemController.js
│   │   ├── productController.js
│   │   ├── roleController.js
│   │   ├── systemLockController.js
│   │   ├── userController.js
│   │   └── userRoleController.js
│   ├── middleware/          # Middleware functions
│   │   ├── auth.js          # JWT verification
│   │   ├── checkLock.js     # User lock checking
│   │   └── roleCheck.js     # Role-based authorization
│   ├── models/              # Sequelize models
│   │   ├── AccessLog.js
│   │   ├── DBChangeLog.js
│   │   ├── LoginAttempt.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Product.js
│   │   ├── Role.js
│   │   ├── SystemLock.js
│   │   ├── User.js
│   │   ├── UserRole.js
│   │   └── index.js         # Model loader & associations
│   └── routes/              # API routes
│       ├── accessLogRoute.js
│       ├── authRoute.js
│       ├── dbChangeLogRoute.js
│       ├── loginAttemptRoute.js
│       ├── orderItemRoute.js
│       ├── orderRoute.js
│       ├── productRoute.js
│       ├── roleRoute.js
│       ├── systemLockRoute.js
│       ├── userRoleRoute.js
│       └── userRoute.js
├── .env                     # Environment variables (tidak di-commit)
├── package.json
├── package-lock.json
└── server.js               # Entry point aplikasi
```

## 📦 Instalasi

### Prerequisites
- Node.js (v14 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**
```bash
git clone <repository-url>
cd backend_ki
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup database PostgreSQL**
```sql
CREATE DATABASE nama_database;
```

4. **Konfigurasi environment variables**
Buat file `.env` di root folder:
```env
# Database Configuration
DB_NAME=nama_database
DB_USER=postgres
DB_PASS=password_anda
DB_HOST=localhost
DB_PORT=5432

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port
PORT=5000
```

5. **Jalankan aplikasi**
```bash
npm start
```

Database akan otomatis ter-sync dan tabel akan dibuat secara otomatis oleh Sequelize.

## ⚙️ Konfigurasi

### Database Configuration
File: `config/database.js`

Menggunakan Sequelize untuk koneksi ke PostgreSQL dengan konfigurasi:
- Dialect: PostgreSQL
- Logging: Disabled (untuk production)
- Timestamps: Automatic (createdAt, updatedAt)

### Environment Variables
| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `DB_NAME` | Nama database PostgreSQL | - |
| `DB_USER` | Username database | - |
| `DB_PASS` | Password database | - |
| `DB_HOST` | Host database | localhost |
| `DB_PORT` | Port database | 5432 |
| `JWT_SECRET` | Secret key untuk JWT | - |
| `PORT` | Port server | 5000 |

## 🚀 Menjalankan Aplikasi

### Development Mode
```bash
npm run dev
# atau
nodemon server.js
```

### Production Mode
```bash
npm start
# atau
node server.js
```

Server akan berjalan di: `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)

#### Register Admin
```http
POST /api/auth/register-admin
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

### Users (`/api/users`)
**Akses: Admin Only (Role ID: 1)**

#### Create User
```http
POST /api/users/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "kasir1",
  "password": "password123"
}
```

#### Get All Users
```http
GET /api/users
Authorization: Bearer <token>
```

### Roles (`/api/roles`)

#### Create Role
```http
POST /api/roles/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Admin",
  "description": "Administrator dengan akses penuh"
}
```

#### Get All Roles
```http
GET /api/roles
Authorization: Bearer <token>
```

### User Roles (`/api/user-roles`)
**Akses: Admin Only (Role ID: 1)**

#### Assign Role to User
```http
POST /api/user-roles
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": 1,
  "role_id": 1
}
```

#### Get All User Roles
```http
GET /api/user-roles
Authorization: Bearer <token>
```

### Products (`/api/products`)
**Akses: Kasir Only (Role ID: 2)**

#### Create Product
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Produk A",
  "price": 50000,
  "stock": 100
}
```

#### Get All Products
```http
GET /api/products
Authorization: Bearer <token>
```

#### Get Product by ID
```http
GET /api/products/:id
Authorization: Bearer <token>
```

#### Update Product
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Produk A Updated",
  "price": 55000,
  "stock": 150
}
```

#### Delete Product
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

### Orders (`/api/orders`)

#### Create Order
**Akses: Kasir Only (Role ID: 2)**
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": 2,
  "total": 100000
}
```

#### Get All Orders
**Akses: Admin & Kasir (Role ID: 1, 2)**
```http
GET /api/orders
Authorization: Bearer <token>
```

### Order Items (`/api/order-items`)

#### Add Item to Order
**Akses: Kasir Only (Role ID: 2)**
```http
POST /api/order-items
Authorization: Bearer <token>
Content-Type: application/json

{
  "order_id": 1,
  "product_id": 1,
  "quantity": 2,
  "price": 50000
}
```

#### Get All Order Items
**Akses: Admin & Kasir (Role ID: 1, 2)**
```http
GET /api/order-items
Authorization: Bearer <token>
```

### Access Logs (`/api/access-logs`)
**Akses: Admin Only (Role ID: 1)**

#### Get All Access Logs
```http
GET /api/access-logs
Authorization: Bearer <token>
```

### Database Change Logs (`/api/db-change-logs`)
**Akses: Admin Only (Role ID: 1)**

#### Get All DB Change Logs
```http
GET /api/db-change-logs
Authorization: Bearer <token>
```

### Login Attempts (`/api/login-attempts`)
**Akses: Admin Only (Role ID: 1)**

#### Get All Login Attempts
```http
GET /api/login-attempts
Authorization: Bearer <token>
```

### System Lock (`/api/system-lock`)
**Akses: Admin Only (Role ID: 1)**

#### Lock User
```http
POST /api/system-lock/lock
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": 2,
  "locked_until": "2024-12-31T23:59:59Z"
}
```

#### Unlock User
```http
PUT /api/system-lock/unlock/:id
Authorization: Bearer <token>
```

## 🗄️ Database Models

### Users
Tabel untuk menyimpan data user/pengguna.

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key (auto increment) |
| `username` | STRING | Username unik, tidak boleh null |
| `password` | STRING | Password terenkripsi (bcrypt) |
| `createdAt` | DATE | Timestamp pembuatan |
| `updatedAt` | DATE | Timestamp update terakhir |

**Relasi:**
- `belongsToMany` Roles (through UserRoles)
- `hasMany` LoginAttempts
- `hasMany` AccessLogs
- `hasMany` DBChangeLogs
- `hasMany` Orders
- `hasMany` SystemLock

### Roles
Tabel untuk menyimpan role/peran user.

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key (auto increment) |
| `name` | STRING(50) | Nama role (unik) |
| `description` | TEXT | Deskripsi role |
| `createdAt` | DATE | Timestamp pembuatan |
| `updatedAt` | DATE | Timestamp update terakhir |

**Default Roles:**
- Role ID 1: Admin (akses penuh)
- Role ID 2: Kasir (akses terbatas)

**Relasi:**
- `belongsToMany` Users (through UserRoles)

### UserRoles
Tabel pivot untuk relasi many-to-many antara Users dan Roles.

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key (auto increment) |
| `user_id` | INTEGER | Foreign key ke Users |
| `role_id` | INTEGER | Foreign key ke Roles |
| `createdAt` | DATE | Timestamp pembuatan |
| `updatedAt` | DATE | Timestamp update terakhir |

### Products
Tabel untuk menyimpan data produk.

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key (auto increment) |
| `name` | STRING | Nama produk |
| `price` | DECIMAL(12,2) | Harga produk |
| `stock` | INTEGER | Jumlah stok (default: 0) |
| `createdAt` | DATE | Timestamp pembuatan |
| `updatedAt` | DATE | Timestamp update terakhir |

**Relasi:**
- `hasMany` OrderItems

### Orders
Tabel untuk menyimpan data order/faktur.

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key (auto increment) |
| `user_id` | INTEGER | Foreign key ke Users (kasir) |
| `total` | DECIMAL(12,2) | Total harga order |
| `created_at` | DATE | Timestamp pembuatan order |
| `updated_at` | DATE | Timestamp update terakhir |

**Relasi:**
- `belongsTo` Users
- `hasMany` OrderItems (cascade delete)

### OrderItems
Tabel untuk menyimpan detail item dalam order.

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key (auto increment) |
| `order_id` | INTEGER | Foreign key ke Orders |
| `product_id` | INTEGER | Foreign key ke Products |
| `quantity` | INTEGER | Jumlah item |
| `price` | DECIMAL(12,2) | Harga per item |
| `created_at` | DATE | Timestamp pembuatan |
| `updated_at` | DATE | Timestamp update terakhir |

**Relasi:**
- `belongsTo` Orders
- `belongsTo` Products

### AccessLogs
Tabel untuk logging aktivitas user.

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key (auto increment) |
| `user_id` | INTEGER | Foreign key ke Users |
| `action` | TEXT | Deskripsi aktivitas |
| `ip_address` | STRING(100) | IP address user |
| `user_agent` | TEXT | Browser/device info |
| `createdAt` | DATE | Timestamp log |

**Relasi:**
- `belongsTo` Users

### DBChangeLogs
Tabel untuk tracking perubahan database.

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key (auto increment) |
| `table_name` | STRING(100) | Nama tabel yang berubah |
| `action` | STRING(20) | Jenis aksi (CREATE/UPDATE/DELETE) |
| `record_id` | INTEGER | ID record yang berubah |
| `user_id` | INTEGER | Foreign key ke Users |
| `description` | TEXT | Detail perubahan (JSON) |
| `created_at` | DATE | Timestamp perubahan |

**Relasi:**
- `belongsTo` Users

### LoginAttempts
Tabel untuk tracking percobaan login.

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key (auto increment) |
| `user_id` | INTEGER | Foreign key ke Users |
| `attempts` | INTEGER | Jumlah percobaan gagal (default: 0) |
| `locked_until` | DATE | Waktu lock berakhir |
| `last_attempt` | DATE | Timestamp percobaan terakhir |
| `createdAt` | DATE | Timestamp pembuatan |
| `updatedAt` | DATE | Timestamp update terakhir |

**Relasi:**
- `belongsTo` Users

**Logic:**
- Setelah 5x login gagal, user akan di-lock selama 30 menit
- Counter reset setelah user di-lock

### SystemLock
Tabel untuk menyimpan status lock user.

| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key (auto increment) |
| `user_id` | INTEGER | Foreign key ke Users |
| `is_locked` | BOOLEAN | Status lock (default: false) |
| `locked_until` | DATE | Waktu lock berakhir |
| `createdAt` | DATE | Timestamp pembuatan |
| `updatedAt` | DATE | Timestamp update terakhir |

**Relasi:**
- `belongsTo` Users

## 🔒 Middleware

### 1. Authentication Middleware (`auth.js`)

**Function:** `verifyToken`

Middleware untuk memverifikasi JWT token pada setiap request yang memerlukan autentikasi.

**Cara Kerja:**
1. Mengambil token dari header `Authorization: Bearer <token>`
2. Memverifikasi token menggunakan `JWT_SECRET`
3. Menyimpan data user (id, username) ke `req.user`
4. Jika token tidak valid/tidak ada, return 401 Unauthorized

**Penggunaan:**
```javascript
router.get("/protected", verifyToken, controller.method);
```

### 2. Role Check Middleware (`roleCheck.js`)

**Function:** `requireRole(allowedRoles)`

Middleware untuk memeriksa apakah user memiliki role yang diizinkan.

**Parameter:**
- `allowedRoles`: Array of role IDs yang diizinkan, contoh: `[1]` atau `[1, 2]`

**Cara Kerja:**
1. Mengambil `user_id` dari `req.user` (dari middleware `verifyToken`)
2. Query ke tabel `UserRoles` untuk mendapatkan role user
3. Memeriksa apakah user memiliki salah satu role yang diizinkan
4. Jika tidak memiliki akses, return 403 Forbidden

**Penggunaan:**
```javascript
// Hanya Admin (Role ID: 1)
router.post("/admin-only", verifyToken, requireRole([1]), controller.method);

// Admin atau Kasir (Role ID: 1 atau 2)
router.get("/admin-kasir", verifyToken, requireRole([1, 2]), controller.method);
```

### 3. User Lock Check Middleware (`checkLock.js`)

**Function:** `checkUserLock`

Middleware untuk memeriksa apakah user sedang dalam status locked.

**Cara Kerja:**
1. Mengambil `user_id` dari `req.user`
2. Query ke tabel `SystemLock` untuk cek status lock
3. Jika user locked dan waktu belum habis, return 403 Forbidden
4. Jika waktu lock sudah habis, unlock otomatis dan lanjutkan request

**Penggunaan:**
```javascript
router.post("/protected", verifyToken, checkUserLock, controller.method);
```

## 👥 Role & Permission

### Role Hierarchy

| Role ID | Role Name | Description | Permissions |
|---------|-----------|-------------|-------------|
| 1 | Admin | Administrator | Full access ke semua endpoint |
| 2 | Kasir | Cashier | Akses terbatas untuk operasional kasir |

### Permission Matrix

| Endpoint | Admin (1) | Kasir (2) |
|----------|-----------|-----------|
| **Authentication** |
| POST /api/auth/login | ✅ | ✅ |
| POST /api/auth/register-admin | ✅ | ❌ |
| **Users** |
| POST /api/users/create | ✅ | ❌ |
| GET /api/users | ✅ | ❌ |
| **Roles** |
| POST /api/roles/create | ✅ | ❌ |
| GET /api/roles | ✅ | ✅ |
| **User Roles** |
| POST /api/user-roles | ✅ | ❌ |
| GET /api/user-roles | ✅ | ❌ |
| **Products** |
| POST /api/products | ❌ | ✅ |
| GET /api/products | ❌ | ✅ |
| GET /api/products/:id | ❌ | ✅ |
| PUT /api/products/:id | ❌ | ✅ |
| DELETE /api/products/:id | ❌ | ✅ |
| **Orders** |
| POST /api/orders | ❌ | ✅ |
| GET /api/orders | ✅ | ✅ |
| **Order Items** |
| POST /api/order-items | ❌ | ✅ |
| GET /api/order-items | ✅ | ✅ |
| **Access Logs** |
| GET /api/access-logs | ✅ | ❌ |
| **DB Change Logs** |
| GET /api/db-change-logs | ✅ | ❌ |
| **Login Attempts** |
| GET /api/login-attempts | ✅ | ❌ |
| **System Lock** |
| POST /api/system-lock/lock | ✅ | ❌ |
| PUT /api/system-lock/unlock/:id | ✅ | ❌ |

## 🔐 Fitur Keamanan

### 1. Password Hashing
- Menggunakan **bcrypt** dengan salt rounds
- Password tidak pernah disimpan dalam bentuk plain text
- Hash dilakukan saat register dan verifikasi saat login

### 2. JWT Authentication
- Token expires sesuai konfigurasi
- Token berisi payload: `{ id, username }`
- Setiap request protected harus menyertakan token di header

### 3. Login Attempt Tracking
- Sistem mencatat setiap percobaan login (berhasil/gagal)
- Setelah **5x login gagal**, user otomatis di-lock
- Lock duration: **30 menit**
- Counter reset setelah user di-lock

### 4. Auto User Lock
- User yang di-lock tidak bisa login hingga waktu lock habis
- Admin dapat unlock user secara manual
- Unlock otomatis setelah `locked_until` terlewati

### 5. Access Logging
- Setiap aktivitas user dicatat dengan detail:
  - User ID
  - Action/aktivitas
  - IP Address
  - User Agent (browser/device)
  - Timestamp

### 6. Database Change Logging
- Setiap perubahan data (CREATE, UPDATE, DELETE) dicatat
- Informasi yang disimpan:
  - Tabel yang berubah
  - Jenis aksi
  - Record ID
  - User yang melakukan
  - Detail perubahan (JSON)
  - Timestamp

## 📝 Contoh Penggunaan

### 1. Setup Awal - Register Admin
```bash
curl -X POST http://localhost:5000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 2. Login dan Dapatkan Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

### 3. Create Role
```bash
curl -X POST http://localhost:5000/api/roles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "name": "Admin",
    "description": "Administrator dengan akses penuh"
  }'
```

### 4. Assign Role ke User
```bash
curl -X POST http://localhost:5000/api/user-roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "user_id": 1,
    "role_id": 1
  }'
```

### 5. Create Product (sebagai Kasir)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <kasir_token>" \
  -d '{
    "name": "Laptop ASUS",
    "price": 8500000,
    "stock": 10
  }'
```

### 6. Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <kasir_token>" \
  -d '{
    "user_id": 2,
    "total": 8500000
  }'
```

## 🔧 Troubleshooting

### Database Connection Error
**Problem:** `DB Sync Error: Connection refused`

**Solution:**
1. Pastikan PostgreSQL sudah running
2. Cek kredensial database di file `.env`
3. Pastikan database sudah dibuat
4. Test koneksi database:
```bash
psql -U postgres -d nama_database
```

### JWT Token Invalid
**Problem:** `Invalid token` atau `Token required`

**Solution:**
1. Pastikan token dikirim di header dengan format: `Authorization: Bearer <token>`
2. Pastikan `JWT_SECRET` di `.env` sama dengan yang digunakan saat generate token
3. Cek apakah token sudah expired

### User Locked
**Problem:** `User terkunci hingga <timestamp>`

**Solution:**
1. Tunggu hingga waktu lock habis (30 menit)
2. Atau minta admin untuk unlock secara manual via endpoint `/api/system-lock/unlock/:id`

### Role Permission Denied
**Problem:** `Unauthorized (akses ditolak)`

**Solution:**
1. Pastikan user sudah memiliki role yang sesuai
2. Cek role assignment di tabel `UserRoles`
3. Pastikan role_id sesuai dengan yang dibutuhkan endpoint

### Port Already in Use
**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
1. Ganti port di file `.env`
2. Atau kill process yang menggunakan port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

## 🛠️ Development Guide

### Menambah Endpoint Baru

1. **Buat Model** (jika perlu)
```javascript
// src/models/NewModel.js
module.exports = (sequelize, DataTypes) => {
  const NewModel = sequelize.define("NewModels", {
    field1: { type: DataTypes.STRING, allowNull: false },
    field2: DataTypes.TEXT,
  });

  NewModel.associate = (models) => {
    // Define associations
  };

  return NewModel;
};
```

2. **Buat Controller**
```javascript
// src/controllers/newController.js
const db = require("../models");
const NewModel = db.NewModels;

exports.create = async (req, res) => {
  try {
    const data = await NewModel.create(req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

3. **Buat Route**
```javascript
// src/routes/newRoute.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/newController");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");

router.post("/", verifyToken, requireRole([1]), controller.create);

module.exports = router;
```

4. **Register Route di server.js**
```javascript
const newRoutes = require("./src/routes/newRoute");
app.use("/api/new", newRoutes);
```

### Database Migration

Untuk mengubah struktur database:

1. **Ubah Model** sesuai kebutuhan
2. **Set sync mode** di `server.js`:
```javascript
// Development: auto-update schema
db.sequelize.sync({ alter: true })

// Production: manual migration
db.sequelize.sync({ alter: false })
```

⚠️ **Warning:** `alter: true` bisa menyebabkan data loss. Gunakan dengan hati-hati!

### Testing API dengan Postman

1. **Import Collection**
   - Buat collection baru di Postman
   - Set base URL: `http://localhost:5000`

2. **Setup Environment Variables**
   - `base_url`: `http://localhost:5000`
   - `token`: (akan diisi setelah login)

3. **Test Flow:**
   - Register Admin → Login → Get Token
   - Create Role → Assign Role
   - Test endpoints sesuai role

## 📊 Database Schema Diagram

```
Users ──────┬─────── UserRoles ─────── Roles
            │
            ├─────── LoginAttempts
            │
            ├─────── AccessLogs
            │
            ├─────── DBChangeLogs
            │
            ├─────── SystemLock
            │
            └─────── Orders ─────── OrderItems ─────── Products
```

## 🚀 Deployment

### Deployment ke Production

1. **Set Environment Variables**
```env
NODE_ENV=production
DB_NAME=production_db
DB_USER=prod_user
DB_PASS=strong_password
DB_HOST=your_db_host
JWT_SECRET=very_strong_secret_key
PORT=5000
```

2. **Install Dependencies**
```bash
npm install --production
```

3. **Run dengan PM2** (recommended)
```bash
npm install -g pm2
pm2 start server.js --name backend-ki
pm2 save
pm2 startup
```

4. **Setup Nginx Reverse Proxy** (optional)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Environment-specific Configuration

**Development:**
- Logging: Enabled
- CORS: Allow all origins
- Database sync: `alter: true`

**Production:**
- Logging: Disabled atau minimal
- CORS: Specific origins only
- Database sync: `alter: false`
- Use HTTPS
- Rate limiting
- Request validation

## 📚 Resources & References

### Dependencies Documentation
- [Express.js](https://expressjs.com/) - Web framework
- [Sequelize](https://sequelize.org/) - ORM for PostgreSQL
- [JWT](https://jwt.io/) - JSON Web Tokens
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing
- [dotenv](https://www.npmjs.com/package/dotenv) - Environment variables

### Best Practices
- Always use environment variables for sensitive data
- Never commit `.env` file to version control
- Use strong JWT secrets (minimum 32 characters)
- Implement rate limiting for production
- Regular backup database
- Monitor access logs and change logs
- Keep dependencies updated

## 🤝 Contributing

Jika ingin berkontribusi pada project ini:

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini dibuat untuk keperluan pembelajaran dan pengembangan sistem manajemen kasir.

## 👨‍💻 Author

Backend KI - Sistem Manajemen Kasir & Inventory

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository atau hubungi developer.

---

**Happy Coding! 🚀**


