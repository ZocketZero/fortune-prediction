import React, { useState } from 'react';
import { TAROT_CARDS } from './data/tarotCards';
import type { TarotCard, CardInterpretation } from './data/tarotCards';
import { Sparkles, Calendar, Heart, Briefcase, Coins, Activity, HelpCircle, Shuffle, RotateCcw, Compass, BookOpen, Eye, Zap, Shield, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

type ReadingType = 'daily' | 'monthly' | 'yearly';

interface CategoryOption {
  id: keyof CardInterpretation | 'all';
  label: string;
  icon: React.ReactNode;
  description: string;
  badgeColor: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'ภาพรวมทั้งหมด', icon: <Sparkles className="w-4 h-4 text-amber-400" />, description: 'อ่านดวงชะตารวมทุกมิติชีวิต', badgeColor: 'from-amber-500/20 to-purple-500/20 border-amber-500/30 text-amber-300' },
  { id: 'work', label: 'การงาน & อาชีพ', icon: <Briefcase className="w-4 h-4 text-blue-400" />, description: 'เจาะลึกทิศทางการงาน ความสำเร็จ', badgeColor: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300' },
  { id: 'finance', label: 'การเงิน & โชคลาภ', icon: <Coins className="w-4 h-4 text-emerald-400" />, description: 'รายรับ รายจ่าย โชคลาภ', badgeColor: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300' },
  { id: 'love', label: 'ความรัก & ความสัมพันธ์', icon: <Heart className="w-4 h-4 text-pink-400" />, description: 'สถานะหัวใจ คนโสดและคนมีคู่', badgeColor: 'from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-300' },
  { id: 'health', label: 'สุขภาพ & พลังกายใจ', icon: <Activity className="w-4 h-4 text-cyan-400" />, description: 'การดูแลตนเองและพลังชีวิต', badgeColor: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300' },
  { id: 'advice', label: 'คำแนะนำจากไพ่', icon: <HelpCircle className="w-4 h-4 text-purple-400" />, description: 'แนวทางปฏิบัติเสริมดวงชะตา', badgeColor: 'from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-300' },
];

export const App: React.FC = () => {
  const [readingType, setReadingType] = useState<ReadingType>('daily');
  const [selectedCategory, setSelectedCategory] = useState<keyof CardInterpretation | 'all'>('all');
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'reading' | 'encyclopedia'>('reading');
  const [selectedEncyclopediaCard, setSelectedEncyclopediaCard] = useState<TarotCard | null>(null);

  const cardsToDrawCount = readingType === 'daily' ? 1 : readingType === 'monthly' ? 3 : 4;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#c084fc', '#f472b6', '#38bdf8']
    });
  };

  const handleDrawCards = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    setDrawnCards([]);

    setTimeout(() => {
      const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, cardsToDrawCount);
      setDrawnCards(selected);
      setIsShuffling(false);
      triggerConfetti();
    }, 1300);
  };

  const getPositionLabel = (index: number, type: ReadingType) => {
    if (type === 'daily') return '✨ ไพ่ประจำวันของคุณ';
    if (type === 'monthly') {
      const labels = ['📜 ใบที่ 1: อดีต & รากฐาน', '🔮 ใบที่ 2: ปัจจุบัน & สถานการณ์หลัก', '🚀 ใบที่ 3: อนาคต & แนวโน้ม'];
      return labels[index];
    }
    if (type === 'yearly') {
      const labels = ['🌱 ไตรมาส 1 (ม.ค. - มี.ค.)', '☀️ ไตรมาส 2 (เม.ย. - มิ.ย.)', '🍂 ไตรมาส 3 (ก.ค. - ก.ย.)', '❄️ ไตรมาส 4 (ต.ค. - ธ.ค.)'];
      return labels[index];
    }
    return `ไพ่ใบที่ ${index + 1}`;
  };

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
      <header className="relative z-20 border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-xl sticky top-0 shadow-2xl shadow-purple-950/50">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-600 to-pink-500 p-[1.5px] shadow-lg shadow-purple-900/40">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold gold-gradient-text m-0 tracking-tight">
                ยิปซีพยากรณ์
              </h1>
              <p className="text-[11px] text-purple-300/80 m-0 font-medium">Gypsy Tarot Oracle • ดูดวงไพ่ยิปซีออนไลน์แม่นยำ</p>
            </div>
          </div>

          {/* Navigation Tab */}
          <nav className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-purple-500/20 shadow-inner">
            <button
              onClick={() => setActiveTab('reading')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'reading'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/50 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              เปิดดวงทำนาย
            </button>
            <button
              onClick={() => setActiveTab('encyclopedia')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'encyclopedia'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/50 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              สารานุกรมไพ่ 22 ใบ
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {activeTab === 'reading' ? (
          <div className="space-y-8">
            {/* Hero / Banner */}
            <div className="text-center space-y-2 py-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 border border-purple-500/30 text-purple-300 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> ศาสตร์แห่งไพ่ยิปซีโบราณ Major Arcana
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold mystic-gradient-text">
                ตั้งจิตอธิษฐานแล้วเปิดไพ่ไขโชคชะตา
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                เลือกช่วงเวลาที่ต้องการทำนาย น้อมรับคำเตือน สติ และพลังงานบวกเพื่อนำทางชีวิต
              </p>
            </div>

            {/* Step 1: Timeframe */}
            <section className="glass-panel rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                ขั้นตอนที่ 1: เลือกช่วงเวลาทำนายดวง
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'daily', title: 'ดวงรายวัน (1 ใบ)', desc: 'เปิดไพ่ 1 ใบ ดูพลังงานประจำวันและคำแนะนำกระทันหัน', count: '1 Card' },
                  { id: 'monthly', title: 'ดวงรายเดือน (3 ใบ)', desc: 'สะท้อนรากฐานอดีต สถานะปัจจุบัน และแนวโน้มอนาคตในเดือนนี้', count: '3 Cards' },
                  { id: 'yearly', title: 'ดวงรายปี (4 ใบ)', desc: 'ทำนายภาพรวมชีวิต 4 ไตรมาส ตลอดทั้งปี 12 เดือน', count: '4 Cards' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setReadingType(type.id as ReadingType);
                      setDrawnCards([]);
                    }}
                    className={`group text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                      readingType === type.id
                        ? 'bg-gradient-to-br from-purple-900/60 via-slate-900 to-indigo-950/80 border-amber-400/80 shadow-xl shadow-purple-950/80 ring-1 ring-amber-400/50'
                        : 'bg-slate-950/50 border-purple-900/30 hover:border-purple-600/50 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-base text-slate-100 group-hover:text-amber-300 transition-colors">{type.title}</span>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-purple-950 border border-purple-800/60 text-purple-300">
                        {type.count}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed m-0">{type.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2: Category Filter */}
            <section className="glass-panel rounded-3xl p-6 shadow-2xl">
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                ขั้นตอนที่ 2: เลือกด้านที่ต้องการเจาะลึก
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={String(cat.id)}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all duration-300 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-b from-purple-900/80 to-slate-900 border-amber-400 shadow-lg shadow-purple-950/60 scale-[1.03]'
                        : 'bg-slate-950/40 border-purple-900/30 text-slate-300 hover:bg-slate-900/60 hover:border-purple-700/50'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-slate-900/90 mb-2 border border-purple-900/50 shadow-inner">
                      {cat.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-200">{cat.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Draw Action Button */}
            <div className="text-center py-4 space-y-3">
              <button
                onClick={handleDrawCards}
                disabled={isShuffling}
                className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-pink-600 text-white font-extrabold text-lg shadow-2xl shadow-purple-950 hover:shadow-purple-900/80 hover:scale-[1.03] active:scale-95 transition-all duration-300 disabled:opacity-50 cursor-pointer border border-amber-300/30"
              >
                {isShuffling ? (
                  <>
                    <RotateCcw className="w-6 h-6 animate-spin text-amber-300" />
                    กำลังสับไพ่และตั้งจิตอธิษฐาน...
                  </>
                ) : (
                  <>
                    <Shuffle className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700 text-amber-300" />
                    {drawnCards.length > 0 ? 'เปิดไพ่ทำนายใหม่อีกครั้ง' : `เริ่มทำนายดวง (${cardsToDrawCount} ใบ)`}
                  </>
                )}
              </button>
              <p className="text-xs text-purple-300/70 font-medium">✨ นึกถึงชื่อ-นามสกุล และเรื่องที่ต้องการคำตอบ แล้วกดปุ่มเพื่อเปิดไพ่</p>
            </div>

            {/* Results Display */}
            {drawnCards.length > 0 && (
              <section className="space-y-8 pt-4">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-950/80 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-md">
                    <Eye className="w-3.5 h-3.5" /> ผลคำทำนายของคุณเรียบร้อยแล้ว
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold gold-gradient-text">
                    คำทำนายดวงชะตาราย{readingType === 'daily' ? 'วัน' : readingType === 'monthly' ? 'เดือน' : 'ปี'}
                  </h3>
                </div>

                <div className={`grid gap-6 ${drawnCards.length === 1 ? 'max-w-md mx-auto' : drawnCards.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
                  {drawnCards.map((card: TarotCard, idx: number) => (
                    <div
                      key={card.id}
                      className="glass-card rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-purple-500/30 hover:border-amber-400/60 transition-all duration-500 group hover:-translate-y-1.5"
                    >
                      {/* Position Tag Header */}
                      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 px-4 py-2.5 border-b border-purple-900/60 text-center text-xs font-bold text-amber-300 tracking-wide">
                        {getPositionLabel(idx, readingType)}
                      </div>

                      {/* Card Graphic Frame */}
                      <div className="p-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 border-b border-purple-900/40 relative">
                        <div className="absolute top-2 right-3 text-[10px] font-mono font-bold text-purple-300/60">
                          #{card.id < 10 ? `0${card.id}` : card.id}
                        </div>

                        {/* Tarot Card Object */}
                        <div
                          className="w-28 h-44 rounded-2xl flex flex-col items-center justify-between p-3.5 border-2 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500"
                          style={{
                            borderColor: card.color,
                            backgroundColor: '#0b0f19',
                            boxShadow: `0 10px 30px -10px ${card.color}60`
                          }}
                        >
                          <div className="text-xs font-extrabold font-mono self-start" style={{ color: card.color }}>
                            {card.romanNumeral}
                          </div>
                          <div className="text-6xl my-auto animate-float">{card.image}</div>
                          <div className="text-[10px] font-bold text-slate-300 text-center line-clamp-1 tracking-wider uppercase">
                            {card.nameEn}
                          </div>
                        </div>

                        <h4 className="text-lg font-bold text-amber-200 mt-4 mb-0.5 text-center">{card.nameTh}</h4>
                        <p className="text-xs text-purple-300/80 mb-3 font-medium">{card.nameEn} (ธาตุ{card.element})</p>

                        <div className="flex flex-wrap gap-1 justify-center">
                          {card.keywords.map((kw: string, kIdx: number) => (
                            <span key={kIdx} className="text-[10px] bg-purple-950/80 text-purple-200 px-2 py-0.5 rounded-full border border-purple-800/50 font-medium">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Interpretation Details */}
                      <div className="p-5 flex-1 space-y-4 text-xs text-slate-200 leading-relaxed">
                        {selectedCategory === 'all' ? (
                          <div className="space-y-3">
                            <div className="bg-slate-950/60 p-3 rounded-xl border border-purple-900/40">
                              <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1 text-xs">
                                <Sparkles className="w-3.5 h-3.5" /> ภาพรวม:
                              </span>
                              <p className="text-slate-300 leading-relaxed m-0">{card.interpretations[readingType].overview}</p>
                            </div>
                            <div className="bg-slate-950/60 p-3 rounded-xl border border-purple-900/40">
                              <span className="font-bold text-blue-400 flex items-center gap-1.5 mb-1 text-xs">
                                <Briefcase className="w-3.5 h-3.5" /> การงาน:
                              </span>
                              <p className="text-slate-300 leading-relaxed m-0">{card.interpretations[readingType].work}</p>
                            </div>
                            <div className="bg-slate-950/60 p-3 rounded-xl border border-purple-900/40">
                              <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1 text-xs">
                                <Coins className="w-3.5 h-3.5" /> การเงิน:
                              </span>
                              <p className="text-slate-300 leading-relaxed m-0">{card.interpretations[readingType].finance}</p>
                            </div>
                            <div className="bg-slate-950/60 p-3 rounded-xl border border-purple-900/40">
                              <span className="font-bold text-pink-400 flex items-center gap-1.5 mb-1 text-xs">
                                <Heart className="w-3.5 h-3.5" /> ความรัก:
                              </span>
                              <p className="text-slate-300 leading-relaxed m-0">{card.interpretations[readingType].love}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-950/70 p-4 rounded-xl border border-purple-900/50">
                            <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-2 text-sm">
                              {CATEGORIES.find((c) => c.id === selectedCategory)?.icon}
                              คำทำนายด้าน {CATEGORIES.find((c) => c.id === selectedCategory)?.label}:
                            </span>
                            <p className="text-slate-200 leading-relaxed text-xs m-0">
                              {card.interpretations[readingType][selectedCategory]}
                            </p>
                          </div>
                        )}

                        {/* Advice Section */}
                        <div className="pt-3 border-t border-purple-900/40">
                          <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-1 text-xs">
                            <Shield className="w-3.5 h-3.5 text-amber-400" /> คำแนะนำเสริมดวง:
                          </span>
                          <p className="text-xs text-amber-200/90 italic font-medium m-0">"{card.interpretations[readingType].advice}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* Encyclopedia Tab */
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold gold-gradient-text">สารานุกรมไพ่ยิปซีชุดใหญ่ (Major Arcana 22 ใบ)</h2>
              <p className="text-xs sm:text-sm text-slate-400">คลิกที่ไพ่แต่ละใบเพื่ออ่านความหมาย สัญลักษณ์ และคำทำนายแบบเจาะลึก</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {TAROT_CARDS.map((card: TarotCard) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedEncyclopediaCard(card)}
                  className="glass-panel hover:border-amber-400/80 rounded-2xl p-4 flex flex-col items-center transition-all duration-300 cursor-pointer hover:scale-105 group"
                >
                  <div
                    className="w-16 h-24 rounded-xl flex flex-col items-center justify-between p-2 border shadow-lg mb-3 bg-slate-950 group-hover:border-amber-400 transition-colors"
                    style={{ borderColor: card.color }}
                  >
                    <span className="text-[10px] font-mono font-bold text-slate-400">{card.romanNumeral}</span>
                    <span className="text-3xl animate-float">{card.image}</span>
                    <span className="text-[8px] font-bold text-slate-400 line-clamp-1">{card.nameEn}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 text-center line-clamp-1">{card.nameTh}</span>
                </button>
              ))}
            </div>

            {/* Modal Detail */}
            {selectedEncyclopediaCard && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-slate-950 border border-purple-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl space-y-6">
                  <button
                    onClick={() => setSelectedEncyclopediaCard(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900 border border-purple-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    ✕
                  </button>

                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div
                      className="w-36 h-56 rounded-2xl flex flex-col items-center justify-between p-4 border-2 shadow-2xl shrink-0"
                      style={{
                        borderColor: selectedEncyclopediaCard.color,
                        backgroundColor: '#0b0f19',
                        boxShadow: `0 10px 35px -10px ${selectedEncyclopediaCard.color}80`
                      }}
                    >
                      <span className="text-sm font-extrabold font-mono" style={{ color: selectedEncyclopediaCard.color }}>
                        {selectedEncyclopediaCard.romanNumeral}
                      </span>
                      <span className="text-6xl">{selectedEncyclopediaCard.image}</span>
                      <span className="text-xs font-bold text-slate-300 text-center tracking-wider uppercase">
                        {selectedEncyclopediaCard.nameEn}
                      </span>
                    </div>

                    <div className="space-y-3 text-center sm:text-left">
                      <h3 className="text-2xl font-extrabold gold-gradient-text">{selectedEncyclopediaCard.nameTh}</h3>
                      <p className="text-xs text-purple-300 font-mono font-medium">{selectedEncyclopediaCard.nameEn} • ธาตุ{selectedEncyclopediaCard.element}</p>
                      <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start pt-1">
                        {selectedEncyclopediaCard.keywords.map((kw: string, i: number) => (
                          <span key={i} className="text-xs bg-purple-950 text-purple-200 px-3 py-1 rounded-full border border-purple-800/60 font-medium">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-purple-900/40">
                    <h4 className="font-bold text-amber-300 flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4" /> คำทำนายตัวอย่างประจำวัน:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-900/90 p-3.5 rounded-xl border border-purple-900/40">
                        <strong className="text-amber-300 block mb-1">ภาพรวม:</strong>
                        <p className="text-slate-300 leading-relaxed">{selectedEncyclopediaCard.interpretations.daily.overview}</p>
                      </div>
                      <div className="bg-slate-900/90 p-3.5 rounded-xl border border-purple-900/40">
                        <strong className="text-blue-400 block mb-1">การงาน:</strong>
                        <p className="text-slate-300 leading-relaxed">{selectedEncyclopediaCard.interpretations.daily.work}</p>
                      </div>
                      <div className="bg-slate-900/90 p-3.5 rounded-xl border border-purple-900/40">
                        <strong className="text-emerald-400 block mb-1">การเงิน:</strong>
                        <p className="text-slate-300 leading-relaxed">{selectedEncyclopediaCard.interpretations.daily.finance}</p>
                      </div>
                      <div className="bg-slate-900/90 p-3.5 rounded-xl border border-purple-900/40">
                        <strong className="text-pink-400 block mb-1">ความรัก:</strong>
                        <p className="text-slate-300 leading-relaxed">{selectedEncyclopediaCard.interpretations.daily.love}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-900/30 bg-slate-950/90 py-6 text-center text-xs text-purple-300/60 mt-auto">
        <p>© 2026 Gypsy Tarot Oracle • ทำนายดวงชะตาส่วนบุคคลด้วยไพ่ยิปซีเพื่อนำทางชีวิตด้วยสติและปัญญา</p>
      </footer>
    </div>
  );
};

export default App;
