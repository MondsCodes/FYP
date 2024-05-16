import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import Leaderboard from "./pages/Leaderboard";
import Help from "./pages/Help";
import Rewards from "./components/Rewards";
import Stats from "./pages/Stats";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/map" element={<Map />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/Help" element={<Help />} />
      </Routes>
    </div>
  );
}

export default App;
