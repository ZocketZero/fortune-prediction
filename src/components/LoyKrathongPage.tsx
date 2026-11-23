import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Heart,
  Flame,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Waves,
  Moon,
  Send,
  X,
  Info,
  Palette,
  Dices,
  Layers
} from 'lucide-react';
import {
  KRATHONG_STYLES,
  KRATHONG_DECORATIONS,
  KRATHONG_BASES,
  KRATHONG_PETALS,
  KRATHONG_CENTERS,
  KRATHONG_CANDLES,
  KRATHONG_INCENSES,
  DEFAULT_KRATHONG_COMPONENTS,
  WISH_CATEGORIES,
  GANGA_BLESSINGS,
  INITIAL_RIVER_KRATHONGS,
  THAI_LOY_KRATHONG_MANTRA,
  type RiverKrathong,
  type GangaBlessing,
  type KrathongComponents
} from '../data/loyKrathongData';
import { KrathongGraphic } from './KrathongGraphic';
import { triggerLightBurst, triggerDivineBlessingLight } from '../utils/lightEffects';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'gypsy_loy_krathong_saved';

interface KrathongPhysics {
  id: string;
  xPercent: number;
  yPercent: number;
  scale: number;
  speedX: number;     // % of river width per second
  waveFreq: number;   // water wave frequency
  waveAmp: number;    // vertical wave bobbing (px)
  tiltAmp: number;    // rotational tilt (deg)
  phase: number;      // initial wave phase
  nudgeY: number;     // reactive nudge from ripple clicks
}

