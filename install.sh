#!/bin/bash

# ========================================================
# AUTO-INSTALLER: UNIVERSAL SOCIAL MEDIA DOWNLOADER
# Target OS: Ubuntu 20.04/22.04/24.04
# ========================================================

set -e

# Warna untuk output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Memulai Instalasi Sistem Downloader...${NC}"

# 1. Update & Upgrade Sistem
echo -e "${GREEN}📦 Memperbarui paket sistem...${NC}"
sudo apt-get update && sudo apt-get upgrade -y

# 2. Instal Dependensi Dasar
echo -e "${GREEN}🛠️ Menginstal Python3, Git, dan FFmpeg...${NC}"
sudo apt-get install -y python3 python3-pip ffmpeg git curl build-essential zip unzip

# 3. Instal Node.js 20 (LTS)
echo -e "${GREEN}🟢 Menginstal Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Instal yt-dlp (Core Engine)
echo -e "${GREEN}📥 Menginstal yt-dlp terbaru...${NC}"
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# 5. Instal PM2 (Process Manager)
echo -e "${GREEN}🚀 Menginstal PM2...${NC}"
sudo npm install -g pm2

# 6. Buat Direktori Kerja
echo -e "${GREEN}📂 Menyiapkan struktur direktori...${NC}"
mkdir -p downloads
chmod 777 downloads

# 7. Verifikasi
echo -e "${BLUE}------------------------------------------------${NC}"
echo -e "${GREEN}✅ INSTALASI BERHASIL!${NC}"
echo -e "Versi Node: $(node -v)"
echo -e "Versi FFmpeg: $(ffmpeg -version | head -n 1)"
echo -e "Versi yt-dlp: $(yt-dlp --version)"
echo -e "${BLUE}------------------------------------------------${NC}"
echo -e "Langkah Selanjutnya:"
echo -e "1. Jalankan: npm install express cors uuid"
echo -e "2. Jalankan: pm2 start backend.js --name downloader-api"
echo -e "3. Pastikan port 3001 terbuka di firewall (ufw allow 3001)"
echo -e "${BLUE}------------------------------------------------${NC}"
