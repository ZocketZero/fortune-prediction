import React, { useState, useRef } from 'react';
import {
  OMIKUJI_FORTUNES,
  JAPANESE_SHRINES
} from '../data/omikujiData';
import type { OmikujiFortune, JapaneseShrine } from '../data/omikujiData';
import {
  Sparkles,
  RotateCcw,
  BookOpen,
  Coins,
  Heart,
  Activity,
  Shield,
  Copy,
  Check,
  Compass,
  GraduationCap,
  Users,
  Home,
  Bell,
  CheckCircle2,
  TreePine
} from 'lucide-react';
import { triggerFortuneLight } from '../utils/lightEffects';
import { getStorageWithTTL, setStorageWithTTL, removeStorage } from '../utils/storage';

interface StoredOmikujiResult {
  shrineId: string;
  userWish: string;
  fallenStick: number;
  fortuneNumber: number;
  isTiedToShrine: boolean;
}

const OMIKUJI_STORAGE_KEY = 'fortune_omikuji_result';

export const OmikujiPage: React.FC = () => {
  const initialSaved = getStorageWithTTL<StoredOmikujiResult>(OMIKUJI_STORAGE_KEY);

  const [selectedShrine, setSelectedShrine] = useState<JapaneseShrine>(() => {
    if (initialSaved?.shrineId) {
      const found = JAPANESE_SHRINES.find((s) => s.id === initialSaved.shrineId);
      if (found) return found;
    }
    return JAPANESE_SHRINES[0];
  });
  const [userWish, setUserWish] = useState<string>(() => initialSaved?.userWish || '');
  const [isRingingBell, setIsRingingBell] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [fallenStick, setFallenStick] = useState<number | null>(() => initialSaved?.fallenStick ?? null);
  const [revealedFortune, setRevealedFortune] = useState<OmikujiFortune | null>(() => {
    if (initialSaved?.fortuneNumber) {
      return OMIKUJI_FORTUNES.find((f) => f.number === initialSaved.fortuneNumber) || null;
    }
    return null;
  });
  const [isTiedToShrine, setIsTiedToShrine] = useState<boolean>(() => initialSaved?.isTiedToShrine || false);
  const [isBrowsingAll, setIsBrowsingAll] = useState<boolean>(false);
  const [selectedBrowseSlip, setSelectedBrowseSlip] = useState<OmikujiFortune | null>(null);
  const [filterRank, setFilterRank] = useState<string>('all');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio Synthesizer for Shinto Bell sound (鈴)
  const playSuzuBellSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Shinto bell multi-harmonic metallic ring
      const frequencies = [1200, 1600, 2200, 2800];
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.15 / (i + 1), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.7);
      });
    } catch {
      // Ignore
    }
  };

  // Web Audio Synthesizer for Wooden Omikuji Stick Rattle
  const playWoodenStickSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Sharp wooden clicks of sticks inside cylinder
      for (let i = 0; i < 8; i++) {
        const time = ctx.currentTime + i * 0.15 + (Math.random() * 0.04);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520 + Math.random() * 380, time);
        osc.frequency.exponentialRampToValueAtTime(140, time + 0.04);

        gain.gain.setValueAtTime(0.28, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.05);
      }
    } catch {
      // Ignore
    }
  };

  const triggerOmikujiLight = () => {
    triggerFortuneLight('japan');
  };

  // Ring Shinto Bell
  const handleRingBell = () => {
    setIsRingingBell(true);
    playSuzuBellSound();
    setTimeout(() => setIsRingingBell(false), 1200);
  };

  // Shake Omikuji Cylinder
  const handleShakeCylinder = () => {
    if (isShaking) return;
    setIsShaking(true);
    setFallenStick(null);
    setRevealedFortune(null);
    setIsTiedToShrine(false);

    playWoodenStickSound();

    setTimeout(() => {
      // Pick random stick 1 to 28
      const randomStickNumber = Math.floor(Math.random() * 28) + 1;
      setFallenStick(randomStickNumber);
      setIsShaking(false);

      // Auto reveal after brief drop
      setTimeout(() => {
        const fortune = OMIKUJI_FORTUNES.find((f) => f.number === randomStickNumber) || null;
        setRevealedFortune(fortune);
        triggerOmikujiLight();

        // Save result to localStorage with 1-day TTL
        if (fortune) {
          setStorageWithTTL<StoredOmikujiResult>(OMIKUJI_STORAGE_KEY, {
            shrineId: selectedShrine.id,
            userWish,
            fallenStick: randomStickNumber,
            fortuneNumber: fortune.number,
            isTiedToShrine: false,
          });
        }

        setTimeout(() => {
          const el = document.getElementById('omikuji-result');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 250);
      }, 700);
    }, 1700);
  };

  // Reset
  const handleReset = () => {
    setFallenStick(null);
    setRevealedFortune(null);
    setIsTiedToShrine(false);
    removeStorage(OMIKUJI_STORAGE_KEY);
  };

  // Tie to Shrine
  const handleTieToShrine = () => {
    setIsTiedToShrine(true);
    triggerOmikujiLight();

    if (revealedFortune) {
      setStorageWithTTL<StoredOmikujiResult>(OMIKUJI_STORAGE_KEY, {
        shrineId: selectedShrine.id,
        userWish,
        fallenStick: fallenStick || revealedFortune.number,
        fortuneNumber: revealedFortune.number,
        isTiedToShrine: true,
      });
    }
  };

  // Copy fortune
  const handleCopyFortune = () => {
    if (!revealedFortune) return;
    const text = `⛩️ ใบเซียมซีญี่ปุ่น ${revealedFortune.kanjiNumber} (${selectedShrine.nameTh})\n` +
      `ระดับโชค: ${revealedFortune.rankTh}\n` +
      `ความหมาย: ${revealedFortune.titleTh} (${revealedFortune.titleJp})\n\n` +
      `📜 บทกวีวะกะ (和歌):\n"${revealedFortune.wakaJp}"\n` +
      `คำอ่าน: ${revealedFortune.wakaRomaji}\n` +
      `คำแปล:\n${revealedFortune.wakaTh.join('\n')}\n\n` +
      `✨ ภาพรวมชะตา (総運): ${revealedFortune.overview}\n` +
      `🌟 ความปรารถนา (願望): ${revealedFortune.wish}\n` +
      `🕊️ ข่าวดี/คนที่รอ (待人): ${revealedFortune.personWaiting}\n` +
      `💖 ความรัก (恋愛): ${revealedFortune.love}\n` +
      `💼 การค้า/การเงิน (商売): ${revealedFortune.business}\n` +
      `📚 การเรียน/การสอบ (学問): ${revealedFortune.study}\n` +
      `🩺 สุขภาพ (健康): ${revealedFortune.health}\n` +
      `⛩️ การเดินทาง (旅行): ${revealedFortune.travel}\n` +
      `🍀 เครื่องรางนำโชค (縁起物): ${revealedFortune.luckyItem}\n` +
      `🎨 สีมงคล (吉色): ${revealedFortune.luckyColor} | ทิศมงคล: ${revealedFortune.luckyDirection}\n\n` +
      `— เสี่ยงเซียมซีญี่ปุ่นออนไลน์ ศาลเจ้าชินโต (Jinja Omikuji Oracle)`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const getRankBadgeClass = (rank: string) => {
    switch (rank) {
      case '大吉':
        return 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white border-amber-300 shadow-md shadow-red-500/30';
      case '中吉':
        return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-300 shadow-md';
      case '小吉':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-300 shadow-md';
      case '吉':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-300 shadow-md';
      case '末吉':
        return 'bg-gradient-to-r from-purple-600 to-violet-600 text-white border-purple-300 shadow-md';
      case '凶':
        return 'bg-gradient-to-r from-slate-700 to-zinc-900 text-rose-300 border-rose-500/50 shadow-md';
      default:
        return 'bg-slate-800 text-slate-200 border-slate-600';
    }
  };

  const filteredFortunes = OMIKUJI_FORTUNES.filter((f) => {
    if (filterRank === 'all') return true;
    return f.rankKanji === filterRank;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Banner / Header */}
      <div className="text-center space-y-2.5 sm:space-y-3 py-1 sm:py-2">
        <span className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-red-950/90 border border-red-500/50 text-amber-300 shadow-md">
          <span className="text-sm">⛩️</span> ศาสตร์แห่งการเสี่ยงเซียมซีศาลเจ้าญี่ปุ่น (おみくじ - Omikuji)
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-100 via-orange-200 to-red-400 bg-clip-text text-transparent tracking-wide font-cinzel leading-tight px-1">
          เซียมซีศาลเจ้าญี่ปุ่น (Jinja Omikuji)
        </h2>
        <p className="text-xs sm:text-sm text-slate-300/80 max-w-xl mx-auto leading-relaxed px-2">
          น้อมจิตอธิษฐานต่อเทพเจ้าชินโตและสิ่งศักดิ์สิทธิ์ เขย่ากระบอกไม้เซียมซีหกเหลี่ยมเพื่อเปิดรับคำทำนายและพรมงคล
        </p>
      </div>

      {/* Mode Navigation */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-inner gap-1 w-full sm:w-auto">
          <button
            onClick={() => {
              setIsBrowsingAll(false);
              setSelectedBrowseSlip(null);
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer active:scale-95 ${
              !isBrowsingAll
                ? 'bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 text-white shadow-lg shadow-orange-600/30 scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⛩️</span>
            <span>เสี่ยงเซียมซี</span>
          </button>
          <button
            onClick={() => setIsBrowsingAll(true)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer active:scale-95 ${
              isBrowsingAll
                ? 'bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 text-white shadow-lg shadow-orange-600/30 scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>สารานุกรม ๒๘ ใบ</span>
          </button>
        </div>
      </div>

      {!isBrowsingAll ? (
        <div className="space-y-6 sm:space-y-8">
          {/* Step 1: Select Japanese Shrine */}
          <section className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 font-cinzel">
                <span>⛩️</span>
                ขั้นตอนที่ ๑: เลือกศาลเจ้า & วัดศักดิ์สิทธิ์ของญี่ปุ่น
              </h3>
              <span className="text-[10px] sm:text-[11px] text-amber-200/70 font-mono">神社選択</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {JAPANESE_SHRINES.map((shrine) => (
                <button
                  key={shrine.id}
                  onClick={() => setSelectedShrine(shrine)}
                  className={`text-left p-3.5 sm:p-4.5 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between active:scale-[0.99] ${
                    selectedShrine.id === shrine.id
                      ? 'bg-gradient-to-br from-orange-950/60 via-slate-900 to-red-950/60 border-amber-400 shadow-xl shadow-orange-500/20 ring-1 ring-amber-400/50 scale-[1.02]'
                      : 'bg-slate-950/50 border-purple-900/30 hover:border-orange-500/40 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-sm sm:text-base font-bold text-amber-200 block">{shrine.nameTh}</span>
                        <span className="text-[10px] sm:text-[11px] font-serif text-amber-400/80 font-bold">{shrine.nameJp}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 shrink-0">
                        {shrine.location}
                      </span>
                    </div>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-950/80 text-orange-300 border border-orange-700/50">
                      {shrine.tag}
                    </span>
                    <p className="text-xs text-slate-300/80 leading-relaxed m-0">{shrine.blessingTopic}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: Shinto Bell Ringing & Wish */}
          <section className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 font-cinzel">
                <Bell className="w-4 h-4 text-amber-400 shrink-0" />
                ขั้นตอนที่ ๒: เขย่ากระดิ่งซุซุ & ตั้งจิตอธิษฐาน
              </h3>
              <span className="text-[10px] sm:text-[11px] text-amber-200/70 font-mono">参拝・祈願</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 bg-slate-950/70 p-3.5 sm:p-5 rounded-2xl border border-orange-950/60">
              {/* Interactive Suzu Bell */}
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-orange-950/40 to-slate-950 border border-amber-500/30 shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleRingBell}
                  title="คลิกเพื่อเขย่ากระดิ่งศาลเจ้า"
                  className={`p-2.5 sm:p-3 rounded-full bg-slate-900 border border-amber-400/60 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-amber-500/20 group ${
                    isRingingBell ? 'bell-swinging' : ''
                  }`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 flex items-center justify-center shadow-inner">
                    <span className="text-xl sm:text-2xl">🔔</span>
                  </div>
                </button>
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 mt-2">
                  {isRingingBell ? 'กำลังเขย่ากระดิ่ง...' : 'คลิกเขย่ากระดิ่ง (本坪鈴)'}
                </span>
                <span className="text-[9px] text-slate-400">โค้ง ๒ ปรบมือ ๒ โค้ง ๑</span>
              </div>

              {/* Wish Input */}
              <div className="flex-1 w-full space-y-1.5 sm:space-y-2">
                <label className="text-xs text-slate-200 font-medium block">
                  ระบุชื่อ-นามสกุล หรือเรื่องที่ต้องการขอพรต่อ {selectedShrine.nameJp} (ทางเลือก):
                </label>
                <input
                  type="text"
                  value={userWish}
                  onChange={(e) => setUserWish(e.target.value)}
                  placeholder="เช่น เรื่องสอบเข้ามหาวิทยาลัย, ความรักกับคนรัก, การค้าขายราบรื่น..."
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/90 border border-orange-900/50 focus:border-amber-400 focus:outline-none text-slate-100 text-xs sm:text-sm placeholder:text-slate-600 transition-colors"
                />
                <p className="text-[10px] sm:text-[11px] text-amber-200/60 m-0">
                  ✨ พรที่บริสุทธิ์และมีความตั้งใจจริง เทพเจ้าชินโตจะทรงรับฟังและคุ้มครอง
                </p>
              </div>
            </div>
          </section>

          {/* Step 3: Hexagonal Omikuji Cylinder */}
          <section className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl text-center relative overflow-hidden">
            <div className="max-w-md mx-auto space-y-5 sm:space-y-6">
              {/* Hexagonal Wooden Cylinder */}
              <div className="relative flex flex-col items-center justify-center py-2 sm:py-4">
                <div
                  className={`relative w-24 h-44 sm:w-28 sm:h-52 rounded-2xl mikuji-wooden-cylinder flex flex-col items-center justify-between p-2.5 sm:p-3 cursor-pointer transition-transform active:scale-95 ${
                    isShaking ? 'cylinder-shaking' : 'hover:scale-105'
                  }`}
                  onClick={handleShakeCylinder}
                >
                  {/* Small round hole on top */}
                  <div className="w-6 h-2 sm:w-7 sm:h-2 rounded-full bg-slate-950 border border-amber-200/50 -mt-1 shadow-inner"></div>

                  {/* Japanese Kanji Calligraphy On Wooden Body */}
                  <div className="flex flex-col items-center space-y-1 my-auto">
                    <span className="text-xs sm:text-sm font-serif font-black text-amber-100 tracking-widest writing-vertical">
                      おみくじ
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-bold text-amber-300/90 font-serif">
                      {selectedShrine.nameJp.slice(0, 4)}
                    </span>
                  </div>

                  {/* Gold Ring Base */}
                  <div className="w-full text-center border-t border-amber-300/40 pt-1">
                    <span className="text-[8px] sm:text-[9px] font-mono font-bold text-amber-200/80">
                      第１〜２８番
                    </span>
                  </div>
                </div>

                {/* Shaking Aura */}
                {isShaking && (
                  <div className="absolute inset-0 bg-orange-500/15 rounded-full blur-2xl animate-pulse pointer-events-none"></div>
                )}
              </div>

              {/* Action Button */}
              {!fallenStick ? (
                <div className="space-y-2.5 sm:space-y-3">
                  <button
                    onClick={handleShakeCylinder}
                    disabled={isShaking}
                    className="btn-shinto-vermilion group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4.5 rounded-2xl text-white font-black text-base sm:text-lg tracking-wide shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer border border-amber-300/40 disabled:opacity-50"
                  >
                    {isShaking ? (
                      <>
                        <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-amber-200" />
                        กำลังเขย่ากระบอกเซียมซี...
                      </>
                    ) : (
                      <>
                        <span className="text-lg sm:text-xl group-hover:rotate-45 transition-transform">🎋</span>
                        เขย่าเซียมซีญี่ปุ่น (おみくじ)
                      </>
                    )}
                  </button>
                  <p className="text-[11px] sm:text-xs text-amber-200/70">
                    💡 ตั้งจิตให้สงบ แล้วคลิกที่กระบอกไม้เพื่อรับคำทำนาย
                  </p>
                </div>
              ) : null}

              {/* Stick Fallen */}
              {fallenStick && !revealedFortune && (
                <div className="space-y-3 sm:space-y-4 stick-drop-anim">
                  <div className="inline-block p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-amber-100 via-amber-50 to-amber-200 border-2 border-amber-500 shadow-2xl text-slate-950 font-black">
                    <span className="text-[11px] sm:text-xs text-amber-900 block font-bold">🎋 ไม้เซียมซีหล่นออกมา (みくじ棒)</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-orange-900 my-1 font-serif">
                      {OMIKUJI_FORTUNES.find((f) => f.number === fallenStick)?.kanjiNumber} (เบอร์ {fallenStick})
                    </div>
                    <span className="text-xs text-orange-800">กำลังคลี่ใบเซียมซี...</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Result: Authentic Japanese Omikuji Slip */}
          {revealedFortune && (
            <section id="omikuji-result" className="space-y-4 sm:space-y-6 pt-3 sm:pt-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1 rounded-full bg-red-950/90 border border-amber-400/40 text-amber-300 text-[11px] sm:text-xs font-bold shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> ผลการเสี่ยงเซียมซีศาลเจ้าญี่ปุ่น
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-orange-200 to-red-400 bg-clip-text text-transparent px-1">
                  {revealedFortune.kanjiNumber} ({revealedFortune.rankKanji}) • {selectedShrine.nameTh}
                </h3>
              </div>

              {/* The Washi Paper Omikuji Slip */}
              <div className="max-w-2xl mx-auto rounded-2xl sm:rounded-3xl omikuji-washi border-2 sm:border-4 border-amber-700/60 p-4 sm:p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                {/* Red Shinto Seal (朱印) */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-red-700/30 flex flex-col items-center justify-center rotate-12 pointer-events-none">
                  <span className="text-red-700/40 text-[9px] sm:text-xs font-bold font-serif">{selectedShrine.nameJp.slice(0, 4)}</span>
                  <span className="text-red-700/40 text-[8px] sm:text-[10px] font-serif">神璽御守</span>
                </div>

                {/* Slip Header */}
                <div className="text-center border-b-2 border-amber-900/20 pb-4 sm:pb-5 space-y-1.5 sm:space-y-2">
                  <div className="text-[10px] sm:text-xs font-bold text-amber-900 tracking-widest uppercase">
                    {selectedShrine.nameJp} • {selectedShrine.location}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-700">
                    {revealedFortune.kanjiNumber} • {revealedFortune.titleJp}
                  </div>
                  <h4 className="text-2xl sm:text-4xl font-black text-red-700 font-serif pt-1">
                    {revealedFortune.rankKanji}
                  </h4>
                  <div>
                    <span className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-bold border ${getRankBadgeClass(revealedFortune.rankKanji)}`}>
                      {revealedFortune.rankTh}
                    </span>
                  </div>
                </div>

                {/* Shinto Waka Poem */}
                <div className="my-4 sm:my-6 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-50/80 border border-amber-300/80 text-center space-y-1.5 sm:space-y-2 shadow-inner">
                  <span className="text-[10px] sm:text-[11px] font-bold text-red-900 block uppercase tracking-wider">
                    📜 บทกวีวะกะโบราณ (和歌)
                  </span>
                  <p className="text-sm sm:text-base font-bold text-stone-900 font-serif leading-relaxed m-0">
                    "{revealedFortune.wakaJp}"
                  </p>
                  <p className="text-[11px] sm:text-xs font-mono text-stone-600 italic m-0">
                    ({revealedFortune.wakaRomaji})
                  </p>
                  <div className="pt-1.5 sm:pt-2 border-t border-amber-200/60 space-y-0.5 sm:space-y-1">
                    {revealedFortune.wakaTh.map((line, idx) => (
                      <p key={idx} className="text-xs sm:text-sm font-medium text-stone-800 m-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Detailed Japanese Omikuji Categories */}
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-stone-900 leading-relaxed">
                  {/* General Fortune */}
                  <div className="p-3 sm:p-4 rounded-xl bg-amber-100/60 border border-amber-300/70">
                    <strong className="text-red-900 flex items-center gap-1.5 mb-1 font-bold text-xs sm:text-sm">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 shrink-0" /> ภาพรวมชะตาชีวิต (総運):
                    </strong>
                    <p className="text-stone-900 m-0 leading-relaxed">{revealedFortune.overview}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="p-3 sm:p-3.5 rounded-xl bg-white/80 border border-amber-200/80">
                      <strong className="text-orange-900 flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" /> ความปรารถนา (願望):
                      </strong>
                      <p className="text-stone-800 m-0 text-xs">{revealedFortune.wish}</p>
                    </div>

                    <div className="p-3 sm:p-3.5 rounded-xl bg-white/80 border border-amber-200/80">
                      <strong className="text-blue-900 flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" /> คนที่รอคอย / ข่าวดี (待人):
                      </strong>
                      <p className="text-stone-800 m-0 text-xs">{revealedFortune.personWaiting}</p>
                    </div>

                    <div className="p-3 sm:p-3.5 rounded-xl bg-white/80 border border-amber-200/80">
                      <strong className="text-rose-900 flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <Heart className="w-3.5 h-3.5 text-rose-600 shrink-0" /> ความรัก & คู่ครอง (恋愛・縁談):
                      </strong>
                      <p className="text-stone-800 m-0 text-xs">{revealedFortune.love}</p>
                    </div>

                    <div className="p-3 sm:p-3.5 rounded-xl bg-white/80 border border-amber-200/80">
                      <strong className="text-emerald-900 flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> การค้า & การเงิน (商売・金運):
                      </strong>
                      <p className="text-stone-800 m-0 text-xs">{revealedFortune.business}</p>
                    </div>

                    <div className="p-3 sm:p-3.5 rounded-xl bg-white/80 border border-amber-200/80">
                      <strong className="text-indigo-900 flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> การเรียน & การสอบ (学問):
                      </strong>
                      <p className="text-stone-800 m-0 text-xs">{revealedFortune.study}</p>
                    </div>

                    <div className="p-3 sm:p-3.5 rounded-xl bg-white/80 border border-amber-200/80">
                      <strong className="text-cyan-900 flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <Activity className="w-3.5 h-3.5 text-cyan-600 shrink-0" /> สุขภาพ & โรคภัย (健康):
                      </strong>
                      <p className="text-stone-800 m-0 text-xs">{revealedFortune.health}</p>
                    </div>

                    <div className="p-3 sm:p-3.5 rounded-xl bg-white/80 border border-amber-200/80">
                      <strong className="text-purple-900 flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <Compass className="w-3.5 h-3.5 text-purple-600 shrink-0" /> การเดินทาง & ทิศ (旅行):
                      </strong>
                      <p className="text-stone-800 m-0 text-xs">{revealedFortune.travel}</p>
                    </div>

                    <div className="p-3 sm:p-3.5 rounded-xl bg-white/80 border border-amber-200/80">
                      <strong className="text-amber-900 flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <Home className="w-3.5 h-3.5 text-amber-600 shrink-0" /> การย้ายที่อยู่ (転居):
                      </strong>
                      <p className="text-stone-800 m-0 text-xs">{revealedFortune.moving}</p>
                    </div>
                  </div>

                  {/* Lucky Elements */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-orange-900 to-red-950 text-white space-y-1.5 shadow-md">
                    <strong className="text-amber-300 flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                      <Shield className="w-4 h-4 text-amber-300 shrink-0" /> สิ่งมงคลเสริมดวง (縁起物):
                    </strong>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                      <div className="bg-black/30 p-2 rounded-lg border border-amber-500/30">
                        <span className="text-amber-300 font-bold block">เครื่องราง:</span>
                        <span>{revealedFortune.luckyItem}</span>
                      </div>
                      <div className="bg-black/30 p-2 rounded-lg border border-amber-500/30">
                        <span className="text-amber-300 font-bold block">สีมงคล (吉色):</span>
                        <span>{revealedFortune.luckyColor}</span>
                      </div>
                      <div className="bg-black/30 p-2 rounded-lg border border-amber-500/30">
                        <span className="text-amber-300 font-bold block">ทิศมงคล (恵方):</span>
                        <span>{revealedFortune.luckyDirection}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tied to Shrine notice or button */}
                {isTiedToShrine ? (
                  <div className="mt-5 sm:mt-6 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-900/90 text-white text-center space-y-1 border border-emerald-400/50 anim-tie-slip">
                    <div className="flex items-center justify-center gap-2 font-bold text-xs sm:text-sm text-emerald-200">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300 shrink-0" />
                      ผูกใบเซียมซีไว้ที่ศาลเจ้าเรียบร้อยแล้ว (おみくじ結び)
                    </div>
                    <p className="text-xs text-emerald-100 m-0">
                      เทพเจ้าแห่ง {selectedShrine.nameTh} จะคุ้มครองและปัดเป่าเคราะห์ภัย นำพาแต่สิ่งดีงามมาสู่ชีวิตท่าน
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t-2 border-amber-900/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                    <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2">
                      <button
                        onClick={handleCopyFortune}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-amber-200 text-xs font-bold cursor-pointer transition-all shadow-md active:scale-95"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            คัดลอกแล้ว
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            คัดลอกคำทำนาย
                          </>
                        )}
                      </button>

                      {/* Tie slip to Shrine Rack */}
                      <button
                        onClick={handleTieToShrine}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold cursor-pointer transition-all shadow-md active:scale-95"
                        title="ผูกใบเซียมซีไว้ที่ราวผูกของศาลเจ้าเพื่อฝากสิ่งศักดิ์สิทธิ์คุ้มครอง"
                      >
                        <TreePine className="w-4 h-4" />
                        ผูกไว้ที่ศาลเจ้า
                      </button>
                    </div>

                    <button
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-800 hover:bg-red-900 text-white text-xs font-bold cursor-pointer transition-all shadow-md active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4" />
                      เสี่ยงใหม่อีกครั้ง
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Encyclopedia of Japanese Omikuji */
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-orange-200 to-red-400 bg-clip-text text-transparent">
              สารานุกรมใบเซียมซีศาลเจ้าญี่ปุ่น (おみくじ一覧)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 px-2">
              คลิกที่ใบเซียมซีแต่ละหมายเลขเพื่ออ่านบทกวีวะกะและความหมายมงคล
            </p>

            {/* Filter by Rank */}
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 pt-2">
              {['all', '大吉', '中吉', '小吉', '吉', '末吉', '凶'].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRank(r)}
                  className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                    filterRank === r
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {r === 'all' ? 'ทั้งหมด' : r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
            {filteredFortunes.map((fortune) => (
              <button
                key={fortune.number}
                onClick={() => setSelectedBrowseSlip(fortune)}
                className="glass-panel hover:border-orange-400 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center transition-all duration-300 cursor-pointer active:scale-95 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-orange-900 to-red-800 border border-amber-400/50 flex flex-col items-center justify-center text-amber-200 font-bold mb-1.5 sm:mb-2 shadow-md group-hover:scale-110 transition-transform">
                  <span className="text-[9px] sm:text-[10px] font-serif">{fortune.kanjiNumber}</span>
                  <span className="text-[11px] sm:text-xs font-black text-white">{fortune.rankKanji}</span>
                </div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 line-clamp-1">
                  {fortune.titleTh}
                </span>
                <span className="text-[10px] text-amber-400/80 mt-0.5">
                  {fortune.rankKanji}
                </span>
              </button>
            ))}
          </div>

          {/* Modal Browse Detail */}
          {selectedBrowseSlip && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
              <div className="bg-slate-950 border border-orange-500/40 rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-4 sm:p-8 relative shadow-2xl space-y-4 sm:space-y-6">
                <button
                  onClick={() => setSelectedBrowseSlip(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 border border-orange-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>

                <div className="text-center space-y-1.5 sm:space-y-2 border-b border-orange-900/40 pb-3 sm:pb-4">
                  <span className="text-[11px] sm:text-xs font-bold text-amber-400 px-3 py-0.5 sm:py-1 rounded-full bg-orange-950/80 border border-orange-700">
                    {selectedBrowseSlip.kanjiNumber} • {selectedBrowseSlip.titleJp}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-amber-200 font-serif">{selectedBrowseSlip.rankKanji}</h3>
                  <span className={`inline-block px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-xs font-bold border ${getRankBadgeClass(selectedBrowseSlip.rankKanji)}`}>
                    {selectedBrowseSlip.rankTh}
                  </span>
                </div>

                {/* Poem */}
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-orange-950/40 border border-amber-500/30 text-center space-y-1 sm:space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-300 block mb-0.5 sm:mb-1">📜 บทกวีวะกะ (和歌)</span>
                  <p className="text-xs sm:text-sm font-bold text-amber-100 font-serif m-0">
                    "{selectedBrowseSlip.wakaJp}"
                  </p>
                  <p className="text-[11px] sm:text-xs font-mono text-amber-300/60 italic m-0">
                    ({selectedBrowseSlip.wakaRomaji})
                  </p>
                  <div className="pt-1 sm:pt-1.5">
                    {selectedBrowseSlip.wakaTh.map((line, i) => (
                      <p key={i} className="text-xs text-amber-200/90 m-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-2.5 sm:space-y-3 text-xs">
                  <div className="bg-slate-900/90 p-3 sm:p-3.5 rounded-xl border border-orange-900/40">
                    <strong className="text-amber-300 block mb-1">ภาพรวมชะตา (総運):</strong>
                    <p className="text-slate-300 leading-relaxed">{selectedBrowseSlip.overview}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                    <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-orange-900/40">
                      <strong className="text-orange-400 block mb-0.5">ความปรารถนา (願望):</strong>
                      <p className="text-slate-300">{selectedBrowseSlip.wish}</p>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-orange-900/40">
                      <strong className="text-rose-400 block mb-0.5">ความรัก (恋愛):</strong>
                      <p className="text-slate-300">{selectedBrowseSlip.love}</p>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-orange-900/40">
                      <strong className="text-emerald-400 block mb-0.5">การค้า (商売):</strong>
                      <p className="text-slate-300">{selectedBrowseSlip.business}</p>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-orange-900/40">
                      <strong className="text-cyan-400 block mb-0.5">สุขภาพ (健康):</strong>
                      <p className="text-slate-300">{selectedBrowseSlip.health}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-950 to-red-950 p-3 sm:p-3.5 rounded-xl border border-amber-500/40 text-amber-200">
                    <strong className="text-amber-300 block mb-1">สิ่งมงคลเสริมดวง (縁起物):</strong>
                    <p className="m-0 leading-relaxed">เครื่องราง: {selectedBrowseSlip.luckyItem} • สีมงคล: {selectedBrowseSlip.luckyColor} • ทิศมงคล: {selectedBrowseSlip.luckyDirection}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OmikujiPage;
