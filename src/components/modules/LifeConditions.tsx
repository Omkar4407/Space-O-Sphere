import React, { useState } from 'react';
import { planets, getHabitabilityColor, getHabitabilityLabel } from '../../data/planets';
import { Thermometer, Wind, Droplets, Zap, Shield, AlertTriangle } from 'lucide-react';

const LifeConditions = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(planets[2]); // Start with Earth

  const getConditionLevel = (value: number, thresholds: number[]) => {
    if (value <= thresholds[0]) return { level: 'optimal', color: 'text-green-400', bg: 'bg-green-500' };
    if (value <= thresholds[1]) return { level: 'good', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    if (value <= thresholds[2]) return { level: 'challenging', color: 'text-orange-400', bg: 'bg-orange-500' };
    return { level: 'extreme', color: 'text-red-400', bg: 'bg-red-500' };
  };

  const temperatureCondition = getConditionLevel(
    Math.abs(selectedPlanet.temperature.average),
    [30, 60, 100]
  );

  const atmosphereCondition = getConditionLevel(
    selectedPlanet.atmosphere.pressure,
    [1.5, 5, 50]
  );

  const gravityCondition = getConditionLevel(
    Math.abs(selectedPlanet.gravity - 1),
    [0.3, 0.7, 2]
  );

  const radiationLevel = selectedPlanet.distanceFromSun < 1 ? 'high' : 
                        selectedPlanet.distanceFromSun > 5 ? 'low' : 'moderate';

  const factors = [
    {
      icon: Thermometer,
      title: 'Temperature',
      value: `${selectedPlanet.temperature.average}°C`,
      condition: temperatureCondition,
      details: `Range: ${selectedPlanet.temperature.min}°C to ${selectedPlanet.temperature.max}°C`
    },
    {
      icon: Wind,
      title: 'Atmospheric Pressure',
      value: `${selectedPlanet.atmosphere.pressure}x Earth`,
      condition: atmosphereCondition,
      details: `Main components: ${selectedPlanet.atmosphere.composition.slice(0, 2).join(', ')}`
    },
    {
      icon: Zap,
      title: 'Gravity',
      value: `${selectedPlanet.gravity}x Earth`,
      condition: gravityCondition,
      details: `Surface gravity affects human physiology and equipment design`
    },
    {
      icon: Shield,
      title: 'Radiation Level',
      value: radiationLevel.charAt(0).toUpperCase() + radiationLevel.slice(1),
      condition: radiationLevel === 'moderate' ? 
        { level: 'good', color: 'text-green-400', bg: 'bg-green-500' } :
        { level: 'challenging', color: 'text-orange-400', bg: 'bg-orange-500' },
      details: `Based on distance from Sun (${selectedPlanet.distanceFromSun} AU)`
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Life Conditions Analysis
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Analyze habitability and environmental conditions across our solar system
          </p>
        </div>

        {/* Planet Selection */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Select Planet for Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {planets.map((planet) => (
                <button
                  key={planet.id}
                  onClick={() => setSelectedPlanet(planet)}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    selectedPlanet.id === planet.id
                      ? 'bg-blue-600/20 border-2 border-blue-400/50 transform scale-105'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: planet.color }}
                  />
                  <p className="text-white text-sm font-medium">{planet.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Habitability Overview */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Habitability Assessment: {selectedPlanet.name}</h2>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getHabitabilityColor(selectedPlanet.habitabilityScore)}`}>
                  {selectedPlanet.habitabilityScore}/100
                </div>
                <div className={`text-sm ${getHabitabilityColor(selectedPlanet.habitabilityScore)}`}>
                  {getHabitabilityLabel(selectedPlanet.habitabilityScore)}
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${
                  selectedPlanet.habitabilityScore >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                  selectedPlanet.habitabilityScore >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                  selectedPlanet.habitabilityScore >= 20 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                  'bg-gradient-to-r from-red-400 to-red-500'
                }`}
                style={{ width: `${selectedPlanet.habitabilityScore}%` }}
              />
            </div>

            <p className="text-gray-300">
              {selectedPlanet.habitabilityScore >= 80 ? 
                'Excellent conditions for sustaining life with minimal technological intervention.' :
              selectedPlanet.habitabilityScore >= 50 ?
                'Moderate habitability with significant technological support required.' :
              selectedPlanet.habitabilityScore >= 20 ?
                'Challenging conditions requiring advanced life support systems.' :
                'Extremely hostile environment unsuitable for human habitation without extensive protection.'
              }
            </p>
          </div>
        </div>

        {/* Environmental Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {factors.map((factor, index) => {
            const Icon = factor.icon;
            return (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${factor.condition.bg}/20 mr-3`}>
                    <Icon className={`w-6 h-6 ${factor.condition.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{factor.title}</h3>
                    <p className={`text-sm ${factor.condition.color} capitalize`}>{factor.condition.level}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-2xl font-bold text-white">{factor.value}</p>
                </div>
                
                <p className="text-gray-400 text-sm">{factor.details}</p>
              </div>
            );
          })}
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Atmospheric Composition */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Wind className="w-5 h-5 mr-2 text-blue-400" />
              Atmospheric Composition
            </h3>
            <div className="space-y-3">
              {selectedPlanet.atmosphere.composition.map((gas, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300">{gas}</span>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-gray-700 rounded-full mr-2">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                        style={{ width: `${Math.max(10, 100 / (index + 1))}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-sm w-12">
                      {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Trace'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-black/20 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="text-white font-medium">Pressure:</span> {selectedPlanet.atmosphere.pressure}x Earth atmospheric pressure
              </p>
            </div>
          </div>

          {/* Survival Challenges */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
              Survival Challenges
            </h3>
            
            <div className="space-y-4">
              {selectedPlanet.temperature.average < -50 && (
                <div className="flex items-start p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
                  <Thermometer className="w-4 h-4 text-blue-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium text-sm">Extreme Cold</p>
                    <p className="text-gray-300 text-xs">Advanced heating systems required</p>
                  </div>
                </div>
              )}
              
              {selectedPlanet.temperature.average > 100 && (
                <div className="flex items-start p-3 bg-red-500/10 rounded-lg border border-red-400/20">
                  <Thermometer className="w-4 h-4 text-red-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-medium text-sm">Extreme Heat</p>
                    <p className="text-gray-300 text-xs">Advanced cooling systems required</p>
                  </div>
                </div>
              )}
              
              {selectedPlanet.atmosphere.pressure < 0.1 && (
                <div className="flex items-start p-3 bg-orange-500/10 rounded-lg border border-orange-400/20">
                  <Wind className="w-4 h-4 text-orange-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-orange-400 font-medium text-sm">Low Atmospheric Pressure</p>
                    <p className="text-gray-300 text-xs">Pressurized environment essential</p>
                  </div>
                </div>
              )}
              
              {selectedPlanet.gravity > 2 && (
                <div className="flex items-start p-3 bg-purple-500/10 rounded-lg border border-purple-400/20">
                  <Zap className="w-4 h-4 text-purple-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-purple-400 font-medium text-sm">High Gravity</p>
                    <p className="text-gray-300 text-xs">Significant physical stress on human body</p>
                  </div>
                </div>
              )}
              
              {selectedPlanet.gravity < 0.3 && (
                <div className="flex items-start p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                  <Zap className="w-4 h-4 text-yellow-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium text-sm">Low Gravity</p>
                    <p className="text-gray-300 text-xs">Long-term health effects on bone and muscle</p>
                  </div>
                </div>
              )}
            </div>

            {selectedPlanet.habitabilityScore === 100 && (
              <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-400/20">
                <p className="text-green-400 font-medium text-sm flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Optimal Conditions
                </p>
                <p className="text-gray-300 text-xs mt-1">Perfect environment for human life</p>
              </div>
            )}
          </div>
        </div>

        {/* Resource Availability */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Droplets className="w-5 h-5 mr-2 text-blue-400" />
            Resource Availability & Life Support Requirements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                selectedPlanet.id === 'earth' || selectedPlanet.id === 'mars' ? 'bg-blue-500/20' : 'bg-red-500/20'
              }`}>
                <Droplets className={`w-8 h-8 ${
                  selectedPlanet.id === 'earth' || selectedPlanet.id === 'mars' ? 'text-blue-400' : 'text-red-400'
                }`} />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Water</h4>
              <p className={`text-sm ${
                selectedPlanet.id === 'earth' ? 'text-green-400' :
                selectedPlanet.id === 'mars' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {selectedPlanet.id === 'earth' ? 'Abundant liquid water' :
                 selectedPlanet.id === 'mars' ? 'Water ice at poles' :
                 'No known water sources'}
              </p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                selectedPlanet.atmosphere.composition.includes('Oxygen') ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <Wind className={`w-8 h-8 ${
                  selectedPlanet.atmosphere.composition.includes('Oxygen') ? 'text-green-400' : 'text-red-400'
                }`} />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Breathable Air</h4>
              <p className={`text-sm ${
                selectedPlanet.atmosphere.composition.includes('Oxygen') && selectedPlanet.id === 'earth' ? 'text-green-400' : 'text-red-400'
              }`}>
                {selectedPlanet.atmosphere.composition.includes('Oxygen') && selectedPlanet.id === 'earth' ? 
                  'Breathable atmosphere' : 'Artificial atmosphere required'}
              </p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                selectedPlanet.habitabilityScore > 20 ? 'bg-yellow-500/20' : 'bg-red-500/20'
              }`}>
                <Shield className={`w-8 h-8 ${
                  selectedPlanet.habitabilityScore > 20 ? 'text-yellow-400' : 'text-red-400'
                }`} />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Shelter</h4>
              <p className={`text-sm ${
                selectedPlanet.id === 'earth' ? 'text-green-400' :
                selectedPlanet.habitabilityScore > 20 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {selectedPlanet.id === 'earth' ? 'Natural shelter possible' :
                 selectedPlanet.habitabilityScore > 20 ? 'Pressurized habitats needed' :
                 'Advanced life support essential'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeConditions;