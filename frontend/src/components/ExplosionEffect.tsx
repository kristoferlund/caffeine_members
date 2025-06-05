import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export default function ExplosionEffect() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Create initial explosion particles
    const newParticles: Particle[] = [];
    const colors = ['#ff6b35', '#f7931e', '#ffcc02', '#fff200', '#ff4757', '#ff3838'];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 60,
        maxLife: 60
      });
    }

    // Add some fire sprites moving from bottom to top
    for (let i = 50; i < 80; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 8 - 5,
        size: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * 3)], // More orange/red colors
        life: 80,
        maxLife: 80
      });
    }

    setParticles(newParticles);

    // Animation loop
    const animate = () => {
      setParticles(prevParticles => {
        return prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.3, // Gravity
            life: particle.life - 1
          }))
          .filter(particle => particle.life > 0);
      });
    };

    const interval = setInterval(animate, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Flash effect */}
      <div className="absolute inset-0 bg-white opacity-80 animate-flash"></div>
      
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: particle.x - particle.size / 2,
            top: particle.y - particle.size / 2,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life / particle.maxLife,
            boxShadow: `0 0 ${particle.size}px ${particle.color}`,
          }}
        />
      ))}

      {/* Cartoon explosion burst */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="explosion-burst animate-explosion-burst">
          <div className="text-8xl animate-bounce">💥</div>
        </div>
      </div>

      {/* Additional cartoon effects */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin-slow">
          <div className="text-6xl">✨</div>
        </div>
      </div>
    </div>
  );
}
