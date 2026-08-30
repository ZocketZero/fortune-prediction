import React, { useState, useEffect, useMemo } from 'react';
import { TAROT_CARDS } from '../data/tarotCards';
import type { TarotCard, CardInterpretation } from '../data/tarotCards';
import {
  Sparkles,
  Calendar,
  Heart,
  Briefcase,
  Coins,
  Activity,
  HelpCircle,
  Shuffle,
  RotateCcw,
  Eye,
  Zap,
  Shield,
  Flame,
  CheckCircle2,
  Dices,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { getStorageWithTTL, setStorageWithTTL, removeStorage } from '../utils/storage';

type ReadingType = 'daily' | 'monthly' | 'yearly';

interface StoredTarotResult {
  readingType: ReadingType;
  selectedCardIds: number[];
  selectedCategory: keyof CardInterpretation | 'all';
}

const TAROT_STORAGE_KEY = 'fortune_tarot_result';

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

export const TarotReadingPage: React.FC = () => {
  // Initialize state from storage if available
  const [readingType, setReadingType] = useState<ReadingType>(() => {
    const saved = getStorageWithTTL<StoredTarotResult>(TAROT_STORAGE_KEY);
    return saved?.readingType || 'daily';
  });
  const [selectedCategory, setSelectedCategory] = useState<keyof CardInterpretation | 'all'>(() => {
    const saved = getStorageWithTTL<StoredTarotResult>(TAROT_STORAGE_KEY);
    return saved?.selectedCategory || 'all';
  });

  // Deck State
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>(() => {
    const saved = getStorageWithTTL<StoredTarotResult>(TAROT_STORAGE_KEY);
    return saved?.selectedCardIds || [];
  });
  const [isRevealed, setIsRevealed] = useState<boolean>(() => {
    const saved = getStorageWithTTL<StoredTarotResult>(TAROT_STORAGE_KEY);
    return Boolean(saved && saved.selectedCardIds && saved.selectedCardIds.length > 0);
  });
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  const cardsToDrawCount = readingType === 'daily' ? 1 : readingType === 'monthly' ? 3 : 4;

  // Initialize and shuffle deck
  const shuffleDeck = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random());
      setDeck(shuffled);
      setIsShuffling(false);
    }, 600);
  };

  useEffect(() => {
    shuffleDeck();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#c084fc', '#f472b6', '#38bdf8', '#fbbf24']
    });
  };

  // Switch timeframe handler
  const handleSelectReadingType = (type: ReadingType) => {
    setReadingType(type);
    setSelectedCardIds([]);
    setIsRevealed(false);
    removeStorage(TAROT_STORAGE_KEY);
  };

  // Card picking handler
  const handleToggleCardPick = (cardId: number) => {
    if (isRevealed || isShuffling) return;

    if (selectedCardIds.includes(cardId)) {
      // Deselect card
      setSelectedCardIds(selectedCardIds.filter((id) => id !== cardId));
    } else {
      // Pick card if quota not full
      if (selectedCardIds.length < cardsToDrawCount) {
        setSelectedCardIds([...selectedCardIds, cardId]);
      }
    }
  };

  // Auto-pick remaining cards
  const handleAutoPick = () => {
    if (isRevealed || isShuffling) return;
    const remainingSlots = cardsToDrawCount - selectedCardIds.length;
    if (remainingSlots <= 0) return;

    const unselected = deck.filter((card) => !selectedCardIds.includes(card.id));
    const randomPicks = [...unselected].sort(() => 0.5 - Math.random()).slice(0, remainingSlots);
    const newSelected = [...selectedCardIds, ...randomPicks.map((c) => c.id)];
    setSelectedCardIds(newSelected);
  };

  // Reset current selection
  const handleResetSelection = () => {
    setSelectedCardIds([]);
    setIsRevealed(false);
    removeStorage(TAROT_STORAGE_KEY);
  };

  // Reveal cards
  const handleRevealCards = () => {
    if (selectedCardIds.length !== cardsToDrawCount || isShuffling) return;
    setIsRevealed(true);
    triggerConfetti();

    // Persist result to localStorage with 1-day TTL
    setStorageWithTTL<StoredTarotResult>(TAROT_STORAGE_KEY, {
      readingType,
      selectedCardIds,
      selectedCategory,
    });

    // Scroll smoothly to results after brief delay
    setTimeout(() => {
      const el = document.getElementById('results-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  // Resolved drawn cards in selected order
  const drawnCards = useMemo(() => {
    return selectedCardIds
      .map((id) => TAROT_CARDS.find((c) => c.id === id))
      .filter((c): c is TarotCard => c !== undefined);
  }, [selectedCardIds]);

  const getPositionLabel = (index: number, type: ReadingType) => {
    if (type === 'daily') return '✨ ไพ่ประจำวันของคุณ';
    if (type === 'monthly') {
      const labels = ['📜 ใบที่ 1: อดีต & รากฐาน', '🔮 ใบที่ 2: ปัจจุบัน & สถานการณ์หลัก', '🚀 ใบที่ 3: อนาคต & แนวโน้ม'];
      return labels[index] || `ไพ่ใบที่ ${index + 1}`;
    }
    if (type === 'yearly') {
      const labels = ['🌱 ไตรมาส 1 (ม.ค. - มี.ค.)', '☀️ ไตรมาส 2 (เม.ย. - มิ.ย.)', '🍂 ไตรมาส 3 (ก.ค. - ก.ย.)', '❄️ ไตรมาส 4 (ต.ค. - ธ.ค.)'];
      return labels[index] || `ไตรมาส ${index + 1}`;
    }
    return `ไพ่ใบที่ ${index + 1}`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Hero / Banner */}
      <div className="text-center space-y-2.5 sm:space-y-3 py-1 sm:py-2">
        <span className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-slate-900/90 border border-amber-500/40 text-amber-300 shadow-md">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> ศาสตร์แห่งไพ่ยิปซีโบราณ Major Arcana 22 ใบ
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mystic-gradient-text tracking-wide leading-tight px-1">
          ตั้งจิตอธิษฐานแล้วเลือกไพ่ด้วยตัวคุณเอง
        </h2>
        <p className="text-xs sm:text-sm text-slate-300/80 max-w-xl mx-auto leading-relaxed px-2">
          ทำจิตใจให้สงบ นึกถึงเรื่องที่ต้องการคำตอบ แล้วคลิกเลือกไพ่ที่ดึงดูดสายตาคุณมากที่สุดจากสำรับ 22 ใบด้านล่าง
        </p>
      </div>

      {/* Step 1: Timeframe Selection */}
      <section className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <h3 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2 font-cinzel">
          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
          ขั้นตอนที่ 1: เลือกช่วงเวลาทำนายดวง
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { id: 'daily', title: 'ดวงรายวัน (1 ใบ)', desc: 'เลือกไพ่ 1 ใบ ดูพลังงานประจำวันและคำแนะนำกระทันหัน', count: '1 Card' },
            { id: 'monthly', title: 'ดวงรายเดือน (3 ใบ)', desc: 'เลือกไพ่ 3 ใบ สะท้อนรากฐานอดีต ปัจจุบัน และแนวโน้มอนาคต', count: '3 Cards' },
            { id: 'yearly', title: 'ดวงรายปี (4 ใบ)', desc: 'เลือกไพ่ 4 ใบ ทำนายภาพรวมชีวิต 4 ไตรมาส ตลอดทั้งปี', count: '4 Cards' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => handleSelectReadingType(type.id as ReadingType)}
              className={`group text-left p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden active:scale-[0.99] ${
                readingType === type.id
                  ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-purple-950/60 border-amber-400 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400/50'
                  : 'bg-slate-950/50 border-purple-900/30 hover:border-amber-500/40 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex justify-between items-start mb-2 gap-2">
                <span className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-amber-300 transition-colors">{type.title}</span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 shrink-0">
                  {type.count}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed m-0">{type.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Step 2: Category Filter */}
      <section className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
        <h3 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2 font-cinzel">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          ขั้นตอนที่ 2: เลือกด้านที่ต้องการเจาะลึก
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={String(cat.id)}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-center transition-all duration-300 cursor-pointer active:scale-[0.97] ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-b from-amber-950/60 to-purple-950/80 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-slate-950/40 border-purple-900/30 text-slate-300 hover:bg-slate-900/60 hover:border-amber-500/40'
              }`}
            >
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 mb-1.5 sm:mb-2 border border-amber-500/30 shadow-inner">
                {cat.icon}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-200">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Step 3: Interactive Card Tray & Chosen Slots */}
      <section className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-purple-900/40">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 font-cinzel">
              <Layers className="w-4 h-4 text-amber-400 shrink-0" />
              ตำแหน่งไพ่ที่เลือก ({selectedCardIds.length}/{cardsToDrawCount} ใบ)
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              {selectedCardIds.length === cardsToDrawCount
                ? '✨ เลือกครบตามจำนวนแล้ว กดปุ่ม "เปิดคำทำนายดวงชะตา" ด้านล่างเพื่อดูผลคำพยากรณ์'
                : `🔮 กรุณาคลิกเลือกไพ่จากสำรับ 22 ใบด้านล่างอีก ${cardsToDrawCount - selectedCardIds.length} ใบ`}
            </p>
          </div>

          {/* Deck Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={shuffleDeck}
              disabled={isShuffling}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-purple-700/60 hover:border-amber-400/60 text-xs font-bold text-amber-200 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
              สับไพ่ใหม่
            </button>
            {selectedCardIds.length < cardsToDrawCount && (
              <button
                onClick={handleAutoPick}
                disabled={isShuffling}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 hover:border-purple-400 text-xs font-bold text-purple-200 transition-all cursor-pointer active:scale-95"
              >
                <Dices className="w-3.5 h-3.5 text-purple-300" />
                สุ่มให้อัตโนมัติ
              </button>
            )}
            {selectedCardIds.length > 0 && (
              <button
                onClick={handleResetSelection}
                disabled={isShuffling}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-red-900/50 hover:border-red-500/60 text-xs font-bold text-red-300 transition-all cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                เริ่มใหม่
              </button>
            )}
          </div>
        </div>

        {/* Chosen Slots Representation */}
        <div className={`grid gap-3 sm:gap-4 ${cardsToDrawCount === 1 ? 'max-w-xs mx-auto' : cardsToDrawCount === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
          {Array.from({ length: cardsToDrawCount }).map((_, idx) => {
            const cardId = selectedCardIds[idx];
            const card = cardId !== undefined ? TAROT_CARDS.find((c) => c.id === cardId) : null;

            return (
              <div
                key={idx}
                className={`relative rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[190px] text-center transition-all duration-300 border ${
                  card
                    ? 'bg-gradient-to-b from-purple-950/60 to-slate-950 border-amber-400/70 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/40 border-dashed border-purple-800/40'
                }`}
              >
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-300/90 mb-2 sm:mb-3 px-2 sm:px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-amber-500/30 max-w-full truncate">
                  {getPositionLabel(idx, readingType)}
                </span>

                {card ? (
                  <div className="flex flex-col items-center space-y-1.5 sm:space-y-2 animate-fadeIn">
                    {isRevealed ? (
                      <div
                        className="w-16 h-24 sm:w-20 sm:h-32 rounded-xl p-1 border-2 shadow-xl bg-slate-950 overflow-hidden"
                        style={{ borderColor: card.color }}
                      >
                        <img src={card.imageUrl} alt={card.nameTh} className="w-full h-full object-cover rounded-lg" />
                      </div>
                    ) : (
                      <div className="w-16 h-24 sm:w-20 sm:h-32 rounded-xl tarot-card-back flex flex-col items-center justify-center p-2 shadow-xl">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />
                        <span className="text-[9px] sm:text-[10px] font-mono text-amber-300/80 font-bold mt-1">ใบที่ {idx + 1}</span>
                      </div>
                    )}

                    <div className="text-center">
                      <span className="text-[11px] sm:text-xs font-bold text-amber-200 block line-clamp-1">
                        {isRevealed ? card.nameTh : `เลือกใบที่ ${idx + 1} แล้ว`}
                      </span>
                      {!isRevealed && (
                        <button
                          onClick={() => handleToggleCardPick(card.id)}
                          className="text-[10px] text-red-400 hover:text-red-300 underline cursor-pointer mt-0.5"
                        >
                          เปลี่ยนใบนี้
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2 py-3 sm:py-4 text-slate-500">
                    <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl border border-dashed border-purple-700/40 flex items-center justify-center bg-slate-900/30">
                      <Sparkles className="w-4 h-4 text-purple-400/40" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">คลิกเลือกไพ่ด้านล่าง</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reveal Action Button */}
        {selectedCardIds.length === cardsToDrawCount && !isRevealed && (
          <div className="text-center pt-2">
            <button
              onClick={handleRevealCards}
              className="group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4.5 rounded-2xl btn-gold-shimmer text-slate-950 font-black text-base sm:text-lg tracking-wide shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer border border-amber-200/50"
            >
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 animate-bounce shrink-0" />
              เปิดคำทำนายดวงชะตา ({cardsToDrawCount} ใบ)
            </button>
          </div>
        )}
      </section>

      {/* Step 4: The 22 Tarot Cards Spread (Deck) */}
      <section className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 font-cinzel">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              สำรับไพ่ยิปซี Major Arcana 22 ใบ (คลิกที่ไพ่เพื่อเลือก)
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              เลือกไพ่ที่ท่านรู้สึกมีพลังงานเชื่อมโยงที่สุด
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 font-bold">
              เลือกแล้ว {selectedCardIds.length} จาก {cardsToDrawCount} ใบ
            </span>
          </div>
        </div>

        {/* 22 Cards Grid Layout */}
        <div
          className={`grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-11 gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-950/60 border border-purple-900/40 ${
            isShuffling ? 'card-shuffling' : ''
          }`}
        >
          {deck.map((card, index) => {
            const pickIndex = selectedCardIds.indexOf(card.id);
            const isSelected = pickIndex !== -1;
            const canSelectMore = selectedCardIds.length < cardsToDrawCount;

            return (
              <button
                key={card.id}
                onClick={() => handleToggleCardPick(card.id)}
                disabled={isRevealed || isShuffling || (!isSelected && !canSelectMore)}
                title={isSelected ? `คลิกเพื่อยกเลิกการเลือกไพ่ใบที่ ${pickIndex + 1}` : `คลิกเพื่อเลือกไพ่ใบนี้`}
                className={`group relative flex flex-col items-center justify-center rounded-xl p-0.5 sm:p-1 transition-all duration-300 cursor-pointer active:scale-95 ${
                  isSelected
                    ? '-translate-y-1 sm:-translate-y-2 scale-105 ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 shadow-xl shadow-amber-500/30'
                    : canSelectMore && !isRevealed
                    ? 'hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                {/* Card Body */}
                <div className="w-full aspect-[2/3] rounded-xl tarot-card-back flex flex-col items-center justify-between p-1.5 sm:p-2 relative overflow-hidden">
                  {/* Decorative Corner Ornaments */}
                  <div className="absolute top-1 left-1 text-[7px] sm:text-[8px] text-amber-400/60 font-serif">✦</div>
                  <div className="absolute top-1 right-1 text-[7px] sm:text-[8px] text-amber-400/60 font-serif">✦</div>
                  <div className="absolute bottom-1 left-1 text-[7px] sm:text-[8px] text-amber-400/60 font-serif">✦</div>
                  <div className="absolute bottom-1 right-1 text-[7px] sm:text-[8px] text-amber-400/60 font-serif">✦</div>

                  <span className="text-[8px] sm:text-[9px] font-mono font-bold text-amber-300/60">
                    {index + 1}
                  </span>

                  {/* Center Icon */}
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900/90 border border-amber-500/40 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                  </div>

                  <span className="text-[7px] sm:text-[8px] font-serif text-amber-400/70 tracking-widest uppercase">TAROT</span>

                  {/* Selection Badge Indicator */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-amber-950/80 backdrop-blur-[1px] flex flex-col items-center justify-center p-1 border-2 border-amber-400 rounded-xl z-10 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mb-0.5" />
                      <span className="text-[9px] sm:text-[10px] font-bold text-amber-200">
                        ใบที่ {pickIndex + 1}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Results Display */}
      {isRevealed && drawnCards.length > 0 && (
        <section id="results-section" className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 animate-fadeIn">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1 rounded-full bg-purple-950/80 border border-amber-400/40 text-amber-300 text-[11px] sm:text-xs font-bold shadow-md">
              <Eye className="w-3.5 h-3.5" /> ผลคำทำนายของคุณเรียบร้อยแล้ว
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold gold-gradient-text">
              คำทำนายดวงชะตาราย{readingType === 'daily' ? 'วัน' : readingType === 'monthly' ? 'เดือน' : 'ปี'}
            </h3>
          </div>

          <div className={`grid gap-4 sm:gap-6 ${drawnCards.length === 1 ? 'max-w-md mx-auto' : drawnCards.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
            {drawnCards.map((card: TarotCard, idx: number) => (
              <div
                key={card.id}
                className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-amber-500/30 hover:border-amber-400/80 transition-all duration-500 group hover:-translate-y-1 sm:hover:-translate-y-2"
              >
                {/* Position Tag Header */}
                <div className="bg-gradient-to-r from-amber-950/80 via-purple-950 to-amber-950/80 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-amber-500/30 text-center text-xs font-bold text-amber-300 tracking-wider font-cinzel">
                  {getPositionLabel(idx, readingType)}
                </div>

                {/* Card Graphic Frame */}
                <div className="p-4 sm:p-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 border-b border-purple-900/40 relative">
                  <div className="absolute top-2 right-3 text-[10px] font-mono font-bold text-amber-400/70">
                    #{card.id < 10 ? `0${card.id}` : card.id}
                  </div>

                  {/* Tarot Card Object */}
                  <div
                    className="w-32 h-48 sm:w-36 sm:h-56 rounded-2xl p-1.5 border-2 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-slate-950 flex flex-col animate-cosmicGlow"
                    style={{
                      borderColor: card.color,
                    }}
                  >
                    <img
                      src={card.imageUrl}
                      alt={card.nameTh}
                      className="w-full h-full object-cover rounded-xl shadow-inner"
                    />
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-amber-200 mt-3 sm:mt-4 mb-0.5 text-center font-cinzel">{card.nameTh}</h4>
                  <p className="text-xs text-amber-300/80 mb-2.5 sm:mb-3 font-medium tracking-wide">{card.nameEn} • ธาตุ{card.element}</p>

                  <div className="flex flex-wrap gap-1 justify-center">
                    {card.keywords.map((kw: string, kIdx: number) => (
                      <span key={kIdx} className="text-[10px] bg-slate-900/90 text-amber-200 px-2 sm:px-2.5 py-0.5 rounded-full border border-amber-500/30 font-medium">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interpretation Details */}
                <div className="p-4 sm:p-5 flex-1 space-y-3 sm:space-y-4 text-xs text-slate-200 leading-relaxed">
                  {selectedCategory === 'all' ? (
                    <div className="space-y-2.5 sm:space-y-3">
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-purple-900/40">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1 text-xs">
                          <Sparkles className="w-3.5 h-3.5 shrink-0" /> ภาพรวม:
                        </span>
                        <p className="text-slate-300 leading-relaxed m-0">{card.interpretations[readingType].overview}</p>
                      </div>
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-purple-900/40">
                        <span className="font-bold text-blue-400 flex items-center gap-1.5 mb-1 text-xs">
                          <Briefcase className="w-3.5 h-3.5 shrink-0" /> การงาน:
                        </span>
                        <p className="text-slate-300 leading-relaxed m-0">{card.interpretations[readingType].work}</p>
                      </div>
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-purple-900/40">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1 text-xs">
                          <Coins className="w-3.5 h-3.5 shrink-0" /> การเงิน:
                        </span>
                        <p className="text-slate-300 leading-relaxed m-0">{card.interpretations[readingType].finance}</p>
                      </div>
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-purple-900/40">
                        <span className="font-bold text-pink-400 flex items-center gap-1.5 mb-1 text-xs">
                          <Heart className="w-3.5 h-3.5 shrink-0" /> ความรัก:
                        </span>
                        <p className="text-slate-300 leading-relaxed m-0">{card.interpretations[readingType].love}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950/70 p-3.5 sm:p-4 rounded-xl border border-purple-900/50">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-2 text-xs sm:text-sm">
                        {CATEGORIES.find((c) => c.id === selectedCategory)?.icon}
                        คำทำนายด้าน {CATEGORIES.find((c) => c.id === selectedCategory)?.label}:
                      </span>
                      <p className="text-slate-200 leading-relaxed text-xs m-0">
                        {card.interpretations[readingType][selectedCategory]}
                      </p>
                    </div>
                  )}

                  {/* Advice Section */}
                  <div className="pt-2.5 sm:pt-3 border-t border-purple-900/40">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-1 text-xs">
                      <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" /> คำแนะนำเสริมดวง:
                    </span>
                    <p className="text-xs text-amber-200/90 italic font-medium m-0">"{card.interpretations[readingType].advice}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reset or Pick New Button at bottom */}
          <div className="text-center pt-2 sm:pt-4">
            <button
              onClick={handleResetSelection}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 hover:from-purple-800 hover:to-indigo-800 border border-purple-500/50 text-amber-200 font-bold text-xs sm:text-sm shadow-xl cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              เลือกไพ่ใหม่ / ทำนายอีกครั้ง
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default TarotReadingPage;
