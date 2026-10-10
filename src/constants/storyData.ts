import { MajorType, NPCId, VocabBadge, CaseBoardPart } from '../types/game';

export const LOGO_URL =
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgzWdtCjCcX2chJuhLX_26N5MmkVK-1SkyO7kgXznQQJPQa6_TB_EJzD1WWpztg7yX9RBRE7rGn0t2Z3FdG06mwwT6pQix8t6vnlcOBm_EgGl9z0jeJemJkppP0KIIjkXGksQvaCLh2dz-gOF6a2H213VQBL6Am8Elhmd76OOnphogk-EoTTbkYbg0TQJhv/s512/34690.png';

export const WEB3FORMS_ACCESS_KEY = '0559a2dd-ca30-480b-a96f-221c0b7679b7';

export const COLORS = {
  peach: '#FFD6C9',
  mint: '#CDEFD9',
  sky: '#CFE6FF',
  lilac: '#E3D4FF',
  butter: '#FFF1B8',
  ink: '#3B3355',
};

export interface MajorInfo {
  id: MajorType;
  title: string;
  tagline: string;
  wingName: string;
  specialty: string;
  icon: string;
  color: string;
}

export const MAJORS: Record<MajorType, MajorInfo> = {
  AKL: {
    id: 'AKL',
    title: 'AKL (Accounting & Finance)',
    tagline: 'Precision, Ledgers, & Digital Audits',
    wingName: 'East Wing • Mini-Bank & Canteen Hub',
    specialty: 'Cashless payment tracking & digital ledger verification',
    icon: '📊',
    color: '#CFE6FF', // sky
  },
  TO: {
    id: 'TO',
    title: 'TO (Automotive Engineering)',
    tagline: 'Engines, EV Diagnostics, & Systems',
    wingName: 'North Wing • Hybrid Workshop & Test Lab',
    specialty: 'OBD-II vehicle diagnostics & smart test bench logs',
    icon: '🔧',
    color: '#FFD6C9', // peach
  },
  TJKT: {
    id: 'TJKT',
    title: 'TJKT (Network & Telecom)',
    tagline: 'Cybersecurity, Routers, & Packet Logs',
    wingName: 'West Wing • Cyber Server & Network Ops',
    specialty: 'Firewall rules, packet tracing & device identifier logs',
    icon: '🌐',
    color: '#CDEFD9', // mint
  },
};

export const INITIAL_VOCAB_BADGES: VocabBadge[] = [
  {
    id: 'allow',
    word: 'allow',
    definition: 'To permit or authorize an action or policy.',
    unlocked: false,
    chapterLearned: 2,
  },
  {
    id: 'rules',
    word: 'rules',
    definition: 'Authoritative regulations governing conduct and procedures.',
    unlocked: false,
    chapterLearned: 1,
  },
  {
    id: 'banning',
    word: 'banning',
    definition: 'Officially or legally prohibiting something entirely.',
    unlocked: false,
    chapterLearned: 1,
  },
  {
    id: 'responsibility',
    word: 'responsibility',
    definition: 'Being accountable and making ethical, sound decisions.',
    unlocked: false,
    chapterLearned: 2,
  },
  {
    id: 'policy',
    word: 'policy',
    definition: 'A deliberate system of principles guiding decisions.',
    unlocked: false,
    chapterLearned: 3,
  },
  {
    id: 'evidence',
    word: 'evidence',
    definition: 'Factual data and verifiable proof supporting an assertion.',
    unlocked: false,
    chapterLearned: 3,
  },
  {
    id: 'crucial',
    word: 'crucial',
    definition: 'Of paramount importance; decisive or critical.',
    unlocked: false,
    chapterLearned: 4,
  },
  {
    id: 'mandatory',
    word: 'mandatory',
    definition: 'Required by law or policy; compulsory, not optional.',
    unlocked: false,
    chapterLearned: 4,
  },
];

