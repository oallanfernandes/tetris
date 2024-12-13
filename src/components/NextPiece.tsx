import React from 'react';
import { TETROMINOS } from '../constants/tetrominos';
import { TetrominoType } from '../types/tetris';

interface NextPieceProps {
  piece: TetrominoType;
}

const NextPiece: React.FC<NextPieceProps> = ({ piece }) => {
  const tetromino = TETROMINOS[piece];

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white text-center mb-2">Next Piece</h3>
      <div className="grid gap-px">
        {tetromino.shape.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={`w-5 h-5 border border-gray-700 ${
                  cell ? 'bg-cyan-500' : 'bg-gray-900'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextPiece;