import { useEffect, useRef, type FC } from "react";
import classes from "../LandingPages.module.css";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface GlowOrb {
  x: number;
  y: number;
  radius: number;
  hue: number;
  phase: number;
  speed: number;
}

export const ParticleBackground: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const orbsRef = useRef<GlowOrb[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 12000);

      for (let i = 0; i < Math.min(particleCount, 150); i++) {
        // Mix of green (155-170), cyan (180-195), and blue (210-240)
        const hueRanges = [[155, 170], [180, 195], [210, 240]];
        const selectedRange = hueRanges[Math.floor(Math.random() * hueRanges.length)];
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.1,
          hue: selectedRange[0] + Math.random() * (selectedRange[1] - selectedRange[0]),
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }
      particlesRef.current = particles;

      // Create glowing orbs - fewer and more subtle
      const orbs: GlowOrb[] = [];
      const orbHues = [160, 190, 220, 250]; // green, cyan, blue, purple
      for (let i = 0; i < 3; i++) {
        orbs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 80 + Math.random() * 100,
          hue: orbHues[i % orbHues.length],
          phase: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.005,
        });
      }
      orbsRef.current = orbs;
    };

    const drawGlowOrbs = () => {
      const orbs = orbsRef.current;
      
      orbs.forEach((orb) => {
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );
        const pulseOpacity = 0.015 + Math.sin(orb.phase) * 0.01;
        gradient.addColorStop(0, `hsla(${orb.hue}, 60%, 45%, ${pulseOpacity})`);
        gradient.addColorStop(0.5, `hsla(${orb.hue}, 50%, 35%, ${pulseOpacity * 0.4})`);
        gradient.addColorStop(1, "transparent");
        
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw glow orbs first (background layer)
      drawGlowOrbs();

      const particles = particlesRef.current;
      const time = timeRef.current;

      // Draw connections with gradient
      particles.forEach((particle, i) => {
        // Pulse effect
        const pulseFactor = 1 + Math.sin(particle.pulsePhase) * 0.3;
        
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 140) {
            const opacity = 0.18 * (1 - distance / 140);
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y,
              other.x, other.y
            );
            gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 55%, ${opacity})`);
            gradient.addColorStop(1, `hsla(${other.hue}, 70%, 55%, ${opacity})`);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // Mouse interaction with enhanced effect
        const dx = particle.x - mouseRef.current.x;
        const dy = particle.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 180) {
          const opacity = 0.4 * (1 - distance / 180);
          const gradient = ctx.createLinearGradient(
            particle.x, particle.y,
            mouseRef.current.x, mouseRef.current.y
          );
          gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 65%, ${opacity})`);
          gradient.addColorStop(1, `hsla(165, 80%, 60%, ${opacity * 0.5})`);
          
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.2;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
        }

        // Draw particle with glow
        const currentOpacity = particle.opacity * pulseFactor;
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${currentOpacity * 0.1})`;
        ctx.fill();
        
        // Middle glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${currentOpacity * 0.2})`;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 75%, 65%, ${currentOpacity})`;
        ctx.fill();
        
        // Bright center
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 50%, 90%, ${currentOpacity * 0.8})`;
        ctx.fill();
      });
    };

    const updateParticles = () => {
      const particles = particlesRef.current;
      const orbs = orbsRef.current;
      timeRef.current += 0.016;

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulsePhase += particle.pulseSpeed;

        // Bounce off edges with smooth transition
        if (particle.x < 0) {
          particle.x = 0;
          particle.speedX *= -0.8;
        }
        if (particle.x > canvas.width) {
          particle.x = canvas.width;
          particle.speedX *= -0.8;
        }
        if (particle.y < 0) {
          particle.y = 0;
          particle.speedY *= -0.8;
        }
        if (particle.y > canvas.height) {
          particle.y = canvas.height;
          particle.speedY *= -0.8;
        }

        // Mouse repulsion effect
        const dx = particle.x - mouseRef.current.x;
        const dy = particle.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100 && distance > 0) {
          const force = (100 - distance) / 100 * 0.02;
          particle.speedX += (dx / distance) * force;
          particle.speedY += (dy / distance) * force;
        }

        // Slight random movement for organic feel
        particle.speedX += (Math.random() - 0.5) * 0.008;
        particle.speedY += (Math.random() - 0.5) * 0.008;

        // Limit speed
        const speed = Math.sqrt(particle.speedX ** 2 + particle.speedY ** 2);
        if (speed > 0.8) {
          particle.speedX *= 0.8 / speed;
          particle.speedY *= 0.8 / speed;
        }
      });

      // Update orbs
      orbs.forEach((orb) => {
        orb.phase += orb.speed;
        orb.x += Math.sin(orb.phase) * 0.5;
        orb.y += Math.cos(orb.phase * 0.7) * 0.3;
        
        // Keep orbs in bounds
        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={classes.particleCanvas} />;
};
