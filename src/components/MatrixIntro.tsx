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

      ctx.fillStyle = '#FFFFFF';
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
        <h1 className="text-white font-mono text-2xl md:text-5xl tracking-[0.3em] uppercase mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
          SYSTEM_BOOT_SEQUENCE
        </h1>
        <p className="text-white/70 font-mono text-sm tracking-widest uppercase mt-4">
          Decrypting Alpha Modules...
        </p>
        <div className="w-64 h-1 bg-white/20 rounded overflow-hidden mt-8 mx-auto">
          <div className="h-full bg-white shadow-[0_0_10px_#FFFFFF] animate-[matrixLoad_2.8s_ease-out_forwards]"></div>
        </div>

        {/* INJECTED TEXT ELEMENTS */}
        <div className="h-12 mt-6 relative flex justify-center items-center">
          <span className="absolute font-mono text-2xl md:text-3xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-0 animate-[glitchWord1_2.8s_linear_forwards]">
            3lit3
          </span>
          <span className="absolute font-mono text-2xl md:text-3xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-0 animate-[glitchWord2_2.8s_linear_forwards]">
            Alpha
          </span>
          <span className="absolute font-mono text-2xl md:text-3xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-0 animate-[glitchWord3_2.8s_linear_forwards]">
            Roials
          </span>
          <span className="absolute font-mono text-2xl md:text-3xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-0 animate-[glitchWord4_2.8s_linear_forwards]">
            Alpha
          </span>
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

        @keyframes glitchWord1 {
          0%, 9% { opacity: 0; filter: blur(5px); transform: scale(0.95); }
          10% { opacity: 1; filter: blur(0px); transform: scale(1); }
          12% { transform: translate(2px, -2px); text-shadow: -2px 0 rgba(255,255,255,0.5), 2px 0 rgba(150,150,150,0.8); }
          14% { transform: translate(-2px, 2px); text-shadow: 2px 0 rgba(255,255,255,0.5), -2px 0 rgba(150,150,150,0.8); }
          16% { transform: translate(0, 0); text-shadow: none; }
          25% { opacity: 1; filter: blur(0px); transform: scale(1); }
          28%, 100% { opacity: 0; filter: blur(10px); transform: scale(1.1); }
        }

        @keyframes glitchWord2 {
          0%, 29% { opacity: 0; filter: blur(5px); transform: scale(0.95); }
          30% { opacity: 1; filter: blur(0px); transform: scale(1); }
          32% { transform: translate(-2px, -2px); text-shadow: -2px 0 rgba(255,255,255,0.5), 2px 0 rgba(150,150,150,0.8); }
          34% { transform: translate(2px, 2px); text-shadow: 2px 0 rgba(255,255,255,0.5), -2px 0 rgba(150,150,150,0.8); }
          36% { transform: translate(0, 0); text-shadow: none; }
          50% { opacity: 1; filter: blur(0px); transform: scale(1); }
          53%, 100% { opacity: 0; filter: blur(10px); transform: scale(1.1); }
        }

        @keyframes glitchWord3 {
          0%, 54% { opacity: 0; filter: blur(5px); transform: scale(0.95); }
          55% { opacity: 1; filter: blur(0px); transform: scale(1); }
          57% { transform: translate(2px, -2px); text-shadow: -2px 0 rgba(255,255,255,0.5), 2px 0 rgba(150,150,150,0.8); }
          59% { transform: translate(-2px, 2px); text-shadow: 2px 0 rgba(255,255,255,0.5), -2px 0 rgba(150,150,150,0.8); }
          61% { transform: translate(0, 0); text-shadow: none; }
          75% { opacity: 1; filter: blur(0px); transform: scale(1); }
          78%, 100% { opacity: 0; filter: blur(10px); transform: scale(1.1); }
        }

        @keyframes glitchWord4 {
          0%, 79% { opacity: 0; filter: blur(5px); transform: scale(0.95); }
          80% { opacity: 1; filter: blur(0px); transform: scale(1); }
          82% { transform: translate(-2px, -2px); text-shadow: -2px 0 rgba(255,255,255,0.5), 2px 0 rgba(150,150,150,0.8); }
          84% { transform: translate(2px, 2px); text-shadow: 2px 0 rgba(255,255,255,0.5), -2px 0 rgba(150,150,150,0.8); }
          86% { transform: translate(0, 0); text-shadow: none; }
          95% { opacity: 1; filter: blur(0px); }
          100% { opacity: 0; filter: blur(10px); }
        }
      `}</style>
    </div>
  );
};
