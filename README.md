# 📥 Universal Social Media Downloader (Production)

Aplikasi web profesional untuk mengunduh konten media dari hampir semua platform media sosial (YouTube, Instagram, TikTok, Twitter/X, Facebook, dll) dengan kualitas HD hingga 4K.

## 🚀 Fitur Utama
- **High Quality**: Mendukung pengunduhan Video 4K/1080p dan Audio 320kbps.
- **Smart Fetching**: Ekstraksi metadata otomatis dari 1000+ situs web menggunakan `yt-dlp`.
- **No Watermark**: Unduh TikTok tanpa watermark secara native.
- **Auto-Cleanup**: Backend secara otomatis menghapus file lama untuk menghemat penyimpanan server.
- **Local History**: Riwayat unduhan tersimpan di browser pengguna.

## 🛠️ Persyaratan Sistem (VPS)
- **OS**: Ubuntu 20.04/22.04/24.04 (Rekomendasi)
- **RAM**: Minimal 1GB (2GB+ direkomendasikan untuk proses merging video 4K)
- **Disk**: Sesuai kebutuhan penyimpanan sementara.

## 📥 Panduan Instalasi Cepat (VPS)

### 1. Jalankan Script Instalasi Otomatis
Unggah file `install.sh` ke server Anda, lalu jalankan:
```bash
chmod +x install.sh
sudo ./install.sh
```
Script ini akan menginstal Node.js, FFmpeg, yt-dlp, dan PM2 secara otomatis.

### 2. Konfigurasi Backend
Di folder project Anda:
```bash
# Instal dependencies Node.js
npm install express cors child_process fs path uuid

# Jalankan backend menggunakan PM2 agar tetap berjalan di background
pm2 start backend.js --name "downloader-api"
```

### 3. Konfigurasi Frontend
Edit file `services/downloaderService.ts`:
- Pastikan `USE_SIMULATED_DATA = false`.
- Ganti `API_BASE_URL` dengan alamat IP VPS atau domain Anda (contoh: `http://103.xx.xx.xx:3001/api`).

## ⚙️ Struktur API
- `POST /api/fetch`: Mengambil metadata (judul, thumbnail, kualitas yang tersedia).
- `POST /api/download`: Memulai proses download dan konversi di server.
- `GET /api/files/:filename`: Endpoint untuk mengunduh file hasil proses.

## 🛡️ Keamanan & Pemeliharaan
- File yang diunduh akan dihapus otomatis setelah 1 jam oleh sistem backend.
- Gunakan Nginx sebagai Reverse Proxy untuk mengaktifkan HTTPS (SSL).

---
**Dibuat untuk Performa Tinggi & Skalabilitas.**
