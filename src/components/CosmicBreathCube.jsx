import React, { useEffect, useRef } from 'react';

const CosmicBreathCube = ({ isActive, breathState, breathPhase }) => {
  const cubeRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!cubeRef.current) return;

    const cube = cubeRef.current;
    let rotation = { x: 0, y: 0, z: 0 };
    let scale = 1;
    let pulsePhase = 0;

    const animate = () => {
      if (!isActive) {
        // Gentle idle rotation when not active
        rotation.y += 0.005;
        cube.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) scale(${scale})`;
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Sync with breath state
      if (breathState) {
        const { phase, progress } = breathState;
        
        if (phase === 'inhale') {
          // Expand and rotate during inhale
          scale = 1 + progress * 0.8;
          rotation.x += 0.8;
          rotation.y += 1.2;
          pulsePhase = progress;
        } else if (phase === 'hold') {
          // Gentle pulsing during hold
          const holdPulse = Math.sin(progress * Math.PI * 6) * 0.1;
          scale = 1.8 + holdPulse;
          rotation.x += 0.3;
          rotation.y += 0.5;
          rotation.z += 0.2;
        } else if (phase === 'exhale') {
          // Contract and slow rotation during exhale
          scale = 1.8 - progress * 0.8;
          rotation.x += 0.4;
          rotation.y += 0.6;
          pulsePhase = 1 - progress;
        }

        // Phase-based rotation speed
        const phaseMultiplier = breathPhase * 0.3;
        rotation.x += phaseMultiplier;
        rotation.y += phaseMultiplier * 1.5;
        rotation.z += phaseMultiplier * 0.5;
      }

      // Apply transformations
      cube.style.transform = `
        rotateX(${rotation.x}deg) 
        rotateY(${rotation.y}deg) 
        rotateZ(${rotation.z}deg) 
        scale(${scale})
      `;

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive, breathState, breathPhase]);

  // Phase-based colors
  const phaseColors = {
    1: 'from-purple-500/30 via-indigo-500/20 to-purple-600/30', // Preparation
    2: 'from-indigo-500/30 via-blue-500/20 to-indigo-600/30',   // Deep Meditation
    3: 'from-yellow-500/30 via-orange-500/20 to-yellow-600/30'  // Integration
  };

  const currentGradient = phaseColors[breathPhase] || phaseColors[1];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="cube-container perspective-1000">
        <div 
          ref={cubeRef}
          className="cube-3d preserve-3d"
          style={{
            width: '200px',
            height: '200px',
            transformStyle: 'preserve-3d',
            transition: isActive ? 'none' : 'transform 2s ease-in-out'
          }}
        >
          {/* Cube faces */}
          <div className={`cube-face cube-front bg-gradient-to-br ${currentGradient} border border-white/10`} />
          <div className={`cube-face cube-back bg-gradient-to-br ${currentGradient} border border-white/10`} />
          <div className={`cube-face cube-right bg-gradient-to-br ${currentGradient} border border-white/10`} />
          <div className={`cube-face cube-left bg-gradient-to-br ${currentGradient} border border-white/10`} />
          <div className={`cube-face cube-top bg-gradient-to-br ${currentGradient} border border-white/10`} />
          <div className={`cube-face cube-bottom bg-gradient-to-br ${currentGradient} border border-white/10`} />
          
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-white/5 rounded-lg cube-glow animate-pulse" />
        </div>
      </div>
      
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .cube-face {
          position: absolute;
          width: 200px;
          height: 200px;
          opacity: 0.7;
          backdrop-filter: blur(2px);
        }
        
        .cube-front {
          transform: rotateY(0deg) translateZ(100px);
        }
        
        .cube-back {
          transform: rotateY(180deg) translateZ(100px);
        }
        
        .cube-right {
          transform: rotateY(90deg) translateZ(100px);  
        }
        
        .cube-left {
          transform: rotateY(-90deg) translateZ(100px);
        }
        
        .cube-top {
          transform: rotateX(90deg) translateZ(100px);
        }
        
        .cube-bottom {
          transform: rotateX(-90deg) translateZ(100px);
        }
        
        .cube-glow {
          box-shadow: 
            inset 0 0 20px rgba(147, 51, 234, 0.3),
            0 0 40px rgba(147, 51, 234, 0.2),
            0 0 80px rgba(147, 51, 234, 0.1);
        }
        
        @media (max-width: 768px) {
          .cube-face {
            width: 150px;
            height: 150px;
          }
          
          .cube-front, .cube-back, .cube-right, .cube-left, .cube-top, .cube-bottom {
            transform-origin: center;
          }
          
          .cube-front {
            transform: rotateY(0deg) translateZ(75px);
          }
          
          .cube-back {
            transform: rotateY(180deg) translateZ(75px);
          }
          
          .cube-right {
            transform: rotateY(90deg) translateZ(75px);  
          }
          
          .cube-left {
            transform: rotateY(-90deg) translateZ(75px);
          }
          
          .cube-top {
            transform: rotateX(90deg) translateZ(75px);
          }
          
          .cube-bottom {
            transform: rotateX(-90deg) translateZ(75px);
          }
        }
      `}</style>
    </div>
  );
};

export default CosmicBreathCube;