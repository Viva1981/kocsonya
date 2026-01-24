import { useEffect, useRef, useState } from 'react';

// --- JÁTÉK KONFIGURÁCIÓ ---
const TILE_SIZE = 20; 
const SPEED = 2;       
const GHOST_SPEED = 1; 
const WALL_COLOR = '#C5A059'; 
const BG_COLOR = '#051f0e';   
const PLATE_COLOR = '#FFFFFF'; 
const JELLY_COLOR = '#C8A880'; 
const MEAT_COLOR = '#8B4513';  

const RAW_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,2,1],
  [1,0,1,1,1,0,1,1,0,1,0,1,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,1,0,1,0,1,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,9,0,0,1,0,0,0,0,0,1],
  [1,1,1,0,1,1,1,1,9,9,9,1,1,1,1,0,1,1,1], 
  [1,0,0,0,0,0,1,9,9,9,9,9,1,0,0,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1],
  [1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
  [1,0,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,0,1],
  [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export default function PacmanGame() {
  const canvasRef = useRef(null);
  
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  
  const gameState = useRef({
    map: [],
    player: { x: 9 * TILE_SIZE, y: 12 * TILE_SIZE, dir: {x:0, y:0}, nextDir: {x:0, y:0} },
    ghosts: [],
    powerMode: false,
    powerTimer: 0,
    frameCount: 0,
    gameOver: false,
    gameWon: false
  });

  const requestRef = useRef();
  // Ref a touch koordináták tárolására, hogy ne rendereljünk újra minden mozdulatnál
  const touchStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    initGame();
    
    const handleKey = (e) => handleKeyDown(e);
    window.addEventListener('keydown', handleKey);
    
    // Touch eventek
    // Fontos: a touchmove-ban kezeljük az irányítást az azonnali reakcióhoz
    const handleMove = (e) => handleTouchMove(e);
    const handleStart = (e) => handleTouchStart(e);
    
    // A canvas-ra kötjük az eseményeket, de a window-ra is tehetnénk
    // A passzív: false fontos a scroll tiltáshoz
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchstart', handleStart, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchstart', handleStart);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const initGame = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    gameState.current.map = JSON.parse(JSON.stringify(RAW_MAP));
    gameState.current.player = { x: 9 * TILE_SIZE, y: 12 * TILE_SIZE, dir: {x:0, y:0}, nextDir: {x:0, y:0} };
    gameState.current.ghosts = [
      { x: 8 * TILE_SIZE, y: 7 * TILE_SIZE, color: 'red', dir: {x:1, y:0} },
      { x: 9 * TILE_SIZE, y: 7 * TILE_SIZE, color: 'pink', dir: {x:-1, y:0} },
      { x: 10 * TILE_SIZE, y: 7 * TILE_SIZE, color: 'cyan', dir: {x:0, y:-1} }
    ];
    gameState.current.powerMode = false;
    gameState.current.gameOver = false;
    gameState.current.gameWon = false;
    
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setGameActive(false); 
    
    if (canvasRef.current) {
        canvasRef.current.width = RAW_MAP[0].length * TILE_SIZE;
        canvasRef.current.height = RAW_MAP.length * TILE_SIZE;
        setTimeout(draw, 50); 
    }
  };

  const startGameIfNotActive = () => {
    if (!gameActive && !gameState.current.gameOver && !gameState.current.gameWon) {
        setGameActive(true);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const handleKeyDown = (e) => {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        startGameIfNotActive();
    }
    
    if (gameState.current.gameOver || gameState.current.gameWon) return;

    switch(e.key) {
      case 'ArrowUp': gameState.current.player.nextDir = {x: 0, y: -1}; break;
      case 'ArrowDown': gameState.current.player.nextDir = {x: 0, y: 1}; break;
      case 'ArrowLeft': gameState.current.player.nextDir = {x: -1, y: 0}; break;
      case 'ArrowRight': gameState.current.player.nextDir = {x: 1, y: 0}; break;
    }
  };

  // --- MOBIL IRÁNYÍTÁS (AZONNALI REAGÁLÁS) ---
  
  const handleTouchStart = (e) => {
      // Csak rögzítjük a kezdőpontot
      if(e.target === canvasRef.current) {
         // Nem hívunk preventDefault-ot itt, mert az néha blokkolja a kattintást gombokra
      }
      touchStartRef.current = {
          x: e.changedTouches[0].screenX,
          y: e.changedTouches[0].screenY
      };
  };

  const handleTouchMove = (e) => {
      // Itt tiltjuk a scrollt, ha a játékon vagyunk
      if (e.target === canvasRef.current) {
          e.preventDefault();
      }

      const touchX = e.changedTouches[0].screenX;
      const touchY = e.changedTouches[0].screenY;
      
      const diffX = touchX - touchStartRef.current.x;
      const diffY = touchY - touchStartRef.current.y;

      // Érzékenység: 10 pixel elmozdulás már irányváltást jelent!
      // Ez teszi lehetővé, hogy még azelőtt reagáljon, hogy felemelnéd az ujjad.
      const SENSITIVITY = 10; 

      if (Math.abs(diffX) > SENSITIVITY || Math.abs(diffY) > SENSITIVITY) {
          startGameIfNotActive();
          
          if (gameState.current.gameOver || gameState.current.gameWon) return;

          // Melyik irányba húztuk jobban?
          if (Math.abs(diffX) > Math.abs(diffY)) {
              // Vízszintes
              if (diffX > 0) gameState.current.player.nextDir = {x: 1, y: 0};
              else gameState.current.player.nextDir = {x: -1, y: 0};
          } else {
              // Függőleges
              if (diffY > 0) gameState.current.player.nextDir = {x: 0, y: 1};
              else gameState.current.player.nextDir = {x: 0, y: -1};
          }
      }
  };

  const gameLoop = () => {
    if (gameState.current.gameOver || gameState.current.gameWon) return;
    update();
    draw();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const update = () => {
    const state = gameState.current;
    state.frameCount++;

    if (state.powerMode) {
        state.powerTimer--;
        if (state.powerTimer <= 0) state.powerMode = false;
    }

    movePlayer(state.player, SPEED);

    const pCenter = getCenter(state.player);
    const pRow = Math.round(pCenter.y);
    const pCol = Math.round(pCenter.x);
    
    if (pRow >= 0 && pRow < state.map.length && pCol >= 0 && pCol < state.map[0].length) {
        const dist = Math.hypot(state.player.x - pCol * TILE_SIZE, state.player.y - pRow * TILE_SIZE);
        if (dist < 5) { 
            if (state.map[pRow][pCol] === 0) {
                state.map[pRow][pCol] = 9; 
                setScore(s => s + 10);
            } else if (state.map[pRow][pCol] === 2) {
                state.map[pRow][pCol] = 9; 
                setScore(s => s + 50);
                state.powerMode = true;
                state.powerTimer = 400; 
            }
        }
    }

    const hasDots = state.map.some(row => row.includes(0) || row.includes(2));
    if (!hasDots) {
        state.gameWon = true; 
        setGameWon(true);
        return;
    }

    state.ghosts.forEach(ghost => {
        const gCenter = getCenter(ghost);
        if (isAtCenter(ghost)) {
             const possibleDirs = [];
             const gx = Math.round(gCenter.x);
             const gy = Math.round(gCenter.y);
             
             if (!isWall(gy - 1, gx)) possibleDirs.push({x:0, y:-1});
             if (!isWall(gy + 1, gx)) possibleDirs.push({x:0, y:1});
             if (!isWall(gy, gx - 1)) possibleDirs.push({x:-1, y:0});
             if (!isWall(gy, gx + 1)) possibleDirs.push({x:1, y:0});

             const forwardDirs = possibleDirs.filter(d => !(d.x === -ghost.dir.x && d.y === -ghost.dir.y));
             
             if (forwardDirs.length > 0) {
                 ghost.dir = forwardDirs[Math.floor(Math.random() * forwardDirs.length)];
             } else {
                 ghost.dir = possibleDirs[0] || {x:0, y:0}; 
             }
        }
        
        let currentSpeed = state.powerMode ? GHOST_SPEED / 2 : GHOST_SPEED;
        ghost.x += ghost.dir.x * currentSpeed;
        ghost.y += ghost.dir.y * currentSpeed;

        const dist = Math.hypot(state.player.x - ghost.x, state.player.y - ghost.y);
        if (dist < TILE_SIZE * 0.8) {
            if (state.powerMode) {
                ghost.x = 9 * TILE_SIZE;
                ghost.y = 7 * TILE_SIZE; 
                setScore(s => s + 200);
            } else {
                state.gameOver = true;
                setGameOver(true);
            }
        }
    });
  };

  const movePlayer = (entity, speed) => {
    // Előre "eltárolt" irány (NextDir) kezelése
    if (entity.nextDir.x !== 0 || entity.nextDir.y !== 0) {
        if (isAtCenter(entity)) {
            const cx = Math.round(entity.x / TILE_SIZE);
            const cy = Math.round(entity.y / TILE_SIZE);
            if (!isWall(cy + entity.nextDir.y, cx + entity.nextDir.x)) {
                entity.dir = entity.nextDir;
                entity.x = cx * TILE_SIZE;
                entity.y = cy * TILE_SIZE;
            }
        }
    }
    // Falnak ütközés
    if (isAtCenter(entity)) {
        const cx = Math.round(entity.x / TILE_SIZE);
        const cy = Math.round(entity.y / TILE_SIZE);
        if (isWall(cy + entity.dir.y, cx + entity.dir.x)) {
            entity.x = cx * TILE_SIZE;
            entity.y = cy * TILE_SIZE;
            return; 
        }
    }
    entity.x += entity.dir.x * speed;
    entity.y += entity.dir.y * speed;
  };

  const getCenter = (e) => ({ x: e.x / TILE_SIZE, y: e.y / TILE_SIZE });
  const isAtCenter = (e) => (e.x % TILE_SIZE === 0) && (e.y % TILE_SIZE === 0);
  const isWall = (row, col) => {
      if (row < 0 || row >= RAW_MAP.length || col < 0 || col >= RAW_MAP[0].length) return true;
      return RAW_MAP[row][col] === 1;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = gameState.current;

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const wobble = Math.sin(state.frameCount * 0.15) * 1.5;

    for (let row = 0; row < state.map.length; row++) {
        for (let col = 0; col < state.map[row].length; col++) {
            const tile = state.map[row][col];
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;

            if (tile === 1) {
                ctx.strokeStyle = state.powerMode 
                    ? (state.frameCount % 20 < 10 ? '#E5C079' : WALL_COLOR) 
                    : WALL_COLOR;
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            } else if (tile === 0) {
                const cx = x + TILE_SIZE/2;
                const cy = y + TILE_SIZE/2;
                ctx.fillStyle = PLATE_COLOR;
                ctx.beginPath();
                ctx.arc(cx, cy, 3.5, 0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = JELLY_COLOR;
                ctx.beginPath();
                ctx.ellipse(cx, cy, 2 + wobble/3, 2 - wobble/3, 0, 0, Math.PI*2);
                ctx.fill();
            } else if (tile === 2) {
                const cx = x + TILE_SIZE/2;
                const cy = y + TILE_SIZE/2;
                const offset = Math.sin(state.frameCount * 0.2) * 1.5;
                ctx.fillStyle = PLATE_COLOR;
                ctx.beginPath();
                ctx.arc(cx, cy, 7, 0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = JELLY_COLOR;
                ctx.beginPath();
                ctx.ellipse(cx, cy, 5 + offset, 5 - offset, 0, 0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = MEAT_COLOR;
                ctx.beginPath();
                ctx.arc(cx, cy, 2, 0, Math.PI*2);
                ctx.fill();
            }
        }
    }
    drawFrog(ctx, state.player.x + TILE_SIZE/2, state.player.y + TILE_SIZE/2, state.player.dir, state.powerMode);
    state.ghosts.forEach(ghost => {
        drawChef(ctx, ghost.x + TILE_SIZE/2, ghost.y + TILE_SIZE/2, ghost.color, state.powerMode);
    });
  };

  const drawFrog = (ctx, x, y, dir, isPowered) => {
      const scale = isPowered ? 1.3 : 1.0;
      ctx.save();
      ctx.translate(x, y);
      let angle = 0;
      if (dir.x === 1) angle = 0;
      if (dir.x === -1) angle = Math.PI;
      if (dir.y === 1) angle = Math.PI / 2;
      if (dir.y === -1) angle = -Math.PI / 2;
      ctx.rotate(angle);
      ctx.scale(scale, scale);
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI*2); 
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(3, -4, 3, 0, Math.PI*2);
      ctx.arc(3, 4, 3, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(4, -4, 1.2, 0, Math.PI*2);
      ctx.arc(4, 4, 1.2, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
  };

  const drawChef = (ctx, x, y, color, isScared) => {
      let drawX = x;
      let drawY = y;
      if (isScared) {
          drawX += (Math.random() - 0.5) * 2;
          drawY += (Math.random() - 0.5) * 2;
      }
      ctx.fillStyle = isScared ? '#3b82f6' : 'white'; 
      ctx.fillRect(drawX - 5, drawY - 10, 10, 8); 
      if (isScared) ctx.fillStyle = '#93c5fd'; 
      else ctx.fillStyle = color; 
      ctx.beginPath();
      ctx.arc(drawX, drawY, 6, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath();
      if (isScared) {
          ctx.arc(drawX - 2, drawY, 1.5, 0, Math.PI*2);
          ctx.arc(drawX + 2, drawY, 1.5, 0, Math.PI*2);
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(drawX - 3, drawY + 4);
          ctx.lineTo(drawX - 1, drawY + 2);
          ctx.lineTo(drawX + 1, drawY + 4);
          ctx.lineTo(drawX + 3, drawY + 2);
          ctx.stroke();
      } else {
          ctx.arc(drawX - 2, drawY, 1, 0, Math.PI*2);
          ctx.arc(drawX + 2, drawY, 1, 0, Math.PI*2);
      }
      ctx.fill();
  };

  return (
    <div className="flex flex-col items-center w-full select-none">
      <div className="flex justify-between w-full max-w-[380px] mb-4 font-serif text-[#C5A059] px-2">
         <div className="text-xl font-bold">SCORE: {score}</div>
         {!gameActive && !gameOver && !gameWon && <div className="animate-pulse text-sm">INDÍTÁS: ÉRINTÉS / NYÍL</div>}
         {gameOver && <div className="text-red-500 font-bold">VÉGE</div>}
         {gameWon && <div className="text-[#aadd77] font-bold">GYŐZELEM!</div>}
      </div>

      <div className="relative w-full flex justify-center px-2">
        <canvas 
            ref={canvasRef} 
            style={{ 
                width: '100%', 
                maxWidth: '380px', 
                height: 'auto',
                aspectRatio: `${RAW_MAP[0].length}/${RAW_MAP.length}` 
            }}
            className="shadow-2xl rounded-lg border-4 border-[#387035] bg-[#051f0e] touch-none cursor-pointer"
        />
      </div>

      {(gameOver || gameWon) && (
          <button 
            onClick={initGame}
            className="mt-8 px-8 py-3 bg-[#C5A059] text-[#051f0e] font-bold rounded-full uppercase tracking-wider hover:bg-white transition-colors z-20 relative cursor-pointer"
          >
            Újra Kocsonya
          </button>
      )}
    </div>
  );
}