export const INITIAL_CASE_BOARD: CaseBoardPart[] = [
  {
    id: 'issue',
    title: 'The Issue',
    snippet: 'School smartphone usage controversy before Muhiba Talks.',
    unlocked: false,
  },
  {
    id: 'thesis',
    title: 'The Thesis',
    snippet: 'Schools should allow smartphones under disciplined educational rules.',
    unlocked: false,
  },
  {
    id: 'argument1',
    title: 'Argument 1',
    snippet: 'Smartphones provide instant vocational manuals and research access.',
    connective: 'Firstly',
    unlocked: false,
  },
  {
    id: 'argument2',
    title: 'Argument 2',
    snippet: 'Cultivating digital ethics prepares students for professional industry.',
    connective: 'Secondly',
    unlocked: false,
  },
  {
    id: 'reiteration',
    title: 'Reiteration',
    snippet: 'Banning is counterproductive; structured regulation yields success.',
    connective: 'In conclusion',
    unlocked: false,
  },
];

// CHAPTER 1: Fact vs Opinion items for card flicking
export interface FactOpinionCard {
  id: number;
  statement: string;
  isFact: boolean;
  explanation: string;
}

export const CH1_FACT_OPINION_CARDS: FactOpinionCard[] = [
  {
    id: 1,
    statement: 'The school Wi-Fi logged 520 phone connections during lunch break yesterday.',
    isFact: true,
    explanation: 'Verifiable timestamped network logs constitute an empirical FACT.',
  },
  {
    id: 2,
    statement: 'Phones completely ruin every student’s ability to concentrate in class.',
    isFact: false,
    explanation: 'Absolute generalizations without statistical proof are subjective OPINIONS.',
  },
  {
    id: 3,
    statement: 'SMK Muhammadiyah Bawang purchased 40 digital tablets for the library last month.',
    isFact: true,
    explanation: 'Documented purchase orders and institutional assets are verifiable FACTS.',
  },
  {
    id: 4,
    statement: 'Banning all electronic devices is the most progressive educational policy.',
    isFact: false,
    explanation: 'Value judgements such as "most progressive" are subjective OPINIONS.',
  },
  {
    id: 5,
    statement: 'The Student Code of Conduct Section 4 outlines acceptable gadget guidelines.',
    isFact: true,
    explanation: 'Official written legal school documentation is a demonstrable FACT.',
  },
  {
    id: 6,
    statement: 'Vocational students who carry smartphones always perform worse on practical exams.',
    isFact: false,
    explanation: 'Sweeping claims without causal evidence represent biased OPINIONS.',
  },
];

