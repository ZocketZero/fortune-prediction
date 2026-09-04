import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Briefcase,
  Activity,
  Copy,
  Check,
  User,
  Users,
  Compass,
  Zap,
  Flame,
  Star,
  ShieldCheck,
  Coffee,
  AlertCircle,
  HelpCircle,
  Apple
} from 'lucide-react';
import {
  BLOOD_TYPE_FORTUNES,
  getBloodTypeFortune,
  getBloodCompatibility
} from '../data/bloodTypeData';
import type { BloodType } from '../data/bloodTypeData';
import { triggerMysticTarotLight } from '../utils/lightEffects';
import { getStorageWithTTL, setStorageWithTTL } from '../utils/storage';

const BLOOD_STORAGE_KEY = 'fortune_blood_type_selected';

export const BloodFortunePage: React.FC = () => {
  const initialBlood = getStorageWithTTL<BloodType>(BLOOD_STORAGE_KEY) || 'A';
  const [selectedBlood, setSelectedBlood] = useState<BloodType>(initialBlood);
  const [activeTab, setActiveTab] = useState<'overview' | 'love' | 'career' | 'wellness' | 'match'>('overview');

  // Matcher state
  const [partnerBlood, setPartnerBlood] = useState<BloodType>('O');
  const [copied, setCopied] = useState<boolean>(false);

  const currentFortune = getBloodTypeFortune(selectedBlood);
  const compatibility = getBloodCompatibility(selectedBlood, partnerBlood);

  const handleSelectBlood = (type: BloodType) => {
    setSelectedBlood(type);
    setStorageWithTTL<BloodType>(BLOOD_STORAGE_KEY, type);
    triggerMysticTarotLight();
  };

  const handleCopySummary = () => {
    const text = `🩸 ทำนายบุคลิกตามกรุ๊ปเลือด: ${currentFortune.thaiTitle} (${currentFortune.englishTitle})\n` +
      `✨ ฉายา: ${currentFortune.archetype}\n` +
      `💡 สโลแกน: "${currentFortune.tagline}"\n\n` +
      `🌟 นิสัยเด่น: ${currentFortune.overview.traits.slice(0, 3).join(', ')}\n` +
      `❤️ ความรัก: ${currentFortune.love.style}\n` +
      `💼 การงาน: ${currentFortune.career.workStyle}\n` +
      `🥗 สุขภาพ: ${currentFortune.wellness.healthAdvice}\n\n` +
      `🔮 ดูดวงและตรวจความเข้ากันได้ของกรุ๊ปเลือดต่อได้ที่ Fortune Prediction`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="text-center space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          <span className="text-sm leading-none">🩸</span>
          <span>ศาสตร์พยากรณ์กรุ๊ปเลือดญี่ปุ่น (Ketsuekigata)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black gold-gradient-text tracking-tight font-cinzel-decorative">
          ทำนายบุคลิกนิสัยและดวงชะตาจากกรุ๊ปเลือด
        </h1>
        <p className="text-xs sm:text-sm text-slate-300/90 max-w-2xl mx-auto leading-relaxed px-2">
          ถอดรหัสตัวตน จิตวิทยาความรัก สไตล์การทำงาน โภชนาการดูแลสุขภาพตามกรุ๊ปเลือด พร้อมระบบคำนวณเคมีหัวใจความเข้ากันได้แบบแม่นยำ
        </p>
      </div>

      {/* Blood Type Selection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {(['A', 'B', 'O', 'AB'] as BloodType[]).map((type) => {
          const item = BLOOD_TYPE_FORTUNES[type];
          const isSelected = selectedBlood === type;
          return (
            <button
              key={type}
              onClick={() => handleSelectBlood(type)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left flex flex-col justify-between relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-900/90 border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <span className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  isSelected ? 'gold-gradient-text' : 'text-slate-300'
                }`}>
                  กรุ๊ป {type}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${item.colorTheme.badge}`}>
                  {type}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200 line-clamp-1">{item.archetype}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{item.elementVibe}</p>
              </div>
              {isSelected && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Result Card */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header of selected blood */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black gold-gradient-text font-cinzel-decorative">
                  {currentFortune.thaiTitle}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full font-bold border ${currentFortune.colorTheme.badge}`}>
                  {currentFortune.archetype}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                  {currentFortune.elementVibe}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 italic">
                "{currentFortune.tagline}"
              </p>
            </div>

            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกเรียบร้อย' : 'แชร์ผลทำนาย'}</span>
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>บุคลิก & ตัวตน</span>
            </button>

            <button
              onClick={() => setActiveTab('love')}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'love'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>ความรัก & มัดใจ</span>
            </button>

            <button
              onClick={() => setActiveTab('career')}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'career'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>การงาน & ภาวะผู้นำ</span>
            </button>

            <button
              onClick={() => setActiveTab('wellness')}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'wellness'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>สุขภาพ & อาหาร</span>
            </button>

            <button
              onClick={() => setActiveTab('match')}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'match'
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>จับคู่ความเข้ากันได้ 💕</span>
            </button>
          </div>

          {/* TAB CONTENT: 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Summary card */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 leading-relaxed text-sm text-slate-200">
                <h3 className="text-base font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  ภาพรวมบุคลิกและธรรมชาติของกรุ๊ป {currentFortune.type}
                </h3>
                <p>{currentFortune.overview.summary}</p>
              </div>

              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    จุดเด่นและพรสวรรค์ (Strengths)
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                    {currentFortune.overview.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5 space-y-3">
                  <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    จุดควรระวังและข้อปรับปรุง (Weaknesses)
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                    {currentFortune.overview.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Hidden Secret */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-indigo-300">มุมลึกๆ ในใจที่คนอื่นอาจไม่รู้ (Hidden Secret)</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {currentFortune.overview.hiddenSecret}
                  </p>
                </div>
              </div>

              {/* Lucky Elements */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center">
                  <span className="text-[11px] text-slate-400">สีเสริมพลัง</span>
                  <p className="text-xs sm:text-sm font-bold text-amber-300 mt-1">
                    {currentFortune.luckyElements.colors.join(', ')}
                  </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center">
                  <span className="text-[11px] text-slate-400">ตัวเลขนำโชค</span>
                  <p className="text-xs sm:text-sm font-bold text-amber-300 mt-1">
                    {currentFortune.luckyElements.numbers.join(', ')}
                  </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center">
                  <span className="text-[11px] text-slate-400">อัญมณีเสริมดวง</span>
                  <p className="text-xs sm:text-sm font-bold text-amber-300 mt-1 line-clamp-1">
                    {currentFortune.luckyElements.gems[0]}
                  </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center">
                  <span className="text-[11px] text-slate-400">ชั่วโมงทองคำ</span>
                  <p className="text-[11px] sm:text-xs font-bold text-amber-300 mt-1 line-clamp-2">
                    {currentFortune.luckyElements.bestHour}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 2. LOVE */}
          {activeTab === 'love' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Love Style */}
                <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5 space-y-2.5">
                  <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    สไตล์ความรักเวลามีคู่
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {currentFortune.love.style}
                  </p>
                </div>

                {/* Flirting Style */}
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-2.5">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    ลีลาการจีบและแสดงออกเมื่อตกหลุมรัก
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {currentFortune.love.flirtingStyle}
                  </p>
                </div>
              </div>

              {/* How to win heart */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  วิธีพิชิตใจคนกรุ๊ป {currentFortune.type} (How to win their heart)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentFortune.love.howToWinHeart.map((tip, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-200">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dealbreaker & Ideal partner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
                  <p className="text-xs font-bold text-red-400 mb-1">🚫 สิ่งที่รับไม่ได้ในความสัมพันธ์ (Dealbreaker):</p>
                  <p className="text-xs sm:text-sm text-slate-200">{currentFortune.love.dealbreaker}</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
                  <p className="text-xs font-bold text-purple-300 mb-1">✨ คนรักในอุดมคติ (Ideal Match):</p>
                  <p className="text-xs sm:text-sm text-slate-200">{currentFortune.love.idealPartnerTrait}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 3. CAREER */}
          {activeTab === 'career' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  สไตล์การทำงานและการบริหารงาน
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {currentFortune.career.workStyle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths at work */}
                <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-5 space-y-2.5">
                  <h4 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    จุดเด่นในที่ทำงาน
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                    {currentFortune.career.strengthsAtWork.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Leadership & Stress */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                    <h5 className="text-xs font-bold text-amber-300">ภาวะผู้นำ (Leadership Style):</h5>
                    <p className="text-xs sm:text-sm text-slate-200">{currentFortune.career.leadershipStyle}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                    <h5 className="text-xs font-bold text-rose-300">สิ่งที่ทำให้เกิดความเครียดในงาน:</h5>
                    <p className="text-xs sm:text-sm text-slate-200">{currentFortune.career.stressTrigger}</p>
                  </div>
                </div>
              </div>

              {/* Suitable Careers */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  อาชีพและสายงานที่เหมาะสมอย่างยิ่ง
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentFortune.career.suitableCareers.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs sm:text-sm font-medium text-slate-200 hover:border-amber-500/50 transition-colors"
                    >
                      💼 {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 4. WELLNESS */}
          {activeTab === 'wellness' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  คำแนะนำด้านสุขภาพโดยรวมของกรุ๊ป {currentFortune.type}
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {currentFortune.wellness.healthAdvice}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Beneficial Foods */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/40 space-y-3">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Apple className="w-4 h-4" />
                    อาหารที่ถูกโฉลกและเสริมสุขภาพ (Beneficial Foods)
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                    {currentFortune.wellness.beneficialFoods.map((food, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Avoid Foods */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/40 space-y-3">
                  <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    อาหารที่ควรลดหรือหลีกเลี่ยง (Foods to Avoid)
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                    {currentFortune.wellness.avoidFoods.map((food, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-rose-400">✕</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <h5 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    รูปแบบการออกกำลังกายที่เหมาะสม:
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-200">{currentFortune.wellness.exerciseStyle}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5" />
                    เคล็ดลับการคลายเครียด:
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-200">{currentFortune.wellness.stressReliefTip}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 5. MATCHER (COMPATIBILITY) */}
          {activeTab === 'match' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Select Partner Blood Type */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                      <Users className="w-4 h-4 text-rose-400" />
                      คำนวณเคมีความเข้ากันได้: กรุ๊ป {selectedBlood} กับใครดี?
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      เลือกกรุ๊ปเลือดของคนรู้ใจ เพื่อนสนิท หรือเพื่อนร่วมงานที่ต้องการตรวจสอบ
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {(['A', 'B', 'O', 'AB'] as BloodType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setPartnerBlood(type)}
                        className={`w-10 h-10 rounded-xl font-black text-sm transition-all cursor-pointer ${
                          partnerBlood === type
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105'
                            : 'bg-slate-950 text-slate-300 border border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Match Result Display */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-rose-500/30 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xl flex items-center justify-center">
                      {selectedBlood}
                    </div>
                    <span className="text-xl text-rose-400 font-bold">❤️</span>
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-xl flex items-center justify-center">
                      {partnerBlood}
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-slate-400">ระดับความเข้ากันได้</p>
                      <h3 className="text-lg font-black text-slate-100">{compatibility.ratingLevel}</h3>
                    </div>
                  </div>

                  {/* Score circle badge */}
                  <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-amber-500/40">
                    <span className="text-xs text-slate-400">ดัชนีเคมี</span>
                    <span className="text-2xl font-black gold-gradient-text">{compatibility.score}%</span>
                  </div>
                </div>

                {/* Match Details */}
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-1">
                    <h5 className="font-bold text-amber-300">ภาพรวมความสัมพันธ์:</h5>
                    <p className="text-slate-200 leading-relaxed">{compatibility.overview}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-rose-950/20 p-4 rounded-xl border border-rose-500/30 space-y-1">
                      <h5 className="font-bold text-rose-300 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5" />
                        เคมีหัวใจ & ข้อควรระวัง:
                      </h5>
                      <p className="text-slate-200 leading-relaxed">{compatibility.relationshipAdvice}</p>
                    </div>

                    <div className="bg-blue-950/20 p-4 rounded-xl border border-blue-500/30 space-y-1">
                      <h5 className="font-bold text-blue-300 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        การทำงานและร่วมมือกัน:
                      </h5>
                      <p className="text-slate-200 leading-relaxed">{compatibility.collaborationTips}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
