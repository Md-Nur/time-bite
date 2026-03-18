export type PuzzleType = 'number_pattern' | 'odd_one_out' | 'quick_math' | 'logic_riddle';

export interface Puzzle {
  id: string;
  type: PuzzleType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const PUZZLES: Puzzle[] = [
  {
    id: "p1",
    type: "number_pattern",
    question: "2, 6, 7, 21, 22, ?",
    options: ["23", "44", "66", "24"],
    correctIndex: 2,
    explanation: "Multiply by 3, then add 1 alternately. 2x3=6, 6+1=7, 7x3=21, 21+1=22, 22x3=66."
  },
  {
    id: "p2",
    type: "odd_one_out",
    question: "Which one does not belong? Apple, Banana, Carrot, Mango",
    options: ["Apple", "Mango", "Carrot", "Banana"],
    correctIndex: 2,
    explanation: "Carrot is a vegetable, while the others are fruits."
  },
  {
    id: "p3",
    type: "quick_math",
    question: "15 + (6 × 3) = ?",
    options: ["63", "33", "45", "18"],
    correctIndex: 1,
    explanation: "According to order of operations (PEMDAS), multiply first: 6 × 3 = 18. Then add: 15 + 18 = 33."
  },
  {
    id: "p4",
    type: "logic_riddle",
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    options: ["A Cloud", "An Echo", "A Ghost", "A Bell"],
    correctIndex: 1,
    explanation: "An echo is a sound reflection, so it 'speaks' and 'hears' without physical body parts."
  },
  {
    id: "p5",
    type: "number_pattern",
    question: "1, 4, 9, 16, ?",
    options: ["20", "24", "25", "30"],
    correctIndex: 2,
    explanation: "These are perfect squares: 1², 2², 3², 4², so the next is 5² = 25."
  },
  {
    id: "p6",
    type: "logic_riddle",
    question: "What has keys but can't open locks?",
    options: ["A Keyboard", "A Map", "A Treasure", "A Door"],
    correctIndex: 0,
    explanation: "A keyboard (or piano) has keys but cannot open physical locks."
  },
  {
    id: "p7",
    type: "quick_math",
    question: "What is 20% of 150?",
    options: ["15", "25", "30", "50"],
    correctIndex: 2,
    explanation: "10% of 150 is 15. So 20% is 15 × 2 = 30."
  },
  {
    id: "p8",
    type: "odd_one_out",
    question: "Which of these is not a programming language?",
    options: ["Python", "Java", "Cobra", "Anaconda"],
    correctIndex: 3,
    explanation: "Anaconda is a distribution of Python and R, not a programming language itself."
  },
  {
    id: "p9",
    type: "number_pattern",
    question: "3, 6, 12, 24, ?",
    options: ["36", "48", "30", "42"],
    correctIndex: 1,
    explanation: "Each number is multiplied by 2 to get the next one. 24 x 2 = 48."
  },
  {
    id: "p10",
    type: "logic_riddle",
    question: "The more of this there is, the less you see. What is it?",
    options: ["Light", "Fog", "Darkness", "Time"],
    correctIndex: 2,
    explanation: "When there is more darkness, you can see less."
  }
];

export const getDailyPuzzle = (): Puzzle => {
  // A simple mechanism to rotate daily puzzles based on the current date
  const now = new Date();
  // Get days since epoch
  const days = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  return PUZZLES[days % PUZZLES.length];
};

export const getRandomPuzzle = (excludeId?: string): Puzzle => {
  const available = excludeId ? PUZZLES.filter(p => p.id !== excludeId) : PUZZLES;
  return available[Math.floor(Math.random() * available.length)];
};
