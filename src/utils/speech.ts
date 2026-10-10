/**
 * Web Speech API wrapper for NPC dialogues.
 * Supports en-US voices, pitch customization (deep male vs feminine voices),
 * and speed toggles (0.8x slow vs 1.0x normal).
 */

let synth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
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
    utterance.lang = 'en-US';
    utterance.rate = options.rate || 1.0;

    // Pitch: deep male vs higher female
    if (options.gender === 'female') {
      utterance.pitch = 1.2;
    } else {
      utterance.pitch = 0.85; // deep male voice
    }

    // Try finding an appropriate en-US voice
    const voices = synth.getVoices();
    if (voices && voices.length > 0) {
      const enVoices = voices.filter((v) => v.lang.startsWith('en'));
      if (enVoices.length > 0) {
        if (options.gender === 'female') {
          const femaleVoice = enVoices.find((v) => 
            v.name.toLowerCase().includes('female') || 
            v.name.toLowerCase().includes('zira') || 
            v.name.toLowerCase().includes('samantha') ||
            v.name.toLowerCase().includes('victoria')
          );
          if (femaleVoice) utterance.voice = femaleVoice;
          else utterance.voice = enVoices[0];
        } else {
          const maleVoice = enVoices.find((v) => 
            v.name.toLowerCase().includes('male') || 
            v.name.toLowerCase().includes('david') || 
            v.name.toLowerCase().includes('george') ||
            v.name.toLowerCase().includes('daniel')
          );
          if (maleVoice) utterance.voice = maleVoice;
          else utterance.voice = enVoices[0];
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
    console.warn('Speech synthesis error:', err);
    if (options.onEnd) options.onEnd();
  }
}
