import { useEffect, useRef } from 'react';

const TILE_SIZE = 30; // Egy rács egység mérete pixelben
const WALL_COLOR = '#C5A059'; // Arany szín a falaknak
const BG_COLOR = '#051f0e'; // Mély sötétzöld háttér
const DOT_COLOR = '#FDFBF7'; // Krémfehér pontok

// Pálya definíció (1: Fal, 0: Pont, 2: Kocsonya/Powerup, 9: Béka Start, 8: Séf Start)
// Egy "M" alakú pálya közepét próbáljuk imitálni
const MAP_LAYOUT = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,0,1,0,1,1,0,1,1,1,0,1],
  [1,0,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,0,1],
  [1,0,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,8,1,1,1,0,1,0,1,1,1],
  [1,0,0,0,0,0,1,8,8,8,8,8,1,0,0,0,0,0,1], // Középen a séfek "konyhája"
  [1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,9,0,0,0,0,1,0,0,0,1], // 9-es a Béka
  [1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1],
  [1,2,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,2,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export default function PacmanGame() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Canvas méretezése a pálya alapján
    canvas.width = MAP_LAYOUT[0].length * TILE_SIZE;
    canvas.height = MAP_LAYOUT.length * TILE_SIZE;

    // --- RAJZOLÁS FÜGGVÉNY ---
    const draw = () => {
      // 1. Háttér törlése
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Pálya kirajzolása
      for (let row = 0; row < MAP_LAYOUT.length; row++) {
        for (let col = 0; col < MAP_LAYOUT[row].length; col++) {
          const tile = MAP_LAYOUT[row][col];
          const x = col * TILE_SIZE;
          const y = row * TILE_SIZE;

          if (tile === 1) {
            // FAL (Arany keret)
            ctx.fillStyle = BG_COLOR;
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = WALL_COLOR;
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
          } else if (tile === 0 || tile === 9 || tile === 8) {
            // PONT (Kis fokhagyma / pötty)
            if (tile !== 8 && tile !== 9) { 
                // Csak akkor rajzolunk pöttyöt, ha nincs ott karakter kezdőpont
                ctx.fillStyle = DOT_COLOR;
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, 2, 0, Math.PI * 2);
                ctx.fill();
            }
          } else if (tile === 2) {
            // POWER UP (Nagy Kocsonya)
            ctx.fillStyle = '#aadd77'; // Kocsonya zöld
            ctx.beginPath();
            ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, 6, 0, Math.PI * 2);
            ctx.fill();
            // Villogás effekt (fix most)
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // KARAKTEREK (Statikus megjelenítés tesztre)
          if (tile === 9) {
            // BÉKA (Hős)
            drawFrog(ctx, x + TILE_SIZE/2, y + TILE_SIZE/2);
          }
          if (tile === 8) {
            // SÉF (Ellenség)
            drawChef(ctx, x + TILE_SIZE/2, y + TILE_SIZE/2);
          }
        }
      }
    };

    draw();

  }, []);

  // --- KARAKTER RAJZOLÓK ---
  
  const drawFrog = (ctx, x, y) => {
    // Test
    ctx.fillStyle = '#4ade80'; // Élénk béka zöld
    ctx.beginPath();
    ctx.arc(x, y, TILE_SIZE/2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Szemek (nagyok, hogy békás legyen)
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - 5, y - 6, 4, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 6, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupillák
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - 5, y - 6, 1.5, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 6, 1.5, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawChef = (ctx, x, y) => {
    // Sapka (hengeres)
    ctx.fillStyle = 'white';
    ctx.fillRect(x - 6, y - 12, 12, 10);
    
    // Fej
    ctx.beginPath();
    ctx.arc(x, y + 2, 6, 0, Math.PI * 2);
    ctx.fill();

    // Szemek (mérges)
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - 2, y + 2, 1, 0, Math.PI * 2);
    ctx.arc(x + 2, y + 2, 1, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="flex justify-center items-center p-4">
        <canvas ref={canvasRef} className="shadow-2xl rounded-lg border-4 border-[#387035]" />
    </div>
  );
}