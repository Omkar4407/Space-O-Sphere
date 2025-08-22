import React, { useState } from 'react';
import { missions } from '../../data/missions';
import { Calendar, MapPin, Rocket, Target, Trophy, AlertCircle, Search } from 'lucide-react';

const SpaceMissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedOutcome, setSelectedOutcome] = useState('all');
  const [selectedDecade, setSelectedDecade] = useState('all');

  const countries = ['all', ...new Set(missions.map(mission => mission.country))];
  const outcomes = ['all', 'success', 'partial', 'failure'];
  const decades = ['all', '1960s', '1970s', '1990s', '2000s', '2010s', '2020s'];

  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.objective.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || mission.country === selectedCountry;
    const matchesOutcome = selectedOutcome === 'all' || mission.outcome === selectedOutcome;
    const missionDecade = Math.floor(mission.year / 10) * 10;
    const matchesDecade = selectedDecade === 'all' || selectedDecade === `${missionDecade}s`;
    
    return matchesSearch && matchesCountry && matchesOutcome && matchesDecade;
  });

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success': return <Trophy className="w-5 h-5 text-green-400" />;
      case 'partial': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'failure': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Rocket className="w-5 h-5 text-gray-400" />;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'partial': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'failure': return 'bg-red-500/20 text-red-400 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  // Sort missions by year for timeline
  const sortedMissions = [...filteredMissions].sort((a, b) => b.year - a.year);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Space Missions Timeline
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore humanity's greatest achievements in space exploration across decades
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search missions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50"
              />
            </div>
            
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400/50"
            >
              {countries.map(country => (
                <option key={country} value={country} className="bg-slate-900">
                  {country === 'all' ? 'All Countries' : country}
                </option>
              ))}
            </select>

            <select
              value={selectedOutcome}
              onChange={(e) => setSelectedOutcome(e.target.value)}
              className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400/50"
            >
              {outcomes.map(outcome => (
                <option key={outcome} value={outcome} className="bg-slate-900">
                  {outcome === 'all' ? 'All Outcomes' : outcome.charAt(0).toUpperCase() + outcome.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedDecade}
              onChange={(e) => setSelectedDecade(e.target.value)}
              className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400/50"
            >
              {decades.map(decade => (
                <option key={decade} value={decade} className="bg-slate-900">
                  {decade === 'all' ? 'All Decades' : decade}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-center px-4 py-3 bg-blue-600/10 rounded-lg border border-blue-400/20">
              <span className="text-blue-400 font-medium">{filteredMissions.length} missions</span>
            </div>
          </div>
        </div>

        {/* Missions Timeline */}
        <div className="space-y-6">
          {sortedMissions.map((mission, index) => (
            <div
              key={mission.id}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transform hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Mission Image */}
                  <div className="lg:w-1/3">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                      <Rocket className="w-16 h-16 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Mission Details */}
                  <div className="lg:w-2/3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {mission.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {mission.year}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {mission.target}
                          </div>
                          <div className="flex items-center">
                            <span className="w-4 h-4 mr-1 text-xs font-bold bg-blue-600 text-white rounded-full flex items-center justify-center">
                              {mission.country.split('')[0]}
                            </span>
                            {mission.country}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full border flex items-center space-x-2 ${getOutcomeColor(mission.outcome)}`}>
                        {getOutcomeIcon(mission.outcome)}
                        <span className="text-sm font-medium capitalize">{mission.outcome}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                          <Target className="w-4 h-4 mr-2 text-blue-400" />
                          Objective
                        </h4>
                        <p className="text-gray-300 text-sm">{mission.objective}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                          <Rocket className="w-4 h-4 mr-2 text-purple-400" />
                          Spacecraft
                        </h4>
                        <p className="text-gray-300 text-sm">{mission.spacecraft}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Mission Description</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{mission.description}</p>
                    </div>

                    {/* Mission Stats */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex flex-wrap gap-4 text-xs">
                        <div className="bg-white/5 px-3 py-1 rounded-full">
                          <span className="text-gray-400">Year:</span>
                          <span className="text-white ml-1 font-medium">{mission.year}</span>
                        </div>
                        <div className="bg-white/5 px-3 py-1 rounded-full">
                          <span className="text-gray-400">Decades ago:</span>
                          <span className="text-white ml-1 font-medium">{Math.floor((2024 - mission.year) / 10)}</span>
                        </div>
                        <div className="bg-white/5 px-3 py-1 rounded-full">
                          <span className="text-gray-400">Target:</span>
                          <span className="text-white ml-1 font-medium">{mission.target}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMissions.length === 0 && (
          <div className="text-center py-16">
            <Rocket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No missions found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Mission Statistics */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h3 className="text-2xl font-bold text-white mb-6">Mission Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {missions.filter(m => m.outcome === 'success').length}
              </div>
              <p className="text-gray-300">Successful</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {missions.filter(m => m.outcome === 'partial').length}
              </div>
              <p className="text-gray-300">Partial Success</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {missions.filter(m => m.outcome === 'failure').length}
              </div>
              <p className="text-gray-300">Failed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {new Set(missions.map(m => m.target)).size}
              </div>
              <p className="text-gray-300">Destinations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceMissions;