import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Rocket, Brain, BarChart3, Info, MapPin } from 'lucide-react';

const Home = () => {
  const modules = [
    {
      icon: Globe,
      title: '3D Planet Viewer',
      description: 'Explore interactive 3D models of planets in our solar system',
      path: '/planet-viewer',
      color: 'malhar-gradient-1'
    },
    {
      icon: Info,
      title: 'Planet Information',
      description: 'Discover detailed facts and data about each planet',
      path: '/planet-cards',
      color: 'malhar-gradient-2'
    },
    {
      icon: MapPin,
      title: 'Life Conditions',
      description: 'Analyze habitability and environmental conditions',
      path: '/life-conditions',
      color: 'malhar-gradient-3'
    },
    {
      icon: Rocket,
      title: 'Space Missions',
      description: 'Timeline of human space exploration achievements',
      path: '/space-missions',
      color: 'malhar-gradient-4'
    },
    {
      icon: Brain,
      title: 'Space Quiz',
      description: 'Test your knowledge of astronomy and space exploration',
      path: '/quiz',
      color: 'malhar-gradient-5'
    },
    {
      icon: BarChart3,
      title: 'Planet Comparison',
      description: 'Compare planets side by side with detailed metrics',
      path: '/comparison',
      color: 'malhar-gradient-6'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Space-O-Sphere
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Your gateway to interactive space exploration and planetary discovery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/planet-viewer"
              className="px-8 py-4 malhar-gradient-1 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Exploring
            </Link>
            <Link
              to="/quiz"
              className="px-8 py-4 border-2 border-orange-400 text-orange-400 font-semibold rounded-lg hover:bg-orange-400 hover:text-white transform hover:scale-105 transition-all duration-300"
            >
              Take Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Explore the Universe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link
                  key={index}
                  to={module.path}
                  className="group block p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                >
                  <div className={`inline-flex p-3 rounded-lg ${module.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {module.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            Educational Space Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 malhar-gradient-1 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Interactive 3D</h3>
              <p className="text-gray-400">Immersive 3D planet models with realistic textures and animations</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 malhar-gradient-2 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Educational Content</h3>
              <p className="text-gray-400">Comprehensive data and engaging quizzes to enhance learning</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 malhar-gradient-3 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Data Visualization</h3>
              <p className="text-gray-400">Beautiful charts and comparisons to understand planetary data</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
