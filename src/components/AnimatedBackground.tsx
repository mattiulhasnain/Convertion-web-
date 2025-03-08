'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ParticleType {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  direction: number;
  opacity: number;
  growth: number;
  sway: number;
  swayCount: number;
}

interface AnimatedBackgroundProps {
  variant: 'default' | 'pdf' | 'format' | 'video' | 'audio' | 'audioVideo' | 'hero';
  className?: string;
  interactiveMode?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  variant = 'default', 
  className = '', 
  interactiveMode = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<{x: number, y: number} | null>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  
  // Define color schemes for different variants
  const colorSchemes = {
    default: ['#1A237E', '#6A1B9A', '#D81B60', '#3949AB', '#8E24AA'],
    pdf: ['#D32F2F', '#C2185B', '#7B1FA2', '#E57373', '#F06292'],
    format: ['#00796B', '#0097A7', '#00838F', '#26A69A', '#4DB6AC'],
    video: ['#303F9F', '#1976D2', '#0288D1', '#5C6BC0', '#42A5F5'],
    audio: ['#7B1FA2', '#512DA8', '#303F9F', '#9575CD', '#7986CB'],
    audioVideo: ['#C2185B', '#7B1FA2', '#512DA8', '#EC407A', '#AB47BC'],
    hero: ['#6A1B9A', '#303F9F', '#0097A7', '#7B1FA2', '#D81B60', '#00796B'],
  };
  
  const colors = colorSchemes[variant];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    setCanvasDimensions();

    // Particle settings based on variant
    const getParticleCount = () => {
      const baseCount = Math.min(window.innerWidth, window.innerHeight) / 10;
      
      switch (variant) {
        case 'hero':
          return Math.floor(baseCount * 1.5); // More particles for hero
        case 'pdf':
        case 'format':
          return Math.floor(baseCount * 0.8);
        case 'video':
        case 'audio':
        case 'audioVideo':
          return Math.floor(baseCount * 1.2);
        default:
          return Math.floor(baseCount);
      }
    };

    // Create particles
    const createParticles = () => {
      const particles: ParticleType[] = [];
      const particleCount = getParticleCount();
      
      for (let i = 0; i < particleCount; i++) {
        const size = variant === 'hero' 
          ? Math.random() * 6 + 1 // Larger particles for hero
          : Math.random() * 4 + 1;
          
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: variant === 'hero' ? (Math.random() * 0.8 + 0.2) : (Math.random() * 0.5 + 0.1),
          direction: Math.random() * Math.PI * 2,
          opacity: variant === 'hero' ? (Math.random() * 0.6 + 0.2) : (Math.random() * 0.5 + 0.1),
          growth: Math.random() * 0.02 - 0.01,
          sway: Math.random() * 0.02 - 0.01,
          swayCount: 0
        });
      }
      
      return particles;
    };

    let particles = createParticles();
    let animationFrameId: number;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Special background for hero variant
      if (variant === 'hero') {
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#f5f5f580');
        gradient.addColorStop(1, '#f0f0f080');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update particle position
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;
        
        // Apply sway effect
        particle.swayCount += particle.sway;
        particle.x += Math.sin(particle.swayCount) * 0.3;
        
        // Update particle size with breathing effect
        particle.size += particle.growth;
        if (particle.size < 0.5 || particle.size > (variant === 'hero' ? 8 : 5)) {
          particle.growth = -particle.growth;
        }
        
        // Wrap around edges
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
        
        // Interactive mode - particles react to mouse
        if (interactiveMode && isMouseOver && mousePosition) {
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = variant === 'hero' ? 150 : 100;
          
          if (distance < maxDistance) {
            const angle = Math.atan2(dy, dx);
            const force = (maxDistance - distance) / maxDistance;
            
            // Push particles away from mouse
            particle.x -= Math.cos(angle) * force * (variant === 'hero' ? 2 : 1);
            particle.y -= Math.sin(angle) * force * (variant === 'hero' ? 2 : 1);
            
            // Increase opacity when near mouse
            particle.opacity = Math.min(1, particle.opacity + 0.02);
          } else {
            // Gradually return to original opacity
            particle.opacity = Math.max(0.1, particle.opacity - 0.01);
          }
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Set fill style with opacity
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // Draw glow effect for hero variant
        if (variant === 'hero' && particle.size > 3) {
          const glow = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
          );
          glow.addColorStop(0, `${particle.color}${Math.floor(particle.opacity * 30).toString(16).padStart(2, '0')}`);
          glow.addColorStop(1, `${particle.color}00`);
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }
        
        // Connect nearby particles with lines for hero variant
        if (variant === 'hero') {
          for (let j = index + 1; j < particles.length; j++) {
            const otherParticle = particles[j];
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `${particle.color}${Math.floor(0.2 * (1 - distance / 100) * 255).toString(16).padStart(2, '0')}`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    
    const handleMouseEnter = () => {
      setIsMouseOver(true);
    };
    
    const handleMouseLeave = () => {
      setIsMouseOver(false);
      setMousePosition(null);
    };
    
    // Add event listeners
    if (interactiveMode) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseenter', handleMouseEnter);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      
      // Touch events for mobile
      canvas.addEventListener('touchstart', (e) => {
        setIsMouseOver(true);
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        setMousePosition({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
      });
      
      canvas.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        setMousePosition({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
      });
      
      canvas.addEventListener('touchend', () => {
        setIsMouseOver(false);
        setMousePosition(null);
      });
    }
    
    // Handle window resize
    const handleResize = () => {
      setCanvasDimensions();
      particles = createParticles();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Handle visibility change to pause animation when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (interactiveMode) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseenter', handleMouseEnter);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [variant, colors, interactiveMode]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full -z-10 ${className}`}
      style={{ 
        background: variant === 'hero' ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' : 'transparent'
      }}
    />
  );
};

export default AnimatedBackground; 