import React, { useState } from 'react';
import { X, BookOpen, Award, Sparkles, Volume2, Lock, CheckCircle2 } from 'lucide-react';
import { GameState } from '../types/game';
import { playTapSound } from '../utils/audio';
import { speakText } from '../utils/speech';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  initialTab?: 'caseBoard' | 'badges' | 'clues';
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  gameState,
  initialTab = 'caseBoard',
}) => {
  const [activeTab, setActiveTab] = useState<'caseBoard' | 'badges' | 'clues'>(initialTab);

  if (!isOpen) return null;

  const unlockedPartsCount = gameState.caseBoard.filter((p) => p.unlocked).length;
  const unlockedBadgesCount = gameState.badges.filter((b) => b.unlocked).length;
  const discoveredCluesCount = gameState.clues.filter((c) => c.discovered).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#3B3355]/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border-4 border-[#3B3355] text-[#3B3355] max-h-[90vh] flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#3B3355]/15">
          <div className="flex items-center gap-2">
            <span className="text-xl">📁</span>
            <h3 className="font-heading font-extrabold text-lg">Detective Portfolio</h3>
          </div>
          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#FFD6C9] border-2 border-[#3B3355] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <X className="w-4 h-4 text-[#3B3355]" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#3B3355]/10 rounded-2xl my-3">
          <button
            onClick={() => {
              playTapSound();
              setActiveTab('caseBoard');
            }}
            className={`flex-1 py-2 text-xs font-heading font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'caseBoard'
                ? 'bg-white text-[#3B3355] shadow-sm border border-[#3B3355]/20'
                : 'text-[#3B3355]/70 hover:text-[#3B3355]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Case Board ({unlockedPartsCount}/5)</span>
          </button>

          <button
            onClick={() => {
              playTapSound();
              setActiveTab('clues');
            }}
            className={`flex-1 py-2 text-xs font-heading font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'clues'
                ? 'bg-white text-[#3B3355] shadow-sm border border-[#3B3355]/20'
                : 'text-[#3B3355]/70 hover:text-[#3B3355]'
            }`}
          >
            <span>🔍 Clues ({discoveredCluesCount})</span>
          </button>

          <button
            onClick={() => {
              playTapSound();
              setActiveTab('badges');
            }}
            className={`flex-1 py-2 text-xs font-heading font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'badges'
                ? 'bg-white text-[#3B3355] shadow-sm border border-[#3B3355]/20'
                : 'text-[#3B3355]/70 hover:text-[#3B3355]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Badges ({unlockedBadgesCount}/8)</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
          {/* CASE BOARD TAB */}
          {activeTab === 'caseBoard' && (
            <div className="space-y-2.5">
              <div className="p-3 bg-[#FFF1B8]/40 border-2 border-[#3B3355]/20 rounded-2xl text-xs leading-relaxed">
                <span className="font-bold">Structure: Analytical Exposition.</span> Unlocks step by step as you dissect arguments and find evidence.
              </div>

              {gameState.caseBoard.map((part, index) => (
                <div
                  key={part.id}
                  className={`rounded-2xl p-3.5 border-2 transition-all ${
                    part.unlocked
                      ? 'bg-[#CDEFD9]/50 border-[#3B3355]'
                      : 'bg-[#3B3355]/5 border-[#3B3355]/20 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#3B3355]/80">
                      Step {index + 1}: {part.title}
                    </span>
                    {part.unlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-[#CDEFD9] px-2 py-0.5 rounded-full border border-emerald-600/30">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-black/5 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-[#3B3355]">
                    {part.unlocked
                      ? part.snippet
                      : 'Solve chapter quizzes and mini-games to decipher this piece.'}
                  </p>

                  {part.unlocked && part.connective && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#3B3355]/20 text-[11px] font-bold text-[#3B3355]">
                      <span>🔑 Connective Key:</span>
                      <span className="text-indigo-600 font-mono">"{part.connective}"</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CLUES TAB */}
          {activeTab === 'clues' && (
            <div className="space-y-2.5">
              {gameState.clues.length === 0 || !gameState.clues.some((c) => c.discovered) ? (
                <div className="text-center py-8 px-4 bg-[#CFE6FF]/30 rounded-2xl border-2 border-dashed border-[#3B3355]/30">
                  <span className="text-3xl mb-2 block">🔎</span>
                  <h4 className="font-heading font-bold text-sm mb-1">No Evidence Discovered Yet</h4>
                  <p className="text-xs text-[#3B3355]/70">
                    Explore your department wing and interrogate NPCs to uncover evidence fragments.
                  </p>
                </div>
              ) : (
                gameState.clues
                  .filter((c) => c.discovered)
                  .map((clue) => (
                    <div
                      key={clue.id}
                      className="bg-[#CFE6FF]/60 rounded-2xl p-3.5 border-2 border-[#3B3355] shadow-sm flex items-start gap-3"
                    >
                      <span className="text-2xl p-2 bg-white rounded-xl border border-[#3B3355]/20 shrink-0">
                        {clue.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <h5 className="font-heading font-bold text-xs truncate">{clue.title}</h5>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white font-bold border border-[#3B3355]/20">
                            Ch. {clue.chapter}
                          </span>
                        </div>
                        <p className="text-xs text-[#3B3355]/90 mb-1 leading-relaxed">
                          {clue.description}
                        </p>
                        {clue.details && (
                          <div className="p-2 bg-white/80 rounded-xl text-[11px] font-mono text-[#3B3355] border border-[#3B3355]/15">
                            {clue.details}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* VOCAB BADGES TAB */}
          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {gameState.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    badge.unlocked
                      ? 'bg-[#E3D4FF]/60 border-[#3B3355] shadow-sm'
                      : 'bg-black/5 border-dashed border-[#3B3355]/20 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-heading font-extrabold text-sm text-[#3B3355]">
                      {badge.word}
                    </span>
                    {badge.unlocked ? (
                      <button
                        onClick={() => {
                          playTapSound();
                          speakText(badge.word, { rate: gameState.speechRate });
                        }}
                        className="p-1.5 rounded-lg bg-white border border-[#3B3355]/20 hover:scale-105 active:scale-95 transition-all"
                        title="Pronounce"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#3B3355]" />
                      </button>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#3B3355]/50" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#3B3355]/85 leading-snug">
                    {badge.unlocked ? badge.definition : 'Unlocks in later analytical chapters.'}
                  </p>
                  {badge.unlocked && (
                    <div className="mt-2 text-[10px] font-bold text-purple-900 bg-white/70 px-2 py-0.5 rounded-full inline-block self-start border border-[#3B3355]/15">
                      Mastered (Ch. {badge.chapterLearned})
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t-2 border-[#3B3355]/15 flex items-center justify-between text-xs text-[#3B3355]/70">
          <span>Target: 100 Points</span>
          <span className="font-bold text-[#3B3355]">Muhiba Mystery: Say It, Prove It!</span>
        </div>
      </div>
    </div>
  );
};
