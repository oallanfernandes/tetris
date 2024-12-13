import React from 'react';

interface GameBoardProps {
  board: number[][];
  currentPiece: {
    shape: number[][];
    position: { x: number; y: number };
    color: string;
  };
}

const GameBoard: React.FC<GameBoardProps> = ({ board, currentPiece }) => {
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    const { shape, position } = currentPiece;

    // Add current piece to display board
    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell && position.y + y >= 0) {
          displayBoard[position.y + y][position.x + x] = cell;
        }
      });
    });

    return displayBoard;
  };

  return (
    <div className="grid gap-px bg-gray-800 p-1 rounded-lg">
      {renderBoard().map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`w-6 h-6 border border-gray-700 ${
                cell ? 'bg-cyan-500' : 'bg-gray-900'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;