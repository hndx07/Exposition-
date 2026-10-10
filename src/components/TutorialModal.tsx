import React, { useState } from 'react';
import { Footprints, MessageSquare, Hand, Flame, Check } from 'lucide-react';
import { playTapSound, playSuccessChime } from '../utils/audio';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: '1. Tap to Walk',
      icon: <Footprints className="w-10 h-10 text-[#3B3355]" />,
      bg: 'bg-[#CFE6FF]', // sky
      desc: 'Tap anywhere on the school map to make your student character walk to that spot. There are no clunky joysticks!',
      tip: 'The top HUD automatically fades away while you are walking so your view is never blocked.',
    },
    {
      title: '2. Tap NPC to Talk',
      icon: <MessageSquare className="w-10 h-10 text-[#3B3355]" />,
      bg: 'bg-[#CDEFD9]', // mint
      desc: 'Tap on teachers, students, or department mentors to talk with them. Tap their dialogue bubble anytime to hear voice playback via Web Speech!',
      tip: 'Pick your answers thoughtfully to uncover critical evidence.',
    },
    {
      title: '3. Flick to Act & Dash',
      icon: <Hand className="w-10 h-10 text-[#3B3355]" />,
      bg: 'bg-[#FFD6C9]', // peach
      desc: 'Swipe/flick quickly in any direction to dash forward on the map. Flicking is also your key move in mini-games: sort Fact vs Opinion, connect cables, and launch debate arguments!',
      tip: 'Fast gestures feel responsive and smooth.',
    },
  ];

  const currentStepData = steps[step];

  const handleNext = () => {
    playTapSound();
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      playSuccessChime();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B3355]/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-4 border-[#3B3355] text-[#3B3355] relative overflow-hidden">
        {/* Header Decor */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h3 className="font-heading font-extrabold text-lg tracking-wide">
              Quick Guide (3 Steps)
            </h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFF1B8] border border-[#3B3355]/20">
            {step + 1} / 3
          </span>
        </div>

        {/* Step Visual Card */}
        <div
          className={`${currentStepData.bg} rounded-2xl p-6 border-3 border-[#3B3355] flex flex-col items-center text-center shadow-md mb-4 transition-all`}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/80 border-2 border-[#3B3355] flex items-center justify-center mb-3 anim-bob">
            {currentStepData.icon}
          </div>
          <h4 className="font-heading font-bold text-lg mb-2">{currentStepData.title}</h4>
          <p className="text-sm font-medium leading-relaxed mb-3">
            {currentStepData.desc}
          </p>
          <div className="w-full bg-white/70 rounded-xl p-2.5 text-xs text-[#3B3355]/90 border border-[#3B3355]/20 font-semibold">
            💡 Pro-tip: {currentStepData.tip}
          </div>
        </div>

        {/* Step Indicator Dots */}
        <div className="flex justify-center gap-2 mb-5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                playTapSound();
                setStep(i);
              }}
              className={`h-2.5 rounded-full transition-all ${
                i === step ? 'w-8 bg-[#3B3355]' : 'w-2.5 bg-[#3B3355]/25'
              }`}
            />
          ))}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#FFF1B8] hover:bg-[#FFE894] active:scale-95 text-[#3B3355] font-heading font-extrabold text-base border-3 border-[#3B3355] shadow-[0_4px_0_#3B3355] transition-all flex items-center justify-center gap-2"
        >
          {step < steps.length - 1 ? (
            <span>Next Guide</span>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>Let's Solve the Mystery!</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
