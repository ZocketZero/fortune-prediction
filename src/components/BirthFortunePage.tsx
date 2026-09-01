import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  RotateCcw,
  Copy,
  Check,
  Compass,
  Heart,
  Briefcase,
  Coins,
  Activity,
  ShieldAlert,
  Award,
  Sun,
  Moon,
  Star
} from 'lucide-react';
import {
  DAY_OF_WEEK_FORTUNES,
  getDayOfWeekFromDate,
  getZodiacSignFromDate,
  getAnimalYearFromYear,
  getElementOfBirthYear,
  calculateLifePathNumber,
  getBirthTimePeriod
} from '../data/birthFortuneData';
import type {
  DayOfWeekFortune,
  ZodiacFortune,
  AnimalYearFortune,
  LifePathNumberFortune,
  BirthTimeFortune
} from '../data/birthFortuneData';
import { triggerMysticTarotLight } from '../utils/lightEffects';
import { getStorageWithTTL, setStorageWithTTL, removeStorage } from '../utils/storage';

const BIRTH_STORAGE_KEY = 'fortune_birth_date_data';

interface SavedBirthData {
  day: number;
  month: number;
  yearCE: number;
  birthTime?: string;
  isNightBornWednesday?: boolean;
}

export const BirthFortunePage: React.FC = () => {
  // Read saved data if available
  const initialSaved = getStorageWithTTL<SavedBirthData>(BIRTH_STORAGE_KEY);

  const today = new Date();
  const currentYearCE = today.getFullYear();

  // Date selection state
  const [birthDay, setBirthDay] = useState<number>(() => initialSaved?.day || 15);
  const [birthMonth, setBirthMonth] = useState<number>(() => initialSaved?.month || 8);
  const [birthYearCE, setBirthYearCE] = useState<number>(() => initialSaved?.yearCE || 1998);
  const [birthTime, setBirthTime] = useState<string>(() => initialSaved?.birthTime || '');
  const [isWednesdayNight, setIsWednesdayNight] = useState<boolean>(() => initialSaved?.isNightBornWednesday || false);

  // Active Tab within the Fortune Result
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'pillars' | 'lucky' | 'merit'>('overview');

  // Animation & Feedback states
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(() => !!initialSaved);
  const [copied, setCopied] = useState<boolean>(false);

  // Month names in Thai
  const THAI_MONTHS = [
    { value: 1, name: 'มกราคม (Jan)' },
    { value: 2, name: 'กุมภาพันธ์ (Feb)' },
    { value: 3, name: 'มีนาคม (Mar)' },
    { value: 4, name: 'เมษายน (Apr)' },
    { value: 5, name: 'พฤษภาคม (May)' },
    { value: 6, name: 'มิถุนายน (Jun)' },
    { value: 7, name: 'กรกฎาคม (Jul)' },
    { value: 8, name: 'สิงหาคม (Aug)' },
    { value: 9, name: 'กันยายน (Sep)' },
    { value: 10, name: 'ตุลาคม (Oct)' },
    { value: 11, name: 'พฤศจิกายน (Nov)' },
    { value: 12, name: 'ธันวาคม (Dec)' },
  ];

  // Calculate Days in Selected Month
  const daysInMonth = new Date(birthYearCE, birthMonth, 0).getDate();

  // Calculated Fortune Objects
  const birthDateObj = new Date(birthYearCE, birthMonth - 1, birthDay);
  
  // Custom check for Wednesday Night toggle or time
  let dayFortune: DayOfWeekFortune = getDayOfWeekFromDate(birthDateObj, birthTime);
  if (birthDateObj.getDay() === 3 && isWednesdayNight) {
    dayFortune = DAY_OF_WEEK_FORTUNES[4]; // Wednesday Night
  }

  const zodiacFortune: ZodiacFortune = getZodiacSignFromDate(birthDay, birthMonth);
  const animalFortune: AnimalYearFortune = getAnimalYearFromYear(birthYearCE);
  const yearElement = getElementOfBirthYear(birthYearCE);
  const lifePathFortune: LifePathNumberFortune = calculateLifePathNumber(birthDay, birthMonth, birthYearCE);
  const timePeriodFortune: BirthTimeFortune | null = getBirthTimePeriod(birthTime);

  // Trigger calculation
  const handleCalculate = () => {
    setIsCalculating(true);
    triggerMysticTarotLight();

    setTimeout(() => {
      setIsCalculating(false);
      setHasCalculated(true);

      // Save to storage
      setStorageWithTTL<SavedBirthData>(BIRTH_STORAGE_KEY, {
        day: birthDay,
        month: birthMonth,
        yearCE: birthYearCE,
        birthTime: birthTime || undefined,
        isNightBornWednesday: isWednesdayNight
      }, 7 * 24 * 60 * 60 * 1000); // 7 days
    }, 600);
  };

  const handleReset = () => {
    removeStorage(BIRTH_STORAGE_KEY);
    setHasCalculated(false);
  };

  const handleCopySummary = () => {
    const textToCopy = `✨ ผลทำนายดวงชะตาจากวันเดือนปีเกิด ✨
📅 เกิดวันที่ ${birthDay} ${THAI_MONTHS[birthMonth - 1].name.split(' ')[0]} พ.ศ. ${birthYearCE + 543} (ค.ศ. ${birthYearCE})
🌟 ${dayFortune.thaiName} (${dayFortune.rulingPlanet}) | ${dayFortune.element}
☸️ พระประจำวันเกิด: ${dayFortune.buddhaName} (${dayFortune.buddhaPosture})
♈ ${zodiacFortune.thaiName} (${zodiacFortune.name}) | ธาตุ${zodiacFortune.element}
🐉 ${animalFortune.thaiName} (${animalFortune.animal}) | ${yearElement}
🔢 เลขศาสตร์รหัสชีวิต: ${lifePathFortune.title}

💡 คำคมประจำดวงชะตา: "${dayFortune.summaryQuote}"
🎨 สีมงคลการงาน: ${dayFortune.luckyColors.work.join(', ')}
💰 สีมงคลการเงิน: ${dayFortune.luckyColors.wealth.join(', ')}
❤️ สีมงคลความรัก: ${dayFortune.luckyColors.love.join(', ')}
🚫 สีกาลกิณีที่ควรเลี่ยง: ${dayFortune.luckyColors.unlucky.join(', ')}
🎲 เลขนำโชค: ${dayFortune.luckyNumbers.join(', ')}

✨ ทำนายโดยระบบทำนายโชคชะตาออนไลน์`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isWednesday = birthDateObj.getDay() === 3;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="text-center space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>โหราศาสตร์และเลขศาสตร์วันเดือนปีเกิด</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black gold-gradient-text tracking-tight font-cinzel-decorative">
          ทำนายดวงชะตาตามวันเดือนปีเกิด
        </h1>
        <p className="text-xs sm:text-sm text-slate-300/90 max-w-2xl mx-auto leading-relaxed px-2">
          ผสานศาสตร์พยากรณ์ไทย ๑๒ นักษัตร จักรราศี และเลขศาสตร์สากล (Life Path Number) เผยรหัสลับแห่งชะตาชีวิต ตัวตนที่แท้จริง สีมงคล และทิศทางแห่งความสำเร็จ
        </p>
      </div>

      {/* Date & Time Input Box */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-amber-300 text-sm sm:text-base font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ระบุข้อมูลวันเดือนปีเกิดของท่าน</span>
            </div>
            {hasCalculated && (
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700/60"
              >
                <RotateCcw className="w-3 h-3" />
                <span>เปลี่ยนวันเกิด</span>
              </button>
            )}
          </div>

          {/* Form Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {/* Day */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>วันที่เกิด</span>
                <span className="text-[10px] text-amber-400/80">(Day)</span>
              </label>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(Number(e.target.value))}
                aria-label="เลือกวันที่เกิด"
                className="w-full bg-slate-900/90 border border-amber-500/30 text-slate-100 text-sm font-semibold rounded-xl px-3 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-400/60 transition-all"
              >
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    วันที่ {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>เดือนเกิด</span>
                <span className="text-[10px] text-amber-400/80">(Month)</span>
              </label>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(Number(e.target.value))}
                aria-label="เลือกเดือนเกิด"
                className="w-full bg-slate-900/90 border border-amber-500/30 text-slate-100 text-sm font-semibold rounded-xl px-3 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-400/60 transition-all"
              >
                {THAI_MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>ปีเกิด</span>
                <span className="text-[10px] text-amber-400/80">(พ.ศ. / ค.ศ.)</span>
              </label>
              <select
                value={birthYearCE}
                onChange={(e) => setBirthYearCE(Number(e.target.value))}
                aria-label="เลือกปีเกิด"
                className="w-full bg-slate-900/90 border border-amber-500/30 text-slate-100 text-sm font-semibold rounded-xl px-3 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-400/60 transition-all"
              >
                {Array.from({ length: 100 }, (_, i) => currentYearCE - i).map((year) => (
                  <option key={year} value={year}>
                    พ.ศ. {year + 543} ({year})
                  </option>
                ))}
              </select>
            </div>

            {/* Birth Time (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  เวลาตกฟาก
                </span>
                <span className="text-[10px] text-slate-400 font-normal">(ไม่ระบุก็ได้)</span>
              </label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                placeholder="--:--"
                aria-label="เลือกเวลาเกิด"
                className="w-full bg-slate-900/90 border border-amber-500/30 text-slate-100 text-sm font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:border-amber-400/60 transition-all"
              />
            </div>
          </div>

          {/* Wednesday Day/Night Special Checkbox */}
          {isWednesday && (
            <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-slate-200">
                  เกิดในคืนวันพุธ (ตั้งแต่ 18:00 น. ถึง 05:59 น. ของเช้าวันพฤหัสบดี - พระราหู)
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={isWednesdayNight}
                  onChange={(e) => setIsWednesdayNight(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          )}

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full sm:w-auto min-w-[240px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-purple-600 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 group"
            >
              <Sparkles className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span>{isCalculating ? 'กำลังผูกดวงชะตา...' : 'คำนวณและทำนายดวงชะตา'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* RESULT SECTION */}
      {hasCalculated && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          {/* Main Fortune Profile Card */}
          <div className="glass-panel rounded-3xl p-5 sm:p-8 border border-amber-500/40 shadow-2xl relative overflow-hidden">
            {/* Header Identity Badge */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-600 to-pink-500 p-[2px] shadow-lg shadow-purple-900/40 shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center text-center p-1">
                    <span className="text-2xl sm:text-3xl">{dayFortune.symbol}</span>
                    <span className="text-[10px] font-bold text-amber-300 truncate max-w-full">
                      {dayFortune.thaiName.replace('วัน', '')}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-100 font-cinzel-decorative">
                      {dayFortune.thaiName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300">
                      {dayFortune.rulingPlanet}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-500/40 text-purple-300">
                      {dayFortune.element}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 italic">
                    "{dayFortune.summaryQuote}"
                  </p>
                </div>
              </div>

              {/* Action Buttons: Copy & Share */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'คัดลอกเรียบร้อย' : 'คัดลอกสรุปดวง'}</span>
                </button>
              </div>
            </div>

            {/* 4 Pillars Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5">
              {/* 1. Zodiac */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>จักรราศี (Zodiac)</span>
                  <span className="text-base">{zodiacFortune.symbol}</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm sm:text-base font-bold text-slate-100">{zodiacFortune.thaiName}</p>
                  <p className="text-[11px] text-amber-300/80">ธาตุ{zodiacFortune.element} • {zodiacFortune.rulingPlanet}</p>
                </div>
              </div>

              {/* 2. 12 Animals */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>๑๒ นักษัตร (Animal)</span>
                  <span className="text-base">{animalFortune.symbol}</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm sm:text-base font-bold text-slate-100">{animalFortune.thaiName} ({animalFortune.animal})</p>
                  <p className="text-[11px] text-amber-300/80">{yearElement}</p>
                </div>
              </div>

              {/* 3. Life Path Numerology */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>เลขศาสตร์ (Life Path)</span>
                  <span className="text-xs font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                    #{lifePathFortune.number}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm sm:text-base font-bold text-slate-100">เลข {lifePathFortune.number}</p>
                  <p className="text-[11px] text-amber-300/80 truncate">{lifePathFortune.archetype}</p>
                </div>
              </div>

              {/* 4. Buddha of the Day / Deity */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>พระประจำวันเกิด</span>
                  <span className="text-amber-400">☸️</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm sm:text-base font-bold text-slate-100 truncate">{dayFortune.buddhaPosture}</p>
                  <p className="text-[11px] text-amber-300/80 truncate">{dayFortune.buddhaName}</p>
                </div>
              </div>
            </div>

            {/* Optional Birth Time Banner */}
            {timePeriodFortune && (
              <div className="mt-4 p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start sm:items-center gap-3 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 sm:mt-0" />
                <div className="text-slate-200">
                  <strong className="text-indigo-300">{timePeriodFortune.periodName}:</strong> {timePeriodFortune.vibe} — {timePeriodFortune.influence}
                </div>
              </div>
            )}
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'overview'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>ภาพรวม & ตัวตน</span>
            </button>

            <button
              onClick={() => setActiveSubTab('pillars')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'pillars'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>๕ มิติดวงชะตา</span>
            </button>

            <button
              onClick={() => setActiveSubTab('lucky')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'lucky'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>สี • เลข • ทิศมงคล</span>
            </button>

            <button
              onClick={() => setActiveSubTab('merit')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'merit'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>เสริมดวง & บารมี</span>
            </button>
          </div>

          {/* TAB 1: Overview & Personality */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Inner Soul & Personality */}
              <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-2 text-amber-300 text-base font-bold border-b border-slate-800 pb-3">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>จิตวิญญาณและตัวตนที่แท้จริง (Inner Soul & Personality)</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                  {dayFortune.personality.innerSoul}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Traits */}
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">🌟 บุคลิกลักษณะ</p>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                      {dayFortune.personality.traits.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Strengths */}
                  <div className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">✨ จุดเด่นและพรสวรรค์</p>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                      {dayFortune.personality.strengths.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-rose-950/20 p-4 rounded-2xl border border-rose-500/30 space-y-2">
                    <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">⚠️ ข้อควรระวังและปรับปรุง</p>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                      {dayFortune.personality.weaknesses.map((w, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">!</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Life Path Numerology Deep Dive */}
              <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-purple-300 text-base font-bold">
                    <Star className="w-5 h-5 text-purple-400" />
                    <span>{lifePathFortune.title}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 px-3 py-1 rounded-full bg-slate-900 border border-purple-500/30">
                    {lifePathFortune.keyword}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {lifePathFortune.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20">
                    <p className="text-xs font-bold text-purple-300 mb-1">🎯 ภารกิจจิตวิญญาณแห่งชีวิต (Life Mission)</p>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{lifePathFortune.lifeMission}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
                    <p className="text-xs font-bold text-indigo-300 mb-1">💼 อาชีพและเส้นทางที่เสริมพลัง</p>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{lifePathFortune.idealCareers.join(' • ')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 5 Pillars of Life */}
          {activeSubTab === 'pillars' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-fadeIn">
              {/* 1. Career */}
              <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-blue-500/30 space-y-3">
                <div className="flex items-center gap-3 text-blue-400">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">การงานและเส้นทางความสำเร็จ</h3>
                    <p className="text-xs text-blue-300/80">Career & Ambition</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {zodiacFortune.careerAspect}
                </p>
              </div>

              {/* 2. Wealth */}
              <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-3 text-amber-400">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">การเงินและโชคลาภ</h3>
                    <p className="text-xs text-amber-300/80">Wealth & Prosperity</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {zodiacFortune.wealthAspect}
                </p>
              </div>

              {/* 3. Love */}
              <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-pink-500/30 space-y-3">
                <div className="flex items-center gap-3 text-pink-400">
                  <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">ความรักและคู่ครอง</h3>
                    <p className="text-xs text-pink-300/80">Love & Relationship</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {zodiacFortune.loveAspect}
                </p>
                <div className="pt-2 border-t border-slate-800 text-xs text-pink-300 flex items-center gap-1.5">
                  <span className="font-semibold">ราศีคู่สมพงษ์:</span>
                  <span>{zodiacFortune.compatibleSigns.join(', ')}</span>
                </div>
              </div>

              {/* 4. Health */}
              <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-3 text-emerald-400">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">สุขภาพและการดูแลร่างกาย</h3>
                    <p className="text-xs text-emerald-300/80">Health & Vitality</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {zodiacFortune.healthAspect}
                </p>
              </div>

              {/* 5. Tarot Card Alignment (Span 2 cols) */}
              <div className="md:col-span-2 glass-panel rounded-3xl p-5 sm:p-6 border border-purple-500/30 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-gradient-to-r from-slate-950 via-purple-950/20 to-slate-950">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl shrink-0">
                  🎴
                </div>
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <p className="text-xs font-semibold text-purple-300 uppercase tracking-widest">ไพ่ยิปซีประจำราศีเกิด (Tarot Alignment)</p>
                  <h4 className="text-base sm:text-lg font-bold text-slate-100">{zodiacFortune.tarotCard}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    พลังจิตวิญญาณแห่งจักรราศี: <span className="text-amber-300 font-semibold">{zodiacFortune.powerWord}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Lucky Colors & Auspicious Guide */}
          {activeSubTab === 'lucky' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Lucky Colors Palette */}
              <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-amber-500/30 space-y-5">
                <div className="flex items-center gap-2 text-amber-300 text-base font-bold border-b border-slate-800 pb-3">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span>ตารางสีมงคลประจำวันเกิด ({dayFortune.thaiName})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* Work */}
                  <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      เสริมการงาน • อำนาจบารมี
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {dayFortune.luckyColors.work.map((c, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-950/40 border border-blue-500/30 text-blue-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Wealth */}
                  <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5" />
                      เสริมการเงิน • โชคลาภก้อนโต
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {dayFortune.luckyColors.wealth.map((c, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-950/40 border border-amber-500/30 text-amber-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Love */}
                  <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" />
                      เสริมความรัก • เมตตามหานิยม
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {dayFortune.luckyColors.love.map((c, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-pink-950/40 border border-pink-500/30 text-pink-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Health */}
                  <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      เสริมสุขภาพ • ความแคล้วคลาด
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {dayFortune.luckyColors.health.map((c, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Unlucky (Avoid) */}
                  <div className="sm:col-span-2 bg-rose-950/20 border border-rose-500/40 p-4 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      สีกาลกิณี (ควรหลีกเลี่ยงหรือใช้แต่น้อย)
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {dayFortune.luckyColors.unlucky.map((c, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-950/60 border border-rose-500/40 text-rose-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Numbers, Gems & Auspicious Elements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Lucky Numbers */}
                <div className="glass-panel rounded-3xl p-5 border border-amber-500/30 space-y-3">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">🎲 ตัวเลขนำโชคประจำวัน</p>
                  <div className="flex flex-wrap gap-2">
                    {dayFortune.luckyNumbers.map((num) => (
                      <span key={num} className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center font-black text-amber-300 text-sm shadow-md">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Lucky Gems */}
                <div className="glass-panel rounded-3xl p-5 border border-purple-500/30 space-y-3">
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">💎 อัญมณีเสริมสิริมงคล</p>
                  <ul className="space-y-1 text-xs sm:text-sm text-slate-300">
                    {dayFortune.luckyGems.map((gem, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-purple-400">✦</span>
                        <span>{gem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lucky Directions */}
                <div className="glass-panel rounded-3xl p-5 border border-cyan-500/30 space-y-3">
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">🧭 ทิศมงคลนำโชค</p>
                  <ul className="space-y-1 text-xs sm:text-sm text-slate-300">
                    {dayFortune.luckyDirections.map((dir, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{dir}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 12 Animal Year Compatibility */}
              <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-slate-200 text-sm font-bold">
                  <span>สมพงษ์ ๑๒ นักษัตร ({animalFortune.thaiName})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                    <span className="font-bold text-emerald-400">ปีสมพงษ์ (เกื้อหนุนดวง):</span>{' '}
                    <span className="text-slate-300">{animalFortune.compatibleYears.join(', ')}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
                    <span className="font-bold text-rose-400">ปีชง (ควรระมัดระวัง):</span>{' '}
                    <span className="text-slate-300">{animalFortune.clashYears.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Merit & Spiritual Guidance */}
          {activeSubTab === 'merit' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Buddha of the day & Posture */}
              <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
                    ☸️
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-100">
                      {dayFortune.buddhaName}
                    </h3>
                    <p className="text-xs text-amber-300">{dayFortune.buddhaPosture}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                  {dayFortune.buddhaDesc}
                </p>
              </div>

              {/* Merit Tips */}
              <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-emerald-500/30 space-y-4">
                <div className="flex items-center gap-2 text-emerald-300 text-base font-bold border-b border-slate-800 pb-3">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>เคล็ดลับการทำบุญเสริมบารมีประจำวันเกิด</span>
                </div>

                <div className="space-y-3">
                  {dayFortune.meritTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs sm:text-sm text-slate-200">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Compatibility Advice */}
              <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">🤝 ความสัมพันธ์ระหว่างวันเกิด (Day Compatibility)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-emerald-400 font-bold mb-1">คู่มิตรใหญ่ (เกื้อหนุนสูงสุด)</p>
                    <p className="text-slate-300">{dayFortune.compatibility.bestDay}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-blue-400 font-bold mb-1">มิตรภาพที่ดี</p>
                    <p className="text-slate-300">{dayFortune.compatibility.friendDay}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-rose-400 font-bold mb-1">คู่ที่ต้องปรับความเข้าใจ</p>
                    <p className="text-slate-300">{dayFortune.compatibility.cautionDay}</p>
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
