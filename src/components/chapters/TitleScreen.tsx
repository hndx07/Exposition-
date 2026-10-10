import React, { useState } from 'react';
import { ArrowRight, Flame, Smartphone, AlertTriangle, ShieldCheck } from 'lucide-react';
import { LOGO_URL, MAJORS } from '../../constants/storyData';
import { MajorType } from '../../types/game';
import { playTapSound, playSuccessChime, triggerHaptic } from '../../utils/audio';

interface TitleScreenProps {
  onStartGame: (name: string, className: string, major: MajorType) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame }) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [selectedMajor, setSelectedMajor] = useState<MajorType | null>(null);
  const [showPrologue, setShowPrologue] = useState(false);
  const [prologueGlitch, setPrologueGlitch] = useState(false);

  const canProceedToPrologue = name.trim().length >= 2 && className.trim().length >= 2 && selectedMajor !== null;

  const handleGoToPrologue = () => {
    if (!canProceedToPrologue || !selectedMajor) return;
    playTapSound();
    setShowPrologue(true);

    // Glitch phone animation after 1.5 seconds
    setTimeout(() => {
      setPrologueGlitch(true);
      triggerHaptic([40, 60, 40]);
    }, 1200);
  };

  const handleStartFinal = () => {
    if (!selectedMajor) return;
    playSuccessChime();
    onStartGame(name.trim(), className.trim(), selectedMajor);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between p-4 max-w-md mx-auto text-[#3B3355] overflow-y-auto">
      {/* Background Decor */}
      <div className="absolute top-12 left-4 w-28 h-10 bg-white/40 rounded-full blur-xl pointer-events-none anim-cloud-slow" />
      <div className="absolute top-36 right-4 w-36 h-12 bg-[#FFF1B8]/40 rounded-full blur-xl pointer-events-none anim-cloud-fast" />

      {!showPrologue ? (
        <div className="flex-1 flex flex-col justify-center py-4">
          {/* Logo & School Header */}
          <div className="text-center mb-4">
            {!logoFailed && (
              <div className="inline-block p-2 bg-white rounded-3xl border-3 border-[#3B3355] shadow-md mb-2 anim-bob">
                <img
                  src={LOGO_URL}
                  alt="SMK Muhammadiyah Bawang Logo"
                  className="w-16 h-16 object-contain"
                  onError={() => setLogoFailed(true)}
                />
              </div>
            )}
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-[#FFF1B8] bg-[#3B3355] px-3 py-1 rounded-full inline-block mb-1">
              SMK Muhammadiyah Bawang
            </h2>
            <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-white drop-shadow-md">
              Muhiba Mystery:
            </h1>
            <h3 className="font-heading font-extrabold text-xl text-[#FFF1B8] drop-shadow">
              Say It, Prove It!
            </h3>
            <p className="text-xs text-white/80 font-medium mt-1">
              An Analytical Exposition Adventure
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-5 border-4 border-[#3B3355] shadow-xl space-y-4 mb-4">
            <div>
              <label className="block text-xs font-heading font-bold mb-1 uppercase tracking-wider text-[#3B3355]">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Pratama"
                className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#3B3355]/30 focus:border-[#3B3355] focus:outline-none bg-[#FFF1B8]/20 font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold mb-1 uppercase tracking-wider text-[#3B3355]">
                Class / Grade <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. XI AKL 1 or XI TO 2"
                className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#3B3355]/30 focus:border-[#3B3355] focus:outline-none bg-[#FFF1B8]/20 font-bold text-sm"
              />
            </div>

            {/* Choose Major (Locked Selection) */}
            <div>
              <label className="block text-xs font-heading font-bold mb-2 uppercase tracking-wider text-[#3B3355]">
                Select Vocational Major (Determines Story Wing) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {(['AKL', 'TO', 'TJKT'] as MajorType[]).map((majorKey) => {
                  const m = MAJORS[majorKey];
                  const isSelected = selectedMajor === majorKey;
                  return (
                    <button
                      key={majorKey}
                      type="button"
                      onClick={() => {
                        playTapSound();
                        setSelectedMajor(majorKey);
                      }}
                      className={`text-left p-3 rounded-2xl border-3 transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#3B3355] bg-[#FFF1B8] shadow-[0_4px_0_#3B3355] scale-[1.02]'
                          : 'border-[#3B3355]/20 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1.5 bg-white rounded-xl border-2 border-[#3B3355]/20 shadow-sm">
                          {m.icon}
                        </span>
                        <div>
                          <div className="font-heading font-extrabold text-xs text-[#3B3355]">
                            {m.title}
                          </div>
                          <div className="text-[11px] text-[#3B3355]/70 font-medium">
                            {m.tagline}
                          </div>
                        </div>
                      </div>
                      {isSelected ? (
                        <span className="w-6 h-6 rounded-full bg-[#3B3355] text-white flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="w-6 h-6 rounded-full border-2 border-[#3B3355]/30" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={!canProceedToPrologue}
              onClick={handleGoToPrologue}
              className={`w-full py-3.5 px-4 rounded-2xl font-heading font-extrabold text-sm border-3 border-[#3B3355] flex items-center justify-center gap-2 transition-all ${
                canProceedToPrologue
                  ? 'bg-[#CDEFD9] hover:bg-[#b5e7c4] shadow-[0_4px_0_#3B3355] active:translate-y-1 active:shadow-none text-[#3B3355]'
                  : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
            >
              <span>Begin Prologue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* PROLOGUE SCREEN */
        <div className="flex-1 flex flex-col justify-center py-2 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 border-4 border-[#3B3355] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#3B3355]/15">
              <span className="text-xs font-bold font-mono uppercase bg-[#FFD6C9] px-2.5 py-1 rounded-full border border-[#3B3355]/20">
                PROLOGUE • 21:15 PM
              </span>
              <span className="text-xs font-bold text-[#3B3355]/70">Night Before Muhiba Talks</span>
            </div>

            {/* Anonymous Flyer Alert */}
            <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-rose-600 font-extrabold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>VIRAL ANONYMOUS ANNOUNCEMENT</span>
              </div>
              <p className="font-heading font-black text-sm text-rose-950 tracking-tight leading-snug">
                "ALL PHONES WILL BE BANNED TOTALLY STARTING TOMORROW!"
              </p>
              <p className="text-[11px] text-rose-700/80 font-medium">
                Sent across student group chats without author name or administrative stamp.
              </p>
            </div>

            {/* Narrative text */}
            <p className="text-xs leading-relaxed text-[#3B3355]/90 font-medium">
              Panic is spreading like wildfire through SMK Muhammadiyah Bawang. Students are demanding answers, teachers are confused, and rumors are spiraling out of control.
            </p>

            {/* Phone Glitch Hidden Clue Box */}
            <div
              className={`p-3 rounded-2xl border-2 transition-all ${
                prologueGlitch
                  ? 'bg-[#FFF1B8] border-[#3B3355] anim-shake shadow-md'
                  : 'bg-slate-100 border-[#3B3355]/20 opacity-80'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className={`w-4 h-4 ${prologueGlitch ? 'text-amber-700' : 'text-gray-500'}`} />
                <span className="text-xs font-heading font-bold text-[#3B3355]">
                  {prologueGlitch ? '⚠️ Phone Glitch Detected!' : 'Checking device notifications...'}
                </span>
              </div>
              {prologueGlitch ? (
                <div className="text-[11px] font-mono bg-white p-2 rounded-xl border border-[#3B3355]/20 text-[#3B3355]">
                  <span className="text-amber-800 font-bold">[Unread Chat Draft]:</span> "Ban all phones forever lol..." (21:14 PM)
                  <p className="text-[10px] text-[#3B3355]/60 mt-0.5">
                    Why does your own message draft look so eerily similar to the viral flyer?
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-[#3B3355]/60">Syncing student messenger cache...</p>
              )}
            </div>

            {/* Mission Statement */}
            <div className="p-3 bg-[#CDEFD9]/50 rounded-2xl border border-[#3B3355]/20 text-xs font-medium text-[#3B3355]">
              <span className="font-bold">Your Mission:</span> Infiltrate the school courtyard, investigate the rumor, collect forensic evidence in your <span className="font-extrabold">{selectedMajor} wing</span>, and prove the truth at the Muhiba Talks debate!
            </div>

            {/* Proceed to Chapter 1 */}
            <button
              onClick={handleStartFinal}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#FFF1B8] hover:bg-[#FFE894] active:scale-95 text-[#3B3355] font-heading font-extrabold text-sm border-3 border-[#3B3355] shadow-[0_4px_0_#3B3355] flex items-center justify-center gap-2 transition-all"
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Enter School Courtyard (Chapter 1)</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="text-center text-[11px] text-white/70 py-1">
        SMK Muhammadiyah Bawang • English Analytical Exposition Challenge
      </footer>
    </div>
  );
};