// CHAPTER 2: Pre-Listening Excerpt Sentences & Quick Checks
export interface PreListeningItem {
  id: number;
  section: 'issue' | 'thesis' | 'argument1' | 'argument2' | 'reiteration';
  title: string;
  sentence: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const CH2_PRE_LISTENING_ITEMS: PreListeningItem[] = [
  {
    id: 1,
    section: 'issue',
    title: '1. The Issue',
    sentence:
      'Recently, whether high school students should be allowed to use mobile phones during school hours has sparked fierce controversy across campuses.',
    question: 'How is this introductory sentence functioning in an analytical exposition?',
    options: [
      'It presents the controversial topic/issue to the audience.',
      'It commands all students to surrender their devices immediately.',
      'It expresses a personal apology for poor school behavior.',
    ],
    correctIndex: 0,
    explanation: 'The opening introduces the context and background of the controversy.',
  },
  {
    id: 2,
    section: 'thesis',
    title: '2. The Thesis',
    sentence:
      'I firmly believe that schools should allow smartphones under clear, structured educational rules rather than imposing a blanket ban.',
    question: 'What is the speaker’s clear stance (thesis) regarding phone policies?',
    options: [
      'Ban all smartphones with zero exceptions.',
      'Allow smartphones with transparent, strict educational rules.',
      'Sell all smartphones to fund school construction.',
    ],
    correctIndex: 1,
    explanation: 'The thesis unequivocally advocates regulated usage over an absolute ban.',
  },
  {
    id: 3,
    section: 'argument1',
    title: '3. Argument 1',
    sentence:
      'Firstly, smartphones grant vocational students immediate access to interactive technical manuals, schematics, and industry databases.',
    question: 'Which connective transition signals this first point?',
    options: [
      'However, which signals a contrast.',
      'Firstly, which systematically introduces the primary argument.',
      'Suddenly, which signals an unexpected surprise.',
    ],
    correctIndex: 1,
    explanation: '"Firstly" organizes the exposition with sequential clarity.',
  },
  {
    id: 4,
    section: 'argument2',
    title: '4. Argument 2',
    sentence:
      'Secondly, nurturing digital responsibility within controlled classroom settings prepares adolescents for future vocational workplaces.',
    question: 'Is modern digital responsibility considered essential for workplaces here?',
    options: [
      'True: Controlled usage cultivates vital workplace accountability.',
      'False: Modern industries prohibit all digital communication entirely.',
      'Uncertain: The speaker thinks students should not enter workplaces.',
    ],
    correctIndex: 0,
    explanation: 'Digital responsibility matches actual industry expectations.',
  },
  {
    id: 5,
    section: 'reiteration',
    title: '5. Reiteration',
    sentence:
      'In conclusion, banning phones entirely is counterproductive; establishing clear educational policies empowers modern vocational learners.',
    question: 'Which concluding connective reinforces this final restatement?',
    options: [
      'In conclusion',
      'For example',
      'On the contrary',
    ],
    correctIndex: 0,
    explanation: '"In conclusion" signals the reaffirmation of the author’s stance.',
  },
];

// CHAPTER 3: Specialized Department Minigames & Clues
export interface WingChallenge {
  major: MajorType;
  title: string;
  npcName: string;
  npcRole: string;
  npcGender: 'male' | 'female';
  npcInitialDialogue: string;
  challengeInstructions: string;
  fragments: {
    id: string;
    title: string;
    snippet: string;
    icon: string;
  }[];
  connectiveKey: string;
  twistClue: string;
}

export const WING_CHALLENGES: Record<MajorType, WingChallenge> = {
  AKL: {
    major: 'AKL',
    title: 'Canteen Cashless Audit & POS Ledger Match',
    npcName: 'Bu Dewi',
    npcRole: 'Mini-Bank Cashier & Accounting Mentor',
    npcGender: 'female',
    npcInitialDialogue:
      'Welcome to the AKL Wing! Our cashless canteen system logged an unusual transaction during the power blip yesterday evening. Let’s audit the transaction ledger!',
    challengeInstructions:
      'Inspect 3 transaction slips. Flick the suspicious slip matching the exact 21:15 PM timestamp into the Audit Ledger slot to unlock the evidence!',
    fragments: [
      {
        id: 'akl_receipt',
        title: 'POS Receipt #4088',
        snippet: 'Spicy Tofu & Sweet Ice Tea purchased at 21:15 PM.',
        icon: '🧾',
      },
      {
        id: 'akl_ledger',
        title: 'Reconciled Audit Sheet',
        snippet: 'Zero cash discrepancies; payment sent from mobile e-wallet #0812-****-771.',
        icon: '📊',
      },
      {
        id: 'akl_cashier_note',
        title: 'Cashier Logbook Note',
        snippet: 'Buyer seemed frantic, frantically typing on their phone about class rumors.',
        icon: '📝',
      },
    ],
    connectiveKey: 'Firstly',
    twistClue:
      'Wait... E-wallet #0812-****-771 matches YOUR phone! You bought spicy tofu at 21:15 PM while sending a frustrated rant in the class group!',
  },
  TO: {
    major: 'TO',
    title: 'Hybrid Engine OBD-II Diagnostic Scan',
    npcName: 'Pak Joko',
    npcRole: 'Senior Automotive Workshop Master',
    npcGender: 'male',
    npcInitialDialogue:
      'G’day, technician! Our hybrid vehicle trainer test bench was left active after hours. Swipe the diagnostic scanner over the engine ECU to pull the stored freeze-frame records!',
    challengeInstructions:
      'Swipe the diagnostic probe across the engine harness to isolate the 3 DTC fault codes (P0A80, P0171, U0100) and unlock the test bench memory buffer!',
    fragments: [
      {
        id: 'to_dtc_scan',
        title: 'ECU Freeze-Frame Buffer',
        snippet: 'Diagnostic scan confirmed normal hybrid state; phone paired via Bluetooth.',
        icon: '⚡',
      },
      {
        id: 'to_audio_memo',
        title: 'Workshop Voice Recorder',
        snippet: 'Audio snippet: "Aargh, my battery died mid-quiz! Ban all phones forever haha!"',
        icon: '🎙️',
      },
      {
        id: 'to_bench_log',
        title: 'Test Bench Device Link',
        snippet: 'Bluetooth device paired: "Student Galaxy M12" logged at 21:14 PM.',
        icon: '🔧',
      },
    ],
    connectiveKey: 'Secondly',
    twistClue:
      'Hold on! "Student Galaxy M12" is YOUR phone model! That voice recorder snippet was you joking with classmates in the workshop right before lights out!',
  },
  TJKT: {
    major: 'TJKT',
    title: 'Network Lab Firewall & Packet Trace',
    npcName: 'Mas Dimas',
    npcRole: 'Cyber Lab & Infrastructure Admin',
    npcGender: 'male',
    npcInitialDialogue:
      'Hey network engineer! The school core switch flagged an anonymous broadcast broadcasted at 21:15 PM yesterday. Help me re-route the patch cables and filter rogue packets!',
    challengeInstructions:
      'Flick the colored patch cables to matching switch ports and swipe away 3 suspicious phishing spoof packets to trace the source device MAC address!',
    fragments: [
      {
        id: 'tjkt_packet',
        title: 'Core Switch Packet Header',
        snippet: 'Broadcast origin: AP-STUDENT-GUEST port 4, timestamp 21:15:02.',
        icon: '📡',
      },
      {
        id: 'tjkt_firewall',
        title: 'Firewall Device Identity',
        snippet: 'Source MAC Address: 7A:44:B2:91:FF — Hostname: "Student-Device-Main".',
        icon: '🛡️',
      },
      {
        id: 'tjkt_screenshot_trace',
        title: 'Cached Image Metadata',
        snippet: 'Image generated from screenshot of WhatsApp chat: "Ban all phones forever!".',
        icon: '🔍',
      },
    ],
    connectiveKey: 'Therefore',
    twistClue:
      'Check the MAC address table: 7A:44:B2:91:FF belongs to YOUR phone! The screenshot was taken from your text in the class group!',
  },
};

// CHAPTER 4: Library Podcast Transcript & Quiz
export const PODCAST_DATA = {
  title: 'Muhiba Talks Ep. 12: School Phone Policies: Ban or Regulate?',
  duration: '3 mins read / listen',
  speaker: 'Mr. Hendra & Student Voice',
  audioText: `Good afternoon, SMK Muhammadiyah Bawang students. Today on Muhiba Talks, we address the heated controversy: Should schools allow smartphones in class?
Many educators instinctively advocate for banning phones, arguing that digital notifications disrupt focus and encourage academic dishonesty. However, an outright prohibition ignores modern vocational realities.
Firstly, vocational students rely on smartphones for rapid technical research. Whether verifying wiring diagrams in the workshop, reviewing accounting spreadsheets, or configuring simulated server topologies, mobile devices are legitimate educational tools.
Secondly, rather than enforcing fear through bans, our core mission is teaching digital responsibility. Industry workplaces do not ban technology; they demand disciplined professional conduct. When students learn self-regulation under school rules, they build lifelong digital literacy.
In conclusion, an absolute ban is ineffective and outdated. Schools must establish clear, enforceable policies: active during technical lessons, docked during formal exams. An opinion without evidence solves nothing; structured regulation guarantees progress.`,
};

export interface LibraryQuestion {
  id: number;
  type: 'single' | 'complex' | 'matrix';
  prompt: string;
  points: number; // Sums to 25
  options?: string[];
  correctIndices?: number[];
  matrixRows?: {
    statement: string;
    isAgree: boolean;
  }[];
  explanation: string;
}

export const LIBRARY_QUESTIONS: LibraryQuestion[] = [
  {
    id: 1,
    type: 'single',
    prompt: 'What is the speaker’s central thesis in the podcast?',
    points: 5, // 10% of chapter scaled
    options: [
      'Schools must confiscate all electronic gadgets permanently.',
      'Schools should allow smartphones under clear educational regulations.',
      'Students should only communicate using handwritten paper notes.',
      'Teachers should be replaced by smartphone applications.',
    ],
    correctIndices: [1],
    explanation: 'The podcast explicitly advocates for regulated, educational usage over an outright ban.',
  },
  {
    id: 2,
    type: 'single',
    prompt: 'Why does the speaker argue that a total ban is counterproductive for vocational students?',
    points: 5, // 10% of chapter scaled
    options: [
      'Because phones are purely toys and entertainment tools.',
      'Because modern industry workplaces do not ban technology, but require digital competence.',
      'Because students will refuse to attend school without social media games.',
      'Because smartphones prevent all electrical power outages in school.',
    ],
    correctIndices: [1],
    explanation: 'Vocational training must mirror real workplace expectations of technology handling.',
  },
  {
    id: 3,
    type: 'complex',
    prompt: 'Which TWO arguments are explicitly highlighted in the podcast to support smartphone integration? (Select ALL that apply)',
    points: 5,
    options: [
      'Immediate access to digital manuals, schematics, and industry databases.',
      'Allowing students to play video games freely during theoretical lectures.',
      'Cultivating self-regulation and digital responsibility for the workplace.',
      'Eliminating the need for certified vocational school teachers.',
    ],
    correctIndices: [0, 2],
    explanation: 'The podcast emphasizes technical reference access and fostering workplace digital responsibility.',
  },
  {
    id: 4,
    type: 'complex',
    prompt: 'According to the policy proposed, what are TWO mandatory responsibilities students must observe? (Select ALL that apply)',
    points: 5,
    options: [
      'Docking or putting away phones during formal exams and evaluations.',
      'Sharing examination answer keys across social media chatrooms.',
      'Using devices actively for technical tasks and assigned vocational research.',
      'Trading hardware devices in the school courtyard during lessons.',
    ],
    correctIndices: [0, 2],
    explanation: 'Strict boundaries (docked in exams, active for assigned learning) ensure academic integrity.',
  },
  {
    id: 5,
    type: 'matrix',
    prompt: 'Evaluate whether the following three claims align (Agree) or conflict (Disagree) with the analytical exposition:',
    points: 5,
    matrixRows: [
      {
        statement: 'Claim A: Digital discipline is more valuable than an unenforceable absolute ban.',
        isAgree: true,
      },
      {
        statement: 'Claim B: Vocational training should completely isolate students from modern digital devices.',
        isAgree: false,
      },
      {
        statement: 'Claim C: Transparent school policies empower students to become responsible digital citizens.',
        isAgree: true,
      },
    ],
    explanation: 'The exposition favors policy transparency and digital ethics over outdated isolation.',
  },
];

// CHAPTER 5: Writing Room Slots & Blocks
export interface ExpositionBlock {
  id: string;
  type: 'thesis' | 'argument1' | 'argument2' | 'reiteration';
  connective: string;
  text: string;
}

export const EXPOSITION_BLOCKS: ExpositionBlock[] = [
  {
    id: 'block_thesis',
    type: 'thesis',
    connective: 'In my perspective',
    text: 'SMK Muhammadiyah Bawang should adopt a regulated smartphone policy rather than enforcing an absolute ban.',
  },
  {
    id: 'block_arg1',
    type: 'argument1',
    connective: 'Firstly',
    text: 'smartphones provide real-time access to technical blueprints, financial ledgers, and network diagnostic documentation.',
  },
  {
    id: 'block_arg2',
    type: 'argument2',
    connective: 'Secondly',
    text: 'learning digital discipline in school prepares students for modern workplace communication and ethical accountability.',
  },
  {
    id: 'block_reiteration',
    type: 'reiteration',
    connective: 'In conclusion',
    text: 'a total ban is counterproductive, whereas well-regulated gadget policies foster responsible, industry-ready graduates.',
  },
];

// CHAPTER 6: Debate Rounds against Rafa
export interface DebateRound {
  roundNumber: number;
  rafaClaim: string;
  rafaExpression: 'smug' | 'shocked';
  availableOpeners: string[];
  correctOpenerIndex: number;
  availableArguments: {
    id: string;
    text: string;
    isCorrect: boolean;
    counterReason: string;
  }[];
}

export const DEBATE_ROUNDS: DebateRound[] = [
  {
    roundNumber: 1,
    rafaClaim:
      'Phones are purely entertainment toys! No student ever learned anything productive from looking down at a glass screen!',
    rafaExpression: 'smug',
    availableOpeners: [
      'I strongly believe that this assumption ignores vocational facts.',
      'You are totally wrong and nobody likes your speech.',
      'Whatever you say, I don’t care about school rules.',
    ],
    correctOpenerIndex: 0,
    availableArguments: [
      {
        id: 'r1_arg1',
        text: 'Vocational students actively consult PDF service manuals, accounting spreadsheets, and network topology tools on their devices.',
        isCorrect: true,
        counterReason: 'Direct factual counter-example regarding vocational learning.',
      },
      {
        id: 'r1_arg2',
        text: 'Smartphones have nice ringtones, so students should listen to music anytime.',
        isCorrect: false,
        counterReason: 'Irrelevant emotional claim that does not prove academic utility.',
      },
      {
        id: 'r1_arg3',
        text: 'Everyone has an expensive phone, so banning them is simply unfair.',
        isCorrect: false,
        counterReason: 'Appeals to privilege rather than educational merit.',
      },
    ],
  },
  {
    roundNumber: 2,
    rafaClaim:
      'A total ban is the only clean solution! Teachers cannot waste time constantly monitoring forty phone screens in every room!',
    rafaExpression: 'smug',
    availableOpeners: [
      'I see your point about supervision, but proactive digital guidelines solve this far better.',
      'Teachers are too busy to care anyway, so let students do whatever.',
      'Nobody follows rules, so we shouldn’t create any rules.',
    ],
    correctOpenerIndex: 0,
    availableArguments: [
      {
        id: 'r2_arg1',
        text: 'Clear boundary policies—docking phones during exams and using them only on designated assignments—build self-regulation without total bans.',
        isCorrect: true,
        counterReason: 'Offers a structured, realistic policy alternative.',
      },
      {
        id: 'r2_arg2',
        text: 'Teachers should just buy forty more smartphones to watch students.',
        isCorrect: false,
        counterReason: 'Impractical and irrational suggestion.',
      },
      {
        id: 'r2_arg3',
        text: 'Screens are harmless anyway, so no supervision is required.',
        isCorrect: false,
        counterReason: 'Ignores valid teacher concerns over distractions.',
      },
    ],
  },
  {
    roundNumber: 3,
    rafaClaim:
      'Besides, look at the viral flyer! The announcement said "ALL PHONES BANNED STARTING TOMORROW!" The decision has already been made by an official whistleblower!',
    rafaExpression: 'smug',
    availableOpeners: [
      'The empirical evidence proves that flyer is nothing more than an unverified rumor!',
      'I made that flyer so I know it is completely true!',
      'Everyone on social media believes it, so it must be real.',
    ],
    correctOpenerIndex: 0,
    availableArguments: [
      {
        id: 'r3_arg1',
        text: 'Our forensic wing evidence—the 21:15 timestamp, device logs, and chat record—proves the flyer was fabricated from an out-of-context text message!',
        isCorrect: true,
        counterReason: 'The definitive empirical proof exposing the rumor origin!',
      },
      {
        id: 'r3_arg2',
        text: 'The flyer has a nice font, so it looks like it was printed by the principal.',
        isCorrect: false,
        counterReason: 'Superficial aesthetic detail rather than factual verification.',
      },
      {
        id: 'r3_arg3',
        text: 'Flyers on the school wall cannot be questioned by students.',
        isCorrect: false,
        counterReason: 'Blind acceptance of rumors without analytical exposition.',
      },
    ],
  },
];
