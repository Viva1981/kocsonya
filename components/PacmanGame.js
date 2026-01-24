import { useEffect, useRef, useState } from 'react';

// --- JÁTÉK KONFIGURÁCIÓ ---
const TILE_SIZE = 25; // Kicsit kisebb, hogy mobilon is kiférjen
const SPEED = 2.5;     // Béka sebessége
const GHOST_SPEED = 1.5; // Séfek sebessége (lassabbak)
const WALL_COLOR = '#C5A059'; // Prémium Arany
const BG_COLOR = '#051f0e';   // Mély Sötétzöld
const DOT_COLOR = '#FDFBF7';  // Fehér

// 0: Pont, 1: Fal, 2: Kocsonya (Power), 9: Üres (nincs pont)
// Pálya - "M" betű formájára emlékeztető szimmetrikus elrendezés
const RAW_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,2,1],
  [1,0,1,1,1,0,1,1,0,1,0,1,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,1,0,1,0,1,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,9,0,0,1,0,0,0,0,0,1],
  [1,1,1,0,1,1,1,1,9,9,9,1,1,1,1,0,1,1,1], // Séf ház (közép)
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
  const [gameActive, setGameActive] = useState(false); // Indításra vár
  
  // Játék változók (Ref-ben, hogy ne rendereljék újra a komponenst minden frame-ben)
  const gameState = useRef({
    map: [],
    player: { x: 9 * TILE_SIZE, y: 12 * TILE_SIZE, dir: {x:0, y:0}, nextDir: {x:0, y:0}, mouthOpen: 0 },
    ghosts: [
      { x: 8 * TILE_SIZE, y: 8 * TILE_SIZE, color: 'red', dir: {x:1, y:0} },
      { x: 9 * TILE_SIZE, y: 8 * TILE_SIZE, color: 'pink', dir: {x:-1, y:0} },
      { x: 10 * TILE_SIZE, y: 8 * TILE_SIZE, color: 'cyan', dir: {x:0, y:-1} }
    ],
    powerMode: false,
    powerTimer: 0,
    frameCount: 0
  });

  // --- INITIALIZÁLÁS ---
  useEffect(() => {
    initGame();
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const initGame = () => {
    // Map mély másolása, hogy újraindításkor visszaálljanak a pontok
    gameState.current.map = JSON.parse(JSON.stringify(RAW_MAP));
    gameState.current.player = { x: 9 * TILE_SIZE, y: 12 * TILE_SIZE, dir: {x:0, y:0}, nextDir: {x:0, y:0}, mouthOpen: 0 };
    gameState.current.ghosts = [
      { x: 8 * TILE_SIZE, y: 7 * TILE_SIZE, color: 'red', dir: {x:1, y:0} },
      { x: 9 * TILE_SIZE, y: 7 * TILE_SIZE, color: 'pink', dir: {x:-1, y:0} },
      { x: 10 * TILE_SIZE, y: 7 * TILE_SIZE, color: 'cyan', dir: {x:0, y:-1} }
    ];
    gameState.current.powerMode = false;
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    
    // Canvas méret
    if (canvasRef.current) {
        canvasRef.current.width = RAW_MAP[0].length * TILE_SIZE;
        canvasRef.current.height = RAW_MAP.length * TILE_SIZE;
    }
  };

  const startGame = () => {
      setGameActive(true);
      requestRef.current = requestAnimationFrame(gameLoop);
  };

  const requestRef = useRef();

  // --- INPUT KEZELÉS ---
  const handleKeyDown = (e) => {
    if (!gameActive) return;
    switch(e.key) {
      case 'ArrowUp': gameState.current.player.nextDir = {x: 0, y: -1}; break;
      case 'ArrowDown': gameState.current.player.nextDir = {x: 0, y: 1}; break;
      case 'ArrowLeft': gameState.current.player.nextDir = {x: -1, y: 0}; break;
      case 'ArrowRight': gameState.current.player.nextDir = {x: 1, y: 0}; break;
    }
  };

  // Mobil gombokhoz
  const handleMobileControl = (dir) => {
      if (!gameActive) startGame();
      gameState.current.player.nextDir = dir;
  };

  // --- JÁTÉK CIKLUS ---
  const gameLoop = () => {
    if (gameOver || gameWon) return;

    update();
    draw();
    
    if (!gameOver && !gameWon) {
        requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const update = () => {
    const state = gameState.current;
    state.frameCount++;

    // POWER UP IDŐZÍTŐ
    if (state.powerMode) {
        state.powerTimer--;
        if (state.powerTimer <= 0) state.powerMode = false;
    }

    // --- JÁTÉKOS MOZGÁS ---
    moveEntity(state.player, SPEED);

    // Pont evés
    const pRow = Math.round(state.player.y / TILE_SIZE);
    const pCol = Math.round(state.player.x / TILE_SIZE);
    
    if (state.map[pRow][pCol] === 0) {
        state.map[pRow][pCol] = 9; // Megevett pont
        setScore(s => s + 10);
    } else if (state.map[pRow][pCol] === 2) {
        state.map[pRow][pCol] = 9; // Megevett powerup
        setScore(s => s + 50);
        state.powerMode = true;
        state.powerTimer = 300; // kb 5 másodperc (60fps)
    }

    // Győzelem ellenőrzése (nincs több 0 vagy 2)
    const hasDots = state.map.some(row => row.includes(0) || row.includes(2));
    if (!hasDots) {
        setGameWon(true);
        setGameActive(false);
    }

    // --- SZELLEMEK MOZGÁSA ---
    state.ghosts.forEach(ghost => {
        // Egyszerű AI: Ha kereszteződéshez ér, random irányt vált
        const gCenter = getCenter(ghost);
        if (Number.isInteger(gCenter.x) && Number.isInteger(gCenter.y)) {
             const possibleDirs = [];
             if (!isWall(gCenter.y - 1, gCenter.x)) possibleDirs.push({x:0, y:-1});
             if (!isWall(gCenter.y + 1, gCenter.x)) possibleDirs.push({x:0, y:1});
             if (!isWall(gCenter.y, gCenter.x - 1)) possibleDirs.push({x:-1, y:0});
             if (!isWall(gCenter.y, gCenter.x + 1)) possibleDirs.push({x:1, y:0});

             // Ne forduljon meg azonnal, ha teheti
             const forwardDirs = possibleDirs.filter(d => !(d.x === -ghost.dir.x && d.y === -ghost.dir.y));
             
             if (forwardDirs.length > 0) {
                 const randomDir = forwardDirs[Math.floor(Math.random() * forwardDirs.length)];
                 ghost.dir = randomDir;
             } else {
                 // Zsákutca
                 ghost.dir = possibleDirs[0] || {x:0, y:0}; 
             }
        }
        
        // Mozgatás (lassított power módban)
        let currentSpeed = state.powerMode ? GHOST_SPEED / 2 : GHOST_SPEED;
        ghost.x += ghost.dir.x * currentSpeed;
        ghost.y += ghost.dir.y * currentSpeed;

        // Ütközés ellenőrzés
        const dist = Math.hypot(state.player.x - ghost.x, state.player.y - ghost.y);
        if (dist < TILE_SIZE * 0.8) {
            if (state.powerMode) {
                // Séf megeszése -> visszakerül a startra
                ghost.x = 9 * TILE_SIZE;
                ghost.y = 8 * TILE_SIZE;
                setScore(s => s + 200);
            } else {
                // Game Over
                setGameOver(true);
                setGameActive(false);
            }
        }
    });
  };

  const moveEntity = (entity, speed) => {
    // 1. Megpróbáljuk beállítani a kért irányt (nextDir), ha rácsponton vagyunk
    const center = getCenter(entity);
    
    // Csak akkor válthat irányt, ha "majdnem" pontosan a rácson van (pixel perfect illúzió)
    if (Math.abs(center.x - Math.round(center.x)) < 0.1 && Math.abs(center.y - Math.round(center.y)) < 0.1) {
        const cx = Math.round(center.x);
        const cy = Math.round(center.y);
        
        // Ha a következő irány érvényes, beállítjuk
        if (!isWall(cy + entity.nextDir.y, cx + entity.nextDir.x)) {
            entity.dir = entity.nextDir;
            // Snappelés a rácsra, hogy ne csússzon el
            entity.x = cx * TILE_SIZE;
            entity.y = cy * TILE_SIZE;
        }
        
        // Ha a jelenlegi irány falba ütközik, megállunk
        if (isWall(cy + entity.dir.y, cx + entity.dir.x)) {
            entity.dir = {x:0, y:0};
        }
    }

    entity.x += entity.dir.x * speed;
    entity.y += entity.dir.y * speed;
  };

  // Segédfüggvények
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

    // Törlés
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pálya
    for (let row = 0; row < state.map.length; row++) {
        for (let col = 0; col < state.map[row].length; col++) {
            const tile = state.map[row][col];
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;

            if (tile === 1) {
                // FAL
                ctx.strokeStyle = WALL_COLOR;
                ctx.lineWidth = 2;
                // Csak keret
                ctx.strokeRect(x + 5, y + 5, TILE_SIZE - 10, TILE_SIZE - 10);
            } else if (tile === 0) {
                // PONT
                ctx.fillStyle = DOT_COLOR;
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, 2, 0, Math.PI*2);
                ctx.fill();
            } else if (tile === 2) {
                // KOCSONYA POWERUP (Rezgő effekt)
                const offset = Math.sin(state.frameCount * 0.2) * 2;
                ctx.fillStyle = '#aadd77';
                ctx.beginPath();
                ctx.ellipse(x + TILE_SIZE/2, y + TILE_SIZE/2, 6 + offset/2, 6 - offset/2, 0, 0, Math.PI*2);
                ctx.fill();
            }
        }
    }

    // JÁTÉKOS (BÉKA)
    drawFrog(ctx, state.player.x + TILE_SIZE/2, state.player.y + TILE_SIZE/2, state.player.dir);

    // SZELLEMEK (SÉFEK)
    state.ghosts.forEach(ghost => {
        drawChef(ctx, ghost.x + TILE_SIZE/2, ghost.y + TILE_SIZE/2, ghost.color, state.powerMode);
    });
  };

  const drawFrog = (ctx, x, y, dir) => {
      ctx.fillStyle = '#4ade80'; // Béka zöld
      ctx.beginPath();
      ctx.arc(x, y, TILE_SIZE/2 - 2, 0, Math.PI*2);
      ctx.fill();
      
      // Szemek
      ctx.fillStyle = 'white';
      ctx.beginPath();
      // Iránytól függő szempozíció kicsit
      const eyeOffX = dir.x * 3;
      const eyeOffY = dir.y * 3;
      
      ctx.arc(x - 5 + eyeOffX, y - 6 + eyeOffY, 4, 0, Math.PI*2);
      ctx.arc(x + 5 + eyeOffX, y - 6 + eyeOffY, 4, 0, Math.PI*2);
      ctx.fill();
      
      // Pupilla
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(x - 5 + eyeOffX, y - 6 + eyeOffY, 1.5, 0, Math.PI*2);
      ctx.arc(x + 5 + eyeOffX, y - 6 + eyeOffY, 1.5, 0, Math.PI*2);
      ctx.fill();
  };

  const drawChef = (ctx, x, y, color, isScared) => {
      if (isScared) {
          ctx.fillStyle = '#3b82f6'; // Ijedt kék
      } else {
          ctx.fillStyle = 'white'; // Séfruha
      }
      
      // Sapka
      ctx.fillRect(x - 6, y - 12, 12, 10);
      // Fej
      ctx.beginPath();
      ctx.arc(x, y + 2, 7, 0, Math.PI*2);
      ctx.fill();
      
      // Arc (Szemek)
      ctx.fillStyle = 'black';
      ctx.beginPath();
      if (isScared) {
          // Ijedt szemek (nagyok)
          ctx.arc(x - 3, y + 2, 2, 0, Math.PI*2);
          ctx.arc(x + 3, y + 2, 2, 0, Math.PI*2);
      } else {
          // Gonosz szemek (kicsik)
          ctx.arc(x - 3, y + 2, 1, 0, Math.PI*2);
          ctx.arc(x + 3, y + 2, 1, 0, Math.PI*2);
      }
      ctx.fill();
  };

  return (
    <div className="flex flex-col items-center">
      {/* HUD */}
      <div className="flex justify-between w-full max-w-md mb-4 font-serif text-[#C5A059]">
         <div className="text-xl font-bold">SCORE: {score}</div>
         {!gameActive && !gameOver && !gameWon && <div className="animate-pulse">NYOMJ EGY GOMBOT AZ INDÍTÁSHOZ</div>}
         {gameOver && <div className="text-red-500 font-bold">GAME OVER</div>}
         {gameWon && <div className="text-[#aadd77] font-bold">GYŐZELEM!</div>}
      </div>

      <canvas 
        ref={canvasRef} 
        className="shadow-2xl rounded-lg border-4 border-[#387035] bg-[#051f0e]"
      />

      {/* MOBIL CONTROLS */}
      <div className="mt-8 grid grid-cols-3 gap-2 sm:hidden">
          <div></div>
          <button onClick={() => handleMobileControl({x:0, y:-1})} className="w-14 h-14 bg-[#387035] rounded-full flex items-center justify-center text-white active:bg-[#aadd77]">▲</button>
          <div></div>
          <button onClick={() => handleMobileControl({x:-1, y:0})} className="w-14 h-14 bg-[#387035] rounded-full flex items-center justify-center text-white active:bg-[#aadd77]">◀</button>
          <button onClick={() => handleMobileControl({x:0, y:1})} className="w-14 h-14 bg-[#387035] rounded-full flex items-center justify-center text-white active:bg-[#aadd77]">▼</button>
          <button onClick={() => handleMobileControl({x:1, y:0})} className="w-14 h-14 bg-[#387035] rounded-full flex items-center justify-center text-white active:bg-[#aadd77]">▶</button>
      </div>

      {(gameOver || gameWon) && (
          <button 
            onClick={() => { initGame(); startGame(); }}
            className="mt-6 px-8 py-3 bg-[#C5A059] text-[#051f0e] font-bold rounded-full uppercase tracking-wider hover:bg-white transition-colors"
          >
            Újra Kocsonya
          </button>
      )}
    </div>
  );
}