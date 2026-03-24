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
    const columns = canvas.width / fontSize;

    const rainDrops: number[] = [];

    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const intervalId = setInterval(draw, 30);

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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
      <div className="relative z-10 text-center animate-pulse">
        <h1 className="text-[#0F0] font-mono text-2xl md:text-5xl tracking-[0.3em] uppercase mb-4 drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]">
          SYSTEM_BOOT_SEQUENCE
        </h1>
        <p className="text-[#0F0]/70 font-mono text-sm tracking-widest uppercase mt-4">
          Decrypting Alpha Modules...
        </p>
        <div className="w-64 h-1 bg-[#0F0]/20 rounded overflow-hidden mt-8 mx-auto">
          <div className="h-full bg-[#0F0] shadow-[0_0_10px_#0F0] animate-[matrixLoad_2.8s_ease-out_forwards]"></div>
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
