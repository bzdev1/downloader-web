
import React, { useState, useEffect } from 'react';
import { History, Download, Trash2, ExternalLink, Video, Music } from 'lucide-react';
import { DownloadHistoryItem } from '../types';
import { downloaderService } from '../services/downloaderService';

const HistoryView: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<DownloadHistoryItem[]>([]);

  useEffect(() => {
    setHistoryItems(downloaderService.getHistory());
  }, []);

  const clearAll = () => {
    if (confirm('Clear all download history?')) {
      downloaderService.clearHistory();
      setHistoryItems([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4">
            <History className="text-blue-500" size={32} />
            History
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Your recent local extractions.</p>
        </div>
        {historyItems.length > 0 && (
          <button 
            onClick={clearAll}
            className="p-4 text-gray-400 hover:text-red-400 transition-colors bg-white/5 rounded-2xl hover:bg-red-500/10"
          >
            <Trash2 size={22} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {historyItems.map((item) => (
          <div key={item.id + item.timestamp} className="glass-morphism p-5 md:p-6 rounded-3xl flex items-center justify-between group hover:border-blue-500/40 transition-all shadow-lg hover:shadow-blue-500/5">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                {item.type === 'video' ? <Video size={28} /> : <Music size={28} />}
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-bold truncate pr-4">{item.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                  <span className="px-2 py-0.5 bg-white/5 rounded font-bold uppercase text-[9px] tracking-tighter">{item.platform}</span>
                  <span>•</span>
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 md:opacity-0 md:group-hover:opacity-100 transition-all">
              <a 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                className="p-3 text-gray-400 hover:text-white bg-white/5 rounded-xl hover:bg-white/10"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        ))}

        {historyItems.length === 0 && (
          <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
            <div className="w-20 h-20 bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-700">
              <Download size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-400">Empty list</h3>
            <p className="text-gray-600 mt-2 max-w-xs mx-auto text-sm">Download your first media to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
