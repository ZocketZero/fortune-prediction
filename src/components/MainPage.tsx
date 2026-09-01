import React from 'react';
import { Compass, Scroll, BookOpen, ArrowRight, Flame, Landmark } from 'lucide-react';
import type { AppTab } from '../App';

interface MainPageProps {
  onNavigate: (tab: AppTab) => void;
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
    id: 'thai_blessing' as const,
    icon: <Flame className="w-5 h-5" />,
    title: 'ขอพรเทพเจ้าไทย',
    desc: 'อธิษฐานจิต สวดคาถาบูชา พระพิฆเนศ ท้าวเวสสุวรรณ พระแม่ลักษมี ฯลฯ',
    accent: 'border-orange-500/40 hover:border-orange-400/70',
    iconColor: 'text-orange-400',
  },
  {
    id: 'japan_blessing' as const,
    icon: <Landmark className="w-5 h-5" />,
    title: 'ขอพรเทพเจ้าญี่ปุ่น',
    desc: 'เขียนแผ่นป้ายเอมะ (繪馬) สั่นกระดิ่งศาลเจ้า รับสาส์นพรมงคลชินโต',
    accent: 'border-rose-500/40 hover:border-rose-400/70',
    iconColor: 'text-rose-400',
  },
  {
    id: 'god_blessing' as const,
    icon: <span className="text-lg leading-none">✝️</span>,
    title: 'ขอพรพระเจ้า',
    desc: 'จุดเทียนอธิษฐานศักดิ์สิทธิ์ สวดบทข้าแต่พระบิดา รับพระพรแห่งพระสัญญา',
    accent: 'border-amber-400/50 hover:border-amber-300/80',
    iconColor: 'text-amber-300',
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh] px-1 sm:px-4 gap-6 sm:gap-10">
      {/* Hero */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-lg">
        <p className="text-[10px] sm:text-xs text-slate-400 tracking-widest uppercase font-medium">
          Fortune Prediction & Deity Blessings
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black gold-gradient-text leading-tight tracking-tight">
          ทำนายโชคชะตา
        </h1>
        <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed px-2">
          ตั้งจิตอธิษฐาน สงบใจ แล้วเลือกศาสตร์พยากรณ์หรือขอพรเทพเจ้าที่ดึงดูดใจคุณ
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 w-full max-w-4xl">
        {CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`group flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-slate-950/70 border transition-all duration-200 cursor-pointer hover:bg-slate-900/80 hover:-translate-y-0.5 active:scale-[0.98] text-left shadow-lg ${card.accent}`}
          >
            <div className={`shrink-0 p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 ${card.iconColor}`}>
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm sm:text-base text-slate-100">{card.title}</p>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2">{card.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};
