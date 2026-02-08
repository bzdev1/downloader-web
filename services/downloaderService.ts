
import { Platform, MediaType, MediaMetadata, DownloadHistoryItem } from '../types';

/**
 * KONFIGURASI PRODUKSI
 * Ganti API_BASE_URL dengan domain/IP server Anda saat deploy.
 */
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : `http://${window.location.hostname}:3001/api`;

const USE_SIMULATED_DATA = false; // NON-DEMO: Harus FALSE untuk bekerja 100%

export const downloaderService = {
  fetchMetadata: async (url: string): Promise<MediaMetadata> => {
    if (USE_SIMULATED_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return simulateMetadata(url);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server gagal mengambil metadata.');
      }

      return await response.json();
    } catch (err: any) {
      if (err.message.includes('Failed to fetch')) {
        throw new Error('Tidak dapat terhubung ke Backend Server. Pastikan backend.js sudah berjalan di port 3001.');
      }
      throw err;
    }
  },

  downloadMedia: async (url: string, qualityId: string, type: MediaType): Promise<string> => {
    if (USE_SIMULATED_DATA) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return '#';
    }

    const response = await fetch(`${API_BASE_URL}/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, qualityId, type })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Proses download gagal di sisi server.');
    }

    const result = await response.json();
    
    // Trigger download file secara otomatis ke browser pengguna
    const downloadUrl = `${API_BASE_URL}/files/${result.downloadUrl.split('/').pop()}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', result.filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return downloadUrl;
  },

  saveToHistory: (item: DownloadHistoryItem) => {
    try {
      const history = JSON.parse(localStorage.getItem('dl_history') || '[]');
      const newHistory = [item, ...history].slice(0, 50);
      localStorage.setItem('dl_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Gagal menyimpan riwayat:', e);
    }
  },

  getHistory: (): DownloadHistoryItem[] => {
    try {
      return JSON.parse(localStorage.getItem('dl_history') || '[]');
    } catch (e) {
      return [];
    }
  },

  clearHistory: () => {
    localStorage.removeItem('dl_history');
  }
};

// Fungsi simulasi hanya sebagai fallback jika diaktifkan (tidak dipakai di produksi)
const simulateMetadata = (url: string): MediaMetadata => {
  return {
    id: 'demo-id',
    url: url,
    platform: Platform.YOUTUBE,
    title: 'Demo Mode: Backend Not Connected',
    thumbnail: 'https://picsum.photos/800/450',
    duration: '00:00',
    author: 'System',
    availableTypes: [MediaType.VIDEO],
    videoQualities: [{ label: 'Simulation Only', value: '0', filesize: '0 MB' }],
    audioQualities: []
  };
};
