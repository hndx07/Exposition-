export type MajorType = 'AKL' | 'TO' | 'TJKT';

export type NPCId = 
  | 'mr_hendra' 
  | 'rafa' 
  | 'mia' 
  | 'pak_satpam' 
  | 'cashier_dewi' 
  | 'mechanic_joko' 
  | 'admin_dimas';

export interface DialogueChoice {
  text: string;
  nextNodeId?: string;
  points?: number;
  action?: string;
  onSelect?: () => void;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  speakerRole: string;
  npcId: NPCId | 'player';
  avatarExpression: 'neutral' | 'happy' | 'shocked' | 'smug' | 'thinking' | 'serious';
  text: string;
  isAudioAvailable?: boolean;
  choices?: DialogueChoice[];
}

export interface ClueItem {
  id: string;
  title: string;
  description: string;
  major: MajorType | 'ALL';
  discovered: boolean;
  icon: string;
  chapter: number;
  details?: string;
}

export interface CaseBoardPart {
  id: 'issue' | 'thesis' | 'argument1' | 'argument2' | 'reiteration';
  title: string;
  snippet: string;
  unlocked: boolean;
  connective?: string;
}

export type VocabBadgeId = 
  | 'allow' 
  | 'rules' 
  | 'banning' 
  | 'responsibility' 
  | 'policy' 
  | 'evidence' 
  | 'crucial' 
  | 'mandatory';

export interface VocabBadge {
  id: VocabBadgeId;
  word: string;
  definition: string;
  unlocked: boolean;
  chapterLearned: number;
}

export interface PlayerPosition {
  x: number;
  y: number;
}

export interface GameState {
  playerName: string;
  className: string;
  major: MajorType | null;
  chapter: number; // 0 = Title/Setup/Prologue, 1-6 chapters, 7 = Ending/Submission
  score: number;
  chapterScores: {
    ch1: number;
    ch2: number;
    ch3: number;
    ch4: number;
    ch5: number;
    ch6: number;
  };
  clues: ClueItem[];
  badges: VocabBadge[];
  caseBoard: CaseBoardPart[];
  hasSeenTutorial: boolean;
  soundEnabled: boolean;
  speechRate: number; // 0.8 or 1.0
  isSubmitted: boolean;
  submissionDate?: string;
}
