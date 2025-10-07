import React, { useEffect, useState } from "react";
import Board from "./gamescreen/Board"; // Make sure Board.jsx exists
import { useNavigate } from "react-router-dom";

function GameScreen({ onLogout }) {
  const [gameId, setGameId] = useState(null);
  const [rows] = useState(10);
  const [cols] = useState(10);
  const [mines] = useState(12);
  const [status, setStatus] = useState("");
  const [grid, setGrid] = useState([]);
  const navigate = useNavigate();

  // ================== Initialize new game ==================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const startGame = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/games/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ rows, cols, mines }),
        });
        const data = await res.json();
        if (res.ok) {
          setGameId(data.id); // assuming backend returns id of the game
          setGrid(data.grid);  // backend should return the initial grid
          setStatus("Game started!");
        } else {
          setStatus(data.message || "Failed to start game");
        }
      } catch (err) {
        console.error(err);
        setStatus("Server error. Could not start game.");
      }
    };

    startGame();
  }, [navigate, rows, cols, mines]);

  // ================== Handle cell click ==================
  const handleCellClick = async (row, col) => {
    if (!gameId) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/games/reveal/${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ row, col }),
      });

      const data = await res.json();

      if (res.ok) {
        setGrid(data.grid); // backend returns updated grid
        if (data.status === "lost") setStatus("💥 Game Over!");
        if (data.status === "won") setStatus("🎉 You Win!");
      } else {
        console.error("Reveal failed:", data.message);
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error during cell reveal.");
    }
  };

  // ================== Finish game (optional) ==================
  const finish = async (result, duration) => {
    if (!gameId) return;

    const token = localStorage.getItem("token");
    try {
      await fetch("http://127.0.0.1:5000/api/games/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ game_id: gameId, result, duration }),
      });
      console.log("Game result sent to backend");
    } catch (err) {
      console.error("Error sending game result:", err);
    }
  };

  return (
    <div>
      <h2>Minesweeper</h2>
      <div>Status: {status}</div>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          onLogout && onLogout();
        }}
      >
        Logout
      </button>
      <Board grid={grid} handleCellClick={handleCellClick} />
    </div>
  );
}

export default GameScreen;
