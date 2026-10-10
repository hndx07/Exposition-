import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, ArrowDown } from 'lucide-react';
import { EXPOSITION_BLOCKS, ExpositionBlock } from '../../constants/storyData';
import { playTapSound, playCardSnapSound, playSuccessChime, playErrorBuzz } from '../../utils/audio';

interface Chapter5WritingRoomProps {
  onComplete: (score: number) => void;
}

export const Chapter5WritingRoom: React.FC<Chapter5WritingRoomProps> = ({ onComplete }) => {
  // Slots: [0: Thesis, 1: Argument 1, 2: Argument 2, 3: Reiteration]
  const [slots, setSlots] = useState<(ExpositionBlock | null)[]>([null, null, null, null]);
  const [availableBlocks, setAvailableBlocks] = useState<ExpositionBlock[]>([
    ...EXPOSITION_BLOCKS,
  ].sort(() => 0.5 - Math.random())); // shuffled initial order

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const slotLabels = [
    { name: '1. Thesis', key: 'In my perspective', requiredType: 'thesis' },
    { name: '2. Argument 1', key: 'Firstly', requiredType: 'argument1' },
    { name: '3. Argument 2', key: 'Secondly', requiredType: 'argument2' },
    { name: '4. Reiteration', key: 'In conclusion', requiredType: 'reiteration' },
  ];

  // Tap a block to place in first empty slot
  const handlePlaceBlock = (block: ExpositionBlock) => {
    playCardSnapSound();
    setValidationError(null);

    const emptySlotIdx = slots.findIndex((s) => s === null);
    if (emptySlotIdx === -1) return;

    const nextSlots = [...slots];
    nextSlots[emptySlotIdx] = block;
    setSlots(nextSlots);

    setAvailableBlocks((prev) => prev.filter((b) => b.id !== block.id));
  };

  // Remove block from slot
  const handleRemoveFromSlot = (slotIdx: number) => {
    const block = slots[slotIdx];
    if (!block) return;
    playTapSound();
    setValidationError(null);

    const nextSlots = [...slots];
    nextSlots[slotIdx] = null;
    setSlots(nextSlots);

    setAvailableBlocks((prev) => [...prev, block]);
  };

  // Reset all
  const handleReset = () => {
    playTapSound();
    setSlots([null, null, null, null]);
    setAvailableBlocks([...EXPOSITION_BLOCKS].sort(() => 0.5 - Math.random()));
    setValidationError(null);
  };

  // Verify arrangement
  const handleValidateEssay = () => {
    playTapSound();
    // Check all filled
    if (slots.some((s) => s === null)) {
      setValidationError('Please place all four structural blocks into the slots.');
      playErrorBuzz();
      return;
    }

    // Check order
    const isCorrect =
      slots[0]?.type === 'thesis' &&
      slots[1]?.type === 'argument1' &&
      slots[2]?.type === 'argument2' &&
      slots[3]?.type === 'reiteration';

    if (isCorrect) {
      playSuccessChime();
      setIsSuccess(true);
      setValidationError(null);
    } else {
      playErrorBuzz();
      setValidationError(
        'The structural sequence is not yet aligned! Remember: Thesis → Argument 1 (Firstly) → Argument 2 (Secondly) → Reiteration (In conclusion).'
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col justify-between min-h-[580px] bg-[#CDEFD9]/40 rounded-3xl border-4 border-[#3B3355] shadow-2xl relative select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase bg-[#FFF1B8] px-2.5 py-0.5 rounded-full border border-[#3B3355]/30">
            Chapter 5 • Writing Room
          </span>
          <span className="text-xs font-bold font-mono text-[#3B3355]">15 Points</span>
        </div>
        <h3 className="font-heading font-extrabold text-base text-[#3B3355]">
          Analytical Exposition Assembler
        </h3>
        <p className="text-xs text-[#3B3355]/80 font-medium">
          Flick or tap the text blocks into their corresponding architectural slots using the connective keys!
        </p>
      </div>

      {/* ESSAY SLOTS */}
      <div className="space-y-2 my-2">
        {slotLabels.map((slotDef, idx) => {
          const filledBlock = slots[idx];
          return (
            <div
              key={idx}
              onClick={() => handleRemoveFromSlot(idx)}
              className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                filledBlock
                  ? 'bg-white border-[#3B3355] shadow-sm'
                  : 'bg-white/40 border-dashed border-[#3B3355]/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-heading font-black text-[#3B3355]">
                  {slotDef.name}
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#E3D4FF] text-purple-950 px-2 py-0.5 rounded-full border border-[#3B3355]/20">
                  Key: "{slotDef.key}"
                </span>
              </div>

              {filledBlock ? (
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-[#3B3355] leading-snug">
                    <span className="text-indigo-700 font-bold">{filledBlock.connective}, </span>
                    {filledBlock.text}
                  </p>
                  <span className="text-[10px] font-bold text-rose-500 shrink-0">✕ Remove</span>
                </div>
              ) : (
                <div className="text-[11px] text-[#3B3355]/50 italic text-center py-1">
                  [Empty Slot: Tap an argument block below]
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AVAILABLE TEXT BLOCKS */}
      <div className="my-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-heading font-bold text-[#3B3355]">
            Available Argument Blocks ({availableBlocks.length})
          </span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] font-bold text-[#3B3355]/70 hover:text-[#3B3355]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {availableBlocks.map((block) => (
            <button
              key={block.id}
              onClick={() => handlePlaceBlock(block)}
              className="w-full text-left p-2.5 rounded-2xl bg-white hover:bg-amber-50 active:scale-95 border-2 border-[#3B3355] shadow-[0_2px_0_#3B3355] text-xs font-medium text-[#3B3355] transition-all flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-black uppercase text-indigo-700 block">
                  Connective: {block.connective}
                </span>
                <span className="line-clamp-2 leading-snug font-semibold">{block.text}</span>
              </div>
              <ArrowDown className="w-4 h-4 shrink-0 text-[#3B3355]" />
            </button>
          ))}
          {availableBlocks.length === 0 && !isSuccess && (
            <div className="text-center text-xs font-bold text-emerald-800 py-1">
              All blocks slotted! Tap "Verify Exposition Sequence" below.
            </div>
          )}
        </div>
      </div>

      {/* ERROR NOTICE */}
      {validationError && (
        <div className="p-2.5 bg-rose-50 border-2 border-rose-400 rounded-2xl text-[11px] font-bold text-rose-800 text-center animate-fade-in my-1">
          ⚠️ {validationError}
        </div>
      )}

      {/* ACTION FOOTER */}
      {isSuccess ? (
        <div className="space-y-2 animate-fade-in">
          <div className="p-2.5 rounded-2xl bg-[#CDEFD9] border-2 border-emerald-700 text-xs font-extrabold text-emerald-950 text-center">
            🎉 Masterpiece Assembled! Your analytical speech is fully prepared for the auditorium debate!
          </div>
          <button
            onClick={() => onComplete(15)}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FFF1B8] hover:bg-[#FFE894] active:scale-95 text-[#3B3355] font-heading font-extrabold text-sm border-3 border-[#3B3355] shadow-[0_3px_0_#3B3355] flex items-center justify-center gap-2"
          >
            <span>Proceed to Auditorium Stage</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleValidateEssay}
          className="w-full py-3 px-4 rounded-2xl bg-[#FFF1B8] hover:bg-[#FFE894] active:scale-95 text-[#3B3355] font-heading font-extrabold text-xs border-3 border-[#3B3355] shadow-[0_3px_0_#3B3355] flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Verify Exposition Sequence</span>
        </button>
      )}
    </div>
  );
};
