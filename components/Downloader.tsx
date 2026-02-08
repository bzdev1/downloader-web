
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Link as LinkIcon, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Youtube, 
  Instagram, 
  Video, 
  Music, 
  Download,
  ServerOff
} from 'lucide-react';
import { Platform, MediaType, MediaMetadata } from '../types';
import { downloaderService } from '../services/downloaderService';

const Downloader: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [selectedType, setSelectedType] = useState<MediaType>(MediaType.VIDEO);
  const [selectedQuality, setSelectedQuality] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleFetch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setMetadata(null);

    try {
      const data = await downloaderService.fetchMetadata(url);
      setMetadata(data);
      if (data.availableTypes.includes(MediaType.VIDEO) && data.videoQualities.length > 0) {
        setSelectedType(MediaType.VIDEO);
        setSelectedQuality(data.videoQualities[0].value);
      } else if (data.availableTypes.includes(MediaType.AUDIO) && data.audioQualities.length > 0) {
        setSelectedType(MediaType.AUDIO);
        setSelectedQuality(data.audioQualities[0].value);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!metadata) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);

    // Animasi progress palsu untuk UX selagi server bekerja
    const interval = setInterval(() => {
      setDownloadProgress((prev) => (prev >= 95 ? 95 : prev + (Math.random() * 5)));
    }, 500);

    try {
      await downloaderService.downloadMedia(metadata.url, selectedQuality, selectedType);
      
      downloaderService.saveToHistory({
        id: metadata.id,
        title: metadata.title,
        platform: metadata.platform,
        timestamp: Date.now(),
        url: metadata.url,
        type: selectedType,
        status: 'completed'
      });

      setDownloadProgress(100);
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Gagal mengunduh file.');
      setIsDownloading(false);
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
      {/* Header Section */}
      <div className="text-center mb-12 animate-in fade-in duration-700">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">
            One Click Download.
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
          Unduh video dan audio kualitas HD dari platform manapun secara gratis, tanpa iklan, dan super cepat.
        </p>
      </div>

      {/* URL Input Form */}
      <div className="glass-morphism p-2 rounded-3xl shadow-2xl mb-12 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-10 group-focus-within:opacity-25 transition-opacity" />
        <form onSubmit={handleFetch} className="relative flex flex-col md:flex-row items-center gap-2">
          <div className="flex-grow w-full relative">
            <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text"
              placeholder="Tempel tautan video (YouTube, TikTok, FB...)"
              className="w-full bg-transparent border-none py-5 pl-14 pr-4 text-white focus:ring-0 text-lg placeholder:text-gray-600"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={loading || !url}
            className="w-full md:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-blue-500/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={22} />}
            Analisis
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex flex-col gap-4 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 mb-8 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="shrink-0" />
            <p className="font-bold">Terjadi Kesalahan</p>
          </div>
          <p className="text-sm opacity-90">{error}</p>
          {error.includes('Backend') && (
            <div className="p-3 bg-red-500/20 rounded-xl text-xs flex items-center gap-2">
              <ServerOff size={14} />
              <span>Pastikan file <b>backend.js</b> sudah dijalankan di server Anda.</span>
            </div>
          )}
        </div>
      )}

      {/* Metadata Preview & Quality Selector */}
      {metadata && !isDownloading && (
        <div className="glass-morphism rounded-3xl overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl border-white/5">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-5/12 relative aspect-video md:aspect-auto">
              <img src={metadata.thumbnail} className="w-full h-full object-cover" alt="Thumbnail" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                 <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                  {metadata.platform}
                </span>
              </div>
            </div>

            <div className="md:w-7/12 p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">{metadata.title}</h2>
                <div className="flex items-center gap-3 text-gray-500 text-sm mb-6">
                  <span className="font-semibold text-gray-300">{metadata.author}</span>
                  <span>•</span>
                  <span>{metadata.duration}</span>
                </div>

                {/* Tabs Type */}
                <div className="flex gap-2 mb-6">
                  {metadata.availableTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedType(type as MediaType);
                        const qualities = type === 'video' ? metadata.videoQualities : metadata.audioQualities;
                        setSelectedQuality(qualities[0]?.value || '');
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 text-sm font-bold
                        ${selectedType === type 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                          : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'}`}
                    >
                      {type === 'video' ? <Video size={16} /> : <Music size={16} />}
                      <span className="capitalize">{type}</span>
                    </button>
                  ))}
                </div>

                {/* Quality List */}
                <div className="mb-8">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 block">Pilih Kualitas</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(selectedType === 'video' ? metadata.videoQualities : metadata.audioQualities).map((q) => (
                      <button
                        key={q.value}
                        onClick={() => setSelectedQuality(q.value)}
                        className={`py-3 px-4 rounded-xl border text-left transition-all flex items-center justify-between
                          ${selectedQuality === q.value 
                            ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' 
                            : 'bg-white/5 border-transparent text-gray-400 hover:border-white/10'}`}
                      >
                        <div>
                          <div className="text-sm font-bold">{q.label}</div>
                          <div className="text-[10px] opacity-60">{q.filesize}</div>
                        </div>
                        {selectedQuality === q.value && <CheckCircle2 size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleDownload}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl transition-all shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-3 active:scale-95"
              >
                <Download size={20} />
                Unduh Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress View */}
      {isDownloading && (
        <div className="glass-morphism p-16 rounded-3xl text-center space-y-8 animate-in zoom-in-95">
           <div className="relative w-32 h-32 mx-auto">
             <div className="absolute inset-0 rounded-full border-8 border-gray-800"></div>
             <svg className="w-full h-full rotate-[-90deg]">
                <circle
                  cx="64" cy="64" r="56"
                  className="stroke-blue-500 stroke-[8px] fill-transparent transition-all duration-300"
                  strokeDasharray="351.85"
                  strokeDashoffset={351.85 - (351.85 * downloadProgress) / 100}
                  strokeLinecap="round"
                />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-blue-500">{Math.round(downloadProgress)}%</span>
             </div>
           </div>
           <div>
             <h3 className="text-2xl font-bold text-white">Sedang Memproses...</h3>
             <p className="text-gray-500 mt-2">Server sedang menggabungkan aliran video dan audio terbaik untuk Anda.</p>
           </div>
        </div>
      )}

      {/* Footer Info */}
      {!metadata && !loading && !isDownloading && (
        <div className="mt-20 text-center">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.3em] mb-10">Mendukung 1000+ Platform</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-20 grayscale hover:grayscale-0 transition-all duration-500">
             <Youtube size={32} />
             <Instagram size={32} />
             <div className="font-black text-2xl">TikTok</div>
             <div className="font-black text-2xl">X</div>
             <div className="font-black text-2xl">FB</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Downloader;
