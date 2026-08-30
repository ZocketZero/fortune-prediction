import React, { useState } from 'react';
import { JAPAN_DEITIES, type JapanDeity } from '../data/japanDeitiesData';
import { Sparkles, Bell, Check, RefreshCw, Send, Bookmark, Compass, Heart, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmaWishRecord {
  deity: JapanDeity;
  userName: string;
  userWish: string;
  emaPattern: JapanDeity['emaPatterns'][0];
  blessing: JapanDeity['blessings'][0];
  createdAt: string;
}

export const JapanBlessingPage: React.FC = () => {
  const [selectedDeityId, setSelectedDeityId] = useState<string>(JAPAN_DEITIES[0].id);
  const [userName, setUserName] = useState<string>('');
  const [userWish, setUserWish] = useState<string>('');
  const [selectedEmaPatternId, setSelectedEmaPatternId] = useState<string>(JAPAN_DEITIES[0].emaPatterns[0].id);
  const [isRingingBell, setIsRingingBell] = useState<boolean>(false);
  const [prayerStage, setPrayerStage] = useState<number>(1);
  const [blessingResult, setBlessingResult] = useState<EmaWishRecord | null>(null);
  const [copiedBlessing, setCopiedBlessing] = useState<boolean>(false);

  const selectedDeity = JAPAN_DEITIES.find((d) => d.id === selectedDeityId) || JAPAN_DEITIES[0];
  const selectedEmaPattern =
    selectedDeity.emaPatterns.find((p) => p.id === selectedEmaPatternId) || selectedDeity.emaPatterns[0];

  // Web Audio Synthesizer for Shinto Suzu Shrine Bell (本坪鈴)
  const playShintoSuzuBell = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      // Shinto shrine bell multi-harmonic metallic ring
      [0, 0.25, 0.55].forEach((delay) => {
        [1320, 1760, 2640, 3520].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

          const initialGain = 0.12 / (idx + 1);
          gain.gain.setValueAtTime(initialGain, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 1.3);
        });
      });
    } catch {
      // Ignore audio error if unsupported
    }
  };

  const triggerSakuraConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 85,
        origin: { y: 0.55 },
        colors: ['#ef4444', '#f43f5e', '#fbbf24', '#fecdd3', '#ffffff', '#fda4af']
      });
      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 60,
          origin: { x: 0.08, y: 0.6 },
          colors: ['#f43f5e', '#fda4af', '#fbbf24', '#ffffff']
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 60,
          origin: { x: 0.92, y: 0.6 },
          colors: ['#f43f5e', '#fda4af', '#fbbf24', '#ffffff']
        });
      }, 300);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectDeity = (deity: JapanDeity) => {
    setSelectedDeityId(deity.id);
    setSelectedEmaPatternId(deity.emaPatterns[0].id);
  };

  const handleSelectSuggestedWish = (wish: string) => {
    setUserWish(wish);
  };

  const handleStartShintoPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userWish.trim()) return;

    setIsRingingBell(true);
    setPrayerStage(1);
    playShintoSuzuBell();

    const randomBlessing =
      selectedDeity.blessings[Math.floor(Math.random() * selectedDeity.blessings.length)];

    // Stage progression: 2 bows & bell -> 2 claps -> 1 bow & hang Ema
    const timer1 = setTimeout(() => {
      setPrayerStage(2);
    }, 900);

    const timer2 = setTimeout(() => {
      setPrayerStage(3);
    }, 1800);

    const timer3 = setTimeout(() => {
      triggerSakuraConfetti();
      playShintoSuzuBell();

      setBlessingResult({
        deity: selectedDeity,
        userName: userName.trim() || '参拝者 (ผู้มาเยือนศาลเจ้า)',
        userWish: userWish.trim(),
        emaPattern: selectedEmaPattern,
        blessing: randomBlessing,
        createdAt: new Date().toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });

      setIsRingingBell(false);
      setPrayerStage(1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleReset = () => {
    setBlessingResult(null);
    setUserWish('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyBlessingText = () => {
    if (!blessingResult) return;
    const textToCopy = `⛩️ สาส์นพรศาลเจ้าญี่ปุ่นจาก ${blessingResult.deity.name} (${blessingResult.deity.japaneseName}) ⛩️\n\nแผ่นป้ายเอมะ: ${blessingResult.emaPattern.name} (${blessingResult.emaPattern.icon})\nผู้ขอพร: ${blessingResult.userName}\nคำอธิษฐาน: "${blessingResult.userWish}"\n\nสาส์นพรศักดิ์สิทธิ์: ${blessingResult.blessing.title} (${blessingResult.blessing.japaneseTitle})\n"${blessingResult.blessing.verse}"\n${blessingResult.blessing.guidance}\n\nเครื่องรางนำโชค (Omamori): ${blessingResult.blessing.luckyCharm}\nทิศมงคล: ${blessingResult.blessing.luckyDirection}\n\nขอให้คำอธิษฐานสัมฤทธิ์ผล (心願成就) 🙏`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedBlessing(true);
    setTimeout(() => setCopiedBlessing(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-8 sm:pb-12 relative">
      {/* Shinto Shrine Prayer Ritual Overlay */}
      {isRingingBell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
          {/* Torii Gate & Crimson Radiance Background */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-red-600/20 blur-3xl animate-sacred-aura pointer-events-none" />
          <div className="absolute w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-amber-500/15 blur-2xl animate-pulse pointer-events-none" />

          {/* Falling Sakura Petals Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="absolute text-rose-300 anim-sakura-petal text-sm sm:text-base select-none"
                style={{
                  left: `${10 + (i * 6.5) % 80}%`,
                  top: `${(i * 7) % 60}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${3.5 + (i % 3)}s`
                }}
              >
                🌸
              </div>
            ))}
          </div>

          {/* Central Shrine Prayer Box */}
          <div className="relative z-10 max-w-md w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#22130e]/95 via-slate-950/95 to-slate-950/95 border-2 border-red-500/60 shadow-2xl shadow-red-950/80 text-center space-y-5">
            {/* Swinging Shrine Bell with Red/White Rope */}
            <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-ping opacity-50" />
              <div className="w-1.5 h-6 bg-gradient-to-b from-red-600 to-amber-200 rounded-full bell-swinging" />
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-red-600 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-red-600/40 text-white bell-swinging">
                🔔
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full bg-red-500/20 text-rose-300 border border-red-500/30">
                ⛩️ {selectedDeity.name} ({selectedDeity.japaneseName})
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-rose-100 mt-1">
                กำลังประกอบพิธีขอพรศาลเจ้า
              </h3>
            </div>

            {/* Shinto Shrine Etiquette (二礼二拍手一礼) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-red-500/30 space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-rose-200">
                <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>
                  {prayerStage === 1 && '๑. 二礼 (คำนับ ๒ ครั้ง และสั่นกระดิ่งศาลเจ้า)...'}
                  {prayerStage === 2 && '๒. 二拍手 (ปรบมือ ๒ ครั้ง น้อมส่งจิตอธิษฐาน)...'}
                  {prayerStage === 3 && '๓. 一礼 (คำนับ ๑ ครั้ง และแขวนแผ่นป้ายเอมะ)...'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 italic">
                "{userWish.length > 50 ? userWish.slice(0, 50) + '...' : userWish}"
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-red-500/30">
              <div
                className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${(prayerStage / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="text-center space-y-2.5 sm:space-y-3 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-rose-300 text-[11px] sm:text-xs font-semibold tracking-wide">
          <span>⛩️</span>
          <span>神社祈願 • 奉納絵馬 • ขอพรเทพเจ้าและเขียนแผ่นป้ายเอมะ</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-rose-300 to-amber-200 tracking-tight leading-tight px-1">
          อธิษฐานขอพรเทพเจ้าญี่ปุ่น
        </h1>
        <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed px-2">
          เขียนความปรารถนาลงบนแผ่นไม้เอมะ (Ema) สั่นกระดิ่งศาลเจ้า และรับสาส์นพรมงคลตามธรรมเนียมชินโต
        </p>
      </div>

      {/* Result View or Ema Prayer Board View */}
      {blessingResult ? (
        <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto anim-blessing-reveal relative">
          {/* Ema Wooden Board Display */}
          <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-8 sm:p-10 border-2 border-amber-600/50 bg-gradient-to-b from-[#2a1a12]/95 via-[#1a120e]/95 to-slate-950/95 shadow-2xl shadow-red-950/50 backdrop-blur-xl overflow-hidden anim-ema-hang">
            {/* Shimmer Light Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-400/10 to-transparent pointer-events-none anim-divine-shimmer" />

            {/* Top Wooden Hole with Red Ribbon */}
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-slate-950 border-2 border-amber-500 shadow-inner flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              </div>
              <div className="w-1 h-5 sm:h-6 bg-red-600 shadow-sm" />
            </div>

            {/* Ema Board Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-amber-700/30 text-center sm:text-left relative">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-red-600/30 text-white shrink-0">
                    {blessingResult.emaPattern.icon}
                  </div>
                  <div className="absolute -inset-1 rounded-2xl border border-red-500/40 animate-pulse pointer-events-none" />
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/20 text-rose-300 border border-red-500/30">
                      {blessingResult.deity.domain}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-amber-100 mt-1">
                    {blessingResult.deity.name}
                  </h2>
                  <p className="text-xs text-rose-300/80 font-medium">
                    {blessingResult.deity.japaneseName} • {blessingResult.deity.shrine}
                  </p>
                </div>
              </div>
              <div className="text-center sm:text-right text-xs text-amber-200/60">
                <p className="font-medium text-amber-300">奉納 (Ema Wish)</p>
                <p>{blessingResult.createdAt}</p>
              </div>
            </div>

            {/* Ema Inscribed Prayer */}
            <div className="my-4 sm:my-6 space-y-3 sm:space-y-4">
              <div className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#fffdfa]/95 text-slate-900 shadow-xl border-2 sm:border-4 border-[#b45309]/30 overflow-hidden">
                {/* Traditional Shrine Seal Mark with Stamp Animation */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 sm:border-3 border-red-600/90 bg-red-50/70 flex items-center justify-center text-red-600 font-black text-xs sm:text-sm select-none pointer-events-none anim-seal-stamp shadow-md shadow-red-600/30">
                  心願成就
                </div>

                <div className="text-xs text-amber-900 font-semibold mb-2 flex items-center gap-1.5 sm:gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>ป้ายเอมะลาย: {blessingResult.emaPattern.name}</span>
                </div>

                <p className="text-base sm:text-xl font-bold text-slate-800 leading-relaxed my-2 sm:my-3 font-sans pr-12">
                  "{blessingResult.userWish}"
                </p>

                <div className="text-right pt-2.5 sm:pt-3 border-t border-amber-900/20 text-xs font-bold text-amber-950 flex justify-end items-center gap-1.5 sm:gap-2">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  <span>ผู้เขียนป้าย: {blessingResult.userName}</span>
                </div>
              </div>

              {/* Shrine Divine Blessing (สาส์นพรจากเทพเจ้า) */}
              <div className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-950/40 via-slate-900/90 to-slate-950/90 border border-red-500/40 text-center space-y-2.5 sm:space-y-3 shadow-inner overflow-hidden">
                <div className="inline-flex items-center gap-1.5 text-xs text-rose-300 uppercase tracking-widest font-bold">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                  สาส์นพรเทพเจ้าประจำศาลเจ้า (神徳)
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-amber-200">
                  {blessingResult.blessing.title}
                </h3>
                <p className="text-xs text-rose-300 font-medium tracking-wide">
                  {blessingResult.blessing.japaneseTitle}
                </p>
                <p className="text-base sm:text-lg text-amber-300/95 font-semibold italic">
                  "{blessingResult.blessing.verse}"
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                  {blessingResult.blessing.guidance}
                </p>

                {/* Omamori & Direction Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2 sm:pt-3 max-w-md mx-auto">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/80 border border-red-500/30 text-xs">
                    <span className="text-slate-400">เครื่องรางนำโชค (Omamori): </span>
                    <p className="text-rose-300 font-bold mt-0.5 text-xs sm:text-sm">
                      {blessingResult.blessing.luckyCharm}
                    </p>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/80 border border-red-500/30 text-xs">
                    <span className="text-slate-400">ทิศมงคลนำโชค: </span>
                    <p className="text-amber-300 font-bold mt-0.5 text-xs sm:text-sm">
                      {blessingResult.blessing.luckyDirection}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shinto Norito Chant */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>คำสวดชินโตชำระจิตใจ (Norito)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  {blessingResult.deity.norito.japanese}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 italic">
                  💡 {blessingResult.deity.norito.thaiMeaning}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={handleCopyBlessingText}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs sm:text-sm transition-all cursor-pointer border border-slate-700 shadow-md active:scale-95"
              >
                {copiedBlessing ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>คัดลอกสาส์นพรแล้ว!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-rose-400" />
                    <span>คัดลอกสาส์นพรมงคล</span>
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-red-600/30 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>เขียนป้ายขอพรใหม่อีกครั้ง</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Deity Selection & Ema Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Japanese Deities Selector */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-200 flex items-center gap-2">
              <span>⛩️</span>
              <span>เลือกเทพเจ้าและศาลเจ้าที่ต้องการขอพร</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
              {JAPAN_DEITIES.map((deity) => {
                const isSelected = deity.id === selectedDeity.id;
                return (
                  <button
                    key={deity.id}
                    onClick={() => handleSelectDeity(deity)}
                    className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-left transition-all duration-200 border cursor-pointer active:scale-[0.99] ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-950/60 to-slate-900/90 border-red-500/80 shadow-lg shadow-red-500/10 scale-[1.01]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-md ${
                        isSelected
                          ? 'bg-gradient-to-br from-red-600 to-rose-700 text-white'
                          : 'bg-slate-900 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {deity.avatarIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-sm sm:text-base text-slate-100 truncate">
                          {deity.name}
                        </span>
                        <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md bg-red-500/10 text-rose-300 border border-red-500/20 shrink-0">
                          {deity.domain.split('&')[0]}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-rose-300/70 truncate mt-0.5">{deity.japaneseName}</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-1">📍 {deity.shrine.split(',')[0]}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Deity Info & Ema Wish Form */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Deity Header Profile */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950/80 border border-red-500/30 space-y-3 sm:space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-red-500/20 text-white shrink-0">
                    {selectedDeity.avatarIcon}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-rose-100">{selectedDeity.name}</h3>
                    <p className="text-xs text-amber-300/90">{selectedDeity.japaneseName}</p>
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-rose-300 font-medium self-start sm:self-auto">
                  {selectedDeity.domain}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedDeity.description}
              </p>

              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-red-500/20 text-xs space-y-1">
                <span className="font-semibold text-amber-300">ศาลเจ้าที่ประดิษฐาน:</span>
                <p className="text-slate-300 font-medium">⛩️ {selectedDeity.shrine}</p>
              </div>
            </div>

            {/* Ema Wish Form (เขียนคำอธิษฐานลงบนแผ่นไม้เอมะ) */}
            <form onSubmit={handleStartShintoPrayer} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950/90 border border-red-500/30 space-y-4 sm:space-y-5 shadow-2xl">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  เขียนคำอธิษฐานลงบนแผ่นป้ายเอมะ (繪馬)
                </h3>
              </div>

              {/* Select Ema Board Design */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  เลือกลายแผ่นป้ายเอมะมงคล
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {selectedDeity.emaPatterns.map((pattern) => {
                    const isSelected = selectedEmaPatternId === pattern.id;
                    return (
                      <button
                        key={pattern.id}
                        type="button"
                        onClick={() => setSelectedEmaPatternId(pattern.id)}
                        className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-2.5 sm:gap-3 active:scale-[0.99] ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-400 text-amber-100 shadow-md'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xl sm:text-2xl">{pattern.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-200">{pattern.name}</p>
                          <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">{pattern.symbolMeaning}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* User Name */}
              <div className="space-y-1 sm:space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  ชื่อผู้ขอพร (เขียนลงมุมป้าย)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="เช่น สมชาย หรือใส่ชื่อเล่นของท่าน"
                  className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-red-400 transition-colors placeholder:text-slate-600"
                />
              </div>

              {/* Wish Textarea */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>คำอธิษฐานบนแผ่นไม้เอมะ (Ema Wish) <strong className="text-rose-400">*</strong></span>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal">ตั้งจิตให้มั่นคงและสงบ</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={userWish}
                  onChange={(e) => setUserWish(e.target.value)}
                  placeholder="เขียนสิ่งที่ท่านปรารถนาให้สำเร็จ เช่น ขอให้สอบผ่านการคัดเลือก ขอให้กิจการค้าขายเจริญรุ่งเรือง..."
                  className="w-full p-3 sm:p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-red-400 transition-colors leading-relaxed placeholder:text-slate-600"
                />
              </div>

              {/* Suggested Wishes */}
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-[11px] sm:text-xs text-rose-300/80 font-medium">คำอธิษฐานยอดนิยมประจำองค์เทพ (คลิกเพื่อเลือก):</p>
                <div className="flex flex-col gap-1.5">
                  {selectedDeity.suggestedWishes.map((wish, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestedWish(wish)}
                      className="text-left text-xs p-2 sm:p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800/60 hover:border-red-500/30 transition-all cursor-pointer truncate active:scale-[0.99]"
                    >
                      🎋 {wish}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit / Ring Bell & Hang Ema Button */}
              <button
                type="submit"
                disabled={!userWish.trim() || isRingingBell}
                className={`w-full py-3 sm:py-3.5 px-6 rounded-xl sm:rounded-2xl font-extrabold text-xs sm:text-base flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer active:scale-95 ${
                  !userWish.trim() || isRingingBell
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 hover:from-red-500 hover:to-rose-400 text-white shadow-red-600/25 hover:scale-[1.01]'
                }`}
              >
                {isRingingBell ? (
                  <>
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce text-amber-200" />
                    <span>กำลังสั่นกระดิ่งศาลเจ้าและแขวนป้ายเอมะ...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-200" />
                    <span>奉納・สั่นกระดิ่งและส่งคำอธิษฐานสู่ศาลเจ้า</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
