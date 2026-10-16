import React, { useEffect, useState, useMemo } from 'react';
import { RealisticTulip, RealisticCarnation, RealisticRose } from './RealisticFlowers';

export interface FlowerSpiralItem {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'tulip' | 'carnation' | 'rose';
  delay: number;
}

export const FlowerSpiral: React.FC = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const flowers: FlowerSpiralItem[] = useMemo(() => {
    const isMobile = dimensions.width < 700;
    // Expanded count to fill the entire screen
    const count = isMobile ? 85 : 150;
    // Radius factor increased to 0.76 of largest dimension to blanket the entire viewport edge-to-edge
    const maxRadius = Math.max(dimensions.width, dimensions.height) * 0.76;
    const goldenAngle = 137.5 * (Math.PI / 180);
    const flowerTypes: ('tulip' | 'carnation' | 'rose')[] = ['tulip', 'carnation', 'rose'];

    const items: FlowerSpiralItem[] = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      // Exponential distribution spreading from central core out to screen perimeters
      const radius = 24 + Math.pow(t, 0.72) * maxRadius;
      const angle = i * goldenAngle;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const type = flowerTypes[i % 3];
      // Size expands towards the outer edges for grand depth
      const size = 26 + t * 62;
      const delay = Math.min(i * 0.038, 4.0);

      items.push({
        id: i,
        x,
        y,
        size,
        type,
        delay,
      });
    }
    return items;
  }, [dimensions]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {flowers.map((fl) => (
        <div
          key={fl.id}
          className="flower absolute"
          style={{
            left: `calc(50% + ${fl.x}px)`,
            top: `calc(50% + ${fl.y}px)`,
            width: `${fl.size}px`,
            height: `${fl.size}px`,
            marginLeft: `${-fl.size / 2}px`,
            marginTop: `${-fl.size / 2}px`,
            animationDelay: `${fl.delay}s, ${fl.delay + 1.8}s`,
          }}
        >
          {fl.type === 'tulip' && <RealisticTulip size="100%" />}
          {fl.type === 'carnation' && <RealisticCarnation size="100%" />}
          {fl.type === 'rose' && <RealisticRose size="100%" />}
        </div>
      ))}
    </div>
  );
};
