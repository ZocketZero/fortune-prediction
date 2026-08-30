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
  const [blessingResult, setBlessingResult] = useState<EmaWishRecord | null>(null);
  const [copiedBlessing, setCopiedBlessing] = useState<boolean>(false);

  const selectedDeity = JAPAN_DEITIES.find((d) => d.id === selectedDeityId) || JAPAN_DEITIES[0];
  const selectedEmaPattern =
    selectedDeity.emaPatterns.find((p) => p.id === selectedEmaPatternId) || selectedDeity.emaPatterns[0];

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

    const randomBlessing =
      selectedDeity.blessings[Math.floor(Math.random() * selectedDeity.blessings.length)];

    setTimeout(() => {
      // Trigger sakura and gold sparks
      try {
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#f43f5e', '#fbbf24', '#fecdd3', '#ffffff']
        });
      } catch (err) {
        console.error(err);
      }

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
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }, 2200);
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
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="text-center space-y-3 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-rose-300 text-xs font-semibold tracking-wide">
          <span>⛩️</span>
          <span>神社祈願 • 奉納絵馬 • ขอพรเทพเจ้าและเขียนแผ่นป้ายเอมะ</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-rose-300 to-amber-200 tracking-tight">
          อธิษฐานขอพรเทพเจ้าญี่ปุ่น
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          เขียนความปรารถนาลงบนแผ่นไม้เอมะ (Ema) สั่นกระดิ่งศาลเจ้า และรับสาส์นพรมงคลตามธรรมเนียมชินโต
        </p>
      </div>

      {/* Result View or Ema Prayer Board View */}
      {blessingResult ? (
        <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
          {/* Ema Wooden Board Display */}
          <div className="relative rounded-3xl p-6 sm:p-10 border-2 border-amber-600/40 bg-gradient-to-b from-[#2a1a12]/95 via-[#1a120e]/95 to-slate-950/95 shadow-2xl shadow-red-950/50 backdrop-blur-xl overflow-hidden">
            {/* Top Wooden Hole with Red Ribbon */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-500 shadow-inner flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              </div>
              <div className="w-1 h-6 bg-red-600 shadow-sm" />
            </div>

            {/* Ema Board Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-amber-700/30">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-3xl shadow-lg shadow-red-600/30 text-white">
                  {blessingResult.emaPattern.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/20 text-rose-300 border border-red-500/30">
                      {blessingResult.deity.domain}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100 mt-1">
                    {blessingResult.deity.name}
                  </h2>
                  <p className="text-xs text-rose-300/80 font-medium">
                    {blessingResult.deity.japaneseName} • {blessingResult.deity.shrine}
                  </p>
                </div>
              </div>
              <div className="text-right text-xs text-amber-200/60">
                <p className="font-medium text-amber-300">奉納 (Ema Wish)</p>
                <p>{blessingResult.createdAt}</p>
              </div>
            </div>

            {/* Ema Inscribed Prayer */}
            <div className="my-6 space-y-4">
              <div className="relative p-6 rounded-2xl bg-[#fffdfa]/95 text-slate-900 shadow-xl border-4 border-[#b45309]/30">
                {/* Traditional Shrine Seal Mark */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-lg border-2 border-red-600/80 flex items-center justify-center text-red-600 font-bold text-xs rotate-[-12deg] select-none opacity-80">
                  心願成就
                </div>

                <div className="text-xs text-amber-900 font-semibold mb-2 flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-red-600" />
                  <span>ป้ายเอมะลาย: {blessingResult.emaPattern.name}</span>
                </div>

                <p className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed my-3 font-sans">
                  "{blessingResult.userWish}"
                </p>

                <div className="text-right pt-3 border-t border-amber-900/20 text-xs font-bold text-amber-950 flex justify-end items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  <span>ผู้เขียนป้าย: {blessingResult.userName}</span>
                </div>
              </div>

              {/* Shrine Divine Blessing (สาส์นพรจากเทพเจ้า) */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/40 via-slate-900/90 to-slate-950/90 border border-red-500/40 text-center space-y-3 shadow-inner">
                <div className="inline-flex items-center gap-1.5 text-xs text-rose-300 uppercase tracking-widest font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  สาส์นพรเทพเจ้าประจำศาลเจ้า (神徳)
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-amber-200">
                  {blessingResult.blessing.title}
                </h3>
                <p className="text-xs text-rose-300 font-medium tracking-wide">
                  {blessingResult.blessing.japaneseTitle}
                </p>
                <p className="text-lg text-amber-300/95 font-semibold italic">
                  "{blessingResult.blessing.verse}"
                </p>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                  {blessingResult.blessing.guidance}
                </p>

                {/* Omamori & Direction Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 max-w-md mx-auto">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-red-500/30 text-xs">
                    <span className="text-slate-400">เครื่องรางนำโชค (Omamori): </span>
                    <p className="text-rose-300 font-bold mt-0.5 text-sm">
                      {blessingResult.blessing.luckyCharm}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-red-500/30 text-xs">
                    <span className="text-slate-400">ทิศมงคลนำโชค: </span>
                    <p className="text-amber-300 font-bold mt-0.5 text-sm">
                      {blessingResult.blessing.luckyDirection}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shinto Norito Chant */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>คำสวดชินโตชำระจิตใจ (Norito)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  {blessingResult.deity.norito.japanese}
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  💡 {blessingResult.deity.norito.thaiMeaning}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={handleCopyBlessingText}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm transition-all cursor-pointer border border-slate-700 shadow-md"
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
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm transition-all cursor-pointer shadow-lg shadow-red-600/30"
              >
                <RefreshCw className="w-4 h-4" />
                <span>เขียนป้ายขอพรใหม่อีกครั้ง</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Deity Selection & Ema Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Japanese Deities Selector */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <span>⛩️</span>
              <span>เลือกเทพเจ้าและศาลเจ้าที่ต้องการขอพร</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {JAPAN_DEITIES.map((deity) => {
                const isSelected = deity.id === selectedDeity.id;
                return (
                  <button
                    key={deity.id}
                    onClick={() => handleSelectDeity(deity)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-950/60 to-slate-900/90 border-red-500/80 shadow-lg shadow-red-500/10 scale-[1.01]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-md ${
                        isSelected
                          ? 'bg-gradient-to-br from-red-600 to-rose-700 text-white'
                          : 'bg-slate-900 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {deity.avatarIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-sm sm:text-base text-slate-100">
                          {deity.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/10 text-rose-300 border border-red-500/20 shrink-0">
                          {deity.domain.split('&')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-rose-300/70 truncate mt-0.5">{deity.japaneseName}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-1">📍 {deity.shrine.split(',')[0]}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Deity Info & Ema Wish Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Deity Header Profile */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-red-500/30 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center text-3xl shadow-lg shadow-red-500/20 text-white">
                    {selectedDeity.avatarIcon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-rose-100">{selectedDeity.name}</h3>
                    <p className="text-xs text-amber-300/90">{selectedDeity.japaneseName}</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-rose-300 font-medium self-start sm:self-auto">
                  {selectedDeity.domain}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedDeity.description}
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-red-500/20 text-xs space-y-1">
                <span className="font-semibold text-amber-300">ศาลเจ้าที่ประดิษฐาน:</span>
                <p className="text-slate-300 font-medium">⛩️ {selectedDeity.shrine}</p>
              </div>
            </div>

            {/* Ema Wish Form (เขียนคำอธิษฐานลงบนแผ่นไม้เอมะ) */}
            <form onSubmit={handleStartShintoPrayer} className="p-6 rounded-3xl bg-slate-950/90 border border-red-500/30 space-y-5 shadow-2xl">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Bell className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="text-lg font-bold text-slate-100">
                  เขียนคำอธิษฐานลงบนแผ่นป้ายเอมะ (繪馬)
                </h3>
              </div>

              {/* Select Ema Board Design */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  เลือกลายแผ่นป้ายเอมะมงคล
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedDeity.emaPatterns.map((pattern) => {
                    const isSelected = selectedEmaPatternId === pattern.id;
                    return (
                      <button
                        key={pattern.id}
                        type="button"
                        onClick={() => setSelectedEmaPatternId(pattern.id)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-400 text-amber-100 shadow-md'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-2xl">{pattern.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-200">{pattern.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{pattern.symbolMeaning}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* User Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  ชื่อผู้ขอพร (เขียนลงมุมป้าย)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="เช่น สมชาย หรือใส่ชื่อเล่นของท่าน"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-red-400 transition-colors placeholder:text-slate-600"
                />
              </div>

              {/* Wish Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>คำอธิษฐานบนแผ่นไม้เอมะ (Ema Wish) <strong className="text-rose-400">*</strong></span>
                  <span className="text-[11px] text-slate-500 font-normal">ตั้งจิตให้มั่นคงและสงบ</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={userWish}
                  onChange={(e) => setUserWish(e.target.value)}
                  placeholder="เขียนสิ่งที่ท่านปรารถนาให้สำเร็จ เช่น ขอให้สอบผ่านการคัดเลือก ขอให้กิจการค้าขายเจริญรุ่งเรือง..."
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-red-400 transition-colors leading-relaxed placeholder:text-slate-600"
                />
              </div>

              {/* Suggested Wishes */}
              <div className="space-y-2">
                <p className="text-xs text-rose-300/80 font-medium">คำอธิษฐานยอดนิยมประจำองค์เทพ (คลิกเพื่อเลือก):</p>
                <div className="flex flex-col gap-1.5">
                  {selectedDeity.suggestedWishes.map((wish, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestedWish(wish)}
                      className="text-left text-xs p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800/60 hover:border-red-500/30 transition-all cursor-pointer truncate"
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
                className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                  !userWish.trim() || isRingingBell
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 hover:from-red-500 hover:to-rose-400 text-white shadow-red-600/25 hover:scale-[1.01]'
                }`}
              >
                {isRingingBell ? (
                  <>
                    <Bell className="w-5 h-5 animate-bounce text-amber-200" />
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
