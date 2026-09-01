import React, { useState, useEffect } from 'react';
import { MainPage } from './components/MainPage';
import { TarotReadingPage } from './components/TarotReadingPage';
import { OmikujiPage } from './components/OmikujiPage';
import { ThaiSiamsiPage } from './components/ThaiSiamsiPage';
import { ThaiBlessingPage } from './components/ThaiBlessingPage';
import { JapanBlessingPage } from './components/JapanBlessingPage';
import { GodBlessingPage } from './components/GodBlessingPage';
import { EncyclopediaPage } from './components/EncyclopediaPage';
import { BirthFortunePage } from './components/BirthFortunePage';
import { Sparkles } from 'lucide-react';

export type AppTab =
  | 'home'
  | 'reading'
  | 'birth_fortune'
  | 'omikuji'
  | 'thai_siamsi'
  | 'thai_blessing'
  | 'japan_blessing'
  | 'god_blessing'
  | 'encyclopedia';

export const App: React.FC = () => {
  // Read initial tab from URL hash if available
  const getTabFromHash = (): AppTab => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (
      hash === 'reading' ||
      hash === 'birth_fortune' ||
      hash === 'birth-fortune' ||
      hash === 'omikuji' ||
      hash === 'thai_siamsi' ||
      hash === 'thai-siamsi' ||
      hash === 'thai_blessing' ||
      hash === 'thai-blessing' ||
      hash === 'japan_blessing' ||
      hash === 'japan-blessing' ||
      hash === 'god_blessing' ||
      hash === 'god-blessing' ||
      hash === 'encyclopedia'
    ) {
      if (hash === 'birth-fortune') return 'birth_fortune';
      if (hash === 'thai-siamsi') return 'thai_siamsi';
      if (hash === 'thai-blessing') return 'thai_blessing';
      if (hash === 'japan-blessing') return 'japan_blessing';
      if (hash === 'god-blessing') return 'god_blessing';
      return hash as AppTab;
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
      <header className="relative z-20 border-b border-amber-500/30 bg-slate-950/90 backdrop-blur-2xl sticky top-0 shadow-2xl shadow-purple-950/80">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer bg-transparent border-0 text-left p-0 w-full md:w-auto justify-center md:justify-start active:scale-[0.98] transition-transform"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-600 to-purple-600 p-[1.5px] shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-extrabold gold-gradient-text m-0 tracking-tight font-cinzel-decorative leading-tight truncate">
                ทำนายโชคชะตา
              </h1>
              <p className="text-[10px] sm:text-[11px] text-amber-200/70 m-0 font-medium truncate max-w-[250px] sm:max-w-none">
                FORTUNE PREDICTION • ไพ่ยิปซี เซียมซี และขอพรเทพเจ้า
              </p>
            </div>
          </button>

          {/* Navigation Dropdown & Quick Navigation */}
          <nav className="w-full md:w-auto flex items-center justify-center">
            <div className="relative w-full sm:w-auto inline-flex items-center">
              <select
                value={activeTab}
                onChange={(e) => navigateTo(e.target.value as AppTab)}
                aria-label="เลือกเมนูพยากรณ์"
                className="w-full sm:w-auto appearance-none bg-slate-900/95 border border-amber-500/30 text-slate-100 text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2 sm:py-2.5 pr-9 sm:pr-10 shadow-inner cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/60 transition-all duration-200 hover:border-amber-500/60 hover:bg-slate-800/90 active:scale-[0.99]"
              >
                <option value="home">✨ หน้าหลัก</option>
                <option value="reading">🧭 ไพ่ยิปซี Major Arcana</option>
                <option value="birth_fortune">🎂 ดูดวงวันเดือนปีเกิด</option>
                <option value="omikuji">⛩️ เซียมซีญี่ปุ่น (おみくじ)</option>
                <option value="thai_siamsi">📜 เซียมซีไทย ๒๘ ใบ</option>
                <option value="thai_blessing">🔥 ขอพรเทพเจ้าไทย</option>
                <option value="japan_blessing">🏛️ ขอพรเทพเจ้าญี่ปุ่น (絵馬)</option>
                <option value="god_blessing">✝️ ขอพรพระเจ้า (Prayer)</option>
                <option value="encyclopedia">📖 สารานุกรมไพ่ยิปซี</option>
              </select>
              {/* Custom chevron */}
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 text-xs sm:text-sm">
                ▾
              </span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-8 flex-1 w-full space-y-6 sm:space-y-8">
        {activeTab === 'home' && <MainPage onNavigate={(tab) => navigateTo(tab)} />}
        {activeTab === 'reading' && <TarotReadingPage />}
        {activeTab === 'birth_fortune' && <BirthFortunePage />}
        {activeTab === 'omikuji' && <OmikujiPage />}
        {activeTab === 'thai_siamsi' && <ThaiSiamsiPage />}
        {activeTab === 'thai_blessing' && <ThaiBlessingPage />}
        {activeTab === 'japan_blessing' && <JapanBlessingPage />}
        {activeTab === 'god_blessing' && <GodBlessingPage />}
        {activeTab === 'encyclopedia' && <EncyclopediaPage />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-900/30 bg-slate-950/90 py-5 sm:py-6 px-4 text-center text-xs text-purple-300/60 mt-auto pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <p className="max-w-xl mx-auto leading-relaxed">
          © 2026 ทำนายโชคชะตา (Fortune Prediction) • ดูดวงไพ่ยิปซี เซียมซี และขอพรเทพเจ้าเพื่อนำทางชีวิตด้วยสติและปัญญา
        </p>
      </footer>
    </div>
  );
};

export default App;
