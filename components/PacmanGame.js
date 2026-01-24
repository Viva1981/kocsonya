import { useEffect, useRef, useState } from 'react';

// --- JÁTÉK KONFIGURÁCIÓ ---
const TILE_SIZE = 25; // Belső felbontás
const SPEED = 2.5;     
const GHOST_SPEED = 1.5; 
const WALL_COLOR = '#C5A059'; 
const BG_COLOR = '#051f0e';   
const DOT_COLOR = '#FDFBF7';  

// Pálya definíció
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
  
  // Állapotok
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  
  // Referenciák a játékciklushoz
  const gameState = useRef({
    map: [],
    player: { x: 9 * TILE_SIZE, y: 12 * TILE_SIZE, dir: {x:0, y:0}, nextDir: {x:0, y:0} },
    ghosts: [],
    powerMode: false,
    powerTimer: 0,
    frameCount: 0
  });

  const requestRef = useRef();

  // --- INITIALIZÁLÁS ---
  useEffect(() => {
    initGame();
    
    // Billentyűzet figyelő
    window.addEventListener('keydown', handleKeyDown);
    
    // Mobil Touch (Swipe) figyelők
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const initGame = () => {
    gameState.current.map = JSON.parse(JSON.stringify(RAW_MAP));
    gameState.current.player = { x: 9 * TILE_SIZE, y: 12 * TILE_SIZE, dir: {x:0, y:0}, nextDir: {x:0, y:0} };
    gameState.current.ghosts = [
      { x: 8 * TILE_SIZE, y: 7 * TILE_SIZE, color: 'red', dir: {x:1, y:0} },
      { x: 9 * TILE_SIZE, y: 7 * TILE_SIZE, color: 'pink', dir: {x:-1, y:0} },
      { x: 10 * TILE_SIZE, y: 7 * TILE_SIZE, color: 'cyan', dir: {x:0, y:-1} }
    ];
    gameState.current.powerMode = false;
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setGameActive(false); // Fontos: alapból áll
    
    if (canvasRef.current) {
        canvasRef.current.width = RAW_MAP[0].length * TILE_SIZE;
        canvasRef.current.height = RAW_MAP.length * TILE_SIZE;
        // Azonnali első rajzolás, hogy ne legyen üres a canvas
        setTimeout(draw, 50); 
    }
  };

  const startGameIfNotActive = () => {
    if (!gameActive && !gameOver && !gameWon) {
        setGameActive(true);
        requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  // --- INPUT KEZELÉS (DESKTOP) ---
  const handleKeyDown = (e) => {
    // Megakadályozzuk az oldal görgetését a nyilakkal
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    // JÁTÉK INDÍTÁSA BÁRMELYIK NYÍLRA
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        startGameIfNotActive();
    }

    if (gameOver || gameWon) return;

    switch(e.key) {
      case 'ArrowUp': gameState.current.player.nextDir = {x: 0, y: -1}; break;
      case 'ArrowDown': gameState.current.player.nextDir = {x: 0, y: 1}; break;
      case 'ArrowLeft': gameState.current.player.nextDir = {x: -1, y: 0}; break;
      case 'ArrowRight': gameState.current.player.nextDir = {x: 1, y: 0}; break;
    }
  };

  // --- INPUT KEZELÉS (MOBIL SWIPE) ---
  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (e) => {
      // Csak akkor tiltjuk a scrollt, ha a canvasra kattintott (vagy teljes képernyőn játék van)
      // De most egyszerűsítsünk: ha a játék oldalon vagy, a swipe játékra van.
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Ha elég nagyot húzott (hogy ne sima koppintás legyen)
      if (Math.abs(diffX) > 20 || Math.abs(diffY) > 20) {
          startGameIfNotActive();
          
          if (Math.abs(diffX) > Math.abs(diffY)) {
              // Vízszintes húzás
              if (diffX > 0) gameState.current.player.nextDir = {x: 1, y: 0};
              else gameState.current.player.nextDir = {x: -1, y: 0};
          } else {
              // Függőleges húzás
              if (diffY > 0) gameState.current.player.nextDir = {x: 0, y: 1};
              else gameState.current.player.nextDir = {x: 0, y: -1};
          }
      }
  };

  // --- JÁTÉK CIKLUS ---
  const gameLoop = () => {
    if (gameOver || gameWon) return; // Stop loop

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

    moveEntity(state.player, SPEED);

    // Ütközés és evés logika
    const pRow = Math.round(state.player.y / TILE_SIZE);
    const pCol = Math.round(state.player.x / TILE_SIZE);
    
    // Map határ ellenőrzés
    if (pRow >= 0 && pRow < state.map.length && pCol >= 0 && pCol < state.map[0].length) {
        if (state.map[pRow][pCol] === 0) {
            state.map[pRow][pCol] = 9;
            setScore(s => s + 10);
        } else if (state.map[pRow][pCol] === 2) {
            state.map[pRow][pCol] = 9;
            setScore(s => s + 50);
            state.powerMode = true;
            state.powerTimer = 300;
        }
    }

    // Nyerés?
    const hasDots = state.map.some(row => row.includes(0) || row.includes(2));
    if (!hasDots) {
        setGameWon(true);
        setGameActive(false); // Stop loop
    }

    // Szellemek
    state.ghosts.forEach(ghost => {
        const gCenter = getCenter(ghost);
        if (Math.abs(gCenter.x - Math.round(gCenter.x)) < 0.1 && Math.abs(gCenter.y - Math.round(gCenter.y)) < 0.1) {
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
                ghost.y = 8 * TILE_SIZE;
                setScore(s => s + 200);
            } else {
                setGameOver(true);
                setGameActive(false); // Stop loop
            }
        }
    });
  };

  const moveEntity = (entity, speed) => {
    const center = getCenter(entity);
    if (Math.abs(center.x - Math.round(center.x)) < 0.15 && Math.abs(center.y - Math.round(center.y)) < 0.15) {
        const cx = Math.round(center.x);
        const cy = Math.round(center.y);
        
        if (!isWall(cy + entity.nextDir.y, cx + entity.nextDir.x)) {
            entity.dir = entity.nextDir;
            entity.x = cx * TILE_SIZE;
            entity.y = cy * TILE_SIZE;
        }
        
        if (isWall(cy + entity.dir.y, cx + entity.dir.x)) {
            entity.dir = {x:0, y:0};
            entity.x = cx * TILE_SIZE; // Snap to grid
            entity.y = cy * TILE_SIZE;
        }
    }
    entity.x += entity.dir.x * speed;
    entity.y += entity.dir.y * speed;
  };

  const getCenter = (e) => ({ x: e.x / TILE_SIZE, y: e.y / TILE_SIZE });
  const isWall = (row, col) => {
      if (row < 0 || row >= RAW_MAP.length || col < 0 || col >= RAW_MAP[0].length) return true;
      return RAW_MAP[row][col] === 1;
  };

  // --- RAJZOLÁS ---
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = gameState.current;

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < state.map.length; row++) {
        for (let col = 0; col < state.map[row].length; col++) {
            const tile = state.map[row][col];
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;

            if (tile === 1) {
                ctx.strokeStyle = WALL_COLOR;
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 5, y + 5, TILE_SIZE - 10, TILE_SIZE - 10);
            } else if (tile === 0) {
                ctx.fillStyle = DOT_COLOR;
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, 2, 0, Math.PI*2);
                ctx.fill();
            } else if (tile === 2) {
                const offset = Math.sin(state.frameCount * 0.2) * 2;
                ctx.fillStyle = '#aadd77';
                ctx.beginPath();
                ctx.ellipse(x + TILE_SIZE/2, y + TILE_SIZE/2, 6 + offset/2, 6 - offset/2, 0, 0, Math.PI*2);
                ctx.fill();
            }
        }
    }

    drawFrog(ctx, state.player.x + TILE_SIZE/2, state.player.y + TILE_SIZE/2, state.player.dir);
    state.ghosts.forEach(ghost => {
        drawChef(ctx, ghost.x + TILE_SIZE/2, ghost.y + TILE_SIZE/2, ghost.color, state.powerMode);
    });
  };

  const drawFrog = (ctx, x, y, dir) => {
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(x, y, TILE_SIZE/2 - 2, 0, Math.PI*2);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.beginPath();
      const eyeOffX = dir.x * 3;
      const eyeOffY = dir.y * 3;
      
      ctx.arc(x - 5 + eyeOffX, y - 6 + eyeOffY, 4, 0, Math.PI*2);
      ctx.arc(x + 5 + eyeOffX, y - 6 + eyeOffY, 4, 0, Math.PI*2);
      ctx.fill();
      
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(x - 5 + eyeOffX, y - 6 + eyeOffY, 1.5, 0, Math.PI*2);
      ctx.arc(x + 5 + eyeOffX, y - 6 + eyeOffY, 1.5, 0, Math.PI*2);
      ctx.fill();
  };

  const drawChef = (ctx, x, y, color, isScared) => {
      ctx.fillStyle = isScared ? '#3b82f6' : 'white';
      ctx.fillRect(x - 6, y - 12, 12, 10);
      ctx.beginPath();
      ctx.arc(x, y + 2, 7, 0, Math.PI*2);
      ctx.fill();
      
      ctx.fillStyle = 'black';
      ctx.beginPath();
      if (isScared) {
          ctx.arc(x - 3, y + 2, 2, 0, Math.PI*2);
          ctx.arc(x + 3, y + 2, 2, 0, Math.PI*2);
      } else {
          ctx.arc(x - 3, y + 2, 1, 0, Math.PI*2);
          ctx.arc(x + 3, y + 2, 1, 0, Math.PI*2);
      }
      ctx.fill();
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* HUD */}
      <div className="flex justify-between w-full max-w-[475px] mb-4 font-serif text-[#C5A059] px-2">
         <div className="text-xl font-bold">SCORE: {score}</div>
         {!gameActive && !gameOver && !gameWon && <div className="animate-pulse text-sm">INDÍTÁS: NYÍL VAGY HÚZÁS</div>}
         {gameOver && <div className="text-red-500 font-bold">VÉGE</div>}
         {gameWon && <div className="text-[#aadd77] font-bold">GYŐZELEM!</div>}
      </div>

      {/* CANVAS KONTÉNER - RESZPONZÍV JAVÍTÁS */}
      <div className="relative w-full flex justify-center px-2">
        <canvas 
            ref={canvasRef} 
            // Ez a stílus teszi reszponzívvá. A max-width a valódi szélessége.
            style={{ 
                width: '100%', 
                maxWidth: '475px', 
                height: 'auto',
                aspectRatio: `${RAW_MAP[0].length}/${RAW_MAP.length}` 
            }}
            className="shadow-2xl rounded-lg border-4 border-[#387035] bg-[#051f0e] touch-none"
        />
      </div>

      {(gameOver || gameWon) && (
          <button 
            onClick={() => { initGame(); setGameActive(true); requestRef.current = requestAnimationFrame(gameLoop); }}
            className="mt-8 px-8 py-3 bg-[#C5A059] text-[#051f0e] font-bold rounded-full uppercase tracking-wider hover:bg-white transition-colors z-20 relative"
          >
            Újra Kocsonya
          </button>
      )}
    </div>
  );
}