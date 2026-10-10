/**
 * Web Audio API synthesizer for responsive, lightweight in-game sound effects.
 * Includes gentle haptic feedback support via navigator.vibrate.
 */

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundMuted(muted: boolean) {
  isAudioMuted = muted;
}

export function isMuted(): boolean {
  return isAudioMuted;
}

export function triggerHaptic(duration: number | number[] = 20) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      (navigator as unknown as { vibrate: (pattern: number | number[]) => boolean }).vibrate(duration);
    } catch {
      // Ignore vibration errors if browser restricts
    }
  }
}

export function playTapSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  triggerHaptic(10);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

export function playFlickSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  triggerHaptic(25);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.13);
}

export function playCardSnapSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  triggerHaptic(15);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(320, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.06);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.07);
}

export function playSuccessChime() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  triggerHaptic([30, 40, 30]);

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + idx * 0.08;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.26);
  });
}

export function playErrorBuzz() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  triggerHaptic([60, 50, 60]);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(160, ctx.currentTime);
  osc.frequency.setValueAtTime(130, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.26);
}

export function playDoorLocked() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  triggerHaptic([40, 30, 40]);

  // Double thud sound
  [0, 0.12].forEach((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const time = ctx.currentTime + offset;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.08);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.09);
  });
}

export function playSparkleSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  triggerHaptic([20, 30, 20, 30]);

  const freqs = [880, 1100, 1320, 1760, 2200];
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const time = ctx.currentTime + idx * 0.05;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.22);
  });
}

export function playFanfareSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  triggerHaptic([50, 40, 50, 40, 80]);

  const chords = [
    [523.25, 659.25, 783.99],       // C
    [587.33, 739.99, 880.00],       // D
    [659.25, 830.61, 987.77],       // E
    [783.99, 987.77, 1174.66, 1567.98] // G chord with high G
  ];

  chords.forEach((chord, i) => {
    const start = ctx.currentTime + i * 0.16;
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.1, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + (i === 3 ? 0.6 : 0.2));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + (i === 3 ? 0.65 : 0.22));
    });
  });
}

export function playBlipSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(500 + Math.random() * 80, ctx.currentTime);

  gain.gain.setValueAtTime(0.03, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.035);
}
