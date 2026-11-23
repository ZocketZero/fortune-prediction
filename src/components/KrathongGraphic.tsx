import React from 'react';
import {
  KRATHONG_BASES,
  KRATHONG_PETALS,
  KRATHONG_CENTERS,
  KRATHONG_CANDLES,
  KRATHONG_INCENSES,
  type KrathongStyle,
  type KrathongComponents
} from '../data/loyKrathongData';

interface KrathongGraphicProps {
  style?: KrathongStyle;
  customComponents?: KrathongComponents;
  decorations?: string[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showReflections?: boolean;
  className?: string;
}

export const KrathongGraphic: React.FC<KrathongGraphicProps> = ({
  style,
  customComponents,
  decorations = ['incense-candle'],
  size = 'md',
  showReflections = true,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-20 h-16',
    md: 'w-36 h-28',
    lg: 'w-52 h-40',
    xl: 'w-64 h-52'
  };

  // Resolve component items
  const baseItem = customComponents
    ? KRATHONG_BASES.find((b) => b.id === customComponents.baseId) || KRATHONG_BASES[0]
    : style?.defaultComponents
    ? KRATHONG_BASES.find((b) => b.id === style.defaultComponents?.baseId) || KRATHONG_BASES[0]
    : KRATHONG_BASES[0];

  const petalItem = customComponents
    ? KRATHONG_PETALS.find((p) => p.id === customComponents.petalId) || KRATHONG_PETALS[0]
    : style?.defaultComponents
    ? KRATHONG_PETALS.find((p) => p.id === style.defaultComponents?.petalId) || KRATHONG_PETALS[0]
    : KRATHONG_PETALS[0];

  const centerItem = customComponents
    ? KRATHONG_CENTERS.find((c) => c.id === customComponents.centerFlowerId) || KRATHONG_CENTERS[0]
    : style?.defaultComponents
    ? KRATHONG_CENTERS.find((c) => c.id === style.defaultComponents?.centerFlowerId) || KRATHONG_CENTERS[0]
    : KRATHONG_CENTERS[0];

  const candleItem = customComponents
    ? KRATHONG_CANDLES.find((c) => c.id === customComponents.candleId) || KRATHONG_CANDLES[0]
    : style?.defaultComponents
    ? KRATHONG_CANDLES.find((c) => c.id === style.defaultComponents?.candleId) || KRATHONG_CANDLES[0]
    : KRATHONG_CANDLES[0];

  const incenseItem = customComponents
    ? KRATHONG_INCENSES.find((i) => i.id === customComponents.incenseId) || KRATHONG_INCENSES[0]
    : style?.defaultComponents
    ? KRATHONG_INCENSES.find((i) => i.id === style.defaultComponents?.incenseId) || KRATHONG_INCENSES[0]
    : KRATHONG_INCENSES[0];

  // Visual Colors fallback if preset style provided without components
  const baseColor = customComponents ? baseItem.baseColor : style?.baseColor || baseItem.baseColor;
  const bottomColor = customComponents ? baseItem.bottomColor : '#064e3b';
  const petalColor = customComponents ? petalItem.petalColor : style?.petalColor || petalItem.petalColor;
  const petalBottom = customComponents ? petalItem.gradientBottom : style?.baseColor || petalItem.gradientBottom;
  const petalStroke = petalItem.strokeColor;
  const centerColor = customComponents ? centerItem.centerColor : style?.centerColor || centerItem.centerColor;
  const candleColor = customComponents ? candleItem.candleColor : style?.candleColor || candleItem.candleColor;
  const auraColor = customComponents ? candleItem.auraColor : style?.auraColor || candleItem.auraColor;

  const hasIncense = decorations.includes('incense-candle');
  const hasCoins = decorations.includes('nine-coins');
  const hasJasmine = decorations.includes('jasmine');
  const hasRose = decorations.includes('rose-petals');
  const hasBetel = decorations.includes('betel-nut');
  const hasPuffedRice = decorations.includes('puffed-rice');
  const hasSacredThread = decorations.includes('sacred-thread');

  const uniqueId = React.useId().replace(/:/g, '');

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      {/* Water reflection glow & trailing water wake underneath */}
      {showReflections && (
        <>
          <div
            className="absolute -bottom-3 w-4/5 h-6 rounded-full blur-md opacity-75 pointer-events-none transition-all duration-500"
            style={{ background: auraColor }}
          />
          <div className="absolute -bottom-2 -left-2 w-[110%] h-6 rounded-full border border-cyan-300/30 anim-trailing-wake pointer-events-none" />
        </>
      )}

      {/* SVG Krathong Artwork */}
      <svg
        viewBox="0 0 200 150"
        className="w-full h-full drop-shadow-xl overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Flame radial gradient */}
          <radialGradient id={`flameGlow-${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor={candleItem.flameCoreColor} />
            <stop offset="70%" stopColor={candleColor} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          {/* Candle light glow aura */}
          <radialGradient id={`candleAura-${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={candleColor} stopOpacity="0.8" />
            <stop offset="65%" stopColor={candleColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={candleColor} stopOpacity="0" />
          </radialGradient>

          {/* Water ripple gradient */}
          <radialGradient id={`rippleGrad-${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#0284c7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
          </radialGradient>

          {/* Golden Coin Gradient */}
          <linearGradient id={`coinGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Petal Gradients */}
          <linearGradient id={`petalGrad-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={petalColor} />
            <stop offset="100%" stopColor={petalBottom} />
          </linearGradient>

          {/* Base Gradients */}
          <linearGradient id={`baseGrad-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={baseColor} />
            <stop offset="100%" stopColor={bottomColor} />
          </linearGradient>
        </defs>

        {/* Subtle water ripple rings */}
        {showReflections && (
          <ellipse
            cx="100"
            cy="125"
            rx="75"
            ry="18"
            fill={`url(#rippleGrad-${uniqueId})`}
            className="anim-ripple"
          />
        )}

        {/* Outer Base: Foundation Layer */}
        <g id="krathong-base">
          {/* Base foundation disc */}
          <ellipse cx="100" cy="115" rx="72" ry="22" fill={`url(#baseGrad-${uniqueId})`} stroke={baseItem.rimColor} strokeWidth="1.5" />
          <ellipse cx="100" cy="113" rx="66" ry="18" fill={bottomColor} opacity="0.85" />

          {/* Specific Base Textures */}
          {baseItem.id === 'coconut-shell' && (
            <ellipse cx="100" cy="114" rx="63" ry="16" fill="#3b1502" opacity="0.9" />
          )}
          {baseItem.id === 'crystal-ice' && (
            <g opacity="0.6">
              <line x1="50" y1="114" x2="150" y2="114" stroke="#e0f2fe" strokeWidth="1.2" strokeDasharray="6 4" />
              <line x1="65" y1="110" x2="135" y2="110" stroke="#bae6fd" strokeWidth="1" strokeDasharray="4 4" />
            </g>
          )}
          {baseItem.id === 'golden-royal' && (
            <ellipse cx="100" cy="113" rx="64" ry="16" fill="#ca8a04" stroke="#fef08a" strokeWidth="0.8" opacity="0.75" />
          )}

          {/* Layer 1: Outermost Folded Petals */}
          <path d="M28 110 C25 90, 35 75, 45 88 C40 102, 32 110, 28 110 Z" fill={`url(#petalGrad-${uniqueId})`} stroke={petalStroke} strokeWidth="0.6" />
          <path d="M45 116 C40 92, 55 72, 65 92 C60 108, 50 116, 45 116 Z" fill={`url(#petalGrad-${uniqueId})`} stroke={petalStroke} strokeWidth="0.6" />
          <path d="M172 110 C175 90, 165 75, 155 88 C160 102, 168 110, 172 110 Z" fill={`url(#petalGrad-${uniqueId})`} stroke={petalStroke} strokeWidth="0.6" />
          <path d="M155 116 C160 92, 145 72, 135 92 C140 108, 150 116, 155 116 Z" fill={`url(#petalGrad-${uniqueId})`} stroke={petalStroke} strokeWidth="0.6" />

          {/* Side Petals Array */}
          <path d="M60 120 C55 96, 75 75, 85 96 C78 112, 66 120, 60 120 Z" fill={`url(#petalGrad-${uniqueId})`} stroke={petalStroke} strokeWidth="0.4" />
          <path d="M140 120 C145 96, 125 75, 115 96 C122 112, 134 120, 140 120 Z" fill={`url(#petalGrad-${uniqueId})`} stroke={petalStroke} strokeWidth="0.4" />

          {/* Center Front Petals Layer */}
          <path d="M78 124 C74 100, 95 80, 100 95 C90 114, 82 124, 78 124 Z" fill={petalColor} stroke="#ffffff" strokeWidth="0.3" opacity="0.95" />
          <path d="M122 124 C126 100, 105 80, 100 95 C110 114, 118 124, 122 124 Z" fill={petalColor} stroke="#ffffff" strokeWidth="0.3" opacity="0.95" />
          <path d="M88 126 C90 98, 100 82, 100 96 C100 82, 110 98, 112 126 Z" fill={petalBottom} opacity="0.9" />

          {/* Front folded base border rim */}
          <path d="M35 118 Q100 138 165 118 Q100 134 35 118 Z" fill={baseColor} stroke={baseItem.rimColor} strokeWidth="1" />
        </g>

        {/* Center Floral Bed / Selected Center Flowers */}
        <g id="krathong-center-flowers">
          <ellipse cx="100" cy="110" rx="42" ry="12" fill={centerColor} opacity="0.88" />
          {/* Center floral decorative textures */}
          <circle cx="85" cy="110" r="4.5" fill={centerItem.highlightColor} opacity="0.9" />
          <circle cx="95" cy="112" r="5" fill={centerItem.secondaryDotColor} opacity="0.9" />
          <circle cx="105" cy="111" r="5" fill={centerItem.highlightColor} opacity="0.9" />
          <circle cx="115" cy="109" r="4.5" fill={centerItem.secondaryDotColor} opacity="0.9" />
        </g>

        {/* Optional Decoration: Sacred Thread (สายสิญจน์มงคล) */}
        {hasSacredThread && (
          <path
            d="M58 116 Q100 128 142 116 Q100 124 58 116 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            opacity="0.9"
          />
        )}

        {/* Optional Decoration: Jasmine Garlands */}
        {hasJasmine && (
          <g id="deco-jasmine">
            <circle cx="70" cy="115" r="3.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
            <circle cx="77" cy="117" r="3.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
            <circle cx="84" cy="119" r="3.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
            <circle cx="116" cy="119" r="3.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
            <circle cx="123" cy="117" r="3.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
            <circle cx="130" cy="115" r="3.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
          </g>
        )}

        {/* Optional Decoration: Rose Petals */}
        {hasRose && (
          <g id="deco-rose">
            <ellipse cx="88" cy="115" rx="5" ry="3.5" fill="#e11d48" transform="rotate(-15 88 115)" />
            <ellipse cx="112" cy="115" rx="5" ry="3.5" fill="#be123c" transform="rotate(20 112 115)" />
            <ellipse cx="100" cy="118" rx="5" ry="3" fill="#f43f5e" />
          </g>
        )}

        {/* Optional Decoration: Puffed Rice (ข้าวตอกดอกไม้โปรยทาน) */}
        {hasPuffedRice && (
          <g id="deco-puffed-rice" opacity="0.9">
            <circle cx="78" cy="111" r="2.2" fill="#fef08a" stroke="#d97706" strokeWidth="0.4" />
            <circle cx="89" cy="113" r="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.4" />
            <circle cx="102" cy="114" r="2.2" fill="#fef08a" stroke="#d97706" strokeWidth="0.4" />
            <circle cx="111" cy="112" r="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.4" />
            <circle cx="121" cy="110" r="2.2" fill="#fef08a" stroke="#d97706" strokeWidth="0.4" />
          </g>
        )}

        {/* Optional Decoration: 9 Baht Coins */}
        {hasCoins && (
          <g id="deco-coins">
            <circle cx="92" cy="118" r="5.5" fill={`url(#coinGrad-${uniqueId})`} stroke="#78350f" strokeWidth="0.8" />
            <text x="92" y="120" fontSize="5" fontWeight="bold" fill="#78350f" textAnchor="middle">๙</text>
            <circle cx="108" cy="118" r="5.5" fill={`url(#coinGrad-${uniqueId})`} stroke="#78350f" strokeWidth="0.8" />
            <text x="108" y="120" fontSize="5" fontWeight="bold" fill="#78350f" textAnchor="middle">฿</text>
          </g>
        )}

        {/* Optional Decoration: Betel Nut Offering */}
        {hasBetel && (
          <g id="deco-betel">
            <path d="M72 112 Q76 108 80 113 Q76 116 72 112 Z" fill="#15803d" stroke="#166534" strokeWidth="0.5" />
            <circle cx="76" cy="112.5" r="2.5" fill="#9a3412" />
          </g>
        )}

        {/* Incense & Candle Offering */}
        {hasIncense && (
          <g id="incense-and-candle">
            {/* Incense Sticks */}
            {/* Left Stick */}
            <line x1="93" y1="108" x2="84" y2="48" stroke={incenseItem.stickColor} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="84" cy="48" r="1.5" fill={incenseItem.tipColor} className="animate-pulse" />

            {/* Center Stick */}
            <line x1="97" y1="108" x2="94" y2="42" stroke={incenseItem.stickColor} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="94" cy="42" r="1.5" fill={incenseItem.tipColor} className="animate-pulse" />

            {/* Right Stick */}
            <line x1="101" y1="108" x2="108" y2="46" stroke={incenseItem.stickColor} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="108" cy="46" r="1.5" fill={incenseItem.tipColor} className="animate-pulse" />

            {/* Incense Smoke (if hasSmoke is true) */}
            {incenseItem.hasSmoke ? (
              <>
                <path
                  d="M84 46 Q80 35 88 28 T85 16"
                  stroke="rgba(241, 245, 249, 0.45)"
                  strokeWidth="1.2"
                  fill="none"
                  strokeDasharray="2 2"
                  className="animate-smoke"
                />
                <path
                  d="M94 40 Q98 30 92 22 T97 12"
                  stroke="rgba(241, 245, 249, 0.55)"
                  strokeWidth="1.2"
                  fill="none"
                  strokeDasharray="2 2"
                  className="animate-smoke"
                  style={{ animationDelay: '0.8s' }}
                />
              </>
            ) : (
              /* Eco LED electronic aura */
              <circle cx="94" cy="40" r="10" fill={incenseItem.tipColor} opacity="0.25" className="animate-pulse" />
            )}

            {/* Candle Body */}
            <rect x="96" y="68" width="8" height="40" rx="2" fill={candleColor} stroke="#d97706" strokeWidth="0.8" />
            <ellipse cx="100" cy="68" rx="4" ry="1.5" fill="#fef08a" />
            <line x1="100" y1="68" x2="100" y2="60" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" />

            {/* Candle Light Aura Background */}
            <circle cx="100" cy="52" r="28" fill={`url(#candleAura-${uniqueId})`} />

            {/* Animated Candle Flame */}
            <g className="anim-candle-flame">
              <path
                d="M100 40 C104 46, 106 53, 103 58 C100 62, 97 61, 96 57 C94 52, 97 45, 100 40 Z"
                fill={`url(#flameGlow-${uniqueId})`}
              />
              {/* Inner Flame Core */}
              <ellipse cx="100" cy="55" rx="2" ry="4" fill="#ffffff" opacity="0.9" />
              <ellipse cx="100" cy="57" rx="1.5" ry="2.5" fill={candleItem.flameCoreColor} opacity="0.8" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
