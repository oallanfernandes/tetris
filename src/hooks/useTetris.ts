import { useState, useCallback, useEffect } from 'react';
import { TETROMINOS, BOARD_WIDTH, BOARD_HEIGHT, INITIAL_SPEED } from '../constants/tetrominos';
import { TetrominoType, GameState } from '../types/tetris';

const createEmptyBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

const getRandomTetromino = (): TetrominoType => {
  const pieces = Object.keys(TETROMINOS) as TetrominoType[];
  return pieces[Math.floor(Math.random() * pieces.length)];
};

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: {
      shape: TETROMINOS.I.shape,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      color: TETROMINOS.I.color
    },
    nextPiece: getRandomTetromino(),
    score: 0,
    level: 1,
    gameOver: false,
    isPaused: false
  });

  const checkCollision = useCallback(
    (shape: number[][], position: { x: number; y: number }) => {
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const newX = position.x + x;
            const newY = position.y + y;
            if (
              newX < 0 ||
              newX >= BOARD_WIDTH ||
              newY >= BOARD_HEIGHT ||
              (newY >= 0 && gameState.board[newY][newX])
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    [gameState.board]
  );

  const rotatePiece = useCallback(() => {
    if (gameState.isPaused || gameState.gameOver) return;

    const rotatedShape = gameState.currentPiece.shape[0].map((_, i) =>
      gameState.currentPiece.shape.map(row => row[i]).reverse()
    );

    if (!checkCollision(rotatedShape, gameState.currentPiece.position)) {
      setGameState(prev => ({
        ...prev,
        currentPiece: {
          ...prev.currentPiece,
          shape: rotatedShape
        }
      }));
    }
  }, [gameState, checkCollision]);

  const movePiece = useCallback(
    (direction: 'left' | 'right' | 'down') => {
      if (gameState.isPaused || gameState.gameOver) return;

      const newPosition = {
        x: gameState.currentPiece.position.x + (direction === 'left' ? -1 : direction === 'right' ? 1 : 0),
        y: gameState.currentPiece.position.y + (direction === 'down' ? 1 : 0)
      };

      if (!checkCollision(gameState.currentPiece.shape, newPosition)) {
        setGameState(prev => ({
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: newPosition
          }
        }));
      } else if (direction === 'down') {
        lockPiece();
      }
    },
    [gameState, checkCollision]
  );

  const lockPiece = useCallback(() => {
    const newBoard = [...gameState.board];
    const { shape, position, color } = gameState.currentPiece;

    // Lock the piece
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          if (position.y + y < 0) {
            setGameState(prev => ({ ...prev, gameOver: true }));
            return;
          }
          newBoard[position.y + y][position.x + x] = 1;
        }
      }
    }

    // Check for completed lines
    let clearedLines = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
        clearedLines++;
      }
    }

    // Update score
    const points = [0, 100, 300, 500, 800][clearedLines];
    const newScore = gameState.score + points;
    const newLevel = Math.floor(newScore / 1000) + 1;

    const nextTetromino = getRandomTetromino();
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      score: newScore,
      level: newLevel,
      currentPiece: {
        shape: TETROMINOS[prev.nextPiece].shape,
        position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
        color: TETROMINOS[prev.nextPiece].color
      },
      nextPiece: nextTetromino
    }));
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: {
        shape: TETROMINOS[getRandomTetromino()].shape,
        position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
        color: TETROMINOS.I.color
      },
      nextPiece: getRandomTetromino(),
      score: 0,
      level: 1,
      gameOver: false,
      isPaused: false
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    const speed = Math.max(INITIAL_SPEED - (gameState.level - 1) * 100, 100);
    const dropTimer = setInterval(() => {
      movePiece('down');
    }, speed);

    return () => clearInterval(dropTimer);
  }, [gameState.level, gameState.isPaused, gameState.gameOver, movePiece]);

  return {
    gameState,
    movePiece,
    rotatePiece,
    resetGame,
    togglePause
  };
};