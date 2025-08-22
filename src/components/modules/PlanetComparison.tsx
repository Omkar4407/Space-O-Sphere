import React, { useState } from 'react';
import { planets } from '../../data/planets';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Globe, ArrowLeftRight, BarChart3, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PlanetComparison = () => {
  const [planet1, setPlanet1] = useState(planets[2]); // Earth
  const [planet2, setPlanet2] = useState(planets[3]); // Mars

  const swapPlanets = () => {
    const temp = planet1;
    setPlanet1(planet2);
    setPlanet2(temp);
  };

  const comparisonData = [
    { label: 'Diameter (km)', planet1: planet1.diameter, planet2: planet2.diameter, unit: 'km' },
    { label: 'Mass (Earth = 1)', planet1: planet1.mass, planet2: planet2.mass, unit: 'x Earth' },
    { label: 'Gravity (Earth = 1)', planet1: planet1.gravity, planet2: planet2.gravity, unit: 'x Earth' },
    { label: 'Distance from Sun (AU)', planet1: planet1.distanceFromSun, planet2: planet2.distanceFromSun, unit: 'AU' },
    { label: 'Year Length (days)', planet1: planet1.yearLength, planet2: planet2.yearLength, unit: 'days' },
    { label: 'Average Temperature (°C)', planet1: planet1.temperature.average, planet2: planet2.temperature.average, unit: '°C' },
    { label: 'Atmospheric Pressure', planet1: planet1.atmosphere.pressure, planet2: planet2.atmosphere.pressure, unit: 'x Earth' },
    { label: 'Number of Moons', planet1: planet1.moons, planet2: planet2.moons, unit: 'moons' },
    { label: 'Habitability Score', planet1: planet1.habitabilityScore, planet2: planet2.habitabilityScore, unit: '/100' }
  ];

  const barChartData = {
    labels: comparisonData.slice(0, 6).map(item => item.label.split(' ')[0]),
    datasets: [
      {
        label: planet1.name,
        data: comparisonData.slice(0, 6).map(item => item.planet1),
        backgroundColor: `${planet1.color}66`,
        borderColor: planet1.color,
        borderWidth: 2,
      },
      {
        label: planet2.name,
        data: comparisonData.slice(0, 6).map(item => item.planet2),
        backgroundColor: `${planet2.color}66`,
        borderColor: planet2.color,
        borderWidth: 2,
      },
    ],
  };

  const radarChartData = {
    labels: ['Size', 'Mass', 'Gravity', 'Temperature', 'Habitability'],
    datasets: [
      {
        label: planet1.name,
        data: [
          (planet1.diameter / 142984) * 100, // Normalized to Jupiter's diameter
          planet1.mass * 10,
          planet1.gravity * 20,
          Math.max(0, (planet1.temperature.average + 200) / 4), // Normalized temperature
          planet1.habitabilityScore
        ],
        backgroundColor: `${planet1.color}33`,
        borderColor: planet1.color,
        borderWidth: 2,
      },
      {
        label: planet2.name,
        data: [
          (planet2.diameter / 142984) * 100,
          planet2.mass * 10,
          planet2.gravity * 20,
          Math.max(0, (planet2.temperature.average + 200) / 4),
          planet2.habitabilityScore
        ],
        backgroundColor: `${planet2.color}33`,
        borderColor: planet2.color,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff'
      }
    },
    scales: {
      y: {
        ticks: {
          color: '#ffffff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#ffffff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      }
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.2)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)'
        },
        pointLabels: {
          color: '#ffffff'
        },
        ticks: {
          color: '#ffffff',
          backdropColor: 'transparent'
        }
      }
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Planet Comparison Tool
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Compare any two planets side by side with detailed metrics and visualizations
          </p>
        </div>

        {/* Planet Selection */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Planet 1 */}
            <div>
              <label className="block text-white font-semibold mb-3">Select First Planet</label>
              <select
                value={planet1.id}
                onChange={(e) => setPlanet1(planets.find(p => p.id === e.target.value) || planets[0])}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400/50"
              >
                {planets.map((planet) => (
                  <option key={planet.id} value={planet.id} className="bg-slate-900">
                    {planet.name}
                  </option>
                ))}
              </select>
              
              <div className="mt-4 text-center">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center"
                >
                  <img
                    src={planet1.image}
                    alt={planet1.name}
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling!.classList.remove('hidden');
                    }}
                  />
                  <div
                    className="w-20 h-20 rounded-full hidden items-center justify-center"
                    style={{ backgroundColor: planet1.color }}
                  >
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">{planet1.name}</h3>
                <p className="text-gray-400 text-sm capitalize">{planet1.type}</p>
              </div>
            </div>

            {/* Swap Button */}
            <div className="text-center">
              <button
                onClick={swapPlanets}
                className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors group"
                title="Swap Planets"
              >
                <ArrowLeftRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Planet 2 */}
            <div>
              <label className="block text-white font-semibold mb-3">Select Second Planet</label>
              <select
                value={planet2.id}
                onChange={(e) => setPlanet2(planets.find(p => p.id === e.target.value) || planets[0])}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400/50"
              >
                {planets.map((planet) => (
                  <option key={planet.id} value={planet.id} className="bg-slate-900">
                    {planet.name}
                  </option>
                ))}
              </select>
              
              <div className="mt-4 text-center">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center"
                >
                  <img
                    src={planet2.image}
                    alt={planet2.name}
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling!.classList.remove('hidden');
                    }}
                  />
                  <div
                    className="w-20 h-20 rounded-full hidden items-center justify-center"
                    style={{ backgroundColor: planet2.color }}
                  >
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">{planet2.name}</h3>
                <p className="text-gray-400 text-sm capitalize">{planet2.type}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-orange-400" />
            Detailed Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white font-semibold">Property</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">{planet1.name}</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">{planet2.name}</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">Winner</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => {
                  let winner = '';
                  let winnerColor = 'text-gray-400';
                  
                  // Determine winner based on context
                  if (row.label.includes('Habitability')) {
                    winner = row.planet1 > row.planet2 ? planet1.name : row.planet2 > row.planet1 ? planet2.name : 'Tie';
                    winnerColor = row.planet1 > row.planet2 ? 'text-green-400' : row.planet2 > row.planet1 ? 'text-green-400' : 'text-gray-400';
                  } else if (row.label.includes('Temperature')) {
                    const temp1Diff = Math.abs(row.planet1 - 15); // Distance from Earth's average
                    const temp2Diff = Math.abs(row.planet2 - 15);
                    winner = temp1Diff < temp2Diff ? planet1.name : temp2Diff < temp1Diff ? planet2.name : 'Tie';
                    winnerColor = temp1Diff < temp2Diff ? 'text-green-400' : temp2Diff < temp1Diff ? 'text-green-400' : 'text-gray-400';
                  } else {
                    winner = row.planet1 > row.planet2 ? planet1.name : row.planet2 > row.planet1 ? planet2.name : 'Tie';
                    winnerColor = 'text-yellow-400';
                  }

                  return (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-gray-300">{row.label}</td>
                      <td className="py-3 px-4 text-center text-white font-medium">
                        {typeof row.planet1 === 'number' ? row.planet1.toLocaleString() : row.planet1} {row.unit}
                      </td>
                      <td className="py-3 px-4 text-center text-white font-medium">
                        {typeof row.planet2 === 'number' ? row.planet2.toLocaleString() : row.planet2} {row.unit}
                      </td>
                      <td className={`py-3 px-4 text-center font-medium ${winnerColor}`}>
                        {winner}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-orange-400" />
              Physical Properties Comparison
            </h3>
            <div className="h-80">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-pink-400" />
              Overall Characteristics
            </h3>
            <div className="h-80">
              <Radar data={radarChartData} options={radarOptions} />
            </div>
          </div>
        </div>

        {/* Quick Facts Comparison */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[planet1, planet2].map((planet, index) => (
            <div key={planet.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="flex items-center mb-4">
                <div
                  className="w-12 h-12 rounded-full mr-4 flex items-center justify-center"
                >
                  <img
                    src={planet.image}
                    alt={planet.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling!.classList.remove('hidden');
                    }}
                  />
                  <div
                    className="w-12 h-12 rounded-full hidden items-center justify-center"
                    style={{ backgroundColor: planet.color }}
                  >
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{planet.name}</h3>
                  <p className="text-gray-400 capitalize">{planet.type}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white">Fun Facts:</h4>
                {planet.funFacts.slice(0, 2).map((fact, factIndex) => (
                  <p key={factIndex} className="text-gray-300 text-sm flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    {fact}
                  </p>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Day Length:</span>
                    <p className="text-white font-medium">{planet.dayLength}h</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Main Atmosphere:</span>
                    <p className="text-white font-medium">{planet.atmosphere.composition[0]}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanetComparison;