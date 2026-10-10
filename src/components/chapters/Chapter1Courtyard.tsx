import React, { useState, useRef } from 'react';
import { Flame, ArrowLeft, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { CH1_FACT_OPINION_CARDS, FactOpinionCard } from '../../constants/storyData';
import { playFlickSound, playSuccessChime, playErrorBuzz, playTapSound } from '../../utils/audio';

interface Chapter1CourtyardProps {
  onComplete: (score: number) => void;
}

export const Chapter1Courtyard: React.FC<Chapter1CourtyardProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [cardOffset, setCardOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; explanation: string } | null>(null);

  const dragStartRef = useRef<number | null>(null);

  const currentCard: FactOpinionCard | undefined = CH1_FACT_OPINION_CARDS[currentIndex];

  const handlePointerDown = (e: React.PointerEvent) => {
    if (lastResult) return;
    dragStartRef.current = e.clientX;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || dragStartRef.current === null || lastResult) return;
    const diff = e.clientX - dragStartRef.current;
    setCardOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging || lastResult) return;
    setIsDragging(false);

    // If dragged sufficiently left (Fact) or right (Opinion)
    if (cardOffset < -60) {
      submitChoice(true); // Left = Fact
    } else if (cardOffset > 60) {
      submitChoice(false); // Right = Opinion
    } else {
      setCardOffset(0);
    }
    dragStartRef.current = null;
  };

  const submitChoice = (choseFact: boolean) => {
    if (!currentCard) return;
    playFlickSound();
    const isCorrect = choseFact === currentCard.isFact;

    if (isCorrect) {
      playSuccessChime();
      setUserScore((prev) => prev + 1);
    } else {
      playErrorBuzz();
    }

    setLastResult({
      isCorrect,
      explanation: currentCard.explanation,
    });
  };

  const handleNextCard = () => {
    playTapSound();
    setLastResult(null);
    setCardOffset(0);

    if (currentIndex < CH1_FACT_OPINION_CARDS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finished all 6 cards! Scale to 10 points
      const totalPoints = Math.round(( (userScore + (lastResult?.isCorrect ? 0 : 0)) / CH1_FACT_OPINION_CARDS.length ) * 10);
      onComplete(totalPoints);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col justify-between min-h-[580px] bg-[#CFE6FF]/40 rounded-3xl border-4 border-[#3B3355] shadow-2xl relative select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase bg-[#FFD6C9] px-2.5 py-0.5 rounded-full border border-[#3B3355]/30">
            Chapter 1 • Courtyard Rumors
          </span>
          <span className="text-xs font-bold font-mono text-[#3B3355]">
            Card {currentIndex + 1} / {CH1_FACT_OPINION_CARDS.length}
          </span>
        </div>
        <h3 className="font-heading font-extrabold text-base text-[#3B3355]">
          Flick Mechanic: Fact vs Opinion
        </h3>
        <p className="text-xs text-[#3B3355]/80 font-medium">
          Students are whispering wild rumors. Flick the card <span className="font-bold underline text-indigo-700">LEFT for FACT</span>, or <span className="font-bold underline text-purple-700">RIGHT for OPINION</span>!
        </p>
      </div>

      {/* SWIPE / FLICK CARD AREA */}
      <div className="my-auto relative flex flex-col items-center">
        {/* Swipe Guides */}
        <div className="w-full flex items-center justify-between px-2 mb-2 text-xs font-extrabold">
          <div className="flex items-center gap-1 text-indigo-800 bg-[#CFE6FF] px-2.5 py-1 rounded-2xl border-2 border-[#3B3355]">
            <ArrowLeft className="w-4 h-4" />
            <span>FLICK LEFT: FACT</span>
          </div>
          <div className="flex items-center gap-1 text-purple-800 bg-[#E3D4FF] px-2.5 py-1 rounded-2xl border-2 border-[#3B3355]">
            <span>OPINION :RIGHT</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* The Interactive Card */}
        {currentCard && (
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-full bg-white rounded-3xl p-6 border-4 border-[#3B3355] shadow-xl text-center cursor-grab active:cursor-grabbing transition-transform duration-100 touch-none"
            style={{
              transform: `translateX(${cardOffset}px) rotate(${cardOffset * 0.06}deg)`,
              backgroundColor: cardOffset < -30 ? '#CFE6FF' : cardOffset > 30 ? '#E3D4FF' : '#ffffff',
            }}
          >
            <span className="text-3xl mb-2 block anim-bob">📢</span>
            <p className="font-heading font-bold text-base text-[#3B3355] leading-relaxed mb-4">
              "{currentCard.statement}"
            </p>
            <div className="text-[11px] text-[#3B3355]/60 font-semibold">
              ← Drag or Flick to Sort →
            </div>
          </div>
        )}

        {/* Manual Quick Tap Buttons (accessible alternative to flick) */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4">
          <button
            onClick={() => submitChoice(true)}
            className="py-3 px-3 rounded-2xl bg-[#CFE6FF] hover:bg-[#b8d8ff] active:scale-95 text-[#3B3355] font-heading font-extrabold text-xs border-3 border-[#3B3355] shadow-[0_3px_0_#3B3355] flex items-center justify-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>It's a FACT</span>
          </button>
          <button
            onClick={() => submitChoice(false)}
            className="py-3 px-3 rounded-2xl bg-[#E3D4FF] hover:bg-[#d4bfff] active:scale-95 text-[#3B3355] font-heading font-extrabold text-xs border-3 border-[#3B3355] shadow-[0_3px_0_#3B3355] flex items-center justify-center gap-1.5 transition-all"
          >
            <span>It's an OPINION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FEEDBACK POPUP WHEN ANSWERED */}
      {lastResult && (
        <div className="absolute inset-4 z-20 bg-white/95 backdrop-blur-md rounded-3xl p-5 border-4 border-[#3B3355] shadow-2xl flex flex-col justify-between text-center animate-fade-in">
          <div>
            <div className="w-14 h-14 mx-auto rounded-2xl border-3 border-[#3B3355] flex items-center justify-center text-3xl mb-2">
              {lastResult.isCorrect ? (
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600" />
              )}
            </div>
            <h4
              className={`font-heading font-extrabold text-lg mb-1 ${
                lastResult.isCorrect ? 'text-emerald-800' : 'text-rose-800'
              }`}
            >
              {lastResult.isCorrect ? 'Accurate Deduction!' : 'Incorrect Classification!'}
            </h4>
            <p className="text-xs font-semibold text-[#3B3355] leading-relaxed mb-2 bg-[#FFF1B8]/40 p-3 rounded-2xl border border-[#3B3355]/20">
              {lastResult.explanation}
            </p>
          </div>

          <button
            onClick={handleNextCard}
            className="w-full py-3 px-4 rounded-2xl bg-[#FFF1B8] hover:bg-[#FFE894] active:scale-95 text-[#3B3355] font-heading font-extrabold text-sm border-3 border-[#3B3355] shadow-[0_3px_0_#3B3355] transition-all flex items-center justify-center gap-2"
          >
            <span>Continue Investigation</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </button>
        </div>
      )}

      {/* Progress Footer */}
      <div className="flex items-center justify-between text-xs text-[#3B3355]/70 pt-2 border-t-2 border-[#3B3355]/15">
        <span>Chapter Score: {Math.round((userScore / CH1_FACT_OPINION_CARDS.length) * 10)} / 10 pts</span>
        <span className="font-bold">SMK Muhiba Courtyard</span>
      </div>
    </div>
  );
};
