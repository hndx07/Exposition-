import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Award, Send, CheckCircle, Smartphone, ArrowRight } from 'lucide-react';
import { GameState, MajorType } from '../../types/game';
import { DEBATE_ROUNDS, WEB3FORMS_ACCESS_KEY, WING_CHALLENGES } from '../../constants/storyData';
import {
  playTapSound,
  playFlickSound,
  playSuccessChime,
  playErrorBuzz,
  playFanfareSound,
  triggerHaptic,
} from '../../utils/audio';
import { speakText, stopSpeaking } from '../../utils/speech';

interface Chapter6AuditoriumProps {
  gameState: GameState;
  onDebateScoreCalculated: (score: number) => void;
  onRestartGame: () => void;
}

export const Chapter6Auditorium: React.FC<Chapter6AuditoriumProps> = ({
  gameState,
  onDebateScoreCalculated,
  onRestartGame,
}) => {
  // Phase in Auditorium: 'debate' -> 'twist_reveal' -> 'stage_speech' -> 'results'
  const [phase, setPhase] = useState<'debate' | 'twist_reveal' | 'stage_speech' | 'results'>(
    'debate'
  );

  // Debate state
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedOpener, setSelectedOpener] = useState<number | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [roundFeedback, setRoundFeedback] = useState<{ isCorrect: boolean; text: string } | null>(
    null
  );
  const [debateScore, setDebateScore] = useState(0);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const currentRound = DEBATE_ROUNDS[currentRoundIdx];
  const totalGameScore = gameState.score + debateScore;
  const isEvidenceEnding = totalGameScore >= 75;

  const storageKey = `muhiba_submitted_${gameState.playerName.trim().toLowerCase()}_${gameState.className.trim().toLowerCase()}`;

  // Check if already submitted previously
  const isAlreadySubmitted =
    typeof window !== 'undefined' ? localStorage.getItem(storageKey) === 'true' : false;

  const handleSelectOpener = (idx: number) => {
    playTapSound();
    setSelectedOpener(idx);
  };

  const handleFlickCounterCard = (cardId: string, isCorrect: boolean, reason: string) => {
    if (selectedOpener === null || roundFeedback) return;
    playFlickSound();
    triggerHaptic(20);
    setSelectedCardId(cardId);

    const openerCorrect = selectedOpener === currentRound.correctOpenerIndex;
    const allCorrect = openerCorrect && isCorrect;

    if (allCorrect) {
      playSuccessChime();
      setDebateScore((prev) => prev + 5); // 5 pts per round = 15 pts total
    } else {
      playErrorBuzz();
    }

    setRoundFeedback({
      isCorrect: allCorrect,
      text: reason,
    });
  };

  const handleNextDebateRound = () => {
    playTapSound();
    setSelectedOpener(null);
    setSelectedCardId(null);
    setRoundFeedback(null);

    if (currentRoundIdx < DEBATE_ROUNDS.length - 1) {
      setCurrentRoundIdx((prev) => prev + 1);
    } else {
      // Finished all 3 debate rounds! Move to plot twist reveal!
      onDebateScoreCalculated(debateScore);
      setPhase('twist_reveal');
      triggerHaptic([50, 50, 50]);
    }
  };

  const handleGoToSpeech = () => {
    playTapSound();
    setPhase('stage_speech');
  };

  const handleGoToResults = () => {
    playFanfareSound();
    setPhase('results');
  };

  // Submit via Web3Forms with strict fetch handler
  const handleSubmitToTeacher = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isAlreadySubmitted || submitSuccess) return;

    setIsSubmitting(true);
    setSubmitMessage(null);
    playTapSound();

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append('from_name', 'Muhiba Mystery Game Portal');
      formData.append('subject', `Muhiba Mystery Results: ${gameState.playerName} (${gameState.className})`);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        playSuccessChime();
        setSubmitSuccess(true);
        setSubmitMessage('Success! Your report has been officially delivered to Mr. Hendra.');
        localStorage.setItem(storageKey, 'true');
      } else {
        setSubmitMessage(`Error: ${data.message || 'Submission could not be completed.'}`);
      }
    } catch {
      setSubmitMessage('Something went wrong. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const majorClue = gameState.major ? WING_CHALLENGES[gameState.major].twistClue : '';

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col justify-between min-h-[590px] bg-white rounded-3xl border-4 border-[#3B3355] shadow-2xl relative select-none">
      {/* ================= STAGE 1: DEBATE ROUNDS ================= */}
      {phase === 'debate' && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase bg-[#FFD6C9] px-2.5 py-0.5 rounded-full border border-[#3B3355]/30">
                Chapter 6 • Auditorium Debate
              </span>
              <span className="text-xs font-bold font-mono text-[#3B3355]">
                Round {currentRoundIdx + 1} / 3
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-base text-[#3B3355]">
              Duel Against Rafa's Arguments
            </h3>
            <p className="text-xs text-[#3B3355]/80 font-medium">
              Pick a professional analytical opener, then flick the counter-card at Rafa!
            </p>
          </div>

          {/* Rafa's Fallacy Speech Bubble */}
          <div className="my-2 p-4 bg-[#FFD6C9]/70 rounded-3xl border-3 border-[#3B3355] shadow-md flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#3B3355] flex items-center justify-center text-2xl shrink-0 anim-breathe">
              {roundFeedback?.isCorrect ? '😱' : '😏'}
            </div>
            <div>
              <div className="font-heading font-black text-xs text-[#3B3355] flex items-center gap-1.5 mb-0.5">
                <span>Rafa (Opposition Debater)</span>
                <span className="text-[9px] uppercase px-2 py-0.2 bg-white rounded-full font-mono">
                  Claim #{currentRound.roundNumber}
                </span>
              </div>
              <p className="text-xs font-bold text-[#3B3355] leading-relaxed">
                "{currentRound.rafaClaim}"
              </p>
            </div>
          </div>

          {/* Step A: Select Analytical Opener */}
          <div className="space-y-1 my-1">
            <span className="text-[11px] font-heading font-bold text-[#3B3355] uppercase tracking-wider block">
              1. Choose Rhetorical Opener:
            </span>
            <div className="space-y-1">
              {currentRound.availableOpeners.map((op, idx) => (
                <button
                  key={idx}
                  disabled={roundFeedback !== null}
                  onClick={() => handleSelectOpener(idx)}
                  className={`w-full text-left p-2 rounded-xl border-2 text-[11px] font-semibold transition-all ${
                    selectedOpener === idx
                      ? 'bg-[#FFF1B8] border-[#3B3355] text-[#3B3355] shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border-[#3B3355]/20 text-[#3B3355]/80'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          {/* Step B: Flick Counter Argument Card */}
          <div className="space-y-1 my-1">
            <span className="text-[11px] font-heading font-bold text-[#3B3355] uppercase tracking-wider block">
              2. Launch Counter-Argument Card:
            </span>
            <div className="space-y-1.5">
              {currentRound.availableArguments.map((arg) => (
                <button
                  key={arg.id}
                  disabled={selectedOpener === null || roundFeedback !== null}
                  onClick={() => handleFlickCounterCard(arg.id, arg.isCorrect, arg.counterReason)}
                  className={`w-full text-left p-2.5 rounded-2xl border-2 text-xs font-medium transition-all ${
                    selectedCardId === arg.id
                      ? roundFeedback?.isCorrect
                        ? 'bg-[#CDEFD9] border-emerald-700 text-emerald-950 font-bold'
                        : 'bg-rose-100 border-rose-600 text-rose-950 font-bold'
                      : selectedOpener !== null
                      ? 'bg-white hover:bg-[#CFE6FF]/40 border-[#3B3355]/30'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {arg.text}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback & Advance */}
          {roundFeedback ? (
            <div className="space-y-2 animate-fade-in pt-1">
              <div
                className={`p-2.5 rounded-2xl border-2 text-xs font-bold text-center ${
                  roundFeedback.isCorrect
                    ? 'bg-[#CDEFD9] border-emerald-700 text-emerald-950'
                    : 'bg-rose-100 border-rose-600 text-rose-950'
                }`}
              >
                {roundFeedback.isCorrect ? '🎯 Point Scored! ' : '❌ Fallacy Missed! '}
                {roundFeedback.text}
              </div>
              <button
                onClick={handleNextDebateRound}
                className="w-full py-3 px-4 rounded-2xl bg-[#FFF1B8] hover:bg-[#FFE894] active:scale-95 text-[#3B3355] font-heading font-extrabold text-xs border-3 border-[#3B3355] shadow-[0_3px_0_#3B3355] flex items-center justify-center gap-2"
              >
                <span>{currentRoundIdx < 2 ? 'Next Debate Round' : 'Proceed to Climax'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center text-[10px] text-[#3B3355]/60 font-semibold py-1">
              Select an opener first, then tap your counter-argument.
            </div>
          )}
        </div>
      )}

      {/* ================= STAGE 2: PLOT TWIST REVEAL ================= */}
      {phase === 'twist_reveal' && (
        <div className="flex-1 flex flex-col justify-between animate-fade-in">
          <div>
            <div className="text-center mb-3">
              <span className="text-xs uppercase font-extrabold px-3 py-1 bg-amber-200 text-amber-900 rounded-full border border-amber-400">
                ⚠️ THE SHOCKING TRUTH REVEALED
              </span>
              <h3 className="font-heading font-black text-xl text-[#3B3355] mt-1">
                There Was No Secret Mastermind!
              </h3>
            </div>

            {/* Twist Card */}
            <div className="bg-[#FFF1B8] p-4 rounded-3xl border-4 border-[#3B3355] shadow-xl space-y-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#3B3355] flex items-center justify-center text-3xl shrink-0 anim-shake">
                  📱
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-xs text-[#3B3355]">
                    The Evidence Points Directly to... YOU!
                  </h4>
                  <p className="text-[11px] text-[#3B3355]/80 font-medium">
                    Every forensic fragment connected back to your own device.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white/90 rounded-2xl border-2 border-[#3B3355]/20 text-xs font-semibold leading-relaxed text-[#3B3355]">
                <p className="mb-1.5">
                  🔍 <span className="font-bold">{majorClue}</span>
                </p>
                <p className="text-[11px] text-[#3B3355]/80">
                  Late yesterday evening, when your battery was low, you sarcastically texted the class chat: <span className="font-bold italic">"Ban all phones forever lol!"</span>
                </p>
                <p className="text-[11px] text-[#3B3355]/80 mt-1">
                  Rafa saw the text, took a screenshot out of context, and blew it up into a sensational rumor!
                </p>
              </div>

              {/* Mr. Hendra's smile */}
              <div className="p-3 bg-[#CFE6FF]/80 rounded-2xl border-2 border-[#3B3355]/20 flex items-center gap-2.5">
                <span className="text-2xl">🧑‍🏫</span>
                <p className="text-[11px] font-semibold text-[#3B3355] leading-snug">
                  <span className="font-bold">Mr. Hendra steps forward:</span> "I knew about the chat all along! Instead of punishing anyone, I wanted you to see how fast baseless rumors spread, and how analytical exposition dismantles chaos with evidence."
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleGoToSpeech}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#CDEFD9] hover:bg-[#b8e8c6] active:scale-95 text-[#3B3355] font-heading font-extrabold text-sm border-3 border-[#3B3355] shadow-[0_3px_0_#3B3355] flex items-center justify-center gap-2"
          >
            <span>Deliver Closing Speech to School</span>
            <Sparkles className="w-4 h-4 text-[#3B3355]" />
          </button>
        </div>
      )}

      {/* ================= STAGE 3: STAGE SPEECH & CURTAINS OPEN ================= */}
      {phase === 'stage_speech' && (
        <div className="flex-1 flex flex-col justify-between animate-fade-in">
          <div>
            <div className="text-center mb-2">
              <span className="text-xs uppercase font-extrabold px-3 py-1 bg-purple-200 text-purple-900 rounded-full border border-purple-400">
                🎭 AUDITORIUM GRAND FINALE
              </span>
              <h3 className="font-heading font-black text-xl text-[#3B3355] mt-1">
                The Stage Curtains Open!
              </h3>
            </div>

            {/* Stage Presentation Box */}
            <div className="bg-[#3B3355] text-white p-4 rounded-3xl border-4 border-[#FFF1B8] shadow-2xl space-y-3 mb-2">
              <div className="text-center">
                <span className="text-2xl">🎤</span>
                <h4 className="font-heading font-extrabold text-sm text-[#FFF1B8]">
                  "{gameState.playerName}'s Keynote at Muhiba Talks"
                </h4>
                <p className="text-[10px] text-white/70">Grade {gameState.className} • {gameState.major} Wing</p>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/20 text-xs leading-relaxed space-y-2 text-white/90 font-medium">
                <p>
                  <span className="text-[#FFF1B8] font-bold">[Thesis]:</span> Schools should not ban smartphones blindly; disciplined regulation cultivates industry readiness.
                </p>
                <p>
                  <span className="text-[#CDEFD9] font-bold">[Firstly]:</span> Mobile tech grants immediate access to technical schematics, ledgers, and diagnostic documentation.
                </p>
                <p>
                  <span className="text-[#CFE6FF] font-bold">[Secondly]:</span> Practicing digital ethics prepares vocational students for modern workplace demands.
                </p>
                <p>
                  <span className="text-[#E3D4FF] font-bold">[In conclusion]:</span> Banning devices out of panic solves nothing. Regulated integration produces mature professionals.
                </p>
              </div>

              {/* The Closing Motto */}
              <div className="p-3 bg-[#FFF1B8] text-[#3B3355] rounded-2xl text-center border-2 border-white font-heading font-black text-sm">
                "An opinion is not enough. Prove it."
              </div>
            </div>

            <p className="text-center text-xs text-[#3B3355]/80 font-bold">
              👏 The entire school stands and erupts in applause!
            </p>
          </div>

          <button
            onClick={handleGoToResults}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FFF1B8] hover:bg-[#FFE894] active:scale-95 text-[#3B3355] font-heading font-extrabold text-sm border-3 border-[#3B3355] shadow-[0_3px_0_#3B3355] flex items-center justify-center gap-2"
          >
            <span>View Final Evaluation & Submit</span>
            <Trophy className="w-4 h-4 text-[#3B3355]" />
          </button>
        </div>
      )}

      {/* ================= STAGE 4: RESULTS, ENDINGS & WEB3FORMS SUBMISSION ================= */}
      {phase === 'results' && (
        <div className="flex-1 flex flex-col justify-between overflow-y-auto max-h-[570px] pr-1 space-y-3">
          {/* Ending Banner */}
          <div
            className={`p-4 rounded-3xl border-4 text-center shadow-lg ${
              isEvidenceEnding
                ? 'bg-[#CDEFD9] border-emerald-800 text-emerald-950'
                : 'bg-[#FFD6C9] border-[#3B3355] text-[#3B3355]'
            }`}
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white border-2 border-[#3B3355] flex items-center justify-center text-3xl mb-1 shadow">
              {isEvidenceEnding ? '🏆' : '🥈'}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/70 border border-[#3B3355]/20">
              {isEvidenceEnding ? 'Evidence Master Ending' : 'Rumor Sleuth Ending'}
            </span>
            <h3 className="font-heading font-black text-xl mt-1">
              Total Score: {totalGameScore} / 100
            </h3>
            <p className="text-xs font-semibold mt-1">
              {isEvidenceEnding
                ? 'Outstanding performance! You dismantled sensational rumors with rigorous empirical evidence and textbook analytical exposition.'
                : 'Good detective work! The rumor is cleared, though sharpening your evidence fragments and transitions will prepare you for the next debate.'}
            </p>
          </div>

          {/* Breakdown Card */}
          <div className="bg-slate-50 p-3 rounded-2xl border-2 border-[#3B3355]/20 text-xs">
            <h4 className="font-heading font-bold text-xs text-[#3B3355] mb-1.5 flex items-center justify-between">
              <span>Chapter Score Breakdown</span>
              <span className="font-mono text-[#3B3355]">Total: {totalGameScore}/100</span>
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold text-[#3B3355]/85">
              <div>Ch. 1 Courtyard: {gameState.chapterScores.ch1}/10 pts</div>
              <div>Ch. 2 Pre-listening: {gameState.chapterScores.ch2}/15 pts</div>
              <div>Ch. 3 Major Wing: {gameState.chapterScores.ch3}/20 pts</div>
              <div>Ch. 4 Library Quiz: {gameState.chapterScores.ch4}/25 pts</div>
              <div>Ch. 5 Writing Room: {gameState.chapterScores.ch5}/15 pts</div>
              <div>Ch. 6 Auditorium: {debateScore}/15 pts</div>
            </div>
          </div>

          {/* Official Web3Forms Submission to Mr. Hendra */}
          <div className="bg-white p-4 rounded-3xl border-3 border-[#3B3355] shadow-md space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">📨</span>
              <div>
                <h4 className="font-heading font-extrabold text-xs text-[#3B3355]">
                  Official Submission to Mr. Hendra
                </h4>
                <p className="text-[10px] text-[#3B3355]/70">
                  Sends name, class, major, ending, score, and summary via Web3Forms.
                </p>
              </div>
            </div>

            <form id="form" onSubmit={handleSubmitToTeacher} className="space-y-2">
              <input type="hidden" name="name" value={gameState.playerName} />
              <input type="hidden" name="class" value={gameState.className} />
              <input type="hidden" name="major" value={gameState.major || ''} />
              <input type="hidden" name="score" value={`${totalGameScore}/100`} />
              <input
                type="hidden"
                name="ending"
                value={isEvidenceEnding ? 'Evidence Master Ending' : 'Rumor Sleuth Ending'}
              />
              <input
                type="hidden"
                name="summary"
                value={`Student ${gameState.playerName} (${gameState.className}, ${gameState.major}) solved Muhiba Mystery with ${totalGameScore}/100 points. Ch1:${gameState.chapterScores.ch1}, Ch2:${gameState.chapterScores.ch2}, Ch3:${gameState.chapterScores.ch3}, Ch4:${gameState.chapterScores.ch4}, Ch5:${gameState.chapterScores.ch5}, Ch6:${debateScore}.`}
              />

              {submitMessage && (
                <div
                  className={`p-2.5 rounded-xl border-2 text-xs font-bold text-center ${
                    submitSuccess
                      ? 'bg-[#CDEFD9] border-emerald-700 text-emerald-950'
                      : 'bg-rose-100 border-rose-600 text-rose-950'
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isAlreadySubmitted || submitSuccess}
                className={`w-full py-3 px-4 rounded-2xl font-heading font-extrabold text-xs border-3 border-[#3B3355] shadow-[0_3px_0_#3B3355] flex items-center justify-center gap-2 transition-all ${
                  isAlreadySubmitted || submitSuccess
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-700 cursor-not-allowed'
                    : isSubmitting
                    ? 'bg-amber-100 text-amber-900 border-amber-700 cursor-wait'
                    : 'bg-[#FFF1B8] hover:bg-[#ffe894] active:scale-95 text-[#3B3355]'
                }`}
              >
                {isAlreadySubmitted || submitSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Sent to Mr. Hendra (Locked)</span>
                  </>
                ) : isSubmitting ? (
                  <span>Sending Report...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#3B3355]" />
                    <span>Send Result to Mr. Hendra</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Play Again */}
          <button
            onClick={() => {
              playTapSound();
              onRestartGame();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-[#3B3355] text-xs font-bold text-[#3B3355] text-center"
          >
            Play Again / Try Another Major
          </button>
        </div>
      )}
    </div>
  );
};
