export interface Mission {
  id: string;
  name: string;
  country: string;
  year: number;
  target: string;
  objective: string;
  spacecraft: string;
  outcome: 'success' | 'partial' | 'failure';
  description: string;
  image: string;
}

export const missions: Mission[] = [
  {
    id: 'apollo11',
    name: 'Apollo 11',
    country: 'USA',
    year: 1969,
    target: 'Moon',
    objective: 'First crewed lunar landing',
    spacecraft: 'Saturn V / Apollo CSM / Lunar Module',
    outcome: 'success',
    description: 'Historic first human landing on the Moon with Neil Armstrong and Buzz Aldrin.',
    image: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg'
  },
  {
    id: 'voyager1',
    name: 'Voyager 1',
    country: 'USA',
    year: 1977,
    target: 'Outer Solar System',
    objective: 'Grand tour of outer planets',
    spacecraft: 'Voyager 1',
    outcome: 'success',
    description: 'Explored Jupiter and Saturn, now in interstellar space.',
    image: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg'
  },
  {
    id: 'mars-pathfinder',
    name: 'Mars Pathfinder',
    country: 'USA',
    year: 1996,
    target: 'Mars',
    objective: 'Mars surface exploration',
    spacecraft: 'Mars Pathfinder / Sojourner',
    outcome: 'success',
    description: 'First successful U.S. mission to Mars since Viking, deployed the first Mars rover.',
    image: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg'
  },
  {
    id: 'cassini',
    name: 'Cassini-Huygens',
    country: 'USA/ESA/Italy',
    year: 1997,
    target: 'Saturn',
    objective: 'Saturn system exploration',
    spacecraft: 'Cassini Orbiter / Huygens Probe',
    outcome: 'success',
    description: 'Comprehensive study of Saturn and its moons, including landing on Titan.',
    image: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg'
  },
  {
    id: 'curiosity',
    name: 'Mars Science Laboratory',
    country: 'USA',
    year: 2011,
    target: 'Mars',
    objective: 'Search for signs of past life',
    spacecraft: 'Curiosity Rover',
    outcome: 'success',
    description: 'Advanced rover studying Mars geology and climate, searching for signs of past life.',
    image: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg'
  },
  {
    id: 'new-horizons',
    name: 'New Horizons',
    country: 'USA',
    year: 2006,
    target: 'Pluto',
    objective: 'Pluto flyby mission',
    spacecraft: 'New Horizons',
    outcome: 'success',
    description: 'First mission to Pluto, providing detailed images and data of the dwarf planet.',
    image: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg'
  },
  {
    id: 'juno',
    name: 'Juno',
    country: 'USA',
    year: 2011,
    target: 'Jupiter',
    objective: 'Jupiter interior study',
    spacecraft: 'Juno Orbiter',
    outcome: 'success',
    description: 'Studying Jupiter\'s composition, gravity field, magnetic field, and polar magnetosphere.',
    image: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg'
  },
  {
    id: 'perseverance',
    name: 'Mars 2020',
    country: 'USA',
    year: 2020,
    target: 'Mars',
    objective: 'Search for ancient microbial life',
    spacecraft: 'Perseverance Rover / Ingenuity Helicopter',
    outcome: 'success',
    description: 'Advanced rover collecting samples and searching for signs of ancient life, with the first powered flight on another planet.',
    image: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg'
  }
];