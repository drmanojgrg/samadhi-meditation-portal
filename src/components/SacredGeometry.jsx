import React, { useEffect, useRef } from 'react';

const SacredGeometry = ({ isActive, breathPhase, breathState }) => {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    let time = 0;
    let pulsePhase = 0;

    const animate = () => {
      if (!isActive) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      time += 0.016; // ~60fps
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sync with breath state
      if (breathState) {
        if (breathState.phase === 'inhale') {
          pulsePhase = Math.min(pulsePhase + 0.02, 1);
        } else if (breathState.phase === 'exhale') {
          pulsePhase = Math.max(pulsePhase - 0.02, 0);
        }
      }

      // Phase-based colors and patterns
      const phaseColors = {
        1: { primary: [138, 43, 226], secondary: [75, 0, 130] }, // Purple
        2: { primary: [0, 191, 255], secondary: [25, 25, 112] }, // Deep blue
        3: { primary: [255, 215, 0], secondary: [255, 140, 0] }  // Golden
      };

      const colors = phaseColors[breathPhase] || phaseColors[1];
      
      // Sacred geometry patterns
      drawFlowerOfLife(ctx, centerX, centerY, pulsePhase, colors, time);
      drawMeditationRings(ctx, centerX, centerY, pulsePhase, colors, time);
      drawBreathGuide(ctx, centerX, centerY, breathState, colors);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive, breathPhase, breathState]);

  const drawFlowerOfLife = (ctx, centerX, centerY, pulse, colors, time) => {
    const baseRadius = 60 + pulse * 40;
    const numCircles = 6;
    
    ctx.strokeStyle = `rgba(${colors.primary.join(',')}, ${0.3 + pulse * 0.4})`;
    ctx.lineWidth = 2;
    
    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Surrounding circles
    for (let i = 0; i < numCircles; i++) {
      const angle = (i / numCircles) * Math.PI * 2 + time * 0.5;
      const x = centerX + Math.cos(angle) * baseRadius;
      const y = centerY + Math.sin(angle) * baseRadius;
      
      ctx.beginPath();
      ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawMeditationRings = (ctx, centerX, centerY, pulse, colors, time) => {
    const numRings = 5;
    
    for (let i = 0; i < numRings; i++) {
      const radius = 150 + i * 50 + pulse * 30;
      const alpha = (0.5 - i * 0.08) * (0.3 + pulse * 0.7);
      
      ctx.strokeStyle = `rgba(${colors.secondary.join(',')}, ${alpha})`;
      ctx.lineWidth = 1 + pulse * 2;
      ctx.setLineDash([10, 5]);
      ctx.lineDashOffset = -time * 20;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.setLineDash([]); // Reset dash
  };

  const drawBreathGuide = (ctx, centerX, centerY, breathState, colors) => {
    if (!breathState) return;
    
    const { phase, progress } = breathState;
    let guideRadius = 40;
    let alpha = 0.8;
    
    if (phase === 'inhale') {
      guideRadius = 40 + progress * 60;
      alpha = 0.8 - progress * 0.3;
    } else if (phase === 'hold') {
      guideRadius = 100;
      alpha = 0.8 + Math.sin(progress * Math.PI * 8) * 0.2;
    } else if (phase === 'exhale') {
      guideRadius = 100 - progress * 60;
      alpha = 0.5 + progress * 0.3;
    }
    
    // Breath guide circle
    ctx.fillStyle = `rgba(${colors.primary.join(',')}, ${alpha * 0.2})`;
    ctx.strokeStyle = `rgba(${colors.primary.join(',')}, ${alpha})`;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, guideRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Phase indicator text
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(phase.toUpperCase(), centerX, centerY + 5);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  );
};

export default SacredGeometry;