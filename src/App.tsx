/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameState, MajorType, NPCId, DialogueNode, ClueItem } from './types/game';
import {
  INITIAL_VOCAB_BADGES,
  INITIAL_CASE_BOARD,
  WING_CHALLENGES,
} from './constants/storyData';
import { HeaderHUD } from './components/HeaderHUD';
import { TutorialModal } from './components/TutorialModal';
import { InventoryModal } from './components/InventoryModal';
import { DialogueBox } from './components/DialogueBox';
import { SparkleOverlay } from './components/SparkleOverlay';
import { IrisTransition } from './components/IrisTransition';
import { GameCanvas } from './components/GameCanvas';

// Chapters
import { TitleScreen } from './components/chapters/TitleScreen';
import { Chapter1Courtyard } from './components/chapters/Chapter1Courtyard';
import { Chapter2PreListening } from './components/chapters/Chapter2PreListening';
import { Chapter3Wings } from './components/chapters/Chapter3Wings';
import { Chapter4Library } from './components/chapters/Chapter4Library';
import { Chapter5WritingRoom } from './components/chapters/Chapter5WritingRoom';
import { Chapter6Auditorium } from './components/chapters/Chapter6Auditorium';

import { setSoundMuted, playTapSound, playDoorLocked, playSparkleSound } from './utils/audio';

