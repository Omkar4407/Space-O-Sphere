export interface Planet {
  id: string;
  name: string;
  type: 'terrestrial' | 'gas giant' | 'ice giant';
  distanceFromSun: number; // in AU
  diameter: number; // in km
  mass: number; // Earth = 1
  gravity: number; // Earth = 1
  dayLength: number; // in Earth hours
  yearLength: number; // in Earth days
  temperature: {
    min: number;
    max: number;
    average: number;
  }; // in Celsius
  atmosphere: {
    composition: string[];
    pressure: number; // Earth = 1
  };
  moons: number;
  color: string;
  habitabilityScore: number; // 0-100
  funFacts: string[];
  image: string;
}

export const planets: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'terrestrial',
    distanceFromSun: 0.39,
    diameter: 4879,
    mass: 0.055,
    gravity: 0.378,
    dayLength: 1408,
    yearLength: 88,
    temperature: { min: -173, max: 427, average: 167 },
    atmosphere: { composition: ['Oxygen', 'Sodium', 'Hydrogen'], pressure: 0.000000001 },
    moons: 0,
    color: '#8C6239',
    habitabilityScore: 5,
    funFacts: [
      'Mercury has the most eccentric orbit of all planets',
      'A day on Mercury is longer than its year',
      'Mercury has water ice at its poles'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mercury_in_color_-_Prockter07-edit.jpg/1200px-Mercury_in_color_-_Prockter07-edit.jpg',
    texture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mercury_in_color_-_Prockter07-edit.jpg/1200px-Mercury_in_color_-_Prockter07-edit.jpg'
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'terrestrial',
    distanceFromSun: 0.72,
    diameter: 12104,
    mass: 0.815,
    gravity: 0.907,
    dayLength: 5832,
    yearLength: 225,
    temperature: { min: 450, max: 470, average: 462 },
    atmosphere: { composition: ['Carbon Dioxide', 'Nitrogen'], pressure: 92 },
    moons: 0,
    color: '#FFA500',
    habitabilityScore: 2,
    funFacts: [
      'Venus rotates backward compared to most planets',
      'Venus is the hottest planet in our solar system',
      'It rains sulfuric acid on Venus'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/1200px-Venus-real_color.jpg',
    texture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/1200px-Venus-real_color.jpg'
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'terrestrial',
    distanceFromSun: 1.0,
    diameter: 12756,
    mass: 1.0,
    gravity: 1.0,
    dayLength: 24,
    yearLength: 365,
    temperature: { min: -89, max: 58, average: 15 },
    atmosphere: { composition: ['Nitrogen', 'Oxygen', 'Argon'], pressure: 1 },
    moons: 1,
    color: '#4A90E2',
    habitabilityScore: 100,
    funFacts: [
      'Earth is the only known planet with life',
      '71% of Earth\'s surface is covered by water',
      'Earth\'s magnetic field protects us from solar radiation'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1200px-The_Earth_seen_from_Apollo_17.jpg',
    texture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1200px-The_Earth_seen_from_Apollo_17.jpg'
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'terrestrial',
    distanceFromSun: 1.52,
    diameter: 6792,
    mass: 0.107,
    gravity: 0.377,
    dayLength: 24.7,
    yearLength: 687,
    temperature: { min: -87, max: -5, average: -65 },
    atmosphere: { composition: ['Carbon Dioxide', 'Nitrogen', 'Argon'], pressure: 0.006 },
    moons: 2,
    color: '#CD5C5C',
    habitabilityScore: 25,
    funFacts: [
      'Mars has the largest volcano in the solar system',
      'Mars has seasons similar to Earth',
      'Evidence suggests Mars once had liquid water'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/1200px-OSIRIS_Mars_true_color.jpg',
    texture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/1200px-OSIRIS_Mars_true_color.jpg'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'gas giant',
    distanceFromSun: 5.2,
    diameter: 142984,
    mass: 317.8,
    gravity: 2.36,
    dayLength: 9.9,
    yearLength: 4333,
    temperature: { min: -145, max: -108, average: -110 },
    atmosphere: { composition: ['Hydrogen', 'Helium'], pressure: 0 },
    moons: 95,
    color: '#D2691E',
    habitabilityScore: 0,
    funFacts: [
      'Jupiter is the largest planet in our solar system',
      'Jupiter acts as a cosmic vacuum cleaner',
      'The Great Red Spot is a storm larger than Earth'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/1200px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
    texture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/1200px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'gas giant',
    distanceFromSun: 9.5,
    diameter: 120536,
    mass: 95.2,
    gravity: 0.916,
    dayLength: 10.7,
    yearLength: 10759,
    temperature: { min: -178, max: -139, average: -140 },
    atmosphere: { composition: ['Hydrogen', 'Helium'], pressure: 0 },
    moons: 146,
    color: '#FAD5A5',
    habitabilityScore: 0,
    funFacts: [
      'Saturn has spectacular rings made of ice and rock',
      'Saturn would float in water if there was a bathtub big enough',
      'Saturn has more moons than any other planet'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/1200px-Saturn_during_Equinox.jpg',
    texture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/1200px-Saturn_during_Equinox.jpg'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'ice giant',
    distanceFromSun: 19.2,
    diameter: 51118,
    mass: 14.5,
    gravity: 0.889,
    dayLength: 17.2,
    yearLength: 30687,
    temperature: { min: -224, max: -197, average: -195 },
    atmosphere: { composition: ['Hydrogen', 'Helium', 'Methane'], pressure: 0 },
    moons: 27,
    color: '#4FD0E7',
    habitabilityScore: 0,
    funFacts: [
      'Uranus rotates on its side',
      'Uranus has faint rings discovered in 1977',
      'A day on Uranus lasts 17 hours'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Uranus2.jpg/1200px-Uranus2.jpg',
    texture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Uranus2.jpg/1200px-Uranus2.jpg'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'ice giant',
    distanceFromSun: 30.1,
    diameter: 49528,
    mass: 17.1,
    gravity: 1.13,
    dayLength: 16.1,
    yearLength: 60190,
    temperature: { min: -218, max: -200, average: -200 },
    atmosphere: { composition: ['Hydrogen', 'Helium', 'Methane'], pressure: 0 },
    moons: 16,
    color: '#4169E1',
    habitabilityScore: 0,
    funFacts: [
      'Neptune has the strongest winds in the solar system',
      'Neptune was discovered through mathematical predictions',
      'One year on Neptune equals 165 Earth years'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/1200px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg',
    texture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/1200px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg'
  }
];

export const getHabitabilityColor = (score: number): string => {
  if (score >= 80) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  if (score >= 20) return 'text-orange-400';
  return 'text-red-400';
};

export const getHabitabilityLabel = (score: number): string => {
  if (score >= 80) return 'Highly Habitable';
  if (score >= 50) return 'Potentially Habitable';
  if (score >= 20) return 'Marginal Habitability';
  return 'Not Habitable';
};