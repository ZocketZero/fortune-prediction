import React, { useState } from 'react';
import { GOD_ASPECTS, GENERAL_PRAYER_VERSES, type GodAspect } from '../data/godPrayerData';
import { Sparkles, Heart, Copy, Check, RefreshCw, Send, Shield, BookOpen, Volume2, Flame } from 'lucide-react';
import { triggerDivineBlessingLight } from '../utils/lightEffects';

interface BlessingRecord {
  aspect: GodAspect;
  userName: string;
  userWish: string;
  offering: string;
  blessing: GodAspect['blessings'][0];
  isCandleLit: boolean;
  createdAt: string;
}

export const GodBlessingPage: React.FC = () => {
  const [selectedAspectId, setSelectedAspectId] = useState<string>(GOD_ASPECTS[0].id);
  const [userName, setUserName] = useState<string>('');
  const [userWish, setUserWish] = useState<string>('');
  const [selectedOffering, setSelectedOffering] = useState<string>('จิตใจแห่งการขอบพระคุณ (Gratitude)');
  const [isCandleLit, setIsCandleLit] = useState<boolean>(true);
  const [isPraying, setIsPraying] = useState<boolean>(false);
  const [prayerStage, setPrayerStage] = useState<number>(1);
  const [blessingResult, setBlessingResult] = useState<BlessingRecord | null>(null);
  const [copiedScripture, setCopiedScripture] = useState<boolean>(false);
  const [copiedBlessing, setCopiedBlessing] = useState<boolean>(false);
  const [showLordsPrayerModal, setShowLordsPrayerModal] = useState<boolean>(false);

  const selectedAspect = GOD_ASPECTS.find((a) => a.id === selectedAspectId) || GOD_ASPECTS[0];

  // Synthesizer for Celestial Choir & Cathedral Chime
  const playSacredChime = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      // Celestial pure harmonic chords (432Hz root, 648Hz fifth, 864Hz octave, 1296Hz)
      const celestialFreqs = [432, 648, 864, 1296];
      celestialFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const initialGain = 0.14 / (idx + 1);
        gain.gain.setValueAtTime(initialGain, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 4.0);
      });
    } catch {
      // Audio context fallback
    }
  };

  const handleCopyScripture = () => {
    navigator.clipboard.writeText(
      `${selectedAspect.keyScripture.verseRef}\n${selectedAspect.keyScripture.text}\n(${selectedAspect.keyScripture.translation})`
    );
    setCopiedScripture(true);
    setTimeout(() => setCopiedScripture(false), 2200);
  };

  const handleSelectSuggestedWish = (wish: string) => {
    setUserWish(wish);
  };

  const handleStartPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userWish.trim()) return;

    setIsPraying(true);
    setPrayerStage(1);
    playSacredChime();

    // Pick random blessing
    const randomBlessing =
      selectedAspect.blessings[Math.floor(Math.random() * selectedAspect.blessings.length)];

    const timer1 = setTimeout(() => {
      setPrayerStage(2);
    }, 1000);

    const timer2 = setTimeout(() => {
      setPrayerStage(3);
    }, 2000);

    const timer3 = setTimeout(() => {
      triggerDivineBlessingLight();
      playSacredChime();

      setBlessingResult({
        aspect: selectedAspect,
        userName: userName.trim() || 'ลูกของพระองค์',
        userWish: userWish.trim(),
        offering: selectedOffering,
        blessing: randomBlessing,
        isCandleLit,
        createdAt: new Date().toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });

      setIsPraying(false);
      setPrayerStage(1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleResetPrayer = () => {
    setBlessingResult(null);
    setUserWish('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyBlessingText = () => {
    if (!blessingResult) return;
    const textToCopy = `✝️ พระพรและพระสัญญาจากพระเจ้า (${blessingResult.aspect.name}) ✝️\n\nคำอธิษฐาน: "${blessingResult.userWish}"\n\nพระพรที่ได้รับ: ${blessingResult.blessing.title}\nพระคัมภีร์: ${blessingResult.blessing.verseRef} - "${blessingResult.blessing.verse}"\n\nคำหนุนใจ: ${blessingResult.blessing.guidance}\nพระสัญญา: ${blessingResult.blessing.divinePromise}\nผลแห่งพระวิญญาณ: ${blessingResult.blessing.spiritualFruit}\n\nขอสันติสุขและความรักของพระเจ้าสถิตอยู่กับท่านเป็นนิตย์ อาเมน 🙏✨`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedBlessing(true);
    setTimeout(() => setCopiedBlessing(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-8 sm:pb-12 relative">
      {/* Holy Prayer Ritual Loading Overlay */}
      {isPraying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
          {/* Radiant Beams of Light */}
          <div
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] pointer-events-none opacity-40 animate-rays-slow"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg 20deg, rgba(254, 240, 138, 0.3) 30deg 50deg, transparent 60deg 80deg, rgba(254, 240, 138, 0.35) 90deg 110deg, transparent 120deg 140deg, rgba(254, 240, 138, 0.3) 150deg 170deg, transparent 180deg 200deg, rgba(254, 240, 138, 0.35) 210deg 230deg, transparent 240deg 260deg, rgba(254, 240, 138, 0.3) 270deg 290deg, transparent 300deg 320deg, rgba(254, 240, 138, 0.35) 330deg 350deg, transparent 360deg)'
            }}
          />

          {/* Luminous Glowing Spheres */}
          <div className="absolute w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full bg-amber-400/20 blur-3xl animate-pulse pointer-events-none" />
          <div className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-sky-400/20 blur-2xl animate-sacred-aura pointer-events-none" />

          {/* Ascending Light Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="absolute text-amber-200 animate-particle-up text-sm sm:text-base"
                style={{
                  left: `${10 + (i * 6.5) % 80}%`,
                  bottom: `${10 + (i * 11) % 45}%`,
                  animationDelay: `${i * 0.28}s`,
                  animationDuration: `${2.6 + (i % 3)}s`
                }}
              >
                🕊️
              </div>
            ))}
          </div>

          {/* Prayer Transmission Card */}
          <div className="relative z-10 max-w-md w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950/95 border-2 border-amber-300/60 shadow-2xl shadow-amber-400/30 text-center space-y-5">
            <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-amber-300/40 animate-ping opacity-60" />
              <div className="absolute -inset-2 rounded-full border border-amber-300/30 animate-pulse" />
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shadow-amber-400/40 text-slate-950">
                {selectedAspect.avatarIcon}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {selectedAspect.name}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-amber-100">
                คำอธิษฐานกำลังขึ้นสู่เบื้องพระพักตร์
              </h3>
            </div>

            {/* Prayer Progression Animation Steps */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>
                  {prayerStage === 1 && '๑. สงบจิตใจ วางภาระลง และเข้าเฝ้าด้วยใจขอบพระคุณ...'}
                  {prayerStage === 2 && '๒. ส่งคำอธิษฐานและเสียงจากหัวใจขึ้นสู่ฟ้าสวรรค์...'}
                  {prayerStage === 3 && '๓. พระบิดารับฟังและประทานพระพรแห่งพระสัญญาอันบริสุทธิ์...'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 italic">
                "{userWish.length > 50 ? userWish.slice(0, 50) + '...' : userWish}"
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-amber-500/30">
              <div
                className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${(prayerStage / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* The Lord's Prayer Modal */}
      {showLordsPrayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-xl w-full p-5 sm:p-7 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 text-lg">
                  ✝️
                </div>
                <h3 className="text-base sm:text-lg font-bold text-amber-200">
                  {selectedAspect.theLordsPrayer.title}
                </h3>
              </div>
              <button
                onClick={() => setShowLordsPrayerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/20 text-xs sm:text-sm leading-relaxed text-amber-100/90 whitespace-pre-line font-medium max-h-[60vh] overflow-y-auto">
              {selectedAspect.theLordsPrayer.content}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedAspect.theLordsPrayer.content);
                  setCopiedScripture(true);
                  setTimeout(() => setCopiedScripture(false), 2000);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-all cursor-pointer"
              >
                {copiedScripture ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedScripture ? 'คัดลอกแล้ว' : 'คัดลอกบทอธิษฐาน'}
              </button>

              <button
                onClick={() => setShowLordsPrayerModal(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="text-center space-y-2.5 sm:space-y-3 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>ขอพรพระเจ้า • พระสัญญาแห่งความหวังและสันติสุขนิรันดร์</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black gold-gradient-text tracking-tight leading-tight px-1">
          อธิษฐานขอพรพระเจ้า
        </h1>
        <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed px-2">
          สงบจิตใจ วางภาระความกังวลลง จุดเทียนศักดิ์สิทธิ์ และทูลขอพรด้วยความเชื่อมั่นในความรักอันยิ่งใหญ่
        </p>
      </div>

      {/* Result View or Prayer Form View */}
      {blessingResult ? (
        <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto anim-blessing-reveal relative">
          {/* Luminous Background Halo */}
          <div
            className="absolute top-1/2 left-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] pointer-events-none opacity-20 animate-rays-slow"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg 20deg, rgba(254, 240, 138, 0.4) 30deg 50deg, transparent 60deg 80deg, rgba(254, 240, 138, 0.4) 90deg 110deg, transparent 120deg 140deg, rgba(254, 240, 138, 0.4) 150deg 170deg, transparent 180deg 200deg, rgba(254, 240, 138, 0.4) 210deg 230deg, transparent 240deg 260deg, rgba(254, 240, 138, 0.4) 270deg 290deg, transparent 300deg 320deg, rgba(254, 240, 138, 0.4) 330deg 350deg, transparent 360deg)'
            }}
          />

          {/* Card: Sacred Divine Blessing Result */}
          <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 sm:p-10 border-2 border-amber-400/50 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950/95 shadow-2xl shadow-amber-400/20 backdrop-blur-xl overflow-hidden">
            {/* Header with Aspect Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 flex items-center justify-center text-3xl shadow-lg shadow-amber-400/30 text-slate-950 shrink-0">
                  {blessingResult.aspect.avatarIcon}
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-bold text-amber-300 tracking-wider uppercase">
                      สาส์นพระพรศักดิ์สิทธิ์
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {blessingResult.aspect.name}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black text-amber-100 mt-0.5">
                    {blessingResult.blessing.title}
                  </h2>
                </div>
              </div>

              {/* Lit Candle Badge */}
              {blessingResult.isCandleLit && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold shadow-inner">
                  <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>เปลวเทียนแห่งความหวังสว่างไสว</span>
                </div>
              )}
            </div>

            {/* Prayer Summary Box */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-amber-300">ผู้อธิษฐาน: {blessingResult.userName}</span>
                <span>{blessingResult.createdAt}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 italic font-medium leading-relaxed">
                “{blessingResult.userWish}”
              </p>
              <div className="text-[11px] text-amber-300/80 flex items-center gap-1.5 pt-1">
                <Heart className="w-3 h-3 text-rose-400" />
                <span>เครื่องบูชาทางใจ: {blessingResult.offering}</span>
              </div>
            </div>

            {/* Scripture & Blessing Body */}
            <div className="mt-6 space-y-5">
              {/* Key Scripture Quote */}
              <div className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-transparent border-l-4 border-amber-400 bg-slate-900/60 shadow-inner">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>พระวจนะหนุนใจ • {blessingResult.blessing.verseRef}</span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-amber-100 leading-relaxed italic">
                  "{blessingResult.blessing.verse}"
                </p>
              </div>

              {/* Guidance & Divine Promise */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> คำหนุนใจสำหรับท่าน
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {blessingResult.blessing.guidance}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Shield className="w-3 h-3" /> พระสัญญาที่มั่นคง
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {blessingResult.blessing.divinePromise}
                  </p>
                </div>
              </div>

              {/* Spiritual Fruits & Sacred Guidance */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                    ผลแห่งพระวิญญาณในชีวิตท่าน
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-amber-200">
                    {blessingResult.blessing.spiritualFruit}
                  </p>
                </div>

                {blessingResult.blessing.luckyNumber && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                      เลขแห่งพระคุณนำทาง
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-amber-300">
                      {blessingResult.blessing.luckyNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-amber-500/20">
              <button
                onClick={handleCopyBlessingText}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shadow-md"
              >
                {copiedBlessing ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedBlessing ? 'คัดลอกพระพรแล้ว' : 'คัดลอกข้อความพระพร'}
              </button>

              <button
                onClick={handleResetPrayer}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer shadow-lg shadow-amber-500/30 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                อธิษฐานขอพรเรื่องอื่น
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Form & Deity Selection View */
        <div className="space-y-6 sm:space-y-8">
          {/* Aspect of God Selector Tabs */}
          <div className="space-y-2.5">
            <label className="text-xs sm:text-sm font-bold text-amber-200 flex items-center gap-1.5">
              <span>✝️ เลือกคุณลักษณะหรือองค์พระผู้เป็นเจ้าที่ต้องการเข้าเฝ้าอธิษฐาน</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
              {GOD_ASPECTS.map((aspect) => {
                const isSelected = aspect.id === selectedAspectId;
                return (
                  <button
                    key={aspect.id}
                    onClick={() => setSelectedAspectId(aspect.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 text-center cursor-pointer group ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-400 shadow-lg shadow-amber-400/20 scale-[1.02]'
                        : 'bg-slate-950/70 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/60'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl transition-transform duration-200 group-hover:scale-110 shadow-md ${
                        isSelected ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950' : 'bg-slate-900 text-amber-300'
                      }`}
                    >
                      {aspect.avatarIcon}
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-100 mt-2 truncate w-full">
                      {aspect.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                      {aspect.category.split('&')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Deity Showcase Banner */}
          <div className="relative rounded-3xl p-5 sm:p-7 border border-amber-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-950/90 backdrop-blur-xl shadow-xl overflow-hidden space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-amber-500/30 text-slate-950 shrink-0">
                  {selectedAspect.avatarIcon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-amber-100">
                      {selectedAspect.name}
                    </h2>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                      {selectedAspect.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-200/80 mt-0.5 font-medium">
                    {selectedAspect.subTitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Sound & Lord's prayer */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={playSacredChime}
                  title="ฟังเสียงระฆังศักดิ์สิทธิ์ (Sacred Cathedral Chime)"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 text-amber-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>เสียงระฆังศักดิ์สิทธิ์</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLordsPrayerModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{selectedAspect.theLordsPrayer.title}</span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedAspect.description}
            </p>

            {/* Highlights Tag list */}
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedAspect.highlightAspects.map((aspect, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  {aspect}
                </span>
              ))}
            </div>

            {/* Key Scripture Quote Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300">
                    📖 พระวจนะประจำองค์ • {selectedAspect.keyScripture.verseRef}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-100 italic leading-relaxed">
                  {selectedAspect.keyScripture.text}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyScripture}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-[11px] font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedScripture ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedScripture ? 'คัดลอกแล้ว' : 'คัดลอกข้อพระคัมภีร์'}
              </button>
            </div>
          </div>

          {/* Interactive Prayer Altar & Form */}
          <form onSubmit={handleStartPrayer} className="space-y-6">
            <div className="rounded-3xl p-5 sm:p-8 border border-amber-500/30 bg-slate-950/80 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                  <h3 className="text-base sm:text-lg font-bold text-amber-200">
                    แท่นอธิษฐานจิตและถวายความปรารถนา
                  </h3>
                </div>

                {/* Holy Candle Toggle */}
                <button
                  type="button"
                  onClick={() => setIsCandleLit(!isCandleLit)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    isCandleLit
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-400/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Flame className={`w-4 h-4 ${isCandleLit ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
                  <span>{isCandleLit ? 'จุดเทียนอธิษฐานแล้ว 🕯️' : 'คลิกเพื่อจุดเทียน 🕯️'}</span>
                </button>
              </div>

              {/* User Name Input (Optional) */}
              <div className="space-y-2">
                <label htmlFor="user-name" className="text-xs sm:text-sm font-bold text-slate-200 block">
                  ชื่อของท่าน (ไม่บังคับระบุ)
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="เช่น มารีอา, ดาวิด หรือ ลูกของพระองค์..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-amber-400 focus:outline-none text-slate-100 text-xs sm:text-sm transition-all"
                />
              </div>

              {/* Heart Offering Selection */}
              <div className="space-y-2.5">
                <label className="text-xs sm:text-sm font-bold text-slate-200 block">
                  เครื่องบูชาทางจิตใจที่ท่านต้องการถวายแด่พระองค์
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedAspect.recommendedHeartOfferings.map((offering, idx) => {
                    const isSelected = selectedOffering === offering;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedOffering(offering)}
                        className={`px-3.5 py-2.5 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Heart className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
                          {offering}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* User Wish Input */}
              <div className="space-y-2">
                <label htmlFor="user-prayer" className="text-xs sm:text-sm font-bold text-slate-200 block">
                  พิมพ์คำอธิษฐานจากก้นบึ้งหัวใจ <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="user-prayer"
                  rows={4}
                  value={userWish}
                  onChange={(e) => setUserWish(e.target.value)}
                  placeholder="เขียนเรื่องราว ความกังวล หรือสิ่งดีๆ ที่ต้องการทูลขอพระเมตตาและการทรงนำจากพระเจ้า..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-amber-400 focus:outline-none text-slate-100 text-xs sm:text-sm leading-relaxed transition-all resize-none shadow-inner"
                  required
                />
              </div>

              {/* Suggested Prayer Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-amber-300/80 block">
                  💡 หรือเลือกคำอธิษฐานแนะนำ:
                </span>
                <div className="flex flex-col gap-1.5">
                  {selectedAspect.suggestedWishes.map((wish, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestedWish(wish)}
                      className="text-left px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/30 text-[11px] sm:text-xs text-slate-300 hover:text-amber-200 transition-all cursor-pointer leading-relaxed"
                    >
                      • {wish}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!userWish.trim()}
                  className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all duration-200 cursor-pointer active:scale-[0.99]"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>น้อมส่งคำอธิษฐานและรับพระพร (Amen)</span>
                </button>
              </div>
            </div>
          </form>

          {/* Daily General Encouraging Scripture Cards */}
          <div className="rounded-3xl p-5 sm:p-7 border border-slate-800 bg-slate-950/60 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm sm:text-base font-bold text-amber-200">
                พระคัมภีร์หนุนใจประจำวันสำหรับทุกสถานการณ์
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GENERAL_PRAYER_VERSES.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                    <span>{item.topic}</span>
                    <span className="text-slate-400">{item.verse}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    {item.quote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
