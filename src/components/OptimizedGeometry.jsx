import React, { useMemo, useCallback } from 'react';

const OptimizedGeometry = ({ breathPhase, phase, breathProgress, cycleProgress, rotation, preciseTime }) => {
  // PRE-CALCULATED BRANCH PATTERNS (only recalculate on breathPhase change)
  const calculateBranchPatterns = useCallback((phase) => {
    const patterns = { phase1: [], phase2: [], phase3: [] };
    const centerX = 200;
    const centerY = 200;
    
    // Phase 1: Tree branches (pre-calculated structure)
    const phase1Branches = [];
    const buildTreeBranch = (x, y, angle, length, depth, maxDepth = 7) => {
      if (depth > maxDepth || length < 2) return;
      
      const rad = angle * Math.PI / 180;
      const endX = x + Math.cos(rad) * length;
      const endY = y + Math.sin(rad) * length;
      
      phase1Branches.push({ x, y, endX, endY, depth });
      
      const numChildren = 3;
      for (let i = 0; i < numChildren; i++) {
        const childAngle = angle + (i - 1) * 30;
        buildTreeBranch(endX, endY, childAngle, length * 0.6, depth + 1, maxDepth);
      }
    };
    
    [0, 90, 180, 270].forEach(angle => buildTreeBranch(centerX, centerY, angle, 60, 0));
    patterns.phase1 = phase1Branches;
    
    // Phase 2: Spiral structure (pre-calculated)
    const phase2Spirals = [];
    const buildSpiral = (startAngle, spiralOffset, maxDepth = 9) => {
      let x = centerX;
      let y = centerY;
      let angle = startAngle;
      let length = 50;
      
      for (let depth = 0; depth < maxDepth; depth++) {
        const rad = (angle + spiralOffset) * Math.PI / 180;
        const endX = x + Math.cos(rad) * length;
        const endY = y + Math.sin(rad) * length;
        
        phase2Spirals.push({ x, y, endX, endY, depth });
        
        x = endX;
        y = endY;
        angle += 137.5; // Golden angle
        length *= 0.65;
      }
    };
    
    [0, 120, 240].forEach((angle, i) => buildSpiral(angle, i * 30));
    patterns.phase2 = phase2Spirals;
    
    // Phase 3: Particle positions (pre-calculated)
    const phase3Particles = [];
    for (let i = 0; i < 150; i++) {
      const angle = (i / 150) * 360;
      const layer = i % 11;
      phase3Particles.push({ angle, layer, index: i });
    }
    patterns.phase3 = phase3Particles;
    
    return patterns;
  }, []);

  // Memoize branch patterns - only recalculate when breathPhase changes
  const branchPatterns = useMemo(() => {
    return calculateBranchPatterns(breathPhase);
  }, [breathPhase, calculateBranchPatterns]);

  // OPTIMIZED RENDER with pre-calculated patterns
  const renderOptimizedGeometry = useCallback(() => {
    const centerX = 200;
    const centerY = 200;
    
    const breathIntensity = phase === 'inhale' ? breathProgress : 
                           phase === 'exhale' ? 1 - breathProgress :
                           phase === 'holdTop' ? 1.0 : 0.3;
    
    const hueShift = cycleProgress * 60;
    const opacityMod = 0.4 + breathIntensity * 0.4;
    
    if (breathPhase === 1) {
      // Use pre-calculated tree branches
      return (
        <g>
          {branchPatterns.phase1.map((branch, idx) => {
            const breathGrowth = breathIntensity * (1 - branch.depth / 7);
            const actualEndX = branch.x + (branch.endX - branch.x) * breathGrowth;
            const actualEndY = branch.y + (branch.endY - branch.y) * breathGrowth;
            
            const depthOpacity = (1 - branch.depth / 7 * 0.6) * opacityMod;
            const color = `hsl(${200 + hueShift}, 70%, ${50 + branch.depth * 3}%)`;
            
            return (
              <line
                key={`branch-${idx}`}
                x1={branch.x}
                y1={branch.y}
                x2={actualEndX}
                y2={actualEndY}
                stroke={color}
                strokeWidth={Math.max(1, 4 - branch.depth)}
                opacity={depthOpacity}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={centerX} cy={centerY} r={3} fill={`hsl(${180 + hueShift}, 80%, 60%)`} opacity={0.9} />
        </g>
      );
    } else if (breathPhase === 2) {
      // Use pre-calculated spirals
      return (
        <g transform={`rotate(${rotation * 0.3} ${centerX} ${centerY})`}>
          {branchPatterns.phase2.map((spiral, idx) => {
            const breathGrowth = breathIntensity * (1 - spiral.depth / 9 * 0.5);
            const actualEndX = spiral.x + (spiral.endX - spiral.x) * breathGrowth;
            const actualEndY = spiral.y + (spiral.endY - spiral.y) * breathGrowth;
            
            const depthOpacity = (1 - spiral.depth / 9 * 0.7) * opacityMod;
            const color = `hsl(${280 + hueShift}, 80%, ${40 + spiral.depth * 4}%)`;
            
            return (
              <line
                key={`spiral-${idx}`}
                x1={spiral.x}
                y1={spiral.y}
                x2={actualEndX}
                y2={actualEndY}
                stroke={color}
                strokeWidth={Math.max(0.5, 3 - spiral.depth * 0.3)}
                opacity={depthOpacity}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={centerX} cy={centerY} r={5} fill="#ec4899" opacity={0.8} />
        </g>
      );
    } else {
      // Use pre-calculated particles
      return (
        <g>
          {branchPatterns.phase3.map((particle) => {
            const angle = particle.angle + rotation * 0.2;
            const distance = 20 + particle.layer * 12 * breathIntensity;
            const x = centerX + Math.cos(angle * Math.PI / 180) * distance;
            const y = centerY + Math.sin(angle * Math.PI / 180) * distance;
            
            const particleOpacity = (1 - particle.index / 150 * 0.8) * opacityMod * 0.3;
            const size = 1 + Math.sin(particle.index + preciseTime) * 0.5;
            const color = `hsl(${320 + hueShift}, 90%, ${60 + (particle.index % 40)}%)`;
            
            return (
              <circle
                key={`particle-${particle.index}`}
                cx={x}
                cy={y}
                r={size}
                fill={color}
                opacity={particleOpacity}
              />
            );
          })}
          <circle cx={centerX} cy={centerY} r={3} fill="#ffffff" opacity={opacityMod * 0.5} />
        </g>
      );
    }
  }, [breathPhase, branchPatterns, phase, breathProgress, cycleProgress, rotation, preciseTime]);

  return (
    <svg width="400" height="400">
      {renderOptimizedGeometry()}
      <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    </svg>
  );
};

export default OptimizedGeometry;