export const LoyKrathongPage: React.FC = () => {
  // Navigation & View Modes
  const [viewMode, setViewMode] = useState<'builder' | 'floating' | 'river'>('builder');

  // Customization Form State
  const [selectedStyleId, setSelectedStyleId] = useState<string>(KRATHONG_STYLES[0].id);
  const [customComponents, setCustomComponents] = useState<KrathongComponents>(
    KRATHONG_STYLES[0].defaultComponents || DEFAULT_KRATHONG_COMPONENTS
  );
  const [builderTab, setBuilderTab] = useState<'presets' | 'components'>('components');
  const [activeComponentType, setActiveComponentType] = useState<
    'base' | 'petal' | 'center' | 'candle' | 'incense'
  >('base');
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([
    'incense-candle',
    'nine-coins',
    'jasmine'
  ]);
  const [floatMode, setFloatMode] = useState<'single' | 'couple'>('single');
  const [userName, setUserName] = useState<string>('');
  const [partnerName, setPartnerName] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(WISH_CATEGORIES[0].id);
  const [wishText, setWishText] = useState<string>('');

  // River & Community State
  const [riverKrathongs, setRiverKrathongs] = useState<RiverKrathong[]>(INITIAL_RIVER_KRATHONGS);
  const [myKrathong, setMyKrathong] = useState<RiverKrathong | null>(null);
  const [inspectedKrathong, setInspectedKrathong] = useState<RiverKrathong | null>(null);
  const [clickRipples, setClickRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // River Animation, Dragging & Physics Refs
  const riverContainerRef = useRef<HTMLDivElement | null>(null);
  const krathongElsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const physicsRef = useRef<Map<string, KrathongPhysics>>(new Map());
  const hoveredIdRef = useRef<string | null>(null);
  const inspectedIdRef = useRef<string | null>(null);
  const draggingIdRef = useRef<string | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const dragMovedRef = useRef<boolean>(false);

  const [activeDraggingId, setActiveDraggingId] = useState<string | null>(null);
  const [showMoveControls, setShowMoveControls] = useState<boolean>(true);

  // Sync inspectedIdRef
  useEffect(() => {
    inspectedIdRef.current = inspectedKrathong?.id || null;
  }, [inspectedKrathong]);

  // Synchronize Physics state with River Krathongs
  useEffect(() => {
    riverKrathongs.forEach((k) => {
      if (!physicsRef.current.has(k.id)) {
        // Perspective speed: foreground (larger scale & higher y) drifts slightly faster
        const perspectiveSpeed = 1.2 + (k.yPercent / 100) * 1.5;
        physicsRef.current.set(k.id, {
          id: k.id,
          xPercent: k.xPercent,
          yPercent: k.yPercent,
          scale: k.scale,
          speedX: perspectiveSpeed,
          waveFreq: 2.0 + Math.random() * 1.2,
          waveAmp: 3.5 + k.scale * 3.5,
          tiltAmp: 1.8 + Math.random() * 1.8,
          phase: Math.random() * Math.PI * 2,
          nudgeY: 0
        });
      }
    });
  }, [riverKrathongs]);

  // 60FPS Fluid River Movement Animation Loop (Runs on GPU via transform)
  useEffect(() => {
    if (viewMode !== 'river') return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const container = riverContainerRef.current;
      if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        const timeSec = currentTime / 1000;

        physicsRef.current.forEach((phys) => {
          // If being dragged by pointer, position is controlled by dragMove!
          if (draggingIdRef.current === phys.id) {
            return;
          }

          const isHovered = hoveredIdRef.current === phys.id;
          const isInspected = inspectedIdRef.current === phys.id;
          // When inspected, freeze position; when hovered, slow to 25% for easy clicking
          const speedMultiplier = isInspected ? 0 : isHovered ? 0.25 : 1.0;

          // Horizontal drift along river current
          phys.xPercent += phys.speedX * dt * speedMultiplier;
          if (phys.xPercent > 112) {
            phys.xPercent = -12; // Seamless wrap around river screen
          }

          // Sinusoidal wave bobbing & tilt
          const waveY = Math.sin(timeSec * phys.waveFreq + phys.phase) * phys.waveAmp;
          const rot = Math.cos(timeSec * (phys.waveFreq * 0.85) + phys.phase) * phys.tiltAmp;

          // Spring damping decay for ripple nudge
          if (Math.abs(phys.nudgeY) > 0.05) {
            phys.nudgeY *= 0.93;
          } else {
            phys.nudgeY = 0;
          }

          const totalWaveY = waveY + phys.nudgeY;
          const el = krathongElsRef.current.get(phys.id);
          if (el) {
            const posX = (phys.xPercent / 100) * width;
            const posY = (phys.yPercent / 100) * height + totalWaveY;
            el.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%) scale(${phys.scale}) rotate(${rot}deg)`;
          }
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [viewMode]);

  // Sky Lanterns & Fireworks
  const [skyLanterns, setSkyLanterns] = useState<Array<{ id: number; left: number; bottom: number; size: number }>>([
    { id: 1, left: 15, bottom: 65, size: 28 },
    { id: 2, left: 35, bottom: 78, size: 22 },
    { id: 3, left: 72, bottom: 82, size: 26 },
    { id: 4, left: 88, bottom: 60, size: 30 }
  ]);

  // Blessing Certificate State
  const [blessing, setBlessing] = useState<GangaBlessing | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [showMantraModal, setShowMantraModal] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Audio Toggle & Context
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const selectedStyle = KRATHONG_STYLES.find((s) => s.id === selectedStyleId) || KRATHONG_STYLES[0];
  const selectedCategory = WISH_CATEGORIES.find((c) => c.id === selectedCategoryId) || WISH_CATEGORIES[0];

  // Current active component items
  const currentBase = KRATHONG_BASES.find((b) => b.id === customComponents.baseId) || KRATHONG_BASES[0];
  const currentPetal = KRATHONG_PETALS.find((p) => p.id === customComponents.petalId) || KRATHONG_PETALS[0];
  const currentCenter = KRATHONG_CENTERS.find((c) => c.id === customComponents.centerFlowerId) || KRATHONG_CENTERS[0];
  const currentCandle = KRATHONG_CANDLES.find((c) => c.id === customComponents.candleId) || KRATHONG_CANDLES[0];
  const currentIncense = KRATHONG_INCENSES.find((i) => i.id === customComponents.incenseId) || KRATHONG_INCENSES[0];

  // Initialize or restore from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.myKrathong) {
          setMyKrathong(parsed.myKrathong);
          if (parsed.myKrathong.customComponents) {
            setCustomComponents(parsed.myKrathong.customComponents);
          }
          if (parsed.myKrathong.krathongStyleId) {
            setSelectedStyleId(parsed.myKrathong.krathongStyleId);
          }
          if (parsed.myKrathong.decorations) {
            setSelectedDecorations(parsed.myKrathong.decorations);
          }
          setRiverKrathongs((prev) => {
            const exists = prev.some((k) => k.id === parsed.myKrathong.id);
            return exists ? prev : [parsed.myKrathong, ...prev];
          });
        }
        if (parsed.blessing) {
          setBlessing(parsed.blessing);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Component Modifiers
  const handleSelectPreset = (styleId: string) => {
    setSelectedStyleId(styleId);
    const style = KRATHONG_STYLES.find((s) => s.id === styleId);
    if (style?.defaultComponents) {
      setCustomComponents({ ...style.defaultComponents });
    }
  };

  const handleModifyComponent = <K extends keyof KrathongComponents>(
    key: K,
    value: KrathongComponents[K]
  ) => {
    setCustomComponents((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRandomizeComponents = () => {
    const randomBase = KRATHONG_BASES[Math.floor(Math.random() * KRATHONG_BASES.length)].id;
    const randomPetal = KRATHONG_PETALS[Math.floor(Math.random() * KRATHONG_PETALS.length)].id;
    const randomCenter = KRATHONG_CENTERS[Math.floor(Math.random() * KRATHONG_CENTERS.length)].id;
    const randomCandle = KRATHONG_CANDLES[Math.floor(Math.random() * KRATHONG_CANDLES.length)].id;
    const randomIncense = KRATHONG_INCENSES[Math.floor(Math.random() * KRATHONG_INCENSES.length)].id;

    setCustomComponents({
      baseId: randomBase,
      petalId: randomPetal,
      centerFlowerId: randomCenter,
      candleId: randomCandle,
      incenseId: randomIncense
    });

    playSoundEffect('chime');
    triggerLightBurst({ particleCount: 45, spread: 65 });
  };

  // Audio Synthesizer: River Chime & Gentle Ripple
  const playSoundEffect = (type: 'chime' | 'splash' | 'firework' | 'lantern') => {
    if (isMuted) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (type === 'chime') {
        // Pentatonic sacred bell harmonics
        const freqs = [432, 648, 864, 1296];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          const volume = 0.14 / (idx + 1);
          gain.gain.setValueAtTime(volume, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 3.3);
        });
      } else if (type === 'splash') {
        // Gentle water flow splash sound using filtered noise
        const bufferSize = ctx.sampleRate * 0.8;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.8);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(ctx.currentTime);
      } else if (type === 'firework') {
        // High sparkling chime with burst
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(700, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
      } else if (type === 'lantern') {
        // Soft ascending tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.3);
      }
    } catch {
      // Audio error ignored
    }
  };

  const toggleDecoration = (id: string) => {
    setSelectedDecorations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectSuggestedWish = (wish: string) => {
    setWishText(wish);
  };

  // Launch Krathong Ceremony
  const handleLaunchKrathong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    // Pick a Ganga blessing
    const randomBlessing =
      GANGA_BLESSINGS[Math.floor(Math.random() * GANGA_BLESSINGS.length)];
    setBlessing(randomBlessing);

    const displayName = userName.trim() || 'ผู้มีจิตศรัทธา';
    const partner = floatMode === 'couple' ? partnerName.trim() || 'คนรู้ใจ' : undefined;

    const newKrathong: RiverKrathong = {
      id: `user-krathong-${Date.now()}`,
      senderName: floatMode === 'couple' ? `${displayName} & ${partner}` : displayName,
      partnerName: partner,
      wish: wishText.trim(),
      category: selectedCategoryId,
      krathongStyleId: selectedStyleId,
      decorations: selectedDecorations,
      customComponents: { ...customComponents },
      xPercent: 50,
      yPercent: 62,
      scale: 1.25,
      speedSeconds: 15,
      createdAt: 'วันนี้ (วันเพ็ญเดือน ๑๒)',
      isUser: true
    };

    setMyKrathong(newKrathong);
    setRiverKrathongs((prev) => [newKrathong, ...prev]);

    // Save to LocalStorage
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          myKrathong: newKrathong,
          blessing: randomBlessing
        })
      );
    } catch {
      // Storage error ignored
    }

    // Progression: Show floating animation
    setViewMode('floating');
    playSoundEffect('splash');
    playSoundEffect('chime');

    // Trigger golden light burst
    setTimeout(() => {
      triggerDivineBlessingLight();
    }, 1200);

    // Switch to river view after animation
    setTimeout(() => {
      setViewMode('river');
      setShowCertificate(true);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }, 2800);
  };

  // Extra Fireworks Burst
  const handleLaunchFireworks = () => {
    playSoundEffect('firework');
    triggerLightBurst({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.45 }
    });
    setTimeout(() => {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { x: 0.25, y: 0.35 },
        colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#c084fc']
      });
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { x: 0.75, y: 0.35 },
        colors: ['#34d399', '#fde047', '#f472b6', '#60a5fa']
      });
    }, 250);
  };

  // Add Sky Lantern to Night Sky
  const handleReleaseLantern = () => {
    playSoundEffect('lantern');
    const newId = Date.now();
    const randomLeft = Math.floor(Math.random() * 70) + 15;
    setSkyLanterns((prev) => [
      ...prev,
      { id: newId, left: randomLeft, bottom: 40, size: 26 }
    ]);
    triggerLightBurst({
      particleCount: 35,
      spread: 50,
      colors: ['#fef08a', '#f59e0b', '#fb923c'],
      origin: { x: randomLeft / 100, y: 0.6 }
    });
  };

  // Interactive River Water Click: Spawns ripples and physically nudges nearby krathongs
  const handleRiverClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid triggering when clicking buttons inside HUD or modals
    if ((e.target as HTMLElement).closest('button')) return;
    if (!riverContainerRef.current) return;

    const rect = riverContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Spawn animated ripple ring
    const rippleId = Date.now();
    setClickRipples((prev) => [...prev.slice(-3), { id: rippleId, x: clickX, y: clickY }]);
    setTimeout(() => {
      setClickRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 1200);

    // Play gentle splash sound
    playSoundEffect('splash');

    // Nudge krathongs located within ripple radius
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    physicsRef.current.forEach((phys) => {
      const kX = (phys.xPercent / 100) * containerWidth;
      const kY = (phys.yPercent / 100) * containerHeight;
      const dist = Math.hypot(clickX - kX, clickY - kY);
      if (dist < 220) {
        // Upward impulse proportional to distance
        const impulse = (1 - dist / 220) * -16;
        phys.nudgeY = impulse;
      }
    });
  };

  // Double Click / Tap on River: Directs User's Krathong to glide to that position
  const handleRiverDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (!riverContainerRef.current) return;

    const targetId = myKrathong?.id || riverKrathongs[0]?.id;
    if (!targetId) return;

    const rect = riverContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = Math.max(5, Math.min(95, (clickX / rect.width) * 100));
    const yPercent = Math.max(28, Math.min(88, (clickY / rect.height) * 100));

    const phys = physicsRef.current.get(targetId);
    if (phys) {
      phys.xPercent = xPercent;
      phys.yPercent = yPercent;
      phys.scale = 0.8 + (yPercent / 100) * 0.55;
      phys.nudgeY = -14;
      playSoundEffect('splash');
      triggerLightBurst({
        particleCount: 30,
        spread: 50,
        origin: { x: clickX / rect.width, y: clickY / rect.height }
      });
    }
  };

  // Pointer Down on Krathong (Initiate Drag or Prepare for Click)
  const handleKrathongPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    krathongId: string
  ) => {
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignored if capture unsupported
    }

    draggingIdRef.current = krathongId;
    setActiveDraggingId(krathongId);
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    dragMovedRef.current = false;
  };

  // Pointer Move (Smoothly move Krathong across the water surface)
  const handleKrathongPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingIdRef.current || !riverContainerRef.current) return;

    const start = dragStartPosRef.current;
    if (start) {
      const dist = Math.hypot(e.clientX - start.x, e.clientY - start.y);
      if (dist > 5) {
        dragMovedRef.current = true;
      }
    }

    if (!dragMovedRef.current) return;

    const rect = riverContainerRef.current.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    // Constrain within river water bounds
    const xPercent = Math.max(2, Math.min(98, (curX / rect.width) * 100));
    const yPercent = Math.max(28, Math.min(88, (curY / rect.height) * 100));

    const phys = physicsRef.current.get(draggingIdRef.current);
    if (phys) {
      phys.xPercent = xPercent;
      phys.yPercent = yPercent;
      // Perspective scale adjusts dynamically as user moves krathong up or down
      phys.scale = 0.8 + (yPercent / 100) * 0.55;

      const el = krathongElsRef.current.get(phys.id);
      if (el) {
        const tilt = Math.max(-12, Math.min(12, (e.movementX || 0) * 1.5));
        el.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%) scale(${phys.scale * 1.15}) rotate(${tilt}deg)`;
      }
    }
  };

  // Pointer Up on Krathong (Release to water or trigger Click to inspect)
  const handleKrathongPointerUp = (
    e: React.PointerEvent<HTMLDivElement>,
    targetK: RiverKrathong
  ) => {
    e.stopPropagation();
    const wasDragging = draggingIdRef.current === targetK.id;
    const wasMoved = dragMovedRef.current;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    draggingIdRef.current = null;
    setActiveDraggingId(null);
    dragStartPosRef.current = null;
    dragMovedRef.current = false;

    if (wasDragging && wasMoved) {
      // Released onto river water!
      playSoundEffect('splash');

      // Spawn splash ripple at drop location
      if (riverContainerRef.current) {
        const rect = riverContainerRef.current.getBoundingClientRect();
        const dropX = e.clientX - rect.left;
        const dropY = e.clientY - rect.top;
        const rippleId = Date.now();
        setClickRipples((prev) => [...prev.slice(-3), { id: rippleId, x: dropX, y: dropY }]);
        setTimeout(() => setClickRipples((p) => p.filter((r) => r.id !== rippleId)), 1200);
      }
    } else if (!wasMoved) {
      // Simple click: open inspection modal!
      setInspectedKrathong(targetK);
    }
  };

  // Manual Steer Buttons for User's Krathong
  const handleMoveMyKrathong = (dir: 'left' | 'right' | 'up' | 'down' | 'boost') => {
    const targetId = myKrathong?.id || riverKrathongs[0]?.id;
    if (!targetId) return;

    const phys = physicsRef.current.get(targetId);
    if (!phys) return;

    playSoundEffect('splash');

    if (dir === 'left') {
      phys.xPercent = Math.max(5, phys.xPercent - 8);
      phys.tiltAmp = 4;
    } else if (dir === 'right') {
      phys.xPercent = Math.min(95, phys.xPercent + 8);
      phys.tiltAmp = 4;
    } else if (dir === 'up') {
      phys.yPercent = Math.max(30, phys.yPercent - 8);
      phys.scale = 0.8 + (phys.yPercent / 100) * 0.55;
      phys.nudgeY = -12;
    } else if (dir === 'down') {
      phys.yPercent = Math.min(85, phys.yPercent + 8);
      phys.scale = 0.8 + (phys.yPercent / 100) * 0.55;
      phys.nudgeY = 12;
    } else if (dir === 'boost') {
      phys.speedX = Math.min(6, phys.speedX + 1.2);
      phys.nudgeY = -8;
      triggerLightBurst({ particleCount: 25, spread: 45 });
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-12">
      {/* Page Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-b from-[#0a1128] via-[#071739] to-[#040817] border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 text-center">
        {/* Full Moon & Atmospheric Lights */}
        <div className="absolute top-4 right-8 sm:right-16 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-100 via-amber-200 to-yellow-300 anim-moon-halo pointer-events-none opacity-90">
          <div className="absolute inset-1 rounded-full bg-yellow-100/40 blur-[1px]"></div>
          {/* Subtle lunar crater markings */}
          <div className="absolute top-3 left-4 w-3.5 h-3.5 rounded-full bg-amber-300/30 blur-[1px]"></div>
          <div className="absolute bottom-4 right-5 w-4 h-3 rounded-full bg-amber-400/20 blur-[1px]"></div>
        </div>

        <div className="absolute top-0 left-1/4 w-72 h-32 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 text-xs font-semibold shadow-inner">
            <Moon className="w-3.5 h-3.5 text-amber-300" />
            <span>วันเพ็ญเดือน ๑๒ • เทศกาลลอยกระทงออนไลน์</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black gold-gradient-text tracking-tight font-cinzel-decorative">
            ลอยกระทงออนไลน์ ๒๕๖๙
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            สืบสานประเพณีไทย ขอขมาแด่พระแม่คงคา ลอยทุกข์โศกโรคภัย
            จุดประทีปส่องสว่างนำทางชีวิต และอธิษฐานจิตสู่สายธาราอันศักดิ์สิทธิ์
          </p>

          {/* Quick Action Bar (Audio toggle, mantra modal, view switcher) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/60 transition-all cursor-pointer"
              title={isMuted ? 'เปิดเสียงมงคล' : 'ปิดเสียง'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  <span>เสียงปิดอยู่</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>เสียงเปิด</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowMantraModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>บทขอขมาพระแม่คงคา</span>
            </button>

            {myKrathong && (
              <button
                onClick={() => setViewMode(viewMode === 'river' ? 'builder' : 'river')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-900/50 hover:bg-cyan-800/60 text-xs font-medium text-cyan-200 border border-cyan-500/40 transition-all cursor-pointer"
              >
                <Waves className="w-3.5 h-3.5 text-cyan-300" />
                <span>
                  {viewMode === 'river' ? '✏️ ประกอบกระทงใหม่' : '🌊 ชมสายน้ำแห่งคำอธิษฐาน'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mode 1: Animated Floating Transition Screen */}
      {viewMode === 'floating' && (
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 min-h-[450px] flex flex-col items-center justify-center text-center water-flowing-bg border border-cyan-500/40 shadow-2xl anim-blessing-reveal">
          {/* Animated Water Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/60 via-transparent to-black/40 pointer-events-none"></div>

          {/* Floating Krathong Ceremony Graphic with Launch Animation */}
          <div className="relative z-10 flex flex-col items-center gap-5">
            <div className="relative transform anim-krathong-launch">
              <div className="absolute -inset-8 bg-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
              <KrathongGraphic
                style={selectedStyle}
                customComponents={customComponents}
                decorations={selectedDecorations}
                size="xl"
                showReflections={true}
              />
              {/* Expanding Water Ripple Ring as it enters water */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-48 h-10 rounded-full border border-cyan-400/50 anim-ripple pointer-events-none"></div>
            </div>

            <div className="space-y-2 mt-4 max-w-md">
              <p className="text-amber-300 text-sm font-semibold tracking-wider animate-pulse">
                ~ น้อมส่งกระทงลอยสู่สายธาราพระแม่คงคา ~
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                ตั้งจิตอธิษฐาน ขจัดทุกข์โศก รับมิ่งมงคล
              </h3>
              <p className="text-xs text-slate-300">
                แสงเทียนประทีปสว่างไสว ขอให้คำอธิษฐานของท่านสัมฤทธิผลทุกประการ...
              </p>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-xs text-cyan-200">กำลังเดินทางสู่แม่น้ำคงคา...</span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: River View (Active River with Floating & Drifting Krathongs) */}
      {viewMode === 'river' && (
        <div className="space-y-6">
          {/* River Canvas Container (Clickable for Interactive Ripples, Draggable & Double-Clickable) */}
          <div
            ref={riverContainerRef}
            onClick={handleRiverClick}
            onDoubleClick={handleRiverDoubleClick}
            className="relative rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl min-h-[520px] sm:min-h-[600px] water-flowing-bg select-none cursor-crosshair"
            title="คลิกลากกระทงเพื่อย้ายตำแหน่ง หรือดับเบิ้ลคลิกบนผิวน้ำเพื่อเรียกกระทงมา"
          >
            {/* River Sky with Full Moon & Stars */}
            <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#020617] via-[#040e24] to-transparent pointer-events-none z-0">
              {/* Stars */}
              <div className="absolute top-6 left-12 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-12 left-44 w-1 h-1 bg-yellow-200 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
              <div className="absolute top-8 right-32 w-1.5 h-1.5 bg-cyan-200 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></div>
              <div className="absolute top-16 right-56 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>

              {/* Distant Temple Silhouette along the riverbank */}
              <div className="absolute bottom-2 inset-x-0 h-8 flex justify-between px-8 opacity-25 text-amber-200 text-xs pointer-events-none">
                <span>ริมฝั่งเจ้าพระยา</span>
                <span>ศาลาท่าน้ำโบราณ</span>
              </div>
            </div>

            {/* Radiant Full Moon */}
            <div className="absolute top-5 right-6 sm:right-14 w-18 h-18 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-100 via-amber-200 to-yellow-300 anim-moon-halo z-0 pointer-events-none">
              <div className="absolute inset-1 rounded-full bg-yellow-100/50 blur-[2px]"></div>
            </div>

            {/* Ascending Sky Lanterns */}
            {skyLanterns.map((lantern) => (
              <div
                key={lantern.id}
                className="absolute anim-sky-lantern pointer-events-none z-10"
                style={{
                  left: `${lantern.left}%`,
                  bottom: `${lantern.bottom}%`,
                  width: `${lantern.size}px`,
                  height: `${lantern.size * 1.3}px`
                }}
              >
                <div className="w-full h-full rounded-t-lg rounded-b-sm bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 shadow-lg shadow-orange-500/80 opacity-90 flex items-center justify-center p-1">
                  <div className="w-2 h-2 rounded-full bg-white blur-[1px] animate-pulse"></div>
                </div>
              </div>
            ))}

            {/* Interactive Krathong Move & Steer Toolbar (Top Left) */}
            {showMoveControls && (
              <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5 p-2 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-cyan-500/40 shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between gap-2 px-1">
                  <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-1">
                    <span>🕹️ เลื่อนกระทง</span>
                  </span>
                  <span className="text-[9px] text-amber-300 bg-amber-950/80 px-1.5 py-0.2 rounded-full border border-amber-500/30">
                    ลากหรือกดเลื่อน
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 w-28 mx-auto">
                  <div></div>
                  <button
                    type="button"
                    onClick={() => handleMoveMyKrathong('up')}
                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-cyan-900/60 border border-slate-700 hover:border-cyan-400 text-cyan-200 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow"
                    title="ลอยขึ้นไปทางไกล (Up)"
                  >
                    ▲
                  </button>
                  <div></div>

                  <button
                    type="button"
                    onClick={() => handleMoveMyKrathong('left')}
                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-cyan-900/60 border border-slate-700 hover:border-cyan-400 text-cyan-200 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow"
                    title="ลอยไปทางซ้าย (Left)"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveMyKrathong('boost')}
                    className="p-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-amber-300 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow"
                    title="เร่งความเร็วกระแสน้ำ (Boost)"
                  >
                    ⚡
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveMyKrathong('right')}
                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-cyan-900/60 border border-slate-700 hover:border-cyan-400 text-cyan-200 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow"
                    title="ลอยไปทางขวา (Right)"
                  >
                    ▶
                  </button>

                  <div></div>
                  <button
                    type="button"
                    onClick={() => handleMoveMyKrathong('down')}
                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-cyan-900/60 border border-slate-700 hover:border-cyan-400 text-cyan-200 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow"
                    title="ลอยลงมาใกล้ (Down)"
                  >
                    ▼
                  </button>
                  <div></div>
                </div>
              </div>
            )}

            {/* Animated Flowing River Waves (Water Current Streams) */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none overflow-hidden opacity-30 z-10">
              <svg
                className="w-[200%] h-full anim-river-waves-1 absolute bottom-0 left-0"
                viewBox="0 0 1600 300"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="riverWaveGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 140 C300 180, 500 100, 800 140 C1100 180, 1300 100, 1600 140 L1600 300 L0 300 Z"
                  fill="url(#riverWaveGrad1)"
                />
              </svg>
              <svg
                className="w-[200%] h-full anim-river-waves-2 absolute bottom-0 left-0 opacity-40"
                viewBox="0 0 1600 300"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="riverWaveGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#083344" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 190 C350 150, 600 230, 950 180 C1300 130, 1550 220, 1800 180 L1800 300 L0 300 Z"
                  fill="url(#riverWaveGrad2)"
                />
              </svg>
            </div>

            {/* Interactive Touch/Click Ripples on Water Surface */}
            {clickRipples.map((r) => (
              <div
                key={r.id}
                className="absolute pointer-events-none rounded-full border-2 border-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.7)] anim-water-click-ripple z-15"
                style={{
                  left: `${r.x}px`,
                  top: `${r.y}px`,
                  width: '120px',
                  height: '55px'
                }}
              />
            ))}

            {/* River Wave Current Overlays */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(14,165,233,0.15),_transparent_70%)] pointer-events-none"></div>
            <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

            {/* Floating & Draggable River Krathongs */}
            <div className="absolute inset-0 z-20 overflow-hidden">
              {riverKrathongs.map((k) => {
                const kStyle =
                  KRATHONG_STYLES.find((s) => s.id === k.krathongStyleId) || KRATHONG_STYLES[0];
                const isMine = k.id === myKrathong?.id;
                const isDragging = activeDraggingId === k.id;

                return (
                  <div
                    key={k.id}
                    ref={(el) => {
                      if (el) krathongElsRef.current.set(k.id, el);
                      else krathongElsRef.current.delete(k.id);
                    }}
                    onPointerDown={(e) => handleKrathongPointerDown(e, k.id)}
                    onPointerMove={handleKrathongPointerMove}
                    onPointerUp={(e) => handleKrathongPointerUp(e, k)}
                    onPointerCancel={(e) => handleKrathongPointerUp(e, k)}
                    onMouseEnter={() => {
                      hoveredIdRef.current = k.id;
                    }}
                    onMouseLeave={() => {
                      if (hoveredIdRef.current === k.id) hoveredIdRef.current = null;
                    }}
                    className={`absolute top-0 left-0 will-change-transform focus:outline-none select-none touch-none ${
                      isDragging
                        ? 'cursor-grabbing z-40'
                        : 'cursor-grab hover:z-30'
                    }`}
                    style={{
                      transform: `translate3d(${(k.xPercent / 100) * 800}px, ${(k.yPercent / 100) * 500}px, 0) translate(-50%, -50%) scale(${k.scale})`
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`กระทงของ ${k.senderName} (คลิกเพื่อดูคำอธิษฐาน หรือลากเพื่อเคลื่อนย้าย)`}
                  >
                    {/* User's Krathong Glowing Halo */}
                    {isMine && (
                      <div className="absolute -inset-4 rounded-full bg-amber-400/30 blur-xl animate-pulse pointer-events-none"></div>
                    )}

                    {/* Active Dragging Ring Indicator */}
                    {isDragging && (
                      <div className="absolute -inset-5 rounded-full border-2 border-dashed border-cyan-300/80 animate-spin pointer-events-none"></div>
                    )}

                    {/* Drag hint badge on user's krathong */}
                    {isMine && !isDragging && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-400/50 shadow-md animate-bounce pointer-events-none">
                        🖐️ ลากย้ายได้
                      </span>
                    )}

                    {/* Krathong Visual Graphic with Trailing Wake */}
                    <div className="transition-transform duration-200 group-hover:scale-105 pointer-events-none">
                      <KrathongGraphic
                        style={kStyle}
                        customComponents={isMine ? customComponents : k.customComponents || kStyle.defaultComponents}
                        decorations={k.decorations}
                        size={isMine ? 'lg' : 'md'}
                        showReflections={true}
                      />
                    </div>

                    {/* Krathong Tag / Name Pill */}
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg transition-all duration-200 pointer-events-none flex items-center gap-1 border border-amber-500/30 bg-slate-950/90 text-amber-200">
                      {isMine && <span className="text-yellow-400">✨ กระทงของคุณ:</span>}
                      <span>{k.senderName}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* River Controls HUD (Bottom Bar) */}
            <div className="absolute bottom-3 inset-x-3 z-30 flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-cyan-500/40 shadow-xl">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handleReleaseLantern}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 text-xs font-bold border border-amber-500/40 transition-all cursor-pointer active:scale-95"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>🏮 ปล่อยโคมลอย</span>
                </button>

                <button
                  onClick={handleLaunchFireworks}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-bold border border-purple-500/40 transition-all cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>🎆 จุดพลุฉลอง</span>
                </button>

                <button
                  onClick={() => setShowMoveControls(!showMoveControls)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                    showMoveControls
                      ? 'bg-cyan-600/40 border-cyan-400 text-cyan-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title="เปิด/ปิด แป้นบังคับกระทง"
                >
                  <span>🕹️ {showMoveControls ? 'ซ่อนปุ่มบังคับ' : 'ปุ่มบังคับ'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {blessing && (
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 text-xs font-bold border border-cyan-500/40 transition-all cursor-pointer"
                  >
                    <Moon className="w-3.5 h-3.5 text-cyan-300" />
                    <span>📜 บัตรมงคล</span>
                  </button>
                )}

                <button
                  onClick={() => setViewMode('builder')}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-700/40 hover:bg-emerald-600/50 text-emerald-200 text-xs font-bold border border-emerald-500/40 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
                  <span>🌸 ลอยกระทงอีกใบ</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 flex flex-wrap items-center justify-center gap-2">
            <span>🖐️ <strong>คลิกและลากกระทง</strong> เพื่อเคลื่อนย้ายตำแหน่งบนผิวน้ำได้อย่างอิสระ</span>
            <span>•</span>
            <span>👆 ดับเบิ้ลคลิกบนผิวน้ำเพื่อเรียกกระทงมา</span>
            <span>•</span>
            <span>คลิกที่กระทงเพื่ออ่านคำอธิษฐาน</span>
          </p>
        </div>
      )}

      {/* Mode 3: Builder & Prayer Form (Default) */}
      {viewMode === 'builder' && (
        <form onSubmit={handleLaunchKrathong} className="space-y-6 sm:space-y-8">
          {/* Step 1: สตูดิโอปรับแต่งกระทง (Krathong DIY Component Studio & Preset Themes) */}
          <div className="glass-panel rounded-3xl p-5 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
              <div>
                <h3 className="text-base sm:text-xl font-bold text-cyan-200 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-amber-400" />
                  <span>๑. สตูดิโอประดิษฐ์และปรับแต่งกระทงมงคล</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  ปรับเปลี่ยนชิ้นส่วนได้อิสระ (ฐาน กลีบ ดอกไม้ เทียน ธูป) หรือเลือกจากชุดธีมมงคลสำเร็จรูป
                </p>
              </div>

              {/* Mode switch tabs: DIY Components vs Preset Themes */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBuilderTab('components')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    builderTab === 'components'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>🎨 ปรับแต่งชิ้นส่วนเอง</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBuilderTab('presets')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    builderTab === 'presets'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✨ ธีมสำเร็จรูป</span>
                </button>
                <button
                  type="button"
                  onClick={handleRandomizeComponents}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-purple-500/40 bg-purple-900/30 text-purple-200 hover:bg-purple-800/50 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="สุ่มส่วนประกอบมงคลแบบไม่ซ้ำใคร"
                >
                  <Dices className="w-3.5 h-3.5 text-purple-400" />
                  <span>🎲 สุ่มชิ้นส่วน</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Krathong Studio Showcase */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-950/80 via-cyan-950/30 to-slate-950/90 border border-cyan-500/30 flex flex-col md:flex-row items-center gap-5 shadow-inner">
              <div className="shrink-0 flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 relative">
                <KrathongGraphic
                  style={selectedStyle}
                  customComponents={customComponents}
                  decorations={selectedDecorations}
                  size="lg"
                  showReflections={true}
                />
                <span className="text-[10px] text-cyan-300 font-medium mt-1">
                  👁️ ตัวอย่างกระทงจริงแบบเรียลไทม์
                </span>
              </div>

              {/* Realtime component breakdown pills */}
              <div className="flex-1 min-w-0 space-y-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-amber-500/30">
                    🌿 ฐาน: {currentBase.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-pink-300 border border-pink-500/30">
                    🌸 กลีบ: {currentPetal.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-yellow-300 border border-yellow-500/30">
                    🌼 ใจกลาง: {currentCenter.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-orange-300 border border-orange-500/30">
                    🕯️ เทียน: {currentCandle.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-blue-300 border border-blue-500/30">
                    🎋 ธูป: {currentIncense.name}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {currentPetal.name} บน{currentBase.name}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  <strong className="text-amber-400 font-semibold">ความหมายมงคลรวม: </strong>
                  {currentPetal.meaning} • {currentCenter.meaning} • {currentCandle.meaning}
                </p>

                <p className="text-[11px] text-emerald-400 font-medium">
                  🌱 สิ่งแวดล้อม: {currentBase.ecoTag} & {currentIncense.typeTag}
                </p>
              </div>
            </div>

            {/* TAB 1: DIY Components Customizer */}
            {builderTab === 'components' && (
              <div className="space-y-4 pt-1">
                {/* Component Sub-Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 pb-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveComponentType('base')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeComponentType === 'base'
                        ? 'bg-emerald-600/40 border-emerald-400 text-emerald-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🌿 ฐานกระทง</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950">
                      {KRATHONG_BASES.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveComponentType('petal')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeComponentType === 'petal'
                        ? 'bg-pink-600/40 border-pink-400 text-pink-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🌸 กลีบกระทง</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950">
                      {KRATHONG_PETALS.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveComponentType('center')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeComponentType === 'center'
                        ? 'bg-yellow-600/40 border-yellow-400 text-yellow-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🌼 ดอกไม้ใจกลาง</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950">
                      {KRATHONG_CENTERS.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveComponentType('candle')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeComponentType === 'candle'
                        ? 'bg-amber-600/40 border-amber-400 text-amber-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🕯️ เทียน & แสงไฟ</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950">
                      {KRATHONG_CANDLES.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveComponentType('incense')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeComponentType === 'incense'
                        ? 'bg-cyan-600/40 border-cyan-400 text-cyan-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🎋 รูปแบบธูป</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950">
                      {KRATHONG_INCENSES.length}
                    </span>
                  </button>
                </div>

                {/* Sub-tab 1: Base items */}
                {activeComponentType === 'base' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {KRATHONG_BASES.map((b) => {
                      const isSelected = customComponents.baseId === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => handleModifyComponent('baseId', b.id)}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                            {b.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-slate-100">{b.name}</p>
                              {isSelected && <span className="text-emerald-400 text-xs font-bold">✓</span>}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {b.description}
                            </p>
                            <span className="inline-block mt-1 text-[10px] text-emerald-300 font-semibold px-2 py-0.2 rounded-full bg-slate-950/80">
                              🌱 {b.ecoTag}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-tab 2: Petal items */}
                {activeComponentType === 'petal' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {KRATHONG_PETALS.map((p) => {
                      const isSelected = customComponents.petalId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleModifyComponent('petalId', p.id)}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-pink-950/60 border-pink-400 ring-2 ring-pink-400/40 shadow-lg'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                            {p.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-slate-100">{p.name}</p>
                              {isSelected && <span className="text-pink-400 text-xs font-bold">✓</span>}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 leading-relaxed">
                              {p.description}
                            </p>
                            <span className="inline-block mt-1 text-[10px] text-pink-300 font-semibold px-2 py-0.2 rounded-full bg-slate-950/80">
                              ✨ {p.meaning}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-tab 3: Center Flower items */}
                {activeComponentType === 'center' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {KRATHONG_CENTERS.map((c) => {
                      const isSelected = customComponents.centerFlowerId === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleModifyComponent('centerFlowerId', c.id)}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-yellow-950/60 border-yellow-400 ring-2 ring-yellow-400/40 shadow-lg'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                            {c.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-slate-100">{c.name}</p>
                              {isSelected && <span className="text-yellow-400 text-xs font-bold">✓</span>}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 leading-relaxed">
                              {c.description}
                            </p>
                            <span className="inline-block mt-1 text-[10px] text-yellow-300 font-semibold px-2 py-0.2 rounded-full bg-slate-950/80">
                              ✨ {c.meaning}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-tab 4: Candle items */}
                {activeComponentType === 'candle' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {KRATHONG_CANDLES.map((c) => {
                      const isSelected = customComponents.candleId === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleModifyComponent('candleId', c.id)}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                            {c.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-slate-100">{c.name}</p>
                              {isSelected && <span className="text-amber-400 text-xs font-bold">✓</span>}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 leading-relaxed">
                              {c.description}
                            </p>
                            <span className="inline-block mt-1 text-[10px] text-amber-300 font-semibold px-2 py-0.2 rounded-full bg-slate-950/80">
                              🕯️ {c.meaning}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-tab 5: Incense items */}
                {activeComponentType === 'incense' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {KRATHONG_INCENSES.map((i) => {
                      const isSelected = customComponents.incenseId === i.id;
                      return (
                        <button
                          key={i.id}
                          type="button"
                          onClick={() => handleModifyComponent('incenseId', i.id)}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                            {i.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-slate-100">{i.name}</p>
                              {isSelected && <span className="text-cyan-400 text-xs font-bold">✓</span>}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {i.description}
                            </p>
                            <span className="inline-block mt-1 text-[10px] text-cyan-300 font-semibold px-2 py-0.2 rounded-full bg-slate-950/80">
                              {i.typeTag}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Quick Presets */}
            {builderTab === 'presets' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
                {KRATHONG_STYLES.map((style) => {
                  const isSelected = style.id === selectedStyleId;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleSelectPreset(style.id)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-950/60'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-950/80 text-amber-300 border border-amber-500/20 truncate max-w-[120px]">
                          {style.badge}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="py-2 flex items-center justify-center">
                        <div className="transform group-hover:scale-105 transition-transform">
                          <KrathongGraphic
                            style={style}
                            customComponents={style.defaultComponents}
                            decorations={['incense-candle']}
                            size="sm"
                            showReflections={false}
                          />
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {style.name}
                        </p>
                        <p className="text-[10px] text-emerald-400 font-medium mt-0.5">
                          🌱 {style.ecoScore}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: เลือกเครื่องสักการะใส่ในกระทง (Decorations) */}
          <div className="glass-panel rounded-3xl p-5 sm:p-7 space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-cyan-200 flex items-center gap-2">
                <span>๒. สิ่งของและดอกไม้มงคลในกระทง</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  เลือกได้ตามจิตศรัทธา
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                คลิกเลือกสิ่งของมงคลเพื่อประดับลงในกระทงของคุณ
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
              {KRATHONG_DECORATIONS.map((deco) => {
                const isChecked = selectedDecorations.includes(deco.id);
                return (
                  <button
                    key={deco.id}
                    type="button"
                    onClick={() => toggleDecoration(deco.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-amber-950/30 border-amber-500/50 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl shrink-0 p-1 bg-slate-950 rounded-xl border border-slate-800">
                      {deco.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-100">{deco.name}</p>
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isChecked ? 'bg-amber-400 text-slate-950' : 'border border-slate-600'
                          }`}
                        >
                          {isChecked ? '✓' : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        {deco.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: ข้อมูลผู้ลอยกระทง (Float Mode: ลอยเดี่ยว / ลอยคู่) */}
          <div className="glass-panel rounded-3xl p-5 sm:p-7 space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-cyan-200">
                ๓. ผู้ร่วมลอยกระทง
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                สามารถลอยคนเดียวเพื่อความสงบร่มเย็น หรือใส่ชื่อคนรัก/เพื่อนเพื่อลอยคู่กัน
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFloatMode('single')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  floatMode === 'single'
                    ? 'bg-cyan-900/60 border-cyan-400 text-cyan-200 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>👤 ลอยคนเดียว (โสดสดใส/ลอยเดี่ยว)</span>
              </button>
              <button
                type="button"
                onClick={() => setFloatMode('couple')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  floatMode === 'couple'
                    ? 'bg-rose-950/60 border-rose-400 text-rose-200 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>👩‍❤️‍👨 ลอยคู่ (กับคนรัก / เพื่อนรู้ใจ)</span>
              </button>
            </div>

            {/* Name Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ชื่อของคุณ (หรือนามแฝง)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="เช่น คุณกานต์ หรือ คนโสด2026"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              {floatMode === 'couple' && (
                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1.5">
                    ชื่อคนรัก / เพื่อนคู่ใจ
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="เช่น น้องฟ้า หรือ เพื่อนสนิท"
                    className="w-full bg-slate-900 border border-rose-700/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Step 4: คำอธิษฐานจิต & บทขอขมา (Wish & Prayer) */}
          <div className="glass-panel rounded-3xl p-5 sm:p-7 space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-cyan-200">
                ๔. คำอธิษฐานจิตสู่สายธารา
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                เลือกหมวดหมู่คำอธิษฐาน หรือคลิกข้อความมงคลด้านล่างเพื่อใช้ได้ทันที
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {WISH_CATEGORIES.map((cat) => {
                const isActive = cat.id === selectedCategoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Suggestions for Selected Category */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-cyan-400">
                ✨ คำอธิษฐานแนะนำประจำหมวด ({selectedCategory.name}):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCategory.wishes.map((w, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestedWish(w)}
                    className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 text-left text-xs text-slate-300 hover:text-white transition-all cursor-pointer leading-relaxed"
                  >
                    "{w}"
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Wish Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ข้อความคำอธิษฐานของคุณ (สามารถแก้ไขหรือพิมพ์เพิ่มเติมได้ตามใจปรารถนา)
              </label>
              <textarea
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                rows={3}
                required
                placeholder="พิมพ์คำอธิษฐานจิต หรือเลือกจากคำแนะนำด้านบน..."
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 leading-relaxed"
              />
            </div>
          </div>

          {/* Action Submission */}
          <div className="text-center space-y-3 pt-2">
            <button
              type="submit"
              disabled={!wishText.trim()}
              className="btn-gold-shimmer text-slate-950 font-black text-base sm:text-lg px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl cursor-pointer shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-3"
            >
              <Send className="w-5 h-5" />
              <span>ตั้งจิตอธิษฐาน & ปล่อยกระทงลงสู่สายน้ำ</span>
              <Sparkles className="w-5 h-5 text-amber-200" />
            </button>
            <p className="text-xs text-slate-400">
              🌕 ขออำนาจบารมีพระแม่คงคาประทานพรให้ทุกคำอธิษฐานสัมฤทธิผล
            </p>
          </div>
        </form>
      )}

      {/* Modal: Inspection of Krathong in River */}
      {inspectedKrathong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md anim-blessing-reveal">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-950 border border-cyan-500/40 p-6 shadow-2xl text-center space-y-4">
            <button
              onClick={() => setInspectedKrathong(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex justify-center pt-2">
              <KrathongGraphic
                style={
                  KRATHONG_STYLES.find((s) => s.id === inspectedKrathong.krathongStyleId) ||
                  KRATHONG_STYLES[0]
                }
                customComponents={
                  inspectedKrathong.isUser
                    ? customComponents
                    : inspectedKrathong.customComponents ||
                      (KRATHONG_STYLES.find((s) => s.id === inspectedKrathong.krathongStyleId) || KRATHONG_STYLES[0]).defaultComponents
                }
                decorations={inspectedKrathong.decorations}
                size="md"
                showReflections={true}
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
                กระทงกลางสายน้ำ
              </span>
              <h3 className="text-lg font-bold text-white">{inspectedKrathong.senderName}</h3>
              <p className="text-xs text-slate-400">{inspectedKrathong.createdAt}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
              <p className="text-xs text-amber-400 font-semibold mb-1">คำอธิษฐานจิต:</p>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                "{inspectedKrathong.wish}"
              </p>
            </div>

            <button
              onClick={() => {
                handleLaunchFireworks();
                setInspectedKrathong(null);
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 font-bold text-xs border border-cyan-500/40 transition-all cursor-pointer"
            >
              ✨ ร่วมอนุโมทนาพร & จุดพลุฉลอง
            </button>
          </div>
        </div>
      )}

      {/* Modal: Auspicious Blessing Certificate */}
      {showCertificate && blessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md anim-blessing-reveal overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-950 via-[#071329] to-slate-950 border-2 border-amber-500/50 p-6 sm:p-8 shadow-2xl text-center space-y-5 my-8">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="space-y-1 pt-2">
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold tracking-widest uppercase">
                <Moon className="w-4 h-4" />
                <span>บัตรมงคลประเพณีลอยกระทง ๒๕๖๙</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black gold-gradient-text font-cinzel-decorative">
                {blessing.title}
              </h3>
              <p className="text-xs text-slate-300">
                สาส์นพรมงคลจากพระแม่คงคาแด่: <strong className="text-white">{myKrathong?.senderName || 'ท่าน'}</strong>
              </p>
            </div>

            {/* Krathong Showcase */}
            {myKrathong && (
              <div className="flex justify-center py-1">
                <KrathongGraphic
                  style={selectedStyle}
                  customComponents={myKrathong.customComponents || customComponents}
                  decorations={myKrathong.decorations}
                  size="md"
                  showReflections={true}
                />
              </div>
            )}

            {/* Blessing Message */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-left space-y-2">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {blessing.message}
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs text-cyan-300">
                <strong>💡 ข้อคิดนำทาง: </strong> {blessing.advice}
              </div>
            </div>

            {/* Lucky Numbers & Colors */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-[10px] text-amber-400 font-bold uppercase">เลขมงคลวันเพ็ญ</p>
                <p className="text-sm font-black text-white">{blessing.luckyNumber}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-[10px] text-cyan-400 font-bold uppercase">สีมงคลเสริมชะตา</p>
                <p className="text-sm font-black text-white">{blessing.luckyColor}</p>
              </div>
            </div>

            {/* User Wish summary */}
            {myKrathong && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs text-slate-400">
                <span className="text-amber-400/90 font-semibold">คำอธิษฐานจิต: </span>
                <span>"{myKrathong.wish}"</span>
              </div>
            )}

            {/* Share / Copy Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() =>
                  handleCopy(
                    `🌕 บัตรมงคลลอยกระทง ๒๕๖๙\nผู้ลอย: ${myKrathong?.senderName}\nคำอธิษฐาน: ${myKrathong?.wish}\nสาส์นพรพระแม่คงคา: ${blessing.title} - ${blessing.message}`,
                    'cert'
                  )
                }
                className="flex-1 py-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 font-bold text-xs border border-amber-500/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {copiedText === 'cert' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText === 'cert' ? 'คัดลอกสำเร็จ' : 'คัดลอกบัตรมงคล'}</span>
              </button>
              <button
                onClick={() => {
                  setShowCertificate(false);
                  setViewMode('river');
                }}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600/40 hover:bg-cyan-600/60 text-cyan-200 font-bold text-xs border border-cyan-500/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Waves className="w-4 h-4" />
                <span>ชมกระทงในแม่น้ำ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Traditional Khongkha Mantra */}
      {showMantraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md anim-blessing-reveal">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-amber-500/40 p-6 sm:p-7 shadow-2xl text-center space-y-4">
            <button
              onClick={() => setShowMantraModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase">
                มนต์พิธีมงคล
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                บทขอขมาพระแม่คงคา วันลอยกระทง
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 text-center">
              <p className="text-sm sm:text-base font-bold text-amber-200 leading-relaxed whitespace-pre-line font-cinzel">
                {THAI_LOY_KRATHONG_MANTRA.pali}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left">
              <p className="text-xs font-semibold text-cyan-400 mb-1">คำแปลและความหมาย:</p>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {THAI_LOY_KRATHONG_MANTRA.meaning}
              </p>
            </div>

            <button
              onClick={() => handleCopy(THAI_LOY_KRATHONG_MANTRA.pali, 'mantra')}
              className="w-full py-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 font-bold text-xs border border-amber-500/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {copiedText === 'mantra' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{copiedText === 'mantra' ? 'คัดลอกบทสวดแล้ว' : 'คัดลอกบทขอขมา'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
