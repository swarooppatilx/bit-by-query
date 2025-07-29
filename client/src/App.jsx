import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import LeaderBoard from "./LeaderBoard";
import CountDown from "./CountDown";
import NotFound from "./NotFound";
import Register from "./Register";
import Middleware from "./middleware";
import './App.css'

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const body = document.body;
    const heading = document.querySelector('h1');

    if (isDark) {
      body.classList.add('night-mode');
      heading && (heading.style.color = 'white');
    } else {
      body.classList.remove('night-mode');
      heading && (heading.style.color = 'black');
    }
  }, [isDark]);

  const handleClick = () => {
    setIsDark(prev => !prev);
  };

  return (
    <Router>
      {/* Toggle Button */}
      <button className="toggle" onClick={handleClick}>
        {isDark ? '🌤️ Daylight Mode' : '🌙 Eclipsed Mode'}
      </button>

      <Routes>
        <Route
          path="/"
          element={
            <Middleware>
              <Home />
            </Middleware>
          }
        />
        <Route
          path="/login"
          element={
            <Middleware>
              <Login />
            </Middleware>
          }
        />
        <Route
          path="/register"
          element={
            <Middleware>
              <Register />
            </Middleware>
          }
        />
        <Route
          path="/home"
          element={
            <Middleware>
              <Home />
            </Middleware>
          }
        />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/countdown" element={<CountDown />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
