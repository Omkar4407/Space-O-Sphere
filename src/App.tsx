import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import PlanetViewer from './components/modules/PlanetViewer';
import PlanetCards from './components/modules/PlanetCards';
import LifeConditions from './components/modules/LifeConditions';
import SpaceMissions from './components/modules/SpaceMissions';
import SpaceQuiz from './components/modules/SpaceQuiz';
import PlanetComparison from './components/modules/PlanetComparison';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <Navbar />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planet-viewer" element={<PlanetViewer />} />
            <Route path="/planet-cards" element={<PlanetCards />} />
            <Route path="/life-conditions" element={<LifeConditions />} />
            <Route path="/space-missions" element={<SpaceMissions />} />
            <Route path="/quiz" element={<SpaceQuiz />} />
            <Route path="/comparison" element={<PlanetComparison />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;