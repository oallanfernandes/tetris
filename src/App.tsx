import React, { useEffect } from 'react';
import { Play, Pause, RotateCw, RefreshCw } from 'lucide-react';
import { useTetris } from './hooks/useTetris';
import GameBoard from './components/GameBoard';
import NextPiece from './components/NextPiece';

function App() {
  const { gameState, movePiece, rotatePiece, resetGame, togglePause } = useTetris();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          movePiece('left');
          break;
        case 'ArrowRight':
          movePiece('right');
          break;
        case 'ArrowDown':
          movePiece('down');
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case ' ':
          togglePause();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, rotatePiece, togglePause]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="flex gap-8">
          <div>
            <GameBoard
              board={gameState.board}
              currentPiece={gameState.currentPiece}
            />
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">Tetris</h2>
              <div className="mb-4">
                <p className="text-lg">Score: {gameState.score}</p>
                <p className="text-lg">Level: {gameState.level}</p>
              </div>
              
              <NextPiece piece={gameState.nextPiece} />
              
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={togglePause}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                  disabled={gameState.gameOver}
                >
                  {gameState.isPaused ? (
                    <>
                      <Play size={20} /> Resume
                    </>
                  ) : (
                    <>
                      <Pause size={20} /> Pause
                    </>
                  )}
                </button>
                
                <button
                  onClick={resetGame}
                  className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full"
                >
                  <RefreshCw size={20} /> New Game
                </button>
              </div>
            </div>

            <div className="text-gray-400">
              <h3 className="font-semibold mb-2">Controls:</h3>
              <ul className="space-y-1">
                <li>← → : Move</li>
                <li>↓ : Soft Drop</li>
                <li>↑ : Rotate</li>
                <li>Space : Pause</li>
              </ul>
            </div>
          </div>
        </div>

        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Game Over!</h2>
              <p className="text-gray-300 mb-4">Final Score: {gameState.score}</p>
              <button
                onClick={resetGame}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                <RotateCw size={20} /> Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;