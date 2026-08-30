import confetti from 'canvas-confetti';

/**
 * Trigger a radiant burst of glowing light particles (stars, light orbs, sparkles)
 * instead of rectangular paper confetti.
 */
export const triggerLightBurst = (options?: {
  colors?: string[];
  particleCount?: number;
  origin?: { x?: number; y?: number };
  spread?: number;
}) => {
  try {
    const defaultColors = ['#fef08a', '#fde047', '#f59e0b', '#fbbf24', '#ffffff', '#67e8f9'];
    const colors = options?.colors || defaultColors;
    const origin = options?.origin || { y: 0.6 };
    const count = options?.particleCount || 70;
    const spread = options?.spread || 80;

    // First layer: Shimmering starlight sparks
    confetti({
      particleCount: Math.floor(count * 0.6),
      spread: spread,
      origin: origin,
      colors: colors,
      shapes: ['star', 'circle'],
      scalar: 1.1,
      gravity: 0.5,
      drift: 0,
      ticks: 220,
      startVelocity: 28,
      decay: 0.92,
      disableForReducedMotion: true
    });

    // Second layer: Fine luminous glowing orbs / stardust floating down gently
    confetti({
      particleCount: Math.floor(count * 0.4),
      spread: spread + 20,
      origin: origin,
      colors: ['#ffffff', '#fffbeb', '#fef9c3', ...colors],
      shapes: ['circle'],
      scalar: 0.6,
      gravity: 0.35,
      drift: 0.05,
      ticks: 260,
      startVelocity: 20,
      decay: 0.94,
      disableForReducedMotion: true
    });
  } catch (err) {
    console.error('Failed to trigger light effect:', err);
  }
};

/**
 * Divine blessing aura light effect with cascading side beacons of light
 */
export const triggerDivineBlessingLight = () => {
  try {
    const goldLightColors = ['#ffd700', '#fef08a', '#fbbf24', '#f59e0b', '#ffffff', '#fed7aa'];

    // Center radiant light burst
    triggerLightBurst({
      colors: goldLightColors,
      particleCount: 85,
      origin: { y: 0.55 },
      spread: 90
    });

    // Side light flares
    setTimeout(() => {
      confetti({
        particleCount: 35,
        angle: 60,
        spread: 55,
        origin: { x: 0.08, y: 0.65 },
        colors: goldLightColors,
        shapes: ['star', 'circle'],
        scalar: 0.9,
        gravity: 0.45,
        ticks: 200,
        startVelocity: 30,
        decay: 0.92,
        disableForReducedMotion: true
      });
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 55,
        origin: { x: 0.92, y: 0.65 },
        colors: goldLightColors,
        shapes: ['star', 'circle'],
        scalar: 0.9,
        gravity: 0.45,
        ticks: 200,
        startVelocity: 30,
        decay: 0.92,
        disableForReducedMotion: true
      });
    }, 250);
  } catch (err) {
    console.error('Failed to trigger divine blessing light:', err);
  }
};

/**
 * Sakura blossom & golden glow light effect
 */
export const triggerSakuraLight = () => {
  try {
    const sakuraColors = ['#fbcfe8', '#fda4af', '#f43f5e', '#ffffff', '#fef08a', '#fbbf24'];

    triggerLightBurst({
      colors: sakuraColors,
      particleCount: 80,
      origin: { y: 0.55 },
      spread: 85
    });

    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0.08, y: 0.6 },
        colors: sakuraColors,
        shapes: ['circle', 'star'],
        scalar: 0.8,
        gravity: 0.4,
        ticks: 200,
        startVelocity: 28,
        decay: 0.93,
        disableForReducedMotion: true
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 0.92, y: 0.6 },
        colors: sakuraColors,
        shapes: ['circle', 'star'],
        scalar: 0.8,
        gravity: 0.4,
        ticks: 200,
        startVelocity: 28,
        decay: 0.93,
        disableForReducedMotion: true
      });
    }, 250);
  } catch (err) {
    console.error('Failed to trigger sakura light:', err);
  }
};

/**
 * Tarot mystic starlight and astral glow effect
 */
export const triggerMysticTarotLight = () => {
  try {
    const mysticColors = ['#c084fc', '#e879f9', '#38bdf8', '#fbbf24', '#ffffff', '#fef08a'];

    triggerLightBurst({
      colors: mysticColors,
      particleCount: 85,
      origin: { y: 0.6 },
      spread: 80
    });
  } catch (err) {
    console.error('Failed to trigger mystic tarot light:', err);
  }
};

/**
 * Sacred Fortune / Siamsi / Omikuji light burst
 */
export const triggerFortuneLight = (palette?: 'thai' | 'japan') => {
  try {
    const colors = palette === 'japan'
      ? ['#ea580c', '#e11d48', '#f59e0b', '#fbbf24', '#ffffff', '#fef08a']
      : ['#dc2626', '#f59e0b', '#fbbf24', '#ffd700', '#ffffff', '#fef08a'];

    triggerLightBurst({
      colors: colors,
      particleCount: 85,
      origin: { y: 0.6 },
      spread: 80
    });
  } catch (err) {
    console.error('Failed to trigger fortune light:', err);
  }
};
