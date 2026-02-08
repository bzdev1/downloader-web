
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Download, 
  History, 
  Settings, 
  LayoutGrid, 
  ShieldCheck, 
  LogOut, 
  User,
  Github
} from 'lucide-react';
import Downloader from './components/Downloader';
import AdminPanel from './components/AdminPanel';
import HistoryView from './components/HistoryView';

const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 p-4 md:relative md:p-0">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl glass-morphism rounded-2xl md:bg-transparent md:border-none md:backdrop-blur-none">
        <div className="hidden md:flex items-center gap-2 font-bold text-xl text-blue-500">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <Download size={24} />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">UniLoader</span>
        </div>

        <div className="flex items-center gap-6 md:gap-8 mx-auto md:mx-0">
          <Link 
            to="/" 
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-colors ${isActive('/') ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}
          >
            <Download size={20} />
            <span className="text-xs md:text-sm font-medium">Download</span>
          </Link>
          <Link 
            to="/history" 
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-colors ${isActive('/history') ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}
          >
            <History size={20} />
            <span className="text-xs md:text-sm font-medium">History</span>
          </Link>
          <Link 
            to="/admin" 
            className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ShieldCheck size={20} />
            <span className="text-xs md:text-sm font-medium hidden md:block">Admin</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            <User size={16} />
            Login with Google
          </button>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="mt-20 py-12 border-t border-gray-800 bg-gray-950/50">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <div className="flex items-center gap-2 font-bold text-xl text-blue-500 mb-4">
          <Download size={24} />
          <span>UniLoader</span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          The ultimate social media downloader. Fast, reliable, and privacy-focused. 
          Support for over 50+ platforms.
        </p>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
          <li><Link to="/history" className="hover:text-blue-400 transition-colors">My History</Link></li>
          <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
        <p className="text-gray-400 text-sm mb-4">Questions or feedback? Reach out to us.</p>
        <div className="flex gap-4">
          <a href="#" className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors">
            <Github size={18} />
          </a>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
      <p>© 2024 Universal Social Media Downloader. All rights reserved.</p>
      <div className="flex gap-6">
        <span>Made with ❤️ for the community</span>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#030712] selection:bg-blue-500/30">
        <Navigation />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Downloader />} />
            <Route path="/history" element={<HistoryView />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        <Footer />
        <div className="h-20 md:hidden" /> {/* Spacer for mobile nav */}
      </div>
    </HashRouter>
  );
};

export default App;
