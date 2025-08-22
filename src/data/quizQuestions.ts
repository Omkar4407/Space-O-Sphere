export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Mercury', 'Earth', 'Mars'],
    correctAnswer: 1,
    explanation: 'Mercury is the closest planet to the Sun, orbiting at an average distance of about 58 million kilometers.',
    difficulty: 'easy'
  },
  {
    id: 'q2',
    question: 'Which planet is known as the "Red Planet"?',
    options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
    correctAnswer: 2,
    explanation: 'Mars is called the Red Planet due to iron oxide (rust) on its surface, giving it a reddish appearance.',
    difficulty: 'easy'
  },
  {
    id: 'q3',
    question: 'How many moons does Jupiter have?',
    options: ['67', '79', '95', '146'],
    correctAnswer: 2,
    explanation: 'Jupiter has 95 confirmed moons, making it one of the planets with the most natural satellites.',
    difficulty: 'medium'
  },
  {
    id: 'q4',
    question: 'Which planet rotates on its side?',
    options: ['Neptune', 'Uranus', 'Saturn', 'Venus'],
    correctAnswer: 1,
    explanation: 'Uranus rotates on its side with an axial tilt of about 98 degrees, likely due to a collision in its past.',
    difficulty: 'medium'
  },
  {
    id: 'q5',
    question: 'What is the Great Red Spot on Jupiter?',
    options: ['A mountain', 'A storm', 'A crater', 'A moon'],
    correctAnswer: 1,
    explanation: 'The Great Red Spot is a giant storm on Jupiter that has been raging for hundreds of years and is larger than Earth.',
    difficulty: 'medium'
  },
  {
    id: 'q6',
    question: 'Which planet has the most eccentric orbit?',
    options: ['Pluto', 'Mercury', 'Mars', 'Neptune'],
    correctAnswer: 1,
    explanation: 'Mercury has the most eccentric orbit among the planets, meaning its orbit is the most oval-shaped.',
    difficulty: 'hard'
  },
  {
    id: 'q7',
    question: 'What is the composition of Saturn\'s rings?',
    options: ['Rock and metal', 'Ice and rock', 'Gas and dust', 'Pure ice'],
    correctAnswer: 1,
    explanation: 'Saturn\'s rings are primarily composed of ice particles and rocky debris, ranging from tiny grains to house-sized chunks.',
    difficulty: 'hard'
  },
  {
    id: 'q8',
    question: 'Which mission first landed humans on the Moon?',
    options: ['Apollo 10', 'Apollo 11', 'Apollo 12', 'Gemini 7'],
    correctAnswer: 1,
    explanation: 'Apollo 11 was the first mission to successfully land humans on the Moon on July 20, 1969.',
    difficulty: 'easy'
  },
  {
    id: 'q9',
    question: 'What causes Venus to be the hottest planet?',
    options: ['Distance from Sun', 'Greenhouse effect', 'Internal heat', 'Solar flares'],
    correctAnswer: 1,
    explanation: 'Venus is the hottest planet due to its extreme greenhouse effect caused by its thick carbon dioxide atmosphere.',
    difficulty: 'medium'
  },
  {
    id: 'q10',
    question: 'Which planet has the strongest winds in the solar system?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correctAnswer: 3,
    explanation: 'Neptune has the strongest winds in the solar system, reaching speeds of up to 2,100 km/h (1,300 mph).',
    difficulty: 'hard'
  }
];