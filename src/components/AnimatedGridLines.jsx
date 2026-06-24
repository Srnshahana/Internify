import React, { useRef, useEffect } from 'react';

export const AnimatedGridLines = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ctx.scale(dpr, dpr);
    };

    const drawLines = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      const gap = 40; // Grid spacing
      const mouseRadius = 150;
      const distortionStrength = 15;

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)'; // Sky blue, slightly more visible
      ctx.lineWidth = 1;

      // Draw vertical lines
      for (let x = 0; x <= window.innerWidth; x += gap) {
        ctx.beginPath();
        for (let y = 0; y <= window.innerHeight; y += 10) {
          let drawX = x;
          const dx = mouse.current.x - x;
          const dy = mouse.current.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius;
            drawX -= (dx / distance) * force * distortionStrength;
          }

          if (y === 0) ctx.moveTo(drawX, y);
          else ctx.lineTo(drawX, y);
        }
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y <= window.innerHeight; y += gap) {
        ctx.beginPath();
        for (let x = 0; x <= window.innerWidth; x += 10) {
          let drawY = y;
          const dx = mouse.current.x - x;
          const dy = mouse.current.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius;
            drawY -= (dy / distance) * force * distortionStrength;
          }

          if (x === 0) ctx.moveTo(x, drawY);
          else ctx.lineTo(x, drawY);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(drawLines);
    };

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    resize();
    drawLines();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none', // Crucial: lets clicks pass through to cards
        zIndex: 0
      }} 
    />
  );
};
