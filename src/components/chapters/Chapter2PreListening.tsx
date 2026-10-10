import React, { useState } from 'react';
import { Volume2, VolumeX, CheckCircle, XCircle, Flame, BookOpen } from 'lucide-react';
import { CH2_PRE_LISTENING_ITEMS, PreListeningItem } from '../../constants/storyData';
import { playTapSound, playSuccessChime, playErrorBuzz } from '../../utils/audio';
import { speakText, stopSpeaking } from '../../utils/speech';

interface Chapter2PreListeningProps {
  speechRate: number;
  onComplete: (score: number, unlockedKeys: string[]) => void;
}

export const Chapter2PreListening: React.FC<Chapter2PreListeningProps> = ({
  speechRate,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [unlockedSections, setUnlockedSections] = useState<string[]>([]);

  const currentItem: PreListeningItem = CH2_PRE_LISTENING_ITEMS[currentIndex];

  const handlePlayAudio = () => {
    playTapSound();
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(currentItem.sentence, {
        gender: 'male',
        rate: speechRate,
        onEnd: () => setIsPlayingAudio(false),
      });
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    playTapSound();
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentItem.correctIndex;
    if (isCorrect) {
      playSuccessChime();
      setCorrectCount((prev) => prev + 1);
      setUnlockedSections((prev) => [...prev, currentItem.section]);
    } else {
      playErrorBuzz();
    }
  };

  const handleNext = () => {
    playTapSound();
    stopSpeaking();
    setIsPlayingAudio(false);
    setIsAnswered(false);
    setSelectedOption(null);

    if (currentIndex < CH2_PRE_LISTENING_ITEMS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Scale to 15 points (3 pts per item)
      const earned = Math.round(( (correctCount + (selectedOption === currentItem.correctIndex ? 0 : 0)) / CH2_PRE_LISTENING_ITEMS.length ) * 15);
      onComplete(earned, unlockedSections);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col justify-between min-h-[580px] bg-[#FFF1B8]/40 rounded-3xl border-4 border-[#3B3355] shadow-2xl relative select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase bg-[#CDEFD9] px-2.5 py-0.5 rounded-full border border-[#3B3355]/30">
            Chapter 2 • Pre-Listening Anatomy
          </span>
          <span className="text-xs font-bold font-mono text-[#3B3355]">
            Item {currentIndex + 1} / 5
          </span>
        </div>
        <h3 className="font-heading font-extrabold text-base text-[#3B3355]">
          Analytical Exposition Structure
        </h3>
        <p className="text-xs text-[#3B3355]/80 font-medium">
          Listen to each podcast excerpt and identify its structural purpose to unlock your Case Board fragments!
        </p>
      </div>

      {/* Main Excerpt Audio Card */}
      <div className="my-auto space-y-4">
        <div className="bg-white rounded-3xl p-5 border-4 border-[#3B3355] shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-black text-purple-900 bg-[#E3D4FF] px-2.5 py-1 rounded-xl border border-[#3B3355]/20">
              {currentItem.title}
            </span>
            <button
              onClick={handlePlayAudio}
              className={`px-3 py-1.5 rounded-2xl border-2 border-[#3B3355] text-xs font-bold flex items-center gap-1.5 transition-all ${
                isPlayingAudio
                  ? 'bg-[#CDEFD9] text-emerald-950 scale-105'
                  : 'bg-[#FFF1B8] hover:bg-[#ffe894] text-[#3B3355]'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Playing...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Audio</span>
                </>
              )}
            </button>
          </div>

          <p className="font-heading font-bold text-sm text-[#3B3355] italic leading-relaxed">
            "{currentItem.sentence}"
          </p>
        </div>

        {/* Question Prompt */}
        <div className="p-3 bg-[#CFE6FF] rounded-2xl border-2 border-[#3B3355] text-xs font-extrabold text-[#3B3355]">
          ❓ {currentItem.question}
        </div>

        {/* Options */}
        <div className="space-y-2">
          {currentItem.options.map((opt, idx) => {
            let btnStyle = 'bg-white hover:bg-slate-50 border-[#3B3355]/30 text-[#3B3355]';

            if (isAnswered) {
              if (idx === currentItem.correctIndex) {
                btnStyle = 'bg-[#CDEFD9] border-emerald-700 text-emerald-950 font-extrabold ring-2 ring-emerald-500';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-rose-100 border-rose-600 text-rose-950 font-bold';
              } else {
                btnStyle = 'bg-white/50 border-gray-200 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3 rounded-2xl border-2 text-xs transition-all shadow-sm flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && idx === currentItem.correctIndex && (
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentItem.correctIndex && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation & Advance Footer */}
      {isAnswered ? (
        <div className="space-y-2 animate-fade-in">
          <div className="p-2.5 rounded-2xl bg-white border-2 border-[#3B3355] text-[11px] font-semibold text-[#3B3355]">
            💡 {currentItem.explanation}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 px-4 rounded-2xl bg-[#FFF1B8] hover:bg-[#FFE894] active:scale-95 text-[#3B3355] font-heading font-extrabold text-xs border-3 border-[#3B3355] shadow-[0_3px_0_#3B3355] flex items-center justify-center gap-2"
          >
            <span>Unlock & Next Section</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </button>
        </div>
      ) : (
        <div className="text-center text-[11px] text-[#3B3355]/60 font-medium">
          Select an option above to test your analytical comprehension.
        </div>
      )}

      {/* Score Tracker */}
      <div className="flex items-center justify-between text-xs text-[#3B3355]/70 pt-2 border-t-2 border-[#3B3355]/15">
        <span>Unlocked Fragments: {unlockedSections.length} / 5</span>
        <span className="font-bold">Total Pts: {Math.round((correctCount / CH2_PRE_LISTENING_ITEMS.length) * 15)} / 15</span>
      </div>
    </div>
  );
};
