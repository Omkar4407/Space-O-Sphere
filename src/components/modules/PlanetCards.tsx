import React, { useState, useMemo } from 'react';
import { planets, getHabitabilityColor, getHabitabilityLabel, Planet } from '../../data/planets';
import { Search, Filter, SortAsc, SortDesc, Info, Thermometer, Globe, Moon, Zap } from 'lucide-react';

const PlanetCards: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  // Filter and sort planets
  const filteredAndSortedPlanets = useMemo(() => {
    let filtered = planets.filter(planet => {
      const matchesSearch = planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           planet.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || planet.type === selectedType;
      return matchesSearch && matchesType;
    });

    // Sort planets
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'distance':
          aValue = a.distanceFromSun;
          bValue = b.distanceFromSun;
          break;
        case 'size':
          aValue = a.diameter;
          bValue = b.diameter;
          break;
        case 'mass':
          aValue = a.mass;
          bValue = b.mass;
          break;
        case 'habitability':
          aValue = a.habitabilityScore;
          bValue = b.habitabilityScore;
          break;
        case 'moons':
          aValue = a.moons;
          bValue = b.moons;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, selectedType, sortBy, sortOrder]);

  const planetTypes = ['all', 'terrestrial', 'gas giant', 'ice giant'];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'terrestrial': return 'bg-orange-500';
      case 'gas giant': return 'bg-yellow-500';
      case 'ice giant': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Solar System Planets</h1>
          <p className="text-gray-300 text-lg">Explore the planets of our solar system</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search planets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                {planetTypes.map(type => (
                  <option key={type} value={type} className="bg-gray-700">
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="name" className="bg-gray-700">Name</option>
                <option value="distance" className="bg-gray-700">Distance</option>
                <option value="size" className="bg-gray-700">Size</option>
                <option value="mass" className="bg-gray-700">Mass</option>
                <option value="habitability" className="bg-gray-700">Habitability</option>
                <option value="moons" className="bg-gray-700">Moons</option>
              </select>
            </div>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-600/50 transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>

        {/* Planet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedPlanets.map((planet) => (
            <div
              key={planet.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-blue-500"
              onClick={() => setSelectedPlanet(planet)}
            >
              {/* Planet Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={planet.image}
                  alt={planet.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QbGFuZXQgSW1hZ2U8L3RleHQ+PC9zdmc+';
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(planet.type)}`}>
                    {planet.type}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getHabitabilityColor(planet.habitabilityScore)} bg-gray-900/80`}>
                    {planet.habitabilityScore}/100
                  </span>
                </div>
              </div>

              {/* Planet Info */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{planet.name}</h3>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>{formatNumber(planet.diameter)} km diameter</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>{planet.distanceFromSun} AU from Sun</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-purple-400" />
                    <span>{planet.moons} moon{planet.moons !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-400" />
                    <span>{planet.temperature.average}°C avg</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-400">
                    Habitability: <span className={getHabitabilityColor(planet.habitabilityScore)}>
                      {getHabitabilityLabel(planet.habitabilityScore)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Count */}
        <div className="mt-8 text-center text-gray-400">
          Showing {filteredAndSortedPlanets.length} of {planets.length} planets
        </div>

        {/* Planet Detail Modal */}
        {selectedPlanet && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800/95 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-white">{selectedPlanet.name}</h2>
                  <button
                    onClick={() => setSelectedPlanet(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Planet Image */}
                  <div className="relative">
                    <img
                      src={selectedPlanet.image}
                      alt={selectedPlanet.name}
                      className="w-full rounded-lg"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getTypeColor(selectedPlanet.type)}`}>
                        {selectedPlanet.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getHabitabilityColor(selectedPlanet.habitabilityScore)} bg-gray-900/80`}>
                        {getHabitabilityLabel(selectedPlanet.habitabilityScore)}
                      </span>
                    </div>
                  </div>

                  {/* Planet Details */}
                  <div className="space-y-6">
                    {/* Basic Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="text-gray-400 text-sm font-semibold">Distance from Sun</h4>
                        <p className="text-white text-lg font-bold">{selectedPlanet.distanceFromSun} AU</p>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="text-gray-400 text-sm font-semibold">Diameter</h4>
                        <p className="text-white text-lg font-bold">{formatNumber(selectedPlanet.diameter)} km</p>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="text-gray-400 text-sm font-semibold">Mass</h4>
                        <p className="text-white text-lg font-bold">{selectedPlanet.mass} × Earth</p>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="text-gray-400 text-sm font-semibold">Gravity</h4>
                        <p className="text-white text-lg font-bold">{selectedPlanet.gravity} × Earth</p>
                      </div>
                    </div>

                    {/* Time and Temperature */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="text-gray-400 text-sm font-semibold">Day Length</h4>
                        <p className="text-white text-lg font-bold">{selectedPlanet.dayLength} hours</p>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="text-gray-400 text-sm font-semibold">Year Length</h4>
                        <p className="text-white text-lg font-bold">{selectedPlanet.yearLength} Earth days</p>
                      </div>
                    </div>

                    {/* Temperature Range */}
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-gray-400 text-sm font-semibold mb-2">Temperature Range</h4>
                      <div className="flex justify-between text-white">
                        <span>Min: {selectedPlanet.temperature.min}°C</span>
                        <span>Avg: {selectedPlanet.temperature.average}°C</span>
                        <span>Max: {selectedPlanet.temperature.max}°C</span>
                      </div>
                    </div>

                    {/* Atmosphere */}
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-gray-400 text-sm font-semibold mb-2">Atmosphere</h4>
                      <p className="text-white mb-2">Pressure: {selectedPlanet.atmosphere.pressure} × Earth</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedPlanet.atmosphere.composition.map((gas, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                            {gas}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Fun Facts */}
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-gray-400 text-sm font-semibold mb-2">Fun Facts</h4>
                      <ul className="space-y-1">
                        {selectedPlanet.funFacts.map((fact, index) => (
                          <li key={index} className="text-white text-sm flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanetCards;
