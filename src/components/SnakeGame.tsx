import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 60;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: { x: number, y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (!isGameOver) setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const newHead = {
          x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#FF00FF';
    ctx.shadowBlur = Math.random() > 0.5 ? 20 : 5;
    ctx.shadowColor = '#FF00FF';
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      
      ctx.fillStyle = isHead ? '#00FFFF' : (index % 2 === 0 ? '#FF00FF' : '#00FFFF');
      ctx.shadowBlur = isHead ? 20 : 0;
      ctx.shadowColor = '#00FFFF';
      
      const padding = 1;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
      ctx.shadowBlur = 0;
    });
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 w-full h-full justify-center relative">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00FFFF]/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#FF00FF]/10 blur-[100px] rounded-full" />

      <div className="flex justify-between w-full items-center px-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF00FF] font-digital">MEM_ALLOC</span>
          <span className="text-4xl font-digital font-bold text-[#00FFFF] glitch-text" data-text={score.toString().padStart(4, '0')}>{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF00FF] font-digital">MAX_MEM</span>
          <span className="text-2xl font-digital text-[#00FFFF]">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="arena cursor-none"
        />
        
        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <div className="text-center p-8 border-2 border-[#FF00FF] bg-black">
                <motion.div
                  initial={isGameOver ? { scale: 0.9, y: 20 } : { scale: 0.9 }}
                  animate={{ scale: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className={`text-3xl font-digital uppercase tracking-tighter ${isGameOver ? 'text-[#FF00FF]' : 'text-[#00FFFF]'}`}>
                    {isGameOver ? 'CRITICAL_FAIL' : 'SYS_HALTED'}
                  </h2>
                  <p className="text-[#00FFFF] text-sm font-mono">
                    {isGameOver ? `DATA_LOST: ${score}` : '> AWAITING_CMD'}
                  </p>
                  <button
                    onClick={isGameOver ? resetGame : () => setIsPaused(false)}
                    className={`mt-4 px-8 py-3 font-digital uppercase tracking-widest text-xs transition-all flex items-center gap-2 mx-auto border-2 ${
                      isGameOver 
                        ? 'bg-black text-[#FF00FF] border-[#FF00FF] hover:bg-[#FF00FF] hover:text-black' 
                        : 'bg-black text-[#00FFFF] border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black'
                    }`}
                  >
                    {isGameOver ? (
                      <><RefreshCw className="w-4 h-4" /> REBOOT</>
                    ) : (
                      <><Play className="w-4 h-4" /> EXECUTE</>
                    )}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex justify-center gap-8 text-[#00FFFF]">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-black border border-[#FF00FF] text-[10px] font-digital">ARROWS</kbd>
          <span className="text-[10px] uppercase tracking-widest font-mono">VECTOR</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-black border border-[#FF00FF] text-[10px] font-digital">SPACE</kbd>
          <span className="text-[10px] uppercase tracking-widest font-mono">HALT</span>
        </div>
      </div>
    </div>
  );
}
