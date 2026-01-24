import { useEffect, useRef, useState } from 'react';

// --- JÁTÉK KONFIGURÁCIÓ (JAVÍTOTT MATEMATIKA) ---
// Fontos: A TILE_SIZE osztható kell legyen a SPEED-del, különben a kanyarok nem működnek!
const TILE_SIZE = 20; 
const SPEED = 2;       // Béka sebessége (20 / 2 = 10 frame/kocka)
const GHOST_SPEED = 1; // Szakács sebessége (Lassabb, könnyebb menekülni)
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
  
  // Referenciák a játékciklushoz (Mutable state)
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
    const handleKey = (e) => handleKeyDown(e);
    window.addEventListener('keydown', handleKey);
    
    // Mobil Touch (Swipe) figyelők
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const initGame = () => {
    // Stop existing loop if any
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    gameState.current.map = JSON.parse(JSON.stringify(RAW_MAP));
    // Béka kezdőpozíció
    gameState.current.player = { x: 9 * TILE_SIZE, y: 12 * TILE_SIZE, dir: {x:0, y:0}, nextDir: {x:0, y:0} };
    
    // Szellemek (Szakácsok) kezdőpozíciói
    gameState.current.ghosts = [
      { x: 8 * TILE_SIZE, y: 7 * TILE_SIZE, color: 'red', dir: {x:1, y:0} },
      { x: 9 * TILE_SIZE, y: 7 * TILE_SIZE, color: 'pink', dir: {x:-1, y:0} },
      { x: 10 * TILE_SIZE, y: 7 * TILE_SIZE, color: 'cyan', dir: {x:0, y:-1} }
    ];
    
    gameState.current.powerMode = false;
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setGameActive(false); 
    
    if (canvasRef.current) {
        canvasRef.current.width = RAW_MAP[0].length * TILE_SIZE;
        canvasRef.current.height = RAW_MAP.length * TILE_SIZE;
        // Azonnali első rajzolás
        setTimeout(draw, 50); 
    }
  };

  const startGameIfNotActive = () => {
    if (!gameActive && !gameOver && !gameWon) {
        setGameActive(true);
        // Biztos ami biztos, töröljük az előzőt
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  // --- INPUT KEZELÉS (DESKTOP) ---
  const handleKeyDown = (e) => {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        startGameIfNotActive();
    }

    // Ha vége a játéknak, ne fogadjon inputot (kivéve restart gomb, ami nem itt van)
    if (gameState.current.gameOver || gameState.current.gameWon) return;

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
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > 20 || Math.abs(diffY) > 20) {
          startGameIfNotActive();
          
          if (Math.abs(diffX) > Math.abs(diffY)) {
              if (diffX > 0) gameState.current.player.nextDir = {x: 1, y: 0};
              else gameState.current.player.nextDir = {x: -1, y: 0};
          } else {
              if (diffY > 0) gameState.current.player.nextDir = {x: 0, y: 1};
              else gameState.current.player.nextDir = {x: 0, y: -1};
          }
      }
  };

  // --- JÁTÉK CIKLUS ---
  const gameLoop = () => {
    // Ellenőrzés Ref-ből, hogy a legfrissebb állapotot lássuk
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

    // Játékos mozgatása
    movePlayer(state.player, SPEED);

    // Ütközés és evés logika
    // A játékos középpontja alapján nézzük, hol van
    const pCenter = getCenter(state.player);
    const pRow = Math.round(pCenter.y);
    const pCol = Math.round(pCenter.x);
    
    if (pRow >= 0 && pRow < state.map.length && pCol >= 0 && pCol < state.map[0].length) {
        // Pici tolerancia, hogy ne kelljen pixelpontosan a közepén lenni az evéshez
        const dist = Math.hypot(state.player.x - pCol * TILE_SIZE, state.player.y - pRow * TILE_SIZE);
        
        if (dist < 5) { // Ha közel van a csempe közepéhez
            if (state.map[pRow][pCol] === 0) {
                state.map[pRow][pCol] = 9; // Megevett
                setScore(s => s + 10);
            } else if (state.map[pRow][pCol] === 2) {
                state.map[pRow][pCol] = 9; // Megevett powerup
                setScore(s => s + 50);
                state.powerMode = true;
                state.powerTimer = 400; // Hosszabb power mode
            }
        }
    }

    // Nyerés ellenőrzése
    const hasDots = state.map.some(row => row.includes(0) || row.includes(2));
    if (!hasDots) {
        state.gameWon = true; // Ref update azonnal
        setGameWon(true);
        return;
    }

    // Szellemek mozgatása
    state.ghosts.forEach(ghost => {
        const gCenter = getCenter(ghost);
        // Csak akkor vált irányt, ha pontosan a rács közepén van
        if (isAtCenter(ghost)) {
             const possibleDirs = [];
             const gx = Math.round(gCenter.x);
             const gy = Math.round(gCenter.y);
             
             if (!isWall(gy - 1, gx)) possibleDirs.push({x:0, y:-1});
             if (!isWall(gy + 1, gx)) possibleDirs.push({x:0, y:1});
             if (!isWall(gy, gx - 1)) possibleDirs.push({x:-1, y:0});
             if (!isWall(gy, gx + 1)) possibleDirs.push({x:1, y:0});

             // Ne forduljon vissza, ha lehet máshova menni
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

        // Ütközés a játékossal
        const dist = Math.hypot(state.player.x - ghost.x, state.player.y - ghost.y);
        if (dist < TILE_SIZE * 0.8) {
            if (state.powerMode) {
                // Szellem megeszése -> visszamegy középre
                ghost.x = 9 * TILE_SIZE;
                ghost.y = 7 * TILE_SIZE; // Ghost house
                setScore(s => s + 200);
            } else {
                state.gameOver = true; // Ref update
                setGameOver(true);
            }
        }
    });
  };

  const movePlayer = (entity, speed) => {
    // Itt a trükk: Csak akkor engedünk kanyarodni, ha "majdnem" a rácsponton vagyunk.
    // Mivel a TILE_SIZE = 20 és SPEED = 2, mindig lesz olyan frame, ahol pont 0 a maradék.
    
    // Először próbáljuk meg a kanyarodást (nextDir)
    if (entity.nextDir.x !== 0 || entity.nextDir.y !== 0) {
        if (isAtCenter(entity)) {
            const cx = Math.round(entity.x / TILE_SIZE);
            const cy = Math.round(entity.y / TILE_SIZE);
            
            if (!isWall(cy + entity.nextDir.y, cx + entity.nextDir.x)) {
                entity.dir = entity.nextDir;
                // Fontos: rácshoz igazítás, hogy ne csússzon el pixelre
                entity.x = cx * TILE_SIZE;
                entity.y = cy * TILE_SIZE;
            }
        }
    }

    // Ha falnak menne a jelenlegi iránnyal, álljon meg
    if (isAtCenter(entity)) {
        const cx = Math.round(entity.x / TILE_SIZE);
        const cy = Math.round(entity.y / TILE_SIZE);
        if (isWall(cy + entity.dir.y, cx + entity.dir.x)) {
            entity.x = cx * TILE_SIZE;
            entity.y = cy * TILE_SIZE;
            // Nem nullázzuk a dir-t teljesen, csak nem adunk hozzá, 
            // így megáll, de az irány megmarad (animációhoz jó lenne, de most mindegy)
            return; 
        }
    }

    entity.x += entity.dir.x * speed;
    entity.y += entity.dir.y * speed;
  };

  const getCenter = (e) => ({ x: e.x / TILE_SIZE, y: e.y / TILE_SIZE });
  
  // Segédfüggvény: pontosan a rács közepén vagyunk-e?
  const isAtCenter = (e) => {
      // Mivel a sebesség (2) osztója a méretnek (20), a maradéknak 0-nak kell lennie
      return (e.x % TILE_SIZE === 0) && (e.y % TILE_SIZE === 0);
  };

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

    // Háttér
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pálya
    for (let row = 0; row < state.map.length; row++) {
        for (let col = 0; col < state.map[row].length; col++) {
            const tile = state.map[row][col];
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;

            if (tile === 1) {
                ctx.strokeStyle = WALL_COLOR;
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            } else if (tile === 0) {
                ctx.fillStyle = DOT_COLOR;
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, 2, 0, Math.PI*2);
                ctx.fill();
            } else if (tile === 2) {
                const offset = Math.sin(state.frameCount * 0.2) * 2;
                ctx.fillStyle = '#aadd77';
                ctx.beginPath();
                ctx.ellipse(x + TILE_SIZE/2, y + TILE_SIZE/2, 5 + offset/2, 5 - offset/2, 0, 0, Math.PI*2);
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
      // Kisebb sugár a kisebb tile miatt
      ctx.arc(x, y, TILE_SIZE/2 - 1, 0, Math.PI*2);
      ctx.fill();
      
      // Szemek
      ctx.fillStyle = 'white';
      ctx.beginPath();
      // Irány szerinti eltolás
      const lookX = dir.x * 4;
      const lookY = dir.y * 4;
      
      ctx.arc(x - 4 + lookX, y - 4 + lookY, 3, 0, Math.PI*2);
      ctx.arc(x + 4 + lookX, y - 4 + lookY, 3, 0, Math.PI*2);
      ctx.fill();
      
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(x - 4 + lookX, y - 4 + lookY, 1, 0, Math.PI*2);
      ctx.arc(x + 4 + lookX, y - 4 + lookY, 1, 0, Math.PI*2);
      ctx.fill();
  };

  const drawChef = (ctx, x, y, color, isScared) => {
      ctx.fillStyle = isScared ? '#3b82f6' : 'white'; // Sapka színe (fehér, ha nem ijedt)
      // Sapka
      ctx.fillRect(x - 5, y - 10, 10, 8);
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI*2); // Fej
      ctx.fill();
      
      // Arc (Szín)
      if (!isScared) {
        ctx.fillStyle = color; // A test/kendő színe az eredeti szellem szín
        ctx.beginPath();
        ctx.arc(x, y + 4, 4, 0, Math.PI*2);
        ctx.fill();
      }

      ctx.fillStyle = 'black';
      ctx.beginPath();
      if (isScared) {
          ctx.arc(x - 2, y, 1, 0, Math.PI*2);
          ctx.arc(x + 2, y, 1, 0, Math.PI*2);
      } else {
          ctx.arc(x - 2, y, 1, 0, Math.PI*2);
          ctx.arc(x + 2, y, 1, 0, Math.PI*2);
      }
      ctx.fill();
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* HUD */}
      <div className="flex justify-between w-full max-w-[380px] mb-4 font-serif text-[#C5A059] px-2">
         <div className="text-xl font-bold">SCORE: {score}</div>
         {!gameActive && !gameOver && !gameWon && <div className="animate-pulse text-sm">INDÍTÁS: NYÍL VAGY HÚZÁS</div>}
         {gameOver && <div className="text-red-500 font-bold">VÉGE</div>}
         {gameWon && <div className="text-[#aadd77] font-bold">GYŐZELEM!</div>}
      </div>

      {/* CANVAS KONTÉNER */}
      <div className="relative w-full flex justify-center px-2">
        <canvas 
            ref={canvasRef} 
            style={{ 
                width: '100%', 
                maxWidth: '380px', 
                height: 'auto',
                aspectRatio: `${RAW_MAP[0].length}/${RAW_MAP.length}` 
            }}
            className="shadow-2xl rounded-lg border-4 border-[#387035] bg-[#051f0e] touch-none"
        />
      </div>

      {(gameOver || gameWon) && (
          <button 
            onClick={() => { initGame(); startGameIfNotActive(); }}
            className="mt-8 px-8 py-3 bg-[#C5A059] text-[#051f0e] font-bold rounded-full uppercase tracking-wider hover:bg-white transition-colors z-20 relative"
          >
            Újra Kocsonya
          </button>
      )}
    </div>
  );
}