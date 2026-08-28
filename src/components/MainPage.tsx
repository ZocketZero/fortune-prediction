import React from 'react';
import { Compass, Scroll, BookOpen, ArrowRight } from 'lucide-react';

interface MainPageProps {
  onNavigate: (tab: 'reading' | 'omikuji' | 'thai_siamsi' | 'encyclopedia') => void;
}

const CARDS = [
  {
    id: 'reading' as const,
    icon: <Compass className="w-5 h-5" />,
    title: 'ไพ่ยิปซี',
    desc: 'ทำนายดวงด้วย Major Arcana 22 ใบ รายวัน รายเดือน รายปี',
    accent: 'border-amber-500/40 hover:border-amber-400/70',
    iconColor: 'text-amber-400',
  },
  {
    id: 'omikuji' as const,
    icon: <span className="text-lg leading-none">⛩️</span>,
    title: 'เซียมซีญี่ปุ่น',
    desc: 'เขย่ากระบอก สุ่มใบเซียมซีตามธรรมเนียมศาลเจ้าญี่ปุ่น',
    accent: 'border-red-500/40 hover:border-red-400/70',
    iconColor: 'text-red-400',
  },
  {
    id: 'thai_siamsi' as const,
    icon: <Scroll className="w-5 h-5" />,
    title: 'เซียมซีไทย ๒๘ ใบ',
    desc: 'เสี่ยงทายเซียมซีโบราณ พร้อมบทกลอนและคำทำนาย',
    accent: 'border-yellow-500/40 hover:border-yellow-400/70',
    iconColor: 'text-yellow-400',
  },
  {
    id: 'encyclopedia' as const,
    icon: <BookOpen className="w-5 h-5" />,
    title: 'สารานุกรมไพ่',
    desc: 'อ่านความหมายเชิงลึกของไพ่ยิปซีทุกใบ',
    accent: 'border-indigo-500/40 hover:border-indigo-400/70',
    iconColor: 'text-indigo-400',
  },
];

export const MainPage: React.FC<MainPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 gap-12">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-lg">
        <p className="text-xs text-slate-500 tracking-widest uppercase font-medium">Fortune Prediction</p>
        <h1 className="text-5xl sm:text-6xl font-black gold-gradient-text leading-tight">
          ทำนายโชคชะตา
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          ตั้งจิตอธิษฐาน สงบใจ แล้วเลือกศาสตร์พยากรณ์ที่ดึงดูดใจคุณ
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`group flex items-center gap-4 p-5 rounded-2xl bg-slate-950/60 border transition-all duration-200 cursor-pointer hover:bg-slate-900/80 hover:-translate-y-0.5 text-left ${card.accent}`}
          >
            <span className={`shrink-0 ${card.iconColor}`}>{card.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-slate-100">{card.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{card.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};
