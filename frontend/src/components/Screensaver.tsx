import React, { useState, useEffect } from 'react';

interface ScreensaverProps {
  onActivity: () => void;
}

interface FloatingLogo {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export default function Screensaver({ onActivity }: ScreensaverProps) {
  const [logos, setLogos] = useState<FloatingLogo[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mode, setMode] = useState<'logos' | 'matrix' | 'pipes'>('logos');

  useEffect(() => {
    // Initialize floating logos
    const initialLogos: FloatingLogo[] = [];
    for (let i = 0; i < 5; i++) {
      initialLogos.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 40 + 60,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 4
      });
    }
    setLogos(initialLogos);

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Animate logos
    const animationInterval = setInterval(() => {
      setLogos(prevLogos => 
        prevLogos.map(logo => {
          let newX = logo.x + logo.vx;
          let newY = logo.y + logo.vy;
          let newVx = logo.vx;
          let newVy = logo.vy;

          // Bounce off edges
          if (newX <= 0 || newX >= window.innerWidth - logo.size) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(window.innerWidth - logo.size, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight - logo.size) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(window.innerHeight - logo.size, newY));
          }

          return {
            ...logo,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: logo.rotation + logo.rotationSpeed
          };
        })
      );
    }, 16); // ~60fps

    // Change mode every 30 seconds
    const modeInterval = setInterval(() => {
      setMode(prev => {
        const modes: typeof mode[] = ['logos', 'matrix', 'pipes'];
        const currentIndex = modes.indexOf(prev);
        return modes[(currentIndex + 1) % modes.length];
      });
    }, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(animationInterval);
      clearInterval(modeInterval);
    };
  }, []);

  const handleClick = () => {
    onActivity();
  };

  const handleKeyPress = (_e: React.KeyboardEvent) => {
    onActivity();
  };

  const renderLogosMode = () => (
    <div className="relative w-full h-full">
      {logos.map(logo => (
        <div
          key={logo.id}
          className="absolute flex items-center justify-center bg-win95-blue border-4 border-white shadow-lg"
          style={{
            left: logo.x,
            top: logo.y,
            width: logo.size,
            height: logo.size,
            transform: `rotate(${logo.rotation}deg)`,
            borderRadius: '8px'
          }}
        >
          <span className="text-white font-bold text-lg">🏢</span>
        </div>
      ))}
    </div>
  );

  const renderMatrixMode = () => {
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = Math.floor(window.innerWidth / 20);
    
    return (
      <div className="relative w-full h-full bg-black overflow-hidden">
        {Array.from({ length: columns }, (_, i) => (
          <div
            key={i}
            className="absolute top-0 text-green-400 font-mono text-sm animate-pulse"
            style={{
              left: i * 20,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            {Array.from({ length: Math.floor(window.innerHeight / 20) }, (_, j) => (
              <div key={j} className="h-5">
                {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderPipesMode = () => (
    <div className="relative w-full h-full bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-green-400 font-mono text-lg animate-pulse">
          <div className="mb-4">┌─────────────────────────────────┐</div>
          <div className="mb-4">│  ASSOCIATION MANAGEMENT SYSTEM  │</div>
          <div className="mb-4">│                                 │</div>
          <div className="mb-4">│  ████████████████████████████   │</div>
          <div className="mb-4">│  ██                        ██   │</div>
          <div className="mb-4">│  ██  SCREENSAVER ACTIVE    ██   │</div>
          <div className="mb-4">│  ██                        ██   │</div>
          <div className="mb-4">│  ████████████████████████████   │</div>
          <div className="mb-4">│                                 │</div>
          <div className="mb-4">│  Press any key to continue...   │</div>
          <div>└─────────────────────────────────┘</div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black cursor-none z-50 overflow-hidden"
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Screensaver Content */}
      {mode === 'logos' && renderLogosMode()}
      {mode === 'matrix' && renderMatrixMode()}
      {mode === 'pipes' && renderPipesMode()}

      {/* Clock */}
      <div className="absolute top-8 right-8 text-white font-mono text-2xl bg-black bg-opacity-50 px-4 py-2 rounded border-2 border-white">
        {currentTime.toLocaleTimeString()}
      </div>

      {/* Mode Indicator */}
      <div className="absolute top-8 left-8 text-white font-mono text-sm bg-black bg-opacity-50 px-3 py-1 rounded border border-white">
        Mode: {mode.toUpperCase()}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white font-mono text-sm bg-black bg-opacity-50 px-4 py-2 rounded border border-white text-center">
        <div className="mb-1">🖱️ Click anywhere or press any key to return</div>
        <div className="text-xs opacity-75">Association Member Management System v2.0</div>
      </div>

      {/* Retro Computer Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-transparent to-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-5 animate-pulse"></div>
      </div>

      {/* Scanlines Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
        }}
      ></div>
    </div>
  );
}
