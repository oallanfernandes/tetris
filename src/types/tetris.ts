export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type Tetromino = {
  shape: number[][];
  color: string;
};

export type GameState = {
  board: number[][];
  currentPiece: {
    shape: number[][];
    position: { x: number; y: number };
    color: string;
  };
  nextPiece: TetrominoType;
  score: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
};