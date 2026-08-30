import React, { useState } from 'react';
import { THAI_DEITIES, type ThaiDeity } from '../data/thaiDeitiesData';
import { Sparkles, Flame, Copy, Check, RefreshCw, Send, Heart, Star, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WishRecord {
  deity: ThaiDeity;
  userName: string;
  userWish: string;
  offering: string;
  blessing: ThaiDeity['blessings'][0];
  createdAt: string;
}

export const ThaiBlessingPage: React.FC = () => {
  const [selectedDeityId, setSelectedDeityId] = useState<string>(THAI_DEITIES[0].id);
  const [userName, setUserName] = useState<string>('');
  const [userWish, setUserWish] = useState<string>('');
  const [selectedOffering, setSelectedOffering] = useState<string>('ธูปและพวงมาลัยดอกไม้สด');
  const [isPraying, setIsPraying] = useState<boolean>(false);
  const [blessingResult, setBlessingResult] = useState<WishRecord | null>(null);
  const [copiedMantra, setCopiedMantra] = useState<boolean>(false);
  const [copiedBlessing, setCopiedBlessing] = useState<boolean>(false);

  const selectedDeity = THAI_DEITIES.find((d) => d.id === selectedDeityId) || THAI_DEITIES[0];

  const handleCopyMantra = () => {
    navigator.clipboard.writeText(selectedDeity.mantra.full);
    setCopiedMantra(true);
    setTimeout(() => setCopiedMantra(false), 2000);
  };

  const handleSelectSuggestedWish = (wish: string) => {
    setUserWish(wish);
  };

  const handleStartPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userWish.trim()) return;

    setIsPraying(true);

    // Pick random blessing
    const randomBlessing =
      selectedDeity.blessings[Math.floor(Math.random() * selectedDeity.blessings.length)];

    setTimeout(() => {
      // Trigger golden confetti
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#f43f5e', '#a855f7', '#ffffff']
        });
      } catch (err) {
        console.error(err);
      }

      setBlessingResult({
        deity: selectedDeity,
        userName: userName.trim() || 'ผู้มีจิตศรัทธา',
        userWish: userWish.trim(),
        offering: selectedOffering,
        blessing: randomBlessing,
        createdAt: new Date().toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });

      setIsPraying(false);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }, 2200);
  };

  const handleResetPrayer = () => {
    setBlessingResult(null);
    setUserWish('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyBlessingText = () => {
    if (!blessingResult) return;
    const textToCopy = `✨ สาส์นพรศักดิ์สิทธิ์จาก ${blessingResult.deity.name} ✨\n\nคำอธิษฐาน: "${blessingResult.userWish}"\n\nบทประทานพร: ${blessingResult.blessing.title}\n"${blessingResult.blessing.verse}"\n${blessingResult.blessing.guidance}\n\nเลขมงคล: ${blessingResult.blessing.luckyNumber} | สีมงคล: ${blessingResult.blessing.color}\n\nขอให้คำอธิษฐานของท่านสัมฤทธิ์ผลด้วยเทอญ สาธุ 🙏`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedBlessing(true);
    setTimeout(() => setCopiedBlessing(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-8 sm:pb-12">
      {/* Header Banner */}
      <div className="text-center space-y-2.5 sm:space-y-3 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-semibold tracking-wide">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>ขอพรสิ่งศักดิ์สิทธิ์ • เสริมสิริมงคลดลบันดาลสุข</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black gold-gradient-text tracking-tight leading-tight px-1">
          อธิษฐานขอพรเทพเจ้าไทย
        </h1>
        <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed px-2">
          น้อมจิตระลึกถึงพระคุณอันประเสริฐ สวดคาถาบูชา และตั้งจิตอธิษฐานเขียนความปรารถนาต่อองค์เทพ
        </p>
      </div>

      {/* Result View or Prayer Form View */}
      {blessingResult ? (
        <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto animate-fadeIn">
          {/* Card: Sacred Blessing Result */}
          <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-8 sm:p-10 border border-amber-500/40 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950/95 shadow-2xl shadow-amber-500/10 backdrop-blur-xl overflow-hidden">
            {/* Background Aura */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Deity Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-amber-500/20 text-center sm:text-left">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-amber-500/30 shrink-0">
                  {blessingResult.deity.avatarIcon}
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {blessingResult.deity.category}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-amber-200 mt-1">
                    {blessingResult.deity.name}
                  </h2>
                  <p className="text-xs text-slate-400">{blessingResult.deity.title}</p>
                </div>
              </div>
              <div className="text-center sm:text-right text-xs text-slate-400">
                <p className="font-medium text-amber-300/80">บันทึกจิตอธิษฐาน</p>
                <p>{blessingResult.createdAt}</p>
              </div>
            </div>

            {/* Wish & Intention Content */}
            <div className="my-4 sm:my-6 space-y-3 sm:space-y-4">
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-xs text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1.5 text-amber-300/90 font-medium">
                    <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    คำอธิษฐานของ: <strong className="text-slate-100">{blessingResult.userName}</strong>
                  </span>
                  <span className="text-slate-500 text-[11px]">ถวาย: {blessingResult.offering}</span>
                </div>
                <p className="text-sm sm:text-lg text-slate-100 font-medium leading-relaxed italic bg-amber-950/20 p-2.5 sm:p-3 rounded-xl border-l-4 border-amber-400">
                  "{blessingResult.userWish}"
                </p>
              </div>

              {/* Divine Blessing Box */}
              <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/15 via-purple-900/20 to-slate-900/90 border border-amber-500/40 text-center space-y-2.5 sm:space-y-3 shadow-inner">
                <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 uppercase tracking-widest font-bold">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                  สาส์นพรและมนตรานำทาง
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-amber-100">
                  {blessingResult.blessing.title}
                </h3>
                <p className="text-base sm:text-lg text-amber-300/95 font-semibold font-cinzel italic">
                  "{blessingResult.blessing.verse}"
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                  {blessingResult.blessing.guidance}
                </p>

                {/* Lucky details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2 sm:pt-3 max-w-md mx-auto">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/20 text-xs">
                    <span className="text-slate-400">เลขมงคลหนุนดวง: </span>
                    <strong className="text-amber-300 font-bold ml-1 text-sm">
                      {blessingResult.blessing.luckyNumber}
                    </strong>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/20 text-xs">
                    <span className="text-slate-400">สีมงคลเสริมโชค: </span>
                    <strong className="text-amber-300 font-bold ml-1 text-sm">
                      {blessingResult.blessing.color}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Mantra Reminder */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-300">คาถาบูชาประจำวันเพื่อหนุนส่งพร</span>
                  <button
                    onClick={handleCopyMantra}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors active:scale-95 cursor-pointer"
                  >
                    {copiedMantra ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMantra ? 'คัดลอกแล้ว' : 'คัดลอกคาถา'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-amber-200/90 whitespace-pre-line font-medium leading-relaxed">
                  {blessingResult.deity.mantra.short}
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
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>คัดลอกสาส์นพรมงคล</span>
                  </>
                )}
              </button>
              <button
                onClick={handleResetPrayer}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>อธิษฐานขอพรใหม่อีกครั้ง</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Prayer Selection and Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Deity Selector */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-200 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>เลือกองค์เทพที่ต้องการขอพร</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
              {THAI_DEITIES.map((deity) => {
                const isSelected = deity.id === selectedDeity.id;
                return (
                  <button
                    key={deity.id}
                    onClick={() => setSelectedDeityId(deity.id)}
                    className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-left transition-all duration-200 border cursor-pointer active:scale-[0.99] ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-950/60 to-slate-900/90 border-amber-400/80 shadow-lg shadow-amber-500/10 scale-[1.01]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-md ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950'
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
                        <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                          {deity.category.split('&')[0]}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-amber-200/70 truncate mt-0.5">{deity.subTitle}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {deity.highlightAspects.slice(0, 2).map((aspect, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300"
                          >
                            • {aspect}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Deity Info & Wish Form */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Deity Header Card */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950/80 border border-amber-500/30 space-y-3 sm:space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-amber-500/20 shrink-0">
                    {selectedDeity.avatarIcon}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-amber-200">{selectedDeity.name}</h3>
                    <p className="text-xs text-amber-300/80">{selectedDeity.title}</p>
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium self-start sm:self-auto">
                  {selectedDeity.category}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedDeity.description}
              </p>

              {/* Mantra Card */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    บทสวด/คาถาบูชา
                  </span>
                  <button
                    onClick={handleCopyMantra}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-medium cursor-pointer active:scale-95"
                  >
                    {copiedMantra ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMantra ? 'คัดลอกแล้ว' : 'คัดลอกคาถา'}</span>
                  </button>
                </div>
                <div className="bg-slate-950/80 p-2.5 sm:p-3 rounded-xl border border-slate-800">
                  <p className="text-xs sm:text-sm text-amber-100/95 font-semibold leading-relaxed whitespace-pre-line">
                    {selectedDeity.mantra.full}
                  </p>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 italic">
                  💡 คำแปล: {selectedDeity.mantra.translation}
                </p>
              </div>

              {/* Offerings */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 pt-1">
                <span className="text-amber-400 font-medium text-[11px] sm:text-xs">เครื่องบูชาแนะนำ:</span>
                {selectedDeity.recommendedOfferings.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-[10px] sm:text-[11px]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Wish Form (เขียนคำอธิษฐาน) */}
            <form onSubmit={handleStartPrayer} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950/90 border border-amber-500/30 space-y-4 sm:space-y-5 shadow-2xl">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  เขียนคำอธิษฐานจิตแด่ {selectedDeity.name}
                </h3>
              </div>

              {/* User Name */}
              <div className="space-y-1 sm:space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  ชื่อ-นามสกุล หรือชื่อเล่น (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="เช่น มานะ ใจดี หรือใส่ชื่อเล่นของท่าน"
                  className="w-full px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder:text-slate-600"
                />
              </div>

              {/* Offering Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  น้อมถวายเครื่องบูชาทางใจ
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'ธูป 9 ดอก และพวงมาลัยดอกไม้สด',
                    'ดอกบัวคู่ และจิตอันบริสุทธิ์',
                    'การบำเพ็ญกุศลและแบ่งปันความดี'
                  ].map((offering) => (
                    <button
                      key={offering}
                      type="button"
                      onClick={() => setSelectedOffering(offering)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer active:scale-95 ${
                        selectedOffering === offering
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {offering}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Wish Textarea */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>ระบุคำอธิษฐาน / สิ่งที่ปรารถนาให้สำเร็จ <strong className="text-rose-400">*</strong></span>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal">ขอเรื่องที่ดีงาม</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={userWish}
                  onChange={(e) => setUserWish(e.target.value)}
                  placeholder="เขียนคำอธิษฐานจากใจของท่าน เช่น ขอให้งานโปรเจกต์นี้สำเร็จลุล่วง ขอให้ผ่านการสอบครั้งนี้ ขอให้มีความรักที่มั่นคง..."
                  className="w-full p-3 sm:p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors leading-relaxed placeholder:text-slate-600"
                />
              </div>

              {/* Suggested Wishes */}
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-[11px] sm:text-xs text-amber-300/80 font-medium">ตัวอย่างคำอธิษฐานยอดนิยม (คลิกเพื่อเลือก):</p>
                <div className="flex flex-col gap-1.5">
                  {selectedDeity.suggestedWishes.map((wish, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestedWish(wish)}
                      className="text-left text-xs p-2 sm:p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800/60 hover:border-amber-500/30 transition-all cursor-pointer truncate active:scale-[0.99]"
                    >
                      ✨ {wish}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!userWish.trim() || isPraying}
                className={`w-full py-3 sm:py-3.5 px-6 rounded-xl sm:rounded-2xl font-extrabold text-xs sm:text-base flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer active:scale-95 ${
                  !userWish.trim() || isPraying
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/25 hover:scale-[1.01]'
                }`}
              >
                {isPraying ? (
                  <>
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce text-amber-950" />
                    <span>กำลังตั้งจิตน้อมส่งคำอธิษฐาน...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-950" />
                    <span>น้อมส่งจิตอธิษฐานขอพร</span>
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
