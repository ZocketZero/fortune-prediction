import React, { useState, useEffect } from 'react';
import { MainPage } from './components/MainPage';
import { TarotReadingPage } from './components/TarotReadingPage';
import { OmikujiPage } from './components/OmikujiPage';
import { ThaiSiamsiPage } from './components/ThaiSiamsiPage';
import { EncyclopediaPage } from './components/EncyclopediaPage';
import {
  Sparkles,
  Compass,
  BookOpen,
  Scroll
} from 'lucide-react';

export type AppTab = 'home' | 'reading' | 'omikuji' | 'thai_siamsi' | 'encyclopedia';

export const App: React.FC = () => {
  // Read initial tab from URL hash if available
  const getTabFromHash = (): AppTab => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash === 'reading' || hash === 'omikuji' || hash === 'thai_siamsi' || hash === 'thai-siamsi' || hash === 'encyclopedia') {
      return (hash === 'thai-siamsi' ? 'thai_siamsi' : hash) as AppTab;
    }
    return 'home';
  };

  const [activeTab, setActiveTab] = useState<AppTab>(getTabFromHash);

  // Sync state with URL hash
  const navigateTo = (tab: AppTab) => {
    setActiveTab(tab);
    window.location.hash = tab === 'home' ? '' : `/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to hash change (back/forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative overflow-hidden bg-[#090a0f]">
      {/* Mystic Atmospheric Background Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-purple-900/25 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/2 -right-32 w-[35rem] h-[35rem] bg-indigo-900/20 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] bg-pink-950/30 rounded-full blur-[130px]"></div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/5 rounded-full blur-[160px]"></div>
      </div>

      {/* Premium Header */}
      <header className="relative z-20 border-b border-amber-500/30 bg-slate-950/85 backdrop-blur-2xl sticky top-0 shadow-2xl shadow-purple-950/80">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3.5 cursor-pointer bg-transparent border-0 text-left p-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-600 to-purple-600 p-[1.5px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold gold-gradient-text m-0 tracking-tight font-cinzel-decorative">
                ทำนายโชคชะตา
              </h1>
              <p className="text-[11px] text-amber-200/70 m-0 font-medium">FORTUNE PREDICTION • ดูดวงไพ่ยิปซีและเซียมซีออนไลน์</p>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap items-center bg-slate-900/90 p-1.5 rounded-2xl border border-amber-500/30 shadow-inner gap-1">
            <button
              onClick={() => navigateTo('home')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-700 text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              หน้าหลัก
            </button>
            <button
              onClick={() => navigateTo('reading')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'reading'
                  ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-purple-600 text-slate-950 shadow-lg shadow-amber-500/30 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-950" />
              ไพ่ยิปซี
            </button>
            <button
              onClick={() => navigateTo('omikuji')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'omikuji'
                  ? 'bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 text-white shadow-lg shadow-orange-500/30 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>⛩️</span>
              เซียมซีญี่ปุ่น
            </button>
            <button
              onClick={() => navigateTo('thai_siamsi')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'thai_siamsi'
                  ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Scroll className="w-4 h-4 text-amber-500" />
              เซียมซีไทย ๒๘ ใบ
            </button>
            <button
              onClick={() => navigateTo('encyclopedia')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'encyclopedia'
                  ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-purple-600 text-slate-950 shadow-lg shadow-amber-500/30 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              สารานุกรมไพ่
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {activeTab === 'home' && <MainPage onNavigate={(tab) => navigateTo(tab)} />}
        {activeTab === 'reading' && <TarotReadingPage />}
        {activeTab === 'omikuji' && <OmikujiPage />}
        {activeTab === 'thai_siamsi' && <ThaiSiamsiPage />}
        {activeTab === 'encyclopedia' && <EncyclopediaPage />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-900/30 bg-slate-950/90 py-6 text-center text-xs text-purple-300/60 mt-auto">
        <p>© 2026 ทำนายโชคชะตา (Fortune Prediction) • ดูดวงไพ่ยิปซีและเซียมซีเพื่อนำทางชีวิตด้วยสติและปัญญา</p>
      </footer>
    </div>
  );
};

export default App;
