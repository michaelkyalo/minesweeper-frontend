import React, { useEffect, useState } from "react";
import { getGameState } from "../utils/api";

function GamePage() {
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getGameState()
      .then((data) => setGameState(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!gameState) return <div>Loading game...</div>;

  return (
    <div>
      <h2>Minesweeper Game</h2>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
    </div>
  );
}

export default GamePage;
