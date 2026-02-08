
/**
 * UNIVERSAL DOWNLOADER BACKEND (PRODUCTION)
 * Stack: Node.js, Express, yt-dlp, FFmpeg
 */

const express = require('express');
const cors = require('cors');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi Direktori
const DOWNLOADS_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

/**
 * ROUTE: Ambil Metadata Media
 */
app.post('/api/fetch', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL diperlukan' });

    // Gunakan yt-dlp untuk dump info dalam format JSON
    const cmd = `yt-dlp --dump-json --no-playlist "${url.replace(/"/g, '\\"')}"`;
    
    exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
            console.error('Fetch Error:', stderr);
            return res.status(500).json({ error: 'URL tidak didukung atau konten tidak ditemukan.' });
        }
        
        try {
            const info = JSON.parse(stdout);
            
            // Mapping metadata untuk Frontend
            const metadata = {
                id: info.id,
                url: url,
                platform: info.extractor_key ? info.extractor_key.toLowerCase() : 'unknown',
                title: info.title,
                thumbnail: info.thumbnail,
                duration: info.duration_string || 'N/A',
                author: info.uploader || info.channel || 'Official',
                availableTypes: ['video', 'audio'],
                videoQualities: info.formats
                    .filter(f => f.vcodec !== 'none' && f.height)
                    .map(f => ({
                        label: `${f.height}p - ${f.ext.toUpperCase()} ${f.fps ? `(${f.fps}fps)` : ''}`,
                        value: f.format_id,
                        filesize: f.filesize ? `${(f.filesize / (1024 * 1024)).toFixed(1)} MB` : 'Size Unknown'
                    }))
                    .filter((v, i, a) => a.findIndex(t => t.label === v.label) === i)
                    .sort((a, b) => parseInt(b.label) - parseInt(a.label))
                    .slice(0, 10),
                audioQualities: info.formats
                    .filter(f => f.acodec !== 'none' && f.vcodec === 'none')
                    .map(f => ({
                        label: `MP3 - ${f.abr || 'High'}kbps`,
                        value: f.format_id,
                        filesize: f.filesize ? `${(f.filesize / (1024 * 1024)).toFixed(1)} MB` : 'Size Unknown'
                    }))
                    .slice(0, 5)
            };
            
            res.json(metadata);
        } catch (e) {
            res.status(500).json({ error: 'Gagal memproses data dari server media.' });
        }
    });
});

/**
 * ROUTE: Proses Download & Convert
 */
app.post('/api/download', (req, res) => {
    const { url, qualityId, type } = req.body;
    if (!url || !type) return res.status(400).json({ error: 'Data tidak lengkap' });

    const fileId = uuidv4();
    const extension = type === 'audio' ? 'mp3' : 'mp4';
    const filename = `${fileId}.${extension}`;
    const outputPath = path.join(DOWNLOADS_DIR, filename);

    let args = [];
    if (type === 'audio') {
        // Ekstrak Audio Terbaik dan konversi ke MP3
        args = [
            '--extract-audio',
            '--audio-format', 'mp3',
            '--audio-quality', '0',
            url,
            '-o', outputPath
        ];
    } else {
        // Download Video Kualitas Spesifik + Audio Terbaik, lalu merge ke MP4
        // f: format_id + bestaudio agar dapet resolusi tinggi (1080p+)
        args = [
            '-f', `${qualityId}+bestaudio/best`,
            '--merge-output-format', 'mp4',
            url,
            '-o', outputPath
        ];
    }

    const downloader = spawn('yt-dlp', args);

    downloader.on('close', (code) => {
        if (code === 0) {
            res.json({ 
                success: true, 
                downloadUrl: `/api/files/${filename}`,
                filename: `UniLoader_${fileId}.${extension}`
            });
            
            // Atur pembersihan otomatis setelah 1 jam
            setTimeout(() => {
                if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                    console.log(`🧹 Deleted temporary file: ${filename}`);
                }
            }, 3600000);
        } else {
            console.error(`yt-dlp exited with code ${code}`);
            res.status(500).json({ error: 'Proses konversi media gagal.' });
        }
    });
});

/**
 * ROUTE: Streaming File ke User
 */
app.get('/api/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(DOWNLOADS_DIR, filename);
    
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: 'File sudah kadaluarsa atau tidak ditemukan.' });
    }
});

// Penanganan Error Global
process.on('uncaughtException', (err) => {
    console.error('FATAL ERROR:', err);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`
🚀 ============================================
   UNIVERSAL DOWNLOADER API IS RUNNING
   Port: ${PORT}
   Env: Production
   Storage: ${DOWNLOADS_DIR}
============================================
    `);
});
