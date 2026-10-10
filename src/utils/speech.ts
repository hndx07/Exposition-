/**
 * Web Speech API wrapper for NPC dialogues with British English (en-GB / GBR) voice library.
 * Supports en-GB voices (UK English), pitch customization (deep male vs feminine voices),
 * and speed toggles (0.8x slow vs 1.0x normal).
 */

let synth: SpeechSynthesis | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
  // Initialize voices & listen for asynchronous voice loading
  const loadVoices = () => {
    if (synth) {
      cachedVoices = synth.getVoices();
    }
  };
  loadVoices();
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
  }
}

export interface SpeakOptions {
  gender?: 'male' | 'female';
  rate?: number; // 0.8 or 1.0
  onStart?: () => void;
  onEnd?: () => void;
}

export function stopSpeaking() {
  if (synth) {
    try {
      synth.cancel();
    } catch {
      // Ignore
    }
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getBritishVoices(): SpeechSynthesisVoice[] {
  if (!synth) return [];
  const voices = cachedVoices.length > 0 ? cachedVoices : synth.getVoices();
  return voices.filter((v) => {
    const lang = v.lang.toLowerCase().replace('_', '-');
    const name = v.name.toLowerCase();
    return (
      lang.startsWith('en-gb') ||
      lang.includes('gb') ||
      name.includes('uk') ||
      name.includes('united kingdom') ||
      name.includes('british') ||
      name.includes('great britain')
    );
  });
}

export function speakText(text: string, options: SpeakOptions = {}) {
  if (!synth) return;

  try {
    synth.cancel(); // Stop any pending speech

    const cleanText = text
      .replace(/<[^>]*>/g, '')
      .replace(/[*_#]/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    // Explicitly set British English (GBR)
    utterance.lang = 'en-GB';
    utterance.rate = options.rate || 1.0;

    // Pitch: deep male vs higher female
    if (options.gender === 'female') {
      utterance.pitch = 1.15;
    } else {
      utterance.pitch = 0.85; // deep male voice
    }

    const allVoices = cachedVoices.length > 0 ? cachedVoices : synth.getVoices();
    const gbVoices = getBritishVoices();

    if (gbVoices.length > 0) {
      if (options.gender === 'female') {
        const femaleGbVoice = gbVoices.find((v) => {
          const n = v.name.toLowerCase();
          return (
            n.includes('female') ||
            n.includes('hazel') ||
            n.includes('susan') ||
            n.includes('libby') ||
            n.includes('sonia') ||
            n.includes('serena') ||
            n.includes('stephanie') ||
            n.includes('kate') ||
            n.includes('martha')
          );
        });
        utterance.voice = femaleGbVoice || gbVoices[0];
      } else {
        const maleGbVoice = gbVoices.find((v) => {
          const n = v.name.toLowerCase();
          return (
            n.includes('male') ||
            n.includes('george') ||
            n.includes('daniel') ||
            n.includes('oliver') ||
            n.includes('arthur') ||
            n.includes('brian') ||
            n.includes('ryan')
          );
        });
        utterance.voice = maleGbVoice || gbVoices[0];
      }
    } else if (allVoices.length > 0) {
      // Fallback to any English voice if no specific GB voice is installed
      const enVoices = allVoices.filter((v) => v.lang.toLowerCase().startsWith('en'));
      if (enVoices.length > 0) {
        if (options.gender === 'female') {
          const femaleVoice = enVoices.find((v) =>
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('samantha')
          );
          utterance.voice = femaleVoice || enVoices[0];
        } else {
          const maleVoice = enVoices.find((v) =>
            v.name.toLowerCase().includes('male') ||
            v.name.toLowerCase().includes('david') ||
            v.name.toLowerCase().includes('george')
          );
          utterance.voice = maleVoice || enVoices[0];
        }
      }
    }

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    utterance.onerror = () => {
      if (options.onEnd) options.onEnd();
    };

    synth.speak(utterance);
  } catch (err) {
    console.warn('British Speech synthesis error:', err);
    if (options.onEnd) options.onEnd();
  }
}
