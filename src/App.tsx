import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Make from './pages/Make/Make';
import Board from './pages/Board/Board';
import './App.css';

function App() {
  return (
    <Router>
      <div className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/make" element={<Make />} />
          <Route path="/board" element={<Board />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
