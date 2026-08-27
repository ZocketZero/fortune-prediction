import React, { useState, useRef } from 'react';
import {
  THAI_SIAMSI_FORTUNES,
  THAI_SHRINES
} from '../data/thaiSiamsiData';
import type { ThaiSiamsiFortune, ThaiShrineTheme } from '../data/thaiSiamsiData';
import {
  Sparkles,
  Flame,
  RotateCcw,
  BookOpen,
  Briefcase,
  Coins,
  Heart,
  Activity,
  Shield,
  Dices,
  Copy,
  Check,
  Building2,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

type PoeiResult = 'shua' | 'im' | 'yang' | null;

export const ThaiSiamsiPage: React.FC = () => {
  const [selectedShrine, setSelectedShrine] = useState<ThaiShrineTheme>(THAI_SHRINES[0]);
  const [userWish, setUserWish] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [fallenStick, setFallenStick] = useState<number | null>(null);
  const [poeiResult, setPoeiResult] = useState<PoeiResult>(null);
  const [isThrowingPoei, setIsThrowingPoei] = useState<boolean>(false);
  const [confirmedFortune, setConfirmedFortune] = useState<ThaiSiamsiFortune | null>(null);
  const [isBrowsingAll, setIsBrowsingAll] = useState<boolean>(false);
  const [selectedBrowseSlip, setSelectedBrowseSlip] = useState<ThaiSiamsiFortune | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio Synthesizer for Bamboo stick clicking sound
  const playBambooStickSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Generate a series of sharp wooden clicks
      for (let i = 0; i < 9; i++) {
        const time = ctx.currentTime + i * 0.14 + (Math.random() * 0.05);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + Math.random() * 450, time);
        osc.frequency.exponentialRampToValueAtTime(180, time + 0.05);

        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.06);
      }
    } catch {
      // Ignore
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#dc2626', '#f59e0b', '#fbbf24', '#ffd700', '#f43f5e']
    });
  };

  // Shake Bamboo Cylinder
  const handleShakeCylinder = () => {
    if (isShaking) return;
    setIsShaking(true);
    setFallenStick(null);
    setPoeiResult(null);
    setConfirmedFortune(null);

    playBambooStickSound();

    setTimeout(() => {
      // Pick random stick 1 to 28
      const randomStickNumber = Math.floor(Math.random() * 28) + 1;
      setFallenStick(randomStickNumber);
      setIsShaking(false);
    }, 1800);
  };

  // Throw Moon Blocks (ไม้ปวย)
  const handleThrowPoei = () => {
    if (!fallenStick || isThrowingPoei) return;
    setIsThrowingPoei(true);
    setPoeiResult(null);

    setTimeout(() => {
      // 70% chance of 'shua' (approval), 15% 'im', 15% 'yang'
      const rand = Math.random();
      let result: PoeiResult = 'shua';
      if (rand < 0.70) {
        result = 'shua';
      } else if (rand < 0.85) {
        result = 'im';
      } else {
        result = 'yang';
      }

      setPoeiResult(result);
      setIsThrowingPoei(false);

      if (result === 'shua') {
        const fortune = THAI_SIAMSI_FORTUNES.find((f) => f.number === fallenStick) || null;
        setConfirmedFortune(fortune);
        triggerConfetti();
      }
    }, 900);
  };

  // Direct Reveal without Poei
  const handleDirectReveal = () => {
    if (!fallenStick) return;
    const fortune = THAI_SIAMSI_FORTUNES.find((f) => f.number === fallenStick) || null;
    setPoeiResult('shua');
    setConfirmedFortune(fortune);
    triggerConfetti();
  };

  // Reset
  const handleReset = () => {
    setFallenStick(null);
    setPoeiResult(null);
    setConfirmedFortune(null);
  };

  // Copy fortune text
  const handleCopyFortune = () => {
    if (!confirmedFortune) return;
    const text = `🎋 ใบเซียมซีไทยหมายเลข ๑${confirmedFortune.thaiNumber} (${confirmedFortune.number}): ${confirmedFortune.title}\n` +
      `ระดับ: ${confirmedFortune.grade}\n` +
      `ศาลเจ้า/วัด: ${selectedShrine.name}\n\n` +
      `📜 บทกลอนทำนาย:\n${confirmedFortune.poem.join('\n')}\n\n` +
      `✨ ภาพรวม: ${confirmedFortune.overview}\n` +
      `💼 การงาน: ${confirmedFortune.work}\n` +
      `💰 การเงิน: ${confirmedFortune.finance}\n` +
      `❤️ ความรัก: ${confirmedFortune.love}\n` +
      `🩺 สุขภาพ: ${confirmedFortune.health}\n` +
      `🎲 โชคลาภ: ${confirmedFortune.luck}\n` +
      `🕊️ คำแนะนำเสริมดวง: ${confirmedFortune.holyAdvice}\n\n` +
      `— เสี่ยงเซียมซีไทยมงคลออนไลน์ (Gypsy & Esiimsi Oracle)`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const toThaiNumber = (num: number): string => {
    const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
    return num.toString().split('').map(d => thaiDigits[parseInt(d)] || d).join('');
  };

  const getGradeBadge = (grade: string) => {
    if (grade.includes('ดีเลิศ') || grade.includes('มหาลาภ')) {
      return 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-amber-300 shadow-amber-500/30';
    }
    if (grade.includes('ดีมาก')) {
      return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-300 shadow-emerald-500/30';
    }
    if (grade.includes('ดีปานกลาง')) {
      return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-300 shadow-blue-500/30';
    }
    if (grade.includes('พอใช้')) {
      return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-300 shadow-orange-500/30';
    }
    return 'bg-gradient-to-r from-rose-700 to-red-800 text-white border-rose-300 shadow-red-500/30';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner / Header */}
      <div className="text-center space-y-3 py-2">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-950/90 border border-amber-500/40 text-amber-300 shadow-md">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> ศาสตร์แห่งการเสี่ยงเซียมซีไทยโบราณ ๒๘ ใบมงคล
        </span>
        <h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-400 bg-clip-text text-transparent tracking-wide">
          เสี่ยงเซียมซีไทยมงคล (๒๘ ใบ)
        </h2>
        <p className="text-xs sm:text-sm text-slate-300/80 max-w-xl mx-auto leading-relaxed">
          น้อมจิตอธิษฐานต่อพระพุทธคุณและสิ่งศักดิ์สิทธิ์ประจำวัดดัง จุดธูป ๓ ดอก แล้วเขย่ากระบอกเซียมซีเพื่อรับคำพยากรณ์
        </p>
      </div>

      {/* Mode Switch: Divination vs All Slips */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-inner">
          <button
            onClick={() => {
              setIsBrowsingAll(false);
              setSelectedBrowseSlip(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
              !isBrowsingAll
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 shadow-lg shadow-amber-600/30 scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            เขย่าเซียมซีเสี่ยงทาย
          </button>
          <button
            onClick={() => setIsBrowsingAll(true)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
              isBrowsingAll
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 shadow-lg shadow-amber-600/30 scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            สารานุกรมใบเซียมซี ๒๘ ใบ
          </button>
        </div>
      </div>

      {!isBrowsingAll ? (
        <div className="space-y-8">
          {/* Step 1: Select Shrine / Temple */}
          <section className="glass-panel rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2 font-cinzel">
              <Building2 className="w-4 h-4 text-amber-400" />
              ขั้นตอนที่ ๑: เลือกวัด & ศาลเจ้าศักดิ์สิทธิ์ประจำประเทศไทย
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {THAI_SHRINES.map((shrine) => (
                <button
                  key={shrine.id}
                  onClick={() => setSelectedShrine(shrine)}
                  className={`text-left p-4.5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    selectedShrine.id === shrine.id
                      ? 'bg-gradient-to-br from-amber-950/60 via-slate-900 to-yellow-950/60 border-amber-400 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400/50 scale-[1.02]'
                      : 'bg-slate-950/50 border-purple-900/30 hover:border-amber-500/40 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-amber-200 block">{shrine.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 inline-block">
                      {shrine.location}
                    </span>
                    <p className="text-xs text-slate-300/80 leading-relaxed m-0">{shrine.blessingTopic}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: Mental Focus / Prayer Intention */}
          <section className="glass-panel rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 font-cinzel">
              <Flame className="w-4 h-4 text-amber-400" />
              ขั้นตอนที่ ๒: ตั้งจิตอธิษฐาน & ระบุเรื่องที่ต้องการถาม (จุดธูป ๓ ดอก)
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/70 p-4.5 rounded-2xl border border-amber-950/60">
              {/* Incense Burner Graphic */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-950 border border-amber-900/40 shrink-0">
                {/* Smoke particles */}
                <div className="relative w-8 h-8 flex justify-center">
                  <div className="w-1 h-3 bg-amber-200/60 rounded-full blur-[1px] animate-smoke"></div>
                  <div className="w-1 h-3 bg-amber-300/40 rounded-full blur-[1px] animate-smoke delay-150 ml-1"></div>
                  <div className="w-1 h-3 bg-amber-100/50 rounded-full blur-[1px] animate-smoke delay-300 -ml-1"></div>
                </div>
                {/* 3 Incense Sticks */}
                <div className="flex gap-1 -mt-2">
                  <div className="w-0.5 h-6 bg-red-400 rounded-t"></div>
                  <div className="w-0.5 h-7 bg-red-500 rounded-t -mt-1"></div>
                  <div className="w-0.5 h-6 bg-red-400 rounded-t"></div>
                </div>
                {/* Golden Urn */}
                <div className="w-10 h-6 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 rounded-b-xl border-t border-amber-200 shadow-md flex items-center justify-center">
                  <div className="w-3 h-1 bg-amber-950/60 rounded-full"></div>
                </div>
                <span className="text-[10px] text-amber-300 font-bold mt-1">ธูป ๓ ดอก</span>
              </div>

              <div className="flex-1 w-full space-y-2">
                <label className="text-xs text-slate-300 font-medium block">
                  ระบุชื่อ-นามสกุล หรือเรื่องที่ต้องการขอความกระจ่าง (ทางเลือก):
                </label>
                <input
                  type="text"
                  value={userWish}
                  onChange={(e) => setUserWish(e.target.value)}
                  placeholder="เช่น เรื่องการสอบเลื่อนตำแหน่ง, การค้าขาย, ความรัก..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-amber-900/50 focus:border-amber-400 focus:outline-none text-slate-100 text-sm placeholder:text-slate-600 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Step 3: Interactive Cylinder and Divination Action */}
          <section className="glass-panel rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
            <div className="max-w-md mx-auto space-y-6">
              {/* Bamboo Cylinder Visual */}
              <div className="relative flex flex-col items-center justify-center py-4">
                <div
                  className={`relative w-28 h-48 rounded-2xl bg-gradient-to-r from-red-900 via-red-700 to-red-950 border-4 border-amber-400 shadow-2xl flex flex-col items-center justify-between p-3 overflow-visible cursor-pointer transition-transform ${
                    isShaking ? 'cylinder-shaking' : 'hover:scale-105'
                  }`}
                  onClick={handleShakeCylinder}
                >
                  {/* Bamboo Sticks Peeking out from cylinder */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex gap-1.5 items-end justify-center w-full px-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-t-sm bg-gradient-to-t from-amber-400 to-amber-200 border-t border-amber-100 shadow-sm transition-all ${
                          isShaking ? 'animate-pulse' : ''
                        }`}
                        style={{
                          height: `${28 + (i % 3) * 6}px`,
                          transform: isShaking ? `translateY(${Math.sin(i) * 6}px)` : 'none'
                        }}
                      />
                    ))}
                  </div>

                  {/* Cylinder Golden Crest */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-[2px] shadow-lg mt-2">
                    <div className="w-full h-full bg-red-950 rounded-full flex flex-col items-center justify-center border border-amber-300">
                      <span className="text-[10px] font-bold text-amber-300 font-serif">เซียมซี</span>
                      <span className="text-[8px] font-bold text-amber-200">๒๘ ใบ</span>
                    </div>
                  </div>

                  {/* Dragon / Cloud Gold Filigree */}
                  <div className="w-full text-center">
                    <div className="text-[10px] text-amber-300/90 font-serif tracking-widest uppercase">
                      มงคลศักดิ์สิทธิ์
                    </div>
                    <div className="text-[9px] text-amber-400/70 font-mono">
                      {selectedShrine.name.slice(0, 14)}
                    </div>
                  </div>
                </div>

                {/* Shaking Aura */}
                {isShaking && (
                  <div className="absolute inset-0 bg-red-500/10 rounded-full blur-2xl animate-pulse pointer-events-none"></div>
                )}
              </div>

              {/* Action Button */}
              {!fallenStick ? (
                <div className="space-y-3">
                  <button
                    onClick={handleShakeCylinder}
                    disabled={isShaking}
                    className="btn-gold-shimmer group relative inline-flex items-center gap-3 px-10 py-4.5 rounded-2xl text-slate-950 font-black text-lg tracking-wide shadow-2xl hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer border border-amber-300/40 disabled:opacity-50"
                  >
                    {isShaking ? (
                      <>
                        <RotateCcw className="w-6 h-6 animate-spin text-slate-950" />
                        กำลังเขย่ากระบอกเซียมซี...
                      </>
                    ) : (
                      <>
                        <Dices className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500 text-slate-950" />
                        เขย่ากระบอกเซียมซีไทย
                      </>
                    )}
                  </button>
                  <p className="text-xs text-amber-200/70">
                    💡 ตั้งจิตนึกถึงเรื่องที่ท่านต้องการ แล้วกดปุ่มหรือคลิกที่กระบอกไม้ไผ่
                  </p>
                </div>
              ) : null}

              {/* Stick has fallen! */}
              {fallenStick && !confirmedFortune && (
                <div className="space-y-6 stick-drop-anim">
                  {/* The Golden Stick */}
                  <div className="inline-block p-4 rounded-2xl bg-gradient-to-b from-amber-200 via-amber-100 to-amber-300 border-2 border-amber-500 shadow-2xl text-slate-950 font-black">
                    <span className="text-xs text-amber-900 block font-bold">🎋 ไม้ติ้วเซียมซีหล่นลงมา</span>
                    <div className="text-3xl font-extrabold text-red-800 my-1 font-serif">
                      หมายเลข ๑{toThaiNumber(fallenStick)} ({fallenStick})
                    </div>
                    <span className="text-[11px] text-amber-950/80 font-medium">
                      {THAI_SIAMSI_FORTUNES.find(f => f.number === fallenStick)?.title}
                    </span>
                  </div>

                  {/* Moon Blocks Confirmation Step */}
                  <div className="bg-slate-950/80 p-6 rounded-2xl border border-amber-500/40 space-y-4">
                    <h4 className="text-sm font-bold text-amber-300 flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      โยนไม้ปวย (Sheng Bei) เสี่ยงทายยืนยันคำทำนาย
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      ตามธรรมเนียมโบราณ โยนไม้ปวยคู่เพื่อถามสิ่งศักดิ์สิทธิ์ว่าไม้เบอร์นี้คือคำตอบที่แท้จริงหรือไม่
                    </p>

                    {/* Throw Results Display */}
                    {poeiResult && (
                      <div className="p-4 rounded-xl border animate-fadeIn space-y-2 bg-slate-900">
                        {poeiResult === 'shua' && (
                          <div className="text-emerald-400 space-y-1">
                            <span className="font-bold text-base block">🌟 ชัวปวย (คว่ำ ๑ หงาย ๑) — เทพเจ้ายินยอม!</span>
                            <p className="text-xs text-slate-300">สิ่งศักดิ์สิทธิ์รับรองว่านี่คือคำทำนายที่แท้จริงของท่าน</p>
                          </div>
                        )}
                        {poeiResult === 'im' && (
                          <div className="text-rose-400 space-y-1">
                            <span className="font-bold text-base block">⚠️ อิมปวย (คว่ำทั้ง ๒) — เทพเจ้ายังไม่อนุมัติ</span>
                            <p className="text-xs text-slate-300">จิตใจอาจยังไม่นิ่ง หรือยังไม่ใช่จังหวะเวลา กรุณาตั้งจิตใหม่แล้วเขย่าอีกครั้ง</p>
                          </div>
                        )}
                        {poeiResult === 'yang' && (
                          <div className="text-amber-400 space-y-1">
                            <span className="font-bold text-base block">🎋 เอี้ยงปวย (หงายทั้ง ๒) — เทพเจ้าทรงสรวล</span>
                            <p className="text-xs text-slate-300">เรื่องนี้ท่านรู้คำตอบในใจดีอยู่แล้ว หรือเป็นเรื่องที่ต้องตัดสินใจด้วยตนเอง</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      {poeiResult !== 'shua' && (
                        <button
                          onClick={handleThrowPoei}
                          disabled={isThrowingPoei}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer hover:scale-105 transition-all shadow-lg"
                        >
                          <Dices className={`w-4 h-4 ${isThrowingPoei ? 'animate-spin' : ''}`} />
                          {isThrowingPoei ? 'กำลังทอดไม้ปวย...' : 'โยนไม้ปวยเสี่ยงทาย'}
                        </button>
                      )}

                      <button
                        onClick={handleDirectReveal}
                        className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/50 text-amber-200 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                      >
                        <ChevronRight className="w-4 h-4" />
                        เปิดอ่านใบเซียมซีทันที
                      </button>

                      <button
                        onClick={handleReset}
                        className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-800/40 text-red-300 font-bold text-xs cursor-pointer"
                      >
                        เขย่าใหม่
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Result: The Authentic Traditional Fortune Slip */}
          {confirmedFortune && (
            <section className="space-y-6 pt-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-950/80 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> คำทำนายเซียมซีของท่าน
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  ใบเซียมซีหมายเลข ๑{toThaiNumber(confirmedFortune.number)} ({confirmedFortune.number})
                </h3>
              </div>

              {/* Traditional Scroll Slip */}
              <div className="max-w-2xl mx-auto rounded-3xl bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 border-4 border-amber-600/70 p-6 sm:p-10 shadow-2xl relative overflow-hidden text-amber-950">
                {/* Red Imperial Seal Watermark in background */}
                <div className="absolute top-6 right-6 w-24 h-24 rounded-2xl border-4 border-red-600/25 flex flex-col items-center justify-center rotate-12 pointer-events-none">
                  <span className="text-red-700/30 text-xs font-bold font-serif">ศาลเจ้ามงคล</span>
                  <span className="text-red-700/30 text-[10px] font-mono">大吉大利</span>
                </div>

                {/* Header of Slip */}
                <div className="text-center border-b-2 border-amber-700/30 pb-6 space-y-2">
                  <div className="text-xs font-bold tracking-widest text-amber-900 uppercase">
                    {selectedShrine.name} • {selectedShrine.location}
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-black text-red-900 font-serif">
                    ใบที่ ๑{toThaiNumber(confirmedFortune.number)} : {confirmedFortune.title}
                  </h4>
                  <div className="pt-2">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${getGradeBadge(confirmedFortune.grade)}`}>
                      เกณฑ์ชะตา: {confirmedFortune.grade}
                    </span>
                  </div>
                </div>

                {/* The Traditional 4-Line Poem */}
                <div className="my-6 p-5 rounded-2xl bg-amber-100/70 border border-amber-400/50 text-center space-y-1.5 shadow-inner">
                  <span className="text-[11px] font-bold text-red-900 block uppercase tracking-wider mb-2">
                    📜 บทกลอนทำนายโบราณ
                  </span>
                  {confirmedFortune.poem.map((line, idx) => (
                    <p key={idx} className="text-sm sm:text-base font-semibold text-amber-950 font-serif leading-relaxed m-0">
                      "{line}"
                    </p>
                  ))}
                </div>

                {/* Categorized Readings */}
                <div className="space-y-4 text-xs sm:text-sm text-amber-950 leading-relaxed">
                  {/* Overview */}
                  <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300/80 shadow-sm">
                    <strong className="text-red-900 flex items-center gap-1.5 mb-1 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-amber-600" /> ภาพรวมดวงชะตา:
                    </strong>
                    <p className="text-amber-950 m-0 leading-relaxed">{confirmedFortune.overview}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-white/70 border border-amber-200">
                      <strong className="text-blue-900 flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" /> การงาน & การค้า:
                      </strong>
                      <p className="text-amber-950 m-0 text-xs">{confirmedFortune.work}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/70 border border-amber-200">
                      <strong className="text-emerald-900 flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <Coins className="w-3.5 h-3.5 text-emerald-600" /> การเงิน & ทรัพย์สิน:
                      </strong>
                      <p className="text-amber-950 m-0 text-xs">{confirmedFortune.finance}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/70 border border-amber-200">
                      <strong className="text-rose-900 flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <Heart className="w-3.5 h-3.5 text-rose-600" /> ความรัก & คู่ครอง:
                      </strong>
                      <p className="text-amber-950 m-0 text-xs">{confirmedFortune.love}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/70 border border-amber-200">
                      <strong className="text-cyan-900 flex items-center gap-1.5 mb-1 font-bold text-xs">
                        <Activity className="w-3.5 h-3.5 text-cyan-600" /> สุขภาพ & โรคภัย:
                      </strong>
                      <p className="text-amber-950 m-0 text-xs">{confirmedFortune.health}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/70 border border-amber-200">
                    <strong className="text-amber-900 flex items-center gap-1.5 mb-1 font-bold text-xs">
                      <Dices className="w-3.5 h-3.5 text-amber-600" /> โชคลาภ & ลาภลอย:
                    </strong>
                    <p className="text-amber-950 m-0 text-xs">{confirmedFortune.luck}</p>
                  </div>

                  {/* Holy Blessing Advice */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-900 to-amber-900 text-white shadow-md">
                    <strong className="text-amber-300 flex items-center gap-1.5 mb-1 font-bold text-xs sm:text-sm">
                      <Shield className="w-4 h-4 text-amber-300" /> คำแนะนำเสริมดวงชะตา & การทำบุญ:
                    </strong>
                    <p className="text-amber-100 m-0 text-xs leading-relaxed">{confirmedFortune.holyAdvice}</p>
                  </div>
                </div>

                {/* Share / Copy and Reset Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-amber-700/30 mt-6">
                  <button
                    onClick={handleCopyFortune}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold cursor-pointer transition-all shadow-md"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        คัดลอกใบเซียมซีแล้ว
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        คัดลอกคำทำนาย
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-800 hover:bg-red-900 text-white text-xs font-bold cursor-pointer transition-all shadow-md"
                  >
                    <RotateCcw className="w-4 h-4" />
                    เสี่ยงเซียมซีใหม่อีกครั้ง
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Encyclopedia of all 28 Fortune Slips */
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              สารานุกรมใบเซียมซีไทย ๒๘ ใบมงคล
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              คลิกที่ใบเซียมซีแต่ละหมายเลขเพื่ออ่านบทกลอนและคำทำนายฉบับเต็ม
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {THAI_SIAMSI_FORTUNES.map((fortune) => (
              <button
                key={fortune.number}
                onClick={() => setSelectedBrowseSlip(fortune)}
                className="glass-panel hover:border-amber-400 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 cursor-pointer hover:scale-105 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-900 to-yellow-700 border border-amber-400/50 flex flex-col items-center justify-center text-amber-200 font-bold mb-2 shadow-md group-hover:scale-110 transition-transform">
                  <span className="text-xs font-serif">ใบที่</span>
                  <span className="text-base font-extrabold">{fortune.number}</span>
                </div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 line-clamp-1">
                  {fortune.title}
                </span>
                <span className="text-[10px] text-amber-400/80 mt-1">
                  {fortune.grade.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Modal Browse Detail */}
          {selectedBrowseSlip && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
              <div className="bg-slate-950 border border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl space-y-6">
                <button
                  onClick={() => setSelectedBrowseSlip(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900 border border-amber-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>

                <div className="text-center space-y-2 border-b border-amber-900/40 pb-4">
                  <span className="text-xs font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700">
                    ใบเซียมซีหมายเลข ๑{selectedBrowseSlip.thaiNumber} ({selectedBrowseSlip.number})
                  </span>
                  <h3 className="text-2xl font-black text-amber-200">{selectedBrowseSlip.title}</h3>
                  <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold border ${getGradeBadge(selectedBrowseSlip.grade)}`}>
                    เกณฑ์ชะตา: {selectedBrowseSlip.grade}
                  </span>
                </div>

                {/* Poem */}
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-center space-y-1">
                  <span className="text-[10px] font-bold text-amber-300 block mb-1">📜 บทกลอน</span>
                  {selectedBrowseSlip.poem.map((line, i) => (
                    <p key={i} className="text-sm font-semibold text-amber-100 font-serif m-0">
                      "{line}"
                    </p>
                  ))}
                </div>

                {/* Breakdown */}
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-amber-900/40">
                    <strong className="text-amber-300 block mb-1">ภาพรวม:</strong>
                    <p className="text-slate-300 leading-relaxed">{selectedBrowseSlip.overview}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-900/40">
                      <strong className="text-blue-400 block mb-0.5">การงาน:</strong>
                      <p className="text-slate-300">{selectedBrowseSlip.work}</p>
                    </div>
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-900/40">
                      <strong className="text-emerald-400 block mb-0.5">การเงิน:</strong>
                      <p className="text-slate-300">{selectedBrowseSlip.finance}</p>
                    </div>
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-900/40">
                      <strong className="text-rose-400 block mb-0.5">ความรัก:</strong>
                      <p className="text-slate-300">{selectedBrowseSlip.love}</p>
                    </div>
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-900/40">
                      <strong className="text-cyan-400 block mb-0.5">สุขภาพ:</strong>
                      <p className="text-slate-300">{selectedBrowseSlip.health}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-950 to-amber-950 p-3.5 rounded-xl border border-amber-500/40 text-amber-200">
                    <strong className="text-amber-300 block mb-1">คำแนะนำเสริมดวง:</strong>
                    <p className="m-0">{selectedBrowseSlip.holyAdvice}</p>
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

export default ThaiSiamsiPage;