const STORAGE_KEY = 'muhiba_mystery_save_v1';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return {
      playerName: '',
      className: '',
      major: null,
      chapter: 0,
      score: 0,
      chapterScores: {
        ch1: 0,
        ch2: 0,
        ch3: 0,
        ch4: 0,
        ch5: 0,
        ch6: 0,
      },
      clues: [],
      badges: INITIAL_VOCAB_BADGES,
      caseBoard: INITIAL_CASE_BOARD,
      hasSeenTutorial: false,
      soundEnabled: true,
      speechRate: 1.0,
      isSubmitted: false,
    };
  });

  // UI state
  const [isPlayerMoving, setIsPlayerMoving] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [inventoryInitialTab, setInventoryInitialTab] = useState<'caseBoard' | 'badges' | 'clues'>('caseBoard');
  const [showIris, setShowIris] = useState(false);
  const [sparkleMessage, setSparkleMessage] = useState<string | null>(null);

  // Active scene mode: 'map' (free walk on courtyard) vs 'chapter_activity' (the specific chapter mini-game)
  const [activeScene, setActiveScene] = useState<'map' | 'chapter_activity'>('map');

  // Active dialogue overlay
  const [activeDialogue, setActiveDialogue] = useState<DialogueNode | null>(null);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      } catch {
        // storage quota
      }
    }
  }, [gameState]);

  // Audio mute sync
  useEffect(() => {
    setSoundMuted(!gameState.soundEnabled);
  }, [gameState.soundEnabled]);

  // Sparkle helper
  const triggerSparkle = (msg: string) => {
    playSparkleSound();
    setSparkleMessage(msg);
    setTimeout(() => setSparkleMessage(null), 2500);
  };

  // Start game from Title
  const handleStartGame = (name: string, className: string, major: MajorType) => {
    setGameState((prev) => ({
      ...prev,
      playerName: name,
      className,
      major,
      chapter: 1,
    }));

    if (!gameState.hasSeenTutorial) {
      setShowTutorial(true);
    }
  };

  // Switch scenes with smooth iris effect
  const transitionToScene = (scene: 'map' | 'chapter_activity') => {
    setShowIris(true);
    setTimeout(() => {
      setActiveScene(scene);
      setShowIris(false);
    }, 450);
  };

  // Chapter 1 Complete
  const handleChapter1Complete = (chScore: number) => {
    setGameState((prev) => {
      const updatedBadges = prev.badges.map((b) =>
        b.id === 'rules' || b.id === 'banning' ? { ...b, unlocked: true } : b
      );
      return {
        ...prev,
        score: prev.score + chScore,
        chapterScores: { ...prev.chapterScores, ch1: chScore },
        badges: updatedBadges,
        chapter: 2,
      };
    });
    triggerSparkle('Chapter 1 Complete! Badges Unlocked: "rules" & "banning"');
    transitionToScene('map');
  };

  // Chapter 2 Complete
  const handleChapter2Complete = (chScore: number, unlockedKeys: string[]) => {
    setGameState((prev) => {
      const updatedCaseBoard = prev.caseBoard.map((part) =>
        unlockedKeys.includes(part.id) ? { ...part, unlocked: true } : part
      );
      const updatedBadges = prev.badges.map((b) =>
        b.id === 'allow' || b.id === 'responsibility' ? { ...b, unlocked: true } : b
      );
      return {
        ...prev,
        score: prev.score + chScore,
        chapterScores: { ...prev.chapterScores, ch2: chScore },
        caseBoard: updatedCaseBoard,
        badges: updatedBadges,
        chapter: 3,
      };
    });
    triggerSparkle('Chapter 2 Complete! Case Board Fragments Unlocked!');
    transitionToScene('map');
  };

  // Chapter 3 Complete
  const handleChapter3Complete = (chScore: number, newClues: ClueItem[], connectiveKey: string) => {
    setGameState((prev) => {
      const updatedBadges = prev.badges.map((b) =>
        b.id === 'policy' || b.id === 'evidence' ? { ...b, unlocked: true } : b
      );
      return {
        ...prev,
        score: prev.score + chScore,
        chapterScores: { ...prev.chapterScores, ch3: chScore },
        clues: [...prev.clues, ...newClues],
        badges: updatedBadges,
        chapter: 4,
      };
    });
    triggerSparkle(`Forensic Clues Logged! Connective Key: "${connectiveKey}"`);
    transitionToScene('map');
  };

  // Chapter 4 Complete
  const handleChapter4Complete = (chScore: number) => {
    setGameState((prev) => {
      const updatedBadges = prev.badges.map((b) =>
        b.id === 'crucial' || b.id === 'mandatory' ? { ...b, unlocked: true } : b
      );
      return {
        ...prev,
        score: prev.score + chScore,
        chapterScores: { ...prev.chapterScores, ch4: chScore },
        badges: updatedBadges,
        chapter: 5,
      };
    });
    triggerSparkle('Library Case Solved! Badges: "crucial" & "mandatory"');
    transitionToScene('map');
  };

  // Chapter 5 Complete
  const handleChapter5Complete = (chScore: number) => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + chScore,
      chapterScores: { ...prev.chapterScores, ch5: chScore },
      chapter: 6,
    }));
    triggerSparkle('Exposition Speech Ready! Proceed to Auditorium!');
    transitionToScene('map');
  };

  // Chapter 6 Debate Score
  const handleDebateScore = (chScore: number) => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + chScore,
      chapterScores: { ...prev.chapterScores, ch6: chScore },
    }));
  };

  // Restart game
  const handleRestartGame = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setGameState({
      playerName: '',
      className: '',
      major: null,
      chapter: 0,
      score: 0,
      chapterScores: { ch1: 0, ch2: 0, ch3: 0, ch4: 0, ch5: 0, ch6: 0 },
      clues: [],
      badges: INITIAL_VOCAB_BADGES,
      caseBoard: INITIAL_CASE_BOARD,
      hasSeenTutorial: false,
      soundEnabled: true,
      speechRate: 1.0,
      isSubmitted: false,
    });
    setActiveScene('map');
    setActiveDialogue(null);
  };

  // NPC Interaction handler on the map
  const handleInteractNPC = (npcId: NPCId) => {
    playTapSound();
    switch (npcId) {
      case 'mr_hendra':
        setActiveDialogue({
          id: 'hendra_greet',
          speaker: 'Mr. Hendra',
          speakerRole: 'English Mentor & Muhiba Talks Organizer',
          npcId: 'mr_hendra',
          avatarExpression: 'happy',
          text: `Welcome, ${gameState.playerName || 'student'}! The school is buzzing over that anonymous phone ban rumor. Remember: emotional opinions fall apart, but analytical exposition with verifiable evidence stands firm. Are you ready?`,
          choices: [
            {
              text: gameState.chapter === 1
                ? 'Yes, let’s investigate the courtyard rumors (Chapter 1)!'
                : `Continue our investigation in Chapter ${gameState.chapter}!`,
              nextNodeId: '',
              onSelect: () => {
                setActiveDialogue(null);
                transitionToScene('chapter_activity');
              },
            },
            {
              text: 'Remind me how an Analytical Exposition works.',
              nextNodeId: '',
              onSelect: () => {
                setActiveDialogue({
                  id: 'hendra_explain',
                  speaker: 'Mr. Hendra',
                  speakerRole: 'English Mentor',
                  npcId: 'mr_hendra',
                  avatarExpression: 'neutral',
                  text: 'An analytical exposition presents an Issue, declares a clear Thesis, supports it with sequential Arguments (using Firstly, Secondly), and concludes with a Reiteration. Always prove your claims!',
                  choices: [
                    {
                      text: 'Understood, Mr. Hendra!',
                      nextNodeId: '',
                      onSelect: () => setActiveDialogue(null),
                    },
                  ],
                });
              },
            },
          ],
        });
        break;

      case 'rafa':
        setActiveDialogue({
          id: 'rafa_taunt',
          speaker: 'Rafa',
          speakerRole: 'Debate Rival & Student Council Opponent',
          npcId: 'rafa',
          avatarExpression: 'smug',
          text: `Haha, did you see the viral poster? "All phones banned starting tomorrow!" Everyone is freaking out, and I have the debate already won! Unless you can prove otherwise at Muhiba Talks?`,
          choices: [
            {
              text: 'An unverified flyer is just an opinion, Rafa. I will prove it with evidence!',
              nextNodeId: '',
              onSelect: () => {
                setActiveDialogue(null);
                if (gameState.chapter === 1) transitionToScene('chapter_activity');
              },
            },
            {
              text: 'Where did you get that flyer from anyway?',
              nextNodeId: '',
              onSelect: () => {
                setActiveDialogue({
                  id: 'rafa_evade',
                  speaker: 'Rafa',
                  speakerRole: 'Debate Rival',
                  npcId: 'rafa',
                  avatarExpression: 'shocked',
                  text: 'Uhh... someone forwarded it to the group chat last night around 21:15 PM! Don’t ask me details, just prepare for our auditorium showdown!',
                  choices: [
                    {
                      text: 'Hmm, 21:15 PM... that sounds suspiciously familiar.',
                      nextNodeId: '',
                      onSelect: () => setActiveDialogue(null),
                    },
                  ],
                });
              },
            },
          ],
        });
        break;

      case 'mia':
        setActiveDialogue({
          id: 'mia_greet',
          speaker: 'Mia',
          speakerRole: 'Library Research Curator',
          npcId: 'mia',
          avatarExpression: 'happy',
          text: 'Shh... welcome to the library! Mr. Hendra recorded a special podcast on phone policies. Are you here to listen to the episode and take the comprehension quiz?',
          choices: [
            {
              text: 'Yes! Open the Podcast player & Library Quiz (Chapter 4).',
              nextNodeId: '',
              onSelect: () => {
                setActiveDialogue(null);
                setGameState((prev) => ({ ...prev, chapter: Math.max(4, prev.chapter) }));
                transitionToScene('chapter_activity');
              },
            },
            {
              text: 'I will explore the courtyard a bit more first.',
              nextNodeId: '',
              onSelect: () => setActiveDialogue(null),
            },
          ],
        });
        break;

      case 'pak_satpam':
        setActiveDialogue({
          id: 'satpam_status',
          speaker: 'Pak Satpam',
          speakerRole: 'Wing Security Officer',
          npcId: 'pak_satpam',
          avatarExpression: 'serious',
          text: `Halt, student! I guard the three vocational wings. You may only enter the ${gameState.major || 'assigned'} wing. All other wings are strictly locked by student ID protocols!`,
          choices: [
            {
              text: `Understood, Pak. I am an authorized ${gameState.major} student!`,
              nextNodeId: '',
              onSelect: () => setActiveDialogue(null),
            },
          ],
        });
        break;
    }
  };

  // Cross-wing access check
  const handleSelectWing = (wing: MajorType) => {
    if (wing !== gameState.major) {
      playDoorLocked();
      setActiveDialogue({
        id: 'access_denied',
        speaker: 'Pak Satpam',
        speakerRole: 'Wing Security Officer',
        npcId: 'pak_satpam',
        avatarExpression: 'serious',
        text: `Access denied: this wing is for ${wing} students only. Please return to your own ${gameState.major} wing!`,
        choices: [
          {
            text: 'Understood, Pak Satpam.',
            nextNodeId: '',
            onSelect: () => setActiveDialogue(null),
          },
        ],
      });
    } else {
      // Authorized wing!
      setActiveDialogue({
        id: 'wing_granted',
        speaker: 'Pak Satpam',
        speakerRole: 'Wing Security Officer',
        npcId: 'pak_satpam',
        avatarExpression: 'happy',
        text: `Access granted! Welcome to the ${wing} Wing. Go inside and gather your forensic evidence!`,
        choices: [
          {
            text: `Enter ${wing} Department Wing (Chapter 3)`,
            nextNodeId: '',
            onSelect: () => {
              setActiveDialogue(null);
              setGameState((prev) => ({ ...prev, chapter: Math.max(3, prev.chapter) }));
              transitionToScene('chapter_activity');
            },
          },
        ],
      });
    }
  };

  // Handle entering auditorium scene from map
  const handleEnterChapterScene = (sceneId: string) => {
    if (sceneId === 'auditorium') {
      if (gameState.chapter < 6) {
        setActiveDialogue({
          id: 'auditorium_locked',
          speaker: 'Mr. Hendra',
          speakerRole: 'English Mentor',
          npcId: 'mr_hendra',
          avatarExpression: 'thinking',
          text: `The debate stage isn’t ready yet! You must complete your investigation and prepare your written exposition speech first (currently on Chapter ${gameState.chapter}).`,
          choices: [
            {
              text: 'I will finish my investigation first!',
              nextNodeId: '',
              onSelect: () => setActiveDialogue(null),
            },
          ],
        });
      } else {
        transitionToScene('chapter_activity');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#3B3355] flex flex-col items-center justify-start sm:justify-center p-0 sm:py-6 sm:px-4 text-[#3B3355] relative overflow-x-hidden overflow-y-auto">
      {/* Sparkle particle overlay */}
      <SparkleOverlay show={sparkleMessage !== null} message={sparkleMessage || undefined} />

      {/* Iris screen transition */}
      <IrisTransition isActive={showIris} />

      {/* Tutorial modal */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => {
          setShowTutorial(false);
          setGameState((prev) => ({ ...prev, hasSeenTutorial: true }));
        }}
      />

      {/* Inventory & Case Board Modal */}
      <InventoryModal
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
        gameState={gameState}
        initialTab={inventoryInitialTab}
      />

      {/* Mobile-first Container (Scrollable) */}
      <div className="w-full max-w-md min-h-screen sm:min-h-0 flex flex-col relative bg-gradient-to-b from-[#CFE6FF]/30 to-[#3B3355] sm:rounded-3xl shadow-2xl overflow-y-auto border-0 sm:border-4 sm:border-white/20">
        {/* CHAPTER 0: TITLE & PROLOGUE */}
        {gameState.chapter === 0 ? (
          <TitleScreen onStartGame={handleStartGame} />
        ) : (
          /* ACTIVE GAME VIEW */
          <div className="flex-1 flex flex-col relative p-2 sm:p-3 overflow-y-auto">
            {/* Top HUD */}
            <HeaderHUD
              gameState={gameState}
              isMoving={isPlayerMoving}
              onOpenInventory={() => {
                setInventoryInitialTab('caseBoard');
                setShowInventory(true);
              }}
              onOpenBadges={() => {
                setInventoryInitialTab('badges');
                setShowInventory(true);
              }}
              onToggleSound={() => {
                setGameState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
              }}
              onToggleRate={() => {
                setGameState((prev) => ({
                  ...prev,
                  speechRate: prev.speechRate === 1.0 ? 0.8 : 1.0,
                }));
              }}
              onPause={() => setShowTutorial(true)}
            />

            {/* MAIN STAGE CONTENT (Map vs Chapter Activity) */}
            <main className="flex-1 flex flex-col pt-20 pb-8 overflow-y-auto">
              {activeScene === 'map' ? (
                <div className="flex-1 flex flex-col justify-between">
                  {/* Quick Chapter Banner on Map */}
                  <div className="mb-2 bg-white/90 backdrop-blur-sm px-3.5 py-2 rounded-2xl border-2 border-[#3B3355] shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-[#E3D4FF] px-2 py-0.5 rounded-full">
                        Current Mission
                      </span>
                      <h4 className="font-heading font-extrabold text-xs text-[#3B3355]">
                        {gameState.chapter === 1 && 'Chapter 1: Courtyard Rumors (Fact vs Opinion)'}
                        {gameState.chapter === 2 && 'Chapter 2: Pre-Listening Case Board'}
                        {gameState.chapter === 3 && `Chapter 3: ${gameState.major} Wing Investigation`}
                        {gameState.chapter === 4 && 'Chapter 4: The Quiet Library Podcast'}
                        {gameState.chapter === 5 && 'Chapter 5: Writing Room Exposition'}
                        {gameState.chapter >= 6 && 'Chapter 6: Auditorium Debate with Rafa'}
                      </h4>
                    </div>

                    <button
                      onClick={() => transitionToScene('chapter_activity')}
                      className="py-1.5 px-3 rounded-xl bg-[#FFF1B8] hover:bg-[#ffe894] active:scale-95 border-2 border-[#3B3355] text-xs font-heading font-extrabold text-[#3B3355] shadow-sm"
                    >
                      Play Activity →
                    </button>
                  </div>

                  {/* 2D Interactive Map */}
                  <GameCanvas
                    currentChapter={gameState.chapter}
                    playerMajor={gameState.major}
                    onInteractNPC={handleInteractNPC}
                    onSelectWing={handleSelectWing}
                    onEnterChapterScene={handleEnterChapterScene}
                    onMovingChange={setIsPlayerMoving}
                  />
                </div>
              ) : (
                /* CHAPTER ACTIVITY COMPONENT */
                <div className="flex-1 flex flex-col justify-between">
                  {/* Back to Courtyard Map button */}
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => transitionToScene('map')}
                      className="py-1 px-3 rounded-xl bg-white/80 hover:bg-white border-2 border-[#3B3355] text-xs font-bold text-[#3B3355] shadow-sm flex items-center gap-1"
                    >
                      <span>← Back to Courtyard Map</span>
                    </button>
                    <span className="text-xs font-bold text-white/80">
                      Ch. {gameState.chapter} / 6
                    </span>
                  </div>

                  {/* Chapter-specific view */}
                  {gameState.chapter === 1 && (
                    <Chapter1Courtyard onComplete={handleChapter1Complete} />
                  )}
                  {gameState.chapter === 2 && (
                    <Chapter2PreListening
                      speechRate={gameState.speechRate}
                      onComplete={handleChapter2Complete}
                    />
                  )}
                  {gameState.chapter === 3 && gameState.major && (
                    <Chapter3Wings
                      playerMajor={gameState.major}
                      speechRate={gameState.speechRate}
                      onComplete={handleChapter3Complete}
                    />
                  )}
                  {gameState.chapter === 4 && (
                    <Chapter4Library
                      speechRate={gameState.speechRate}
                      onComplete={handleChapter4Complete}
                    />
                  )}
                  {gameState.chapter === 5 && (
                    <Chapter5WritingRoom onComplete={handleChapter5Complete} />
                  )}
                  {gameState.chapter >= 6 && (
                    <Chapter6Auditorium
                      gameState={gameState}
                      onDebateScoreCalculated={handleDebateScore}
                      onRestartGame={handleRestartGame}
                    />
                  )}
                </div>
              )}
            </main>

            {/* Active Dialogue Overlay */}
            {activeDialogue && (
              <DialogueBox
                speakerName={activeDialogue.speaker}
                speakerRole={activeDialogue.speakerRole}
                npcId={activeDialogue.npcId}
                gender={
                  activeDialogue.npcId === 'mia' || activeDialogue.npcId === 'cashier_dewi'
                    ? 'female'
                    : 'male'
                }
                expression={activeDialogue.avatarExpression}
                text={activeDialogue.text}
                speechRate={gameState.speechRate}
                choices={activeDialogue.choices}
                onAdvance={() => setActiveDialogue(null)}
                onClose={() => setActiveDialogue(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
