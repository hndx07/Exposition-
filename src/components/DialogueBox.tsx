import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ChevronRight, Flame } from 'lucide-react';
import { NPCId, DialogueChoice } from '../types/game';
import { playTapSound, playBlipSound } from '../utils/audio';
import { speakText, stopSpeaking } from '../utils/speech';

interface DialogueBoxProps {
  speakerName: string;
  speakerRole: string;
  npcId: NPCId | 'player';
  gender: 'male' | 'female';
  expression: 'neutral' | 'happy' | 'shocked' | 'smug' | 'thinking' | 'serious';
  text: string;
  speechRate: number;
  choices?: DialogueChoice[];
  onAdvance?: () => void;
  onClose?: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speakerName,
  speakerRole,
  npcId,
  gender,
  expression,
  text,
  speechRate,
  choices,
  onAdvance,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);
    stopSpeaking();
    setIsSpeaking(false);

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        if (index % 3 === 0) {
          playBlipSound();
        }
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  const handleSkipOrAdvance = () => {
    if (isTyping) {
      // Instantly finish typing
      setDisplayedText(text);
      setIsTyping(false);
    } else if (onAdvance && (!choices || choices.length === 0)) {
      playTapSound();
      stopSpeaking();
      onAdvance();
    }
  };

  const handleReadAloud = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTapSound();
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, {
        gender,
        rate: speechRate,
        onEnd: () => setIsSpeaking(false),
      });
    }
  };

  // Avatar emoji / styling by expression
  const getAvatarVisual = () => {
    switch (npcId) {
      case 'mr_hendra':
        return { emoji: expression === 'shocked' ? '😲' : expression === 'happy' ? '👨‍🏫' : '🧑‍🏫', bg: 'bg-[#CFE6FF]' };
      case 'rafa':
        return { emoji: expression === 'smug' ? '😏' : expression === 'shocked' ? '😱' : '🧢', bg: 'bg-[#FFD6C9]' };
      case 'mia':
        return { emoji: expression === 'happy' ? '😊' : '📚', bg: 'bg-[#E3D4FF]' };
      case 'pak_satpam':
        return { emoji: expression === 'serious' ? '👮' : '🛡️', bg: 'bg-[#FFF1B8]' };
      case 'cashier_dewi':
        return { emoji: '👩‍💼', bg: 'bg-[#CDEFD9]' };
      case 'mechanic_joko':
        return { emoji: '👨‍🔧', bg: 'bg-[#FFD6C9]' };
      case 'admin_dimas':
        return { emoji: '🧑‍💻', bg: 'bg-[#CFE6FF]' };
      default:
        return { emoji: '🎒', bg: 'bg-[#FFF1B8]' };
    }
  };

  const avatar = getAvatarVisual();

  return (
    <div
      onClick={handleSkipOrAdvance}
      className="fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto cursor-pointer animate-slide-up"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 border-4 border-[#3B3355] shadow-2xl text-[#3B3355]">
        {/* Speaker Info Bar */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-[#3B3355]/15">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-11 h-11 rounded-2xl ${avatar.bg} border-2 border-[#3B3355] flex items-center justify-center text-2xl shadow-inner anim-breathe`}
            >
              {avatar.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-extrabold text-sm">{speakerName}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF1B8] border border-[#3B3355]/20 font-bold uppercase">
                  {expression}
                </span>
              </div>
              <p className="text-[11px] text-[#3B3355]/70 font-semibold">{speakerRole}</p>
            </div>
          </div>

          {/* Voice Playback Button */}
          <button
            onClick={handleReadAloud}
            className={`p-2 rounded-2xl border-2 border-[#3B3355] transition-all flex items-center gap-1 ${
              isSpeaking
                ? 'bg-[#CDEFD9] text-emerald-950 scale-105'
                : 'bg-white hover:bg-slate-100 text-[#3B3355]'
            }`}
            title="Read aloud with British Voice (en-GB)"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="text-[10px] font-bold">Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="text-[10px] font-bold">Listen</span>
              </>
            )}
          </button>
        </div>

        {/* Dialogue Text Body */}
        <div className="min-h-[52px] mb-3">
          <p className="text-sm font-medium leading-relaxed">{displayedText}</p>
        </div>

        {/* Choices or Tap to Continue */}
        {choices && choices.length > 0 && !isTyping ? (
          <div className="space-y-2 pt-1 border-t-2 border-[#3B3355]/10">
            {choices.map((choice, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  playTapSound();
                  if (choice.onSelect) choice.onSelect();
                }}
                className="w-full text-left p-3 rounded-2xl bg-[#FFF1B8]/60 hover:bg-[#FFF1B8] active:scale-95 border-2 border-[#3B3355] text-xs font-bold text-[#3B3355] shadow-[0_2px_0_#3B3355] transition-all flex items-center justify-between"
              >
                <span>{choice.text}</span>
                <ChevronRight className="w-4 h-4 shrink-0 text-[#3B3355]" />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] font-bold text-[#3B3355]/60 pt-1 border-t border-[#3B3355]/10">
            <span>{isTyping ? 'Tap to skip typing...' : 'Tap anywhere to continue'}</span>
            <ChevronRight className="w-4 h-4 animate-bounce" />
          </div>
        )}
      </div>
    </div>
  );
};
