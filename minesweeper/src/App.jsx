import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import GameScreen from "./components/Gamescreen";
import Welcome from "./components/welcome";
function App() {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  const onLogin = () => {
    setIsLogged(true);
    navigate("/game");
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogged(false);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login onLogin={onLogin} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/game" element={<GameScreen onLogout={onLogout} />} />
    </Routes>
  );
}

// Single export at the bottom
export default App;
