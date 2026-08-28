import React, { useState } from 'react';
import { TAROT_CARDS } from '../data/tarotCards';
import type { TarotCard } from '../data/tarotCards';
import {
  BookOpen,
  Sparkles,
  Briefcase,
  Coins,
  Heart,
  Shield,
  Search,
  Filter
} from 'lucide-react';

export const EncyclopediaPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedElement, setSelectedElement] = useState<string>('all');

  const elements = ['all', 'ไฟ', 'ดิน', 'ลม', 'น้ำ'];

  const filteredCards = TAROT_CARDS.filter((card) => {
    const matchesSearch =
      card.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesElement = selectedElement === 'all' || card.element === selectedElement;

    return matchesSearch && matchesElement;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner / Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 py-2">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-purple-950/90 border border-purple-500/40 text-purple-300 shadow-md">
          <BookOpen className="w-3.5 h-3.5 text-purple-400" /> คลังความรู้ศาสตร์ไพ่ยิปซีสากล (Tarot Arcana Library)
        </span>
        <h2 className="text-3xl sm:text-5xl font-black mystic-gradient-text tracking-wide">
          สารานุกรมไพ่ยิปซี Major Arcana
        </h2>
        <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
          รวมความหมาย สัญลักษณ์ ธาตุประจำไพ่ และคำทำนายเจาะลึกของไพ่ชุดใหญ่ ๒๒ ใบ
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อไพ่ หรือคำสำคัญ..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-purple-900/40 focus:border-amber-400 focus:outline-none text-slate-100 text-xs placeholder:text-slate-500 transition-colors"
          />
        </div>

        {/* Element Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-purple-400" /> ธาตุ:
          </span>
          {elements.map((elem) => (
            <button
              key={elem}
              onClick={() => setSelectedElement(elem)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedElement === elem
                  ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-purple-900/30'
              }`}
            >
              {elem === 'all' ? 'ทั้งหมด (22 ใบ)' : `ธาตุ${elem}`}
            </button>
          ))}
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredCards.map((card: TarotCard) => (
          <button
            key={card.id}
            onClick={() => setSelectedCard(card)}
            className="glass-panel hover:border-amber-400/80 rounded-2xl p-4 flex flex-col items-center transition-all duration-300 cursor-pointer hover:scale-105 group text-center"
          >
            <div
              className="w-20 h-32 rounded-xl p-1 border shadow-lg mb-3 bg-slate-950 group-hover:border-amber-400 transition-colors overflow-hidden"
              style={{ borderColor: card.color }}
            >
              <img
                src={card.imageUrl}
                alt={card.nameTh}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 line-clamp-1">
              {card.nameTh}
            </span>
            <span className="text-[10px] text-purple-300/80 mt-0.5 font-mono">
              ธาตุ{card.element} • #{card.id < 10 ? `0${card.id}` : card.id}
            </span>
          </button>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-xs">
          ไม่พบไพ่ที่ตรงกับคำค้นหา "{searchQuery}"
        </div>
      )}

      {/* Modal Detail */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border border-purple-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900 border border-purple-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div
                className="w-40 h-64 rounded-2xl p-1.5 border-2 shadow-2xl shrink-0 overflow-hidden bg-slate-950"
                style={{
                  borderColor: selectedCard.color,
                  boxShadow: `0 10px 35px -10px ${selectedCard.color}80`
                }}
              >
                <img
                  src={selectedCard.imageUrl}
                  alt={selectedCard.nameTh}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="space-y-3 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700">
                    Major Arcana #{selectedCard.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
                    ธาตุ{selectedCard.element}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold gold-gradient-text">{selectedCard.nameTh}</h3>
                <p className="text-xs text-purple-300 font-mono font-medium">{selectedCard.nameEn}</p>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start pt-1">
                  {selectedCard.keywords.map((kw: string, i: number) => (
                    <span key={i} className="text-xs bg-purple-950 text-purple-200 px-3 py-1 rounded-full border border-purple-800/60 font-medium">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Interpretations */}
            <div className="space-y-4 pt-4 border-t border-purple-900/40">
              <h4 className="font-bold text-amber-300 flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-amber-400" /> คำทำนายตัวอย่างประจำวัน:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-purple-900/40">
                  <strong className="text-amber-300 flex items-center gap-1.5 mb-1 text-xs">
                    <Sparkles className="w-3.5 h-3.5" /> ภาพรวม:
                  </strong>
                  <p className="text-slate-300 leading-relaxed m-0">{selectedCard.interpretations.daily.overview}</p>
                </div>
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-purple-900/40">
                  <strong className="text-blue-400 flex items-center gap-1.5 mb-1 text-xs">
                    <Briefcase className="w-3.5 h-3.5" /> การงาน:
                  </strong>
                  <p className="text-slate-300 leading-relaxed m-0">{selectedCard.interpretations.daily.work}</p>
                </div>
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-purple-900/40">
                  <strong className="text-emerald-400 flex items-center gap-1.5 mb-1 text-xs">
                    <Coins className="w-3.5 h-3.5" /> การเงิน:
                  </strong>
                  <p className="text-slate-300 leading-relaxed m-0">{selectedCard.interpretations.daily.finance}</p>
                </div>
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-purple-900/40">
                  <strong className="text-pink-400 flex items-center gap-1.5 mb-1 text-xs">
                    <Heart className="w-3.5 h-3.5" /> ความรัก:
                  </strong>
                  <p className="text-slate-300 leading-relaxed m-0">{selectedCard.interpretations.daily.love}</p>
                </div>
              </div>

              {/* Monthly / Yearly Summary */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-purple-900/40 text-xs space-y-2">
                <strong className="text-purple-300 block">อิทธิพลเมื่อเปิดได้ในดวงรายเดือน & รายปี:</strong>
                <p className="text-slate-300 leading-relaxed m-0">
                  <span className="text-amber-300 font-semibold">รายเดือน:</span> {selectedCard.interpretations.monthly.overview}
                </p>
                <p className="text-slate-300 leading-relaxed m-0">
                  <span className="text-amber-300 font-semibold">รายปี:</span> {selectedCard.interpretations.yearly.overview}
                </p>
              </div>

              {/* Advice */}
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-amber-400" /> คำแนะนำเสริมดวงชะตา:
                </span>
                <p className="text-amber-200/90 italic font-medium m-0">
                  "{selectedCard.interpretations.daily.advice}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncyclopediaPage;
