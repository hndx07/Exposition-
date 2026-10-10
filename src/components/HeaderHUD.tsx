import React from 'react';
import { Volume2, VolumeX, BookOpen, Award, Pause } from 'lucide-react';
import { GameState } from '../types/game';
import { MAJORS } from '../constants/storyData';
import { playTapSound } from '../utils/audio';

interface HeaderHUDProps {
  gameState: GameState;
  isMoving: boolean;
  onOpenInventory: () => void;
  onOpenBadges: () => void;
  onToggleSound: () => void;
  onToggleRate: () => void;
  onPause: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  gameState,
  isMoving,
  onOpenInventory,
  onOpenBadges,
  onToggleSound,
  onToggleRate,
  onPause,
}) => {
  const majorData = gameState.major ? MAJORS[gameState.major] : null;
  const discoveredCluesCount = gameState.clues.filter((c) => c.discovered).length;
  const unlockedBadgesCount = gameState.badges.filter((b) => b.unlocked).length;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-none p-3 max-w-md mx-auto ${
        isMoving ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-[#3B3355]/90 backdrop-blur-md text-white rounded-3xl p-3 border-2 border-white/20 shadow-xl pointer-events-auto">
        <div className="flex items-center justify-between gap-2">
          {/* Student Info */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-[#FFF1B8] text-[#3B3355] flex items-center justify-center font-bold text-sm shrink-0 border-2 border-[#3B3355]/20 shadow-inner">
              {gameState.playerName ? gameState.playerName.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs truncate max-w-[90px] text-[#FFF1B8]">
                  {gameState.playerName || 'Student'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/80 font-mono">
                  {gameState.className || 'XI'}
                </span>
              </div>
              {majorData && (
                <div className="flex items-center gap-1">
                  <span className="text-xs">{majorData.icon}</span>
                  <span className="text-[10px] font-semibold text-[#CFE6FF] truncate">
                    {majorData.id} Wing
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-1 bg-[#FFF1B8]/15 px-2.5 py-1 rounded-2xl border border-[#FFF1B8]/30">
            <span className="text-[10px] uppercase font-bold text-[#FFF1B8]">Score</span>
            <span className="font-extrabold text-sm text-[#FFF1B8] font-mono">
              {gameState.score}
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Clues / Case Board */}
            <button
              onClick={() => {
                playTapSound();
                onOpenInventory();
              }}
              className="relative p-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-[#CFE6FF]"
              title="Clues & Case Board"
            >
              <BookOpen className="w-4 h-4" />
              {discoveredCluesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FFD6C9] text-[#3B3355] text-[10px] font-bold flex items-center justify-center shadow">
                  {discoveredCluesCount}
                </span>
              )}
            </button>

            {/* Vocabulary Badges */}
            <button
              onClick={() => {
                playTapSound();
                onOpenBadges();
              }}
              className="relative p-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-[#E3D4FF]"
              title="Vocab Badges"
            >
              <Award className="w-4 h-4" />
              {unlockedBadgesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E3D4FF] text-[#3B3355] text-[10px] font-bold flex items-center justify-center shadow">
                  {unlockedBadgesCount}
                </span>
              )}
            </button>

            {/* Speech Rate Toggle */}
            <button
              onClick={() => {
                playTapSound();
                onToggleRate();
              }}
              className="px-2 py-1 rounded-2xl bg-white/10 hover:bg-white/20 text-[10px] font-bold text-[#CDEFD9]"
              title="Toggle speech speed"
            >
              {gameState.speechRate}x
            </button>

            {/* Sound Mute */}
            <button
              onClick={() => {
                playTapSound();
                onToggleSound();
              }}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white"
              title="Toggle Sound"
            >
              {gameState.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#CDEFD9]" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/50" />
              )}
            </button>

            {/* Pause Menu */}
            <button
              onClick={() => {
                playTapSound();
                onPause();
              }}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white"
              title="Pause & Chapters"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chapter Progress Bar */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#CDEFD9] to-[#FFF1B8] h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (gameState.chapter / 6) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-semibold text-white/70 whitespace-nowrap">
            {gameState.chapter === 0
              ? 'Prologue'
              : gameState.chapter <= 6
              ? `Ch. ${gameState.chapter}/6`
              : 'Epilogue'}
          </span>
        </div>
      </div>
    </header>
  );
};
