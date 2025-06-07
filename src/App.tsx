import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Make from './pages/Make/Make';
import Explore from './pages/Explore/Explore';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/make" element={<Make />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
