import React, { useEffect, useRef } from 'react';

export const MatrixIntro: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';

    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const rows = Math.floor(canvas.height / fontSize);

    const rainDrops: number[] = [];

    // Initialize all drops with random starts so they don't fall in a straight line
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.floor(Math.random() * rows);
    }

    const startTime = Date.now();

    const targetSequence = [
      { word: "1337",   start: 0,    end: 1550 },
      { word: "ALPHA",  start: 1550, end: 2350 },
      { word: "ROIALS", start: 2350, end: 3150 },
      { word: "ALPHA",  start: 3150, end: 3950 },
      { word: "1337",   start: 3950, end: 5500 }
    ];

    const draw = () => {
      // Create the fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + 'px monospace';

      const elapsed = Date.now() - startTime;
      const currentTarget = targetSequence.find(t => elapsed >= t.start && elapsed < t.end);

      for (let i = 0; i < rainDrops.length; i++) {
        let text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        
        // Define standard rain drop color
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        
        // --- ADVANCED CANVAS LETTER LOCKING ---
        if (currentTarget) {
          const word = currentTarget.word;
          const startCol = Math.floor((columns - word.length) / 2);
          const targetRow = Math.floor(rows / 2) + 4; // Render just below the loading bar

          if (i >= startCol && i < startCol + word.length) {
            const charIndex = i - startCol;
            
            // If the rain has passed this row, we force the proper character to stay frozen & glowing
            if (rainDrops[i] >= targetRow) {
               ctx.fillStyle = '#FFFFFF';
               ctx.shadowBlur = 8;
               ctx.shadowColor = '#FFFFFF';
               ctx.fillText(word[charIndex], i * fontSize, targetRow * fontSize);
               ctx.shadowBlur = 0; // Reset
            }

            // As the head of the drop hits the exact row, make the drop characters match the word
            if (rainDrops[i] === targetRow) {
               text = word[charIndex];
               ctx.fillStyle = '#FFFFFF';
            }
          }
        }

        // Draw the moving rain drop
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        // Reset drops to top randomly to keep continuous rain flow
        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const intervalId = setInterval(draw, 35); // Run ~30 fps

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />
      <div className="relative z-10 text-center animate-pulse mt-[-8rem]">
        <h1 className="text-white font-mono text-2xl md:text-5xl tracking-[0.3em] uppercase mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
          SYSTEM_BOOT_SEQUENCE
        </h1>
        <p className="text-white/70 font-mono text-sm tracking-widest uppercase mt-4">
          Decrypting Alpha Modules...
        </p>
        <div className="w-64 h-1 bg-white/20 rounded overflow-hidden mt-8 mx-auto">
          <div className="h-full bg-white shadow-[0_0_10px_#FFFFFF] animate-[matrixLoad_5.3s_ease-out_forwards]"></div>
        </div>
      </div>
      <style>{`
        @keyframes matrixLoad {
          0% { width: 0%; }
          20% { width: 20%; }
          40% { width: 45%; }
          60% { width: 70%; }
          80% { width: 85%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
