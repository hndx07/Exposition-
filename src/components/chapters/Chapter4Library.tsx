import React, { useState } from 'react';
import { Volume2, VolumeX, BookOpen, CheckCircle, XCircle, Flame, HelpCircle } from 'lucide-react';
import { PODCAST_DATA, LIBRARY_QUESTIONS, LibraryQuestion } from '../../constants/storyData';
import { playTapSound, playSuccessChime, playErrorBuzz } from '../../utils/audio';
import { speakText, stopSpeaking } from '../../utils/speech';

interface Chapter4LibraryProps {
  speechRate: number;
  onComplete: (score: number) => void;
}

export const Chapter4Library: React.FC<Chapter4LibraryProps> = ({ speechRate, onComplete }) => {
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // User answers
  const [singleChoice, setSingleChoice] = useState<number | null>(null);
  const [complexChoices, setComplexChoices] = useState<number[]>([]);
  const [matrixAnswers, setMatrixAnswers] = useState<Record<number, boolean>>({});

  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [earnedChapterScore, setEarnedChapterScore] = useState(0);

  const currentQ: LibraryQuestion = LIBRARY_QUESTIONS[currentQIndex];

  // Podcast audio play
  const handleTogglePodcast = () => {
    playTapSound();
    if (isPlayingPodcast) {
      stopSpeaking();
      setIsPlayingPodcast(false);
    } else {
      setIsPlayingPodcast(true);
      speakText(PODCAST_DATA.audioText, {
        gender: 'male',
        rate: speechRate,
        onEnd: () => setIsPlayingPodcast(false),
      });
    }
  };

  // Complex choice toggle
  const toggleComplexChoice = (idx: number) => {
    if (isAnswerSubmitted) return;
    playTapSound();
    setComplexChoices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Matrix agree/disagree select
  const setMatrixChoice = (rowIndex: number, agree: boolean) => {
    if (isAnswerSubmitted) return;
    playTapSound();
    setMatrixAnswers((prev) => ({ ...prev, [rowIndex]: agree }));
  };

  // Submit answer for current question
  const handleSubmitAnswer = () => {
    playTapSound();
    let earned = 0;

    if (currentQ.type === 'single') {
      if (singleChoice !== null && currentQ.correctIndices?.includes(singleChoice)) {
        earned = currentQ.points;
      }
    } else if (currentQ.type === 'complex') {
      const correct = currentQ.correctIndices || [];
      const isPerfect =
        correct.length === complexChoices.length &&
        correct.every((val) => complexChoices.includes(val));
      if (isPerfect) {
        earned = currentQ.points;
      } else {
        // partial credit if selected at least 1 correct without selecting false
        const correctPicks = complexChoices.filter((c) => correct.includes(c)).length;
        const wrongPicks = complexChoices.filter((c) => !correct.includes(c)).length;
        earned = Math.max(0, (correctPicks - wrongPicks) * 2.5);
      }
    } else if (currentQ.type === 'matrix') {
      const rows = currentQ.matrixRows || [];
      let matches = 0;
      rows.forEach((r, idx) => {
        if (matrixAnswers[idx] === r.isAgree) matches++;
      });
      earned = Math.round((matches / rows.length) * currentQ.points);
    }

    if (earned > 0) {
      playSuccessChime();
    } else {
      playErrorBuzz();
    }

    setEarnedChapterScore((prev) => prev + earned);
    setIsAnswerSubmitted(true);
  };

  // Move to next question or complete chapter
  const handleNextQuestion = () => {
    playTapSound();
    setIsAnswerSubmitted(false);
    setSingleChoice(null);
    setComplexChoices([]);
    setMatrixAnswers({});

    if (currentQIndex < LIBRARY_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      stopSpeaking();
      onComplete(Math.min(25, Math.round(earnedChapterScore)));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col justify-between min-h-[540px] bg-[#E3D4FF]/40 rounded-3xl border-4 border-[#3B3355] shadow-2xl relative select-none overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase bg-[#FFF1B8] px-2.5 py-0.5 rounded-full border border-[#3B3355]/30">
            Chapter 4 • The Quiet Library
          </span>
          <span className="text-xs font-bold font-mono text-[#3B3355]">
            Quiz {currentQIndex + 1} / {LIBRARY_QUESTIONS.length}
          </span>
        </div>
        <h3 className="font-heading font-extrabold text-base text-[#3B3355]">
          Podcast Listening & Comprehension
        </h3>
      </div>

      {/* PODCAST AUDIO PLAYER WIDGET */}
      <div className="bg-white rounded-2xl p-3.5 border-3 border-[#3B3355] shadow-sm my-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎙️</span>
            <div>
              <h4 className="font-heading font-bold text-xs text-[#3B3355]">
                {PODCAST_DATA.title}
              </h4>
              <p className="text-[10px] text-[#3B3355]/70">{PODCAST_DATA.duration}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleTogglePodcast}
              className={`p-2 rounded-xl border-2 border-[#3B3355] transition-all flex items-center gap-1 text-xs font-bold ${
                isPlayingPodcast
                  ? 'bg-[#CDEFD9] text-emerald-950 scale-105'
                  : 'bg-[#FFF1B8] text-[#3B3355]'
              }`}
            >
              {isPlayingPodcast ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingPodcast ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => {
                playTapSound();
                setShowTranscript(!showTranscript);
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-[#3B3355] text-xs font-bold"
              title="Toggle Transcript"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Transcript */}
        {showTranscript && (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-[#3B3355]/20 text-[11px] leading-relaxed max-h-36 overflow-y-auto font-medium text-[#3B3355]">
            {PODCAST_DATA.audioText}
          </div>
        )}
      </div>

      {/* CURRENT QUESTION CONTAINER */}
      <div className="flex-1 my-1 flex flex-col justify-center space-y-3">
        {/* Prompt Header */}
        <div className="p-3 bg-white rounded-2xl border-2 border-[#3B3355] text-xs font-extrabold text-[#3B3355]">
          <span className="text-indigo-600 mr-1 font-mono">Q{currentQ.id} ({currentQ.points} pts):</span>
          {currentQ.prompt}
        </div>

        {/* 1. SINGLE CHOICE QUESTION */}
        {currentQ.type === 'single' && currentQ.options && (
          <div className="space-y-1.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = singleChoice === idx;
              let btnStyle = isSelected
                ? 'bg-[#FFF1B8] border-[#3B3355] font-bold shadow-sm'
                : 'bg-white hover:bg-slate-50 border-[#3B3355]/30';

              if (isAnswerSubmitted) {
                if (currentQ.correctIndices?.includes(idx)) {
                  btnStyle = 'bg-[#CDEFD9] border-emerald-700 text-emerald-950 font-extrabold ring-2 ring-emerald-500';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-100 border-rose-600 text-rose-950 font-bold';
                } else {
                  btnStyle = 'bg-white/50 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => {
                    playTapSound();
                    setSingleChoice(idx);
                  }}
                  className={`w-full text-left p-2.5 rounded-2xl border-2 text-xs transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isSelected && !isAnswerSubmitted && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3B3355]" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. COMPLEX MULTIPLE CHOICE (Select all that apply) */}
        {currentQ.type === 'complex' && currentQ.options && (
          <div className="space-y-1.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = complexChoices.includes(idx);
              let btnStyle = isSelected
                ? 'bg-[#CFE6FF] border-[#3B3355] font-bold shadow-sm'
                : 'bg-white hover:bg-slate-50 border-[#3B3355]/30';

              if (isAnswerSubmitted) {
                if (currentQ.correctIndices?.includes(idx)) {
                  btnStyle = 'bg-[#CDEFD9] border-emerald-700 text-emerald-950 font-extrabold ring-2 ring-emerald-500';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-100 border-rose-600 text-rose-950 font-bold';
                } else {
                  btnStyle = 'bg-white/50 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => toggleComplexChoice(idx)}
                  className={`w-full text-left p-2.5 rounded-2xl border-2 text-xs transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  <span
                    className={`w-4 h-4 rounded-md border-2 border-[#3B3355] flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? 'bg-[#3B3355] text-white' : 'bg-white'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. AGREE / DISAGREE MATRIX */}
        {currentQ.type === 'matrix' && currentQ.matrixRows && (
          <div className="space-y-2">
            {currentQ.matrixRows.map((row, rIdx) => {
              const userChoice = matrixAnswers[rIdx];
              return (
                <div key={rIdx} className="bg-white p-2.5 rounded-2xl border-2 border-[#3B3355]/30 text-xs">
                  <p className="font-semibold text-[#3B3355] mb-2">{row.statement}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled={isAnswerSubmitted}
                      onClick={() => setMatrixChoice(rIdx, true)}
                      className={`py-1.5 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                        userChoice === true
                          ? isAnswerSubmitted
                            ? row.isAgree
                              ? 'bg-[#CDEFD9] border-emerald-700 text-emerald-950'
                              : 'bg-rose-100 border-rose-600 text-rose-950'
                            : 'bg-[#FFF1B8] border-[#3B3355]'
                          : 'bg-slate-50 border-[#3B3355]/20 hover:bg-slate-100'
                      }`}
                    >
                      👍 Agree
                    </button>
                    <button
                      disabled={isAnswerSubmitted}
                      onClick={() => setMatrixChoice(rIdx, false)}
                      className={`py-1.5 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                        userChoice === false
                          ? isAnswerSubmitted
                            ? !row.isAgree
                              ? 'bg-[#CDEFD9] border-emerald-700 text-emerald-950'
                              : 'bg-rose-100 border-rose-600 text-rose-950'
                            : 'bg-[#FFD6C9] border-[#3B3355]'
                          : 'bg-slate-50 border-[#3B3355]/20 hover:bg-slate-100'
                      }`}
                    >
                      👎 Disagree
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Question Feedback & Action Footer */}
      {isAnswerSubmitted ? (
        <div className="space-y-2 animate-fade-in pt-1">
          <div className="p-2.5 rounded-2xl bg-white border-2 border-[#3B3355] text-[11px] font-semibold text-[#3B3355]">
            💡 {currentQ.explanation}
          </div>
          <button
            onClick={handleNextQuestion}
            className="w-full py-3 px-4 rounded-2xl bg-[#FFF1B8] hover:bg-[#FFE894] active:scale-95 text-[#3B3355] font-heading font-extrabold text-xs border-3 border-[#3B3355] shadow-[0_3px_0_#3B3355] flex items-center justify-center gap-2"
          >
            <span>{currentQIndex < LIBRARY_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Library Study'}</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleSubmitAnswer}
          className="w-full py-3 px-4 rounded-2xl bg-[#CDEFD9] hover:bg-[#b8e8c6] active:scale-95 text-[#3B3355] font-heading font-extrabold text-xs border-3 border-[#3B3355] shadow-[0_3px_0_#3B3355] flex items-center justify-center gap-2"
        >
          <span>Submit Deduction</span>
          <CheckCircle className="w-4 h-4" />
        </button>
      )}

      {/* Progress Footer */}
      <div className="flex items-center justify-between text-xs text-[#3B3355]/70 pt-2 border-t-2 border-[#3B3355]/15">
        <span>Chapter 4 Score: {Math.round(earnedChapterScore)} / 25 pts</span>
        <span className="font-bold">SMK Muhiba Library</span>
      </div>
    </div>
  );
};
