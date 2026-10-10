import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Volume2, ShieldAlert, Cpu, Receipt } from 'lucide-react';
import { MajorType, ClueItem } from '../../types/game';
import { WING_CHALLENGES } from '../../constants/storyData';
import { playTapSound, playFlickSound, playSuccessChime, triggerHaptic } from '../../utils/audio';
import { speakText } from '../../utils/speech';

interface Chapter3WingsProps {
  playerMajor: MajorType;
  speechRate: number;
  onComplete: (score: number, newClues: ClueItem[], connectiveKey: string) => void;
}

export const Chapter3Wings: React.FC<Chapter3WingsProps> = ({
  playerMajor,
  speechRate,
  onComplete,
}) => {
  const challenge = WING_CHALLENGES[playerMajor];

  // AKL Mini-game state
  const [selectedSlip, setSelectedSlip] = useState<number | null>(null);
  const [isAklMatched, setIsAklMatched] = useState(false);

  // TO Mini-game state
  const [scannedDtcCount, setScannedDtcCount] = useState<number>(0);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);

  // TJKT Mini-game state
  const [cablesConnected, setCablesConnected] = useState<number>(0);
  const [phishingBlocked, setPhishingBlocked] = useState<number>(0);

  // Completed steps tracking
  const [unlockedFragmentCount, setUnlockedFragmentCount] = useState<number>(0);
  const [hasFinishedMiniGame, setHasFinishedMiniGame] = useState(false);

  // Handle AKL Slip Matching
  const handleAklSelectSlip = (idx: number) => {
    playTapSound();
    setSelectedSlip(idx);
    if (idx === 1) {
      // Correct slip: 21:15 PM Spicy Tofu transaction!
      playSuccessChime();
      setIsAklMatched(true);
      setUnlockedFragmentCount(3);
      setHasFinishedMiniGame(true);
    } else {
      triggerHaptic(40);
    }
  };

  // Handle TO Scanner Drag / Swipe
  const handleToScanCode = (code: string) => {
    if (scannedCodes.includes(code)) return;
    playFlickSound();
    triggerHaptic(20);
    const newCodes = [...scannedCodes, code];
    setScannedCodes(newCodes);
    setScannedDtcCount(newCodes.length);
    if (newCodes.length >= 3) {
      playSuccessChime();
      setUnlockedFragmentCount(3);
      setHasFinishedMiniGame(true);
    }
  };

  // Handle TJKT Cable Flick & Firewall block
  const handleTjktFlickCable = (cableIdx: number) => {
    playFlickSound();
    triggerHaptic(25);
    setCablesConnected((prev) => Math.min(3, prev + 1));
    checkTjktDone(cablesConnected + 1, phishingBlocked);
  };

  const handleTjktBlockPhishing = () => {
    playTapSound();
    triggerHaptic(20);
    setPhishingBlocked((prev) => Math.min(3, prev + 1));
    checkTjktDone(cablesConnected, phishingBlocked + 1);
  };

  const checkTjktDone = (cables: number, blocked: number) => {
    if (cables >= 3 && blocked >= 2) {
      playSuccessChime();
      setUnlockedFragmentCount(3);
      setHasFinishedMiniGame(true);
    }
  };

  // Finish Chapter 3
  const handleFinishChapter = () => {
    playSuccessChime();
    const newClues: ClueItem[] = challenge.fragments.map((frag) => ({
      id: frag.id,
      title: frag.title,
      description: frag.snippet,
      major: playerMajor,
      discovered: true,
      icon: frag.icon,
      chapter: 3,
      details: challenge.twistClue,
    }));

    onComplete(20, newClues, challenge.connectiveKey);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col justify-between min-h-[580px] bg-white rounded-3xl border-4 border-[#3B3355] shadow-2xl relative select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase bg-[#E3D4FF] px-2.5 py-0.5 rounded-full border border-[#3B3355]/30">
            Chapter 3 • {playerMajor} Department Wing
          </span>
          <span className="text-xs font-bold text-[#3B3355] font-mono">20 Points</span>
        </div>
        <h3 className="font-heading font-extrabold text-base text-[#3B3355]">
          {challenge.title}
        </h3>
        <p className="text-xs text-[#3B3355]/80 font-medium">
          {challenge.challengeInstructions}
        </p>
      </div>

      {/* NPC Dialogue Box snippet */}
      <div className="my-2 p-3 rounded-2xl bg-[#FFF1B8]/40 border-2 border-[#3B3355]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">👩‍🏫</span>
          <div>
            <div className="font-heading font-bold text-xs">{challenge.npcName} ({challenge.npcRole})</div>
            <div className="text-[11px] text-[#3B3355]/80 italic line-clamp-1">{challenge.npcInitialDialogue}</div>
          </div>
        </div>
        <button
          onClick={() => {
            playTapSound();
            speakText(challenge.npcInitialDialogue, {
              gender: challenge.npcGender,
              rate: speechRate,
            });
          }}
          className="p-1.5 rounded-xl bg-white border border-[#3B3355]/20 shrink-0"
          title="Listen NPC"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#3B3355]" />
        </button>
      </div>

      {/* SPECIALIZED MINI-GAME CONTENT */}
      <div className="flex-1 my-2 flex flex-col justify-center">
        {/* ================= AKL MINIGAME ================= */}
        {playerMajor === 'AKL' && (
          <div className="space-y-3">
            <div className="bg-[#CFE6FF]/50 p-3 rounded-2xl border-2 border-[#3B3355] text-xs font-bold flex items-center gap-2">
              <Receipt className="w-4 h-4 text-indigo-700" />
              <span>Audit Target: Locate transaction timestamped at 21:15 PM!</span>
            </div>

            {/* Invoices List */}
            <div className="space-y-2">
              {[
                { time: '12:30 PM', item: 'Fried Rice & Mineral Water', price: 'Rp 14,000', note: 'Normal lunch rush' },
                { time: '21:15 PM', item: 'Spicy Tofu & Ice Tea', price: 'Rp 8,000', note: '⚠️ Odd hour, student frantically typing on phone!' },
                { time: '15:10 PM', item: 'Bread & Banana Milk', price: 'Rp 9,000', note: 'Afternoon study club' },
              ].map((slip, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAklSelectSlip(idx)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedSlip === idx
                      ? idx === 1
                        ? 'bg-[#CDEFD9] border-emerald-700 ring-2 ring-emerald-500 shadow-md'
                        : 'bg-rose-100 border-rose-600'
                      : 'bg-white hover:bg-slate-50 border-[#3B3355]/30'
                  }`}
                >
                  <div>
                    <div className="font-heading font-extrabold text-xs text-[#3B3355]">
                      Slip #{4087 + idx} • {slip.time}
                    </div>
                    <div className="text-[11px] font-semibold text-[#3B3355]/90">{slip.item} — {slip.price}</div>
                    <div className="text-[10px] text-[#3B3355]/70 italic">{slip.note}</div>
                  </div>
                  {selectedSlip === idx && idx === 1 && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TO MINIGAME ================= */}
        {playerMajor === 'TO' && (
          <div className="space-y-3">
            <div className="bg-[#FFD6C9]/60 p-3 rounded-2xl border-2 border-[#3B3355] text-xs font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-700" />
              <span>Scan & match 3 Diagnostic Trouble Codes (DTCs): ({scannedDtcCount}/3)</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'P0A80', desc: 'Hybrid Battery Voltage' },
                { code: 'P0171', desc: 'System Fuel Trim' },
                { code: 'U0100', desc: 'CAN Bus Phone Link' },
              ].map((dtc) => {
                const isScanned = scannedCodes.includes(dtc.code);
                return (
                  <button
                    key={dtc.code}
                    onClick={() => handleToScanCode(dtc.code)}
                    className={`p-3 rounded-2xl border-2 text-center transition-all ${
                      isScanned
                        ? 'bg-[#CDEFD9] border-emerald-700 text-emerald-950 font-black'
                        : 'bg-white hover:bg-amber-50 border-[#3B3355]/30'
                    }`}
                  >
                    <div className="font-mono text-sm font-extrabold mb-1">{dtc.code}</div>
                    <div className="text-[9px] font-bold text-[#3B3355]/80">{dtc.desc}</div>
                    <div className="mt-1 text-[9px] font-bold text-indigo-700">
                      {isScanned ? '✓ Logged' : '👆 Tap to Scan'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TJKT MINIGAME ================= */}
        {playerMajor === 'TJKT' && (
          <div className="space-y-3">
            <div className="bg-[#CDEFD9]/60 p-3 rounded-2xl border-2 border-[#3B3355] text-xs font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-800" />
              <span>Network Switch: Connect Cables ({cablesConnected}/3) & Block Phishing ({phishingBlocked}/2)</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleTjktFlickCable(cablesConnected)}
                disabled={cablesConnected >= 3}
                className="p-3 bg-white hover:bg-slate-50 border-2 border-[#3B3355] rounded-2xl text-left"
              >
                <div className="font-heading font-bold text-xs text-[#3B3355] mb-1">
                  🔌 Connect Patch Cable ({cablesConnected}/3)
                </div>
                <div className="text-[10px] text-[#3B3355]/70">
                  Flick to terminate Cat6 STP cable to core router port
                </div>
              </button>

              <button
                onClick={handleTjktBlockPhishing}
                disabled={phishingBlocked >= 2}
                className="p-3 bg-white hover:bg-slate-50 border-2 border-[#3B3355] rounded-2xl text-left"
              >
                <div className="font-heading font-bold text-xs text-[#3B3355] mb-1">
                  🛡️ Filter Rogue Packet ({phishingBlocked}/2)
                </div>
                <div className="text-[10px] text-[#3B3355]/70">
                  Swipe away spoofed broadcast packets from internal subnet
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CLUES UNLOCKED REVEAL CARD */}
      {hasFinishedMiniGame && (
        <div className="bg-[#FFF1B8] p-3.5 rounded-2xl border-3 border-[#3B3355] shadow-md my-2 animate-fade-in space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-heading font-black text-xs text-[#3B3355] flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>3 Evidence Fragments Unlocked!</span>
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#3B3355]/20 text-indigo-700">
              Key: "{challenge.connectiveKey}"
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#3B3355] leading-snug">
            {challenge.twistClue}
          </p>
        </div>
      )}

      {/* Advance Button */}
      {hasFinishedMiniGame ? (
        <button
          onClick={handleFinishChapter}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#CDEFD9] hover:bg-[#b8e8c6] active:scale-95 text-[#3B3355] font-heading font-extrabold text-sm border-3 border-[#3B3355] shadow-[0_3px_0_#3B3355] flex items-center justify-center gap-2 transition-all"
        >
          <span>Claim 20 Pts & Head to Library</span>
          <Sparkles className="w-4 h-4 text-[#3B3355]" />
        </button>
      ) : (
        <div className="text-center text-[11px] text-[#3B3355]/60 font-medium py-1">
          Complete the department inspection above to extract your forensic fragments.
        </div>
      )}
    </div>
  );
};
