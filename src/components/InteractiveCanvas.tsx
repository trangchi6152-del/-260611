import React, { useEffect, useRef } from 'react';

interface InteractiveCanvasProps {
  id: string;
  themeColorHex: string;
  isSpecialDay: boolean;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({ id, themeColorHex, isSpecialDay }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, px: -1000, py: -1000, isDown: false, vx: 0, vy: 0 });
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play a beautiful bell note when interacting
  const playSound = (freq = 440, type: OscillatorType = 'sine', duration = 0.4) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context might fail to init or be blocked - ignore quietly
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      rotation: number;
      rotSpeed: number;
      life: number;
      maxLife: number;
      char?: string;
      image?: string;
      scaleY?: number;

      constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.life = 0;
        this.maxLife = type === 'coin' || type === 'snow' || type === 'star' ? 150 : 80;
        this.alpha = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.05;

        // Custom setup by anniversary
        if (type === 'heart') {
          this.radius = Math.random() * 8 + 6;
          this.vx = (Math.random() - 0.5) * 3;
          this.vy = -Math.random() * 3 - 1;
          this.color = `hsla(${340 + Math.random() * 30}, 90%, ${60 + Math.random() * 15}%, 1)`;
        } else if (type === 'feather') {
          this.radius = Math.random() * 10 + 8;
          this.vx = (Math.random() - 0.5) * 2;
          this.vy = Math.random() * 1 + 0.5;
          this.rotSpeed = (Math.random() - 0.5) * 0.02;
          const colors = ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1'];
          this.color = colors[Math.floor(Math.random() * colors.length)];
        } else if (type === 'pulse') {
          this.radius = Math.random() * 15 + 10;
          this.vx = (Math.random() - 0.5) * 1.5;
          this.vy = (Math.random() - 0.5) * 1.5;
          this.color = `hsla(${280 + Math.random() * 40}, 85%, 65%, 1)`;
          this.maxLife = 60;
        } else if (type === 'word') {
          this.radius = Math.random() * 10 + 12;
          this.vx = (Math.random() - 0.5) * 1.5;
          this.vy = -Math.random() * 1.2 - 0.5;
          const words = ['诗', '棉', '暖', '风', '月', '歌', '生', '柔', '梦', '影', '光'];
          this.char = words[Math.floor(Math.random() * words.length)];
          this.color = `hsla(${150 + Math.random() * 50}, 60%, ${30 + Math.random() * 20}%, 1)`;
        } else if (type === 'science') {
          this.radius = Math.random() * 3 + 2;
          this.vx = (Math.random() - 0.5) * 1.2;
          this.vy = (Math.random() - 0.5) * 1.2;
          this.color = `rgba(34, 211, 238, ${0.5 + Math.random() * 0.5})`; // Cyan-400
        } else if (type === 'grape') {
          this.radius = Math.random() * 12 + 10;
          this.vx = (Math.random() - 0.5) * 4;
          this.vy = -Math.random() * 4 - 2;
          this.color = `hsla(${260 + Math.random() * 40}, 75%, 45%, 1)`; // Grape violet
        } else if (type === 'grape-splash') {
          this.radius = Math.random() * 3 + 2;
          this.vx = (Math.random() - 0.5) * 6;
          this.vy = (Math.random() - 0.5) * 6;
          this.color = `hsla(${270 + Math.random() * 30}, 80%, 40%, 1)`;
          this.maxLife = 30;
        } else if (type === 'confetti') {
          this.radius = Math.random() * 6 + 4;
          this.vx = (Math.random() - 0.5) * 8;
          this.vy = -Math.random() * 10 - 5;
          this.color = `hsla(${Math.random() * 360}, 90%, 60%, 1)`;
          this.rotSpeed = (Math.random() - 0.5) * 0.15;
          this.scaleY = Math.random();
        } else if (type === 'ginkgo') {
          this.radius = Math.random() * 12 + 6;
          this.vx = -Math.random() * 2.5 - 0.5; // fly from right to left
          this.vy = Math.random() * 1.5 + 0.5;
          this.color = `hsla(${42 + Math.random() * 12}, 95%, ${45 + Math.random() * 15}%, 0.95)`; // Warm amber/yellow
        } else if (type === 'paw') {
          this.radius = Math.random() * 8 + 8;
          this.vx = (Math.random() - 0.5) * 1;
          this.vy = -Math.random() * 1 - 0.5;
          this.color = '#fb923c'; // orange-400
          this.maxLife = 45;
        } else if (type === 'coin') {
          this.radius = Math.random() * 7 + 8;
          this.vx = (Math.random() - 0.5) * 4;
          this.vy = -Math.random() * 6 - 3;
          this.color = '#eab308'; // yellow-500 gold
        } else if (type === 'snow') {
          this.radius = Math.random() * 3 + 2;
          this.vx = (Math.random() - 0.5) * 1.5;
          this.vy = Math.random() * 1 + 0.5;
          this.color = '#ffffff';
          this.maxLife = 200;
        } else {
          // Standard ripple particles
          this.radius = Math.random() * 4 + 3;
          this.vx = (Math.random() - 0.5) * 2;
          this.vy = (Math.random() - 0.5) * 2;
          this.color = themeColorHex || '#6366f1';
        }
      }

      update() {
        this.life++;
        this.rotation += this.rotSpeed;

        // Custom physics by ID
        if (id === 'pillow-fight-day') {
          this.vy += 0.015; // slow feather settlement
          this.vx += Math.sin(this.life * 0.05) * 0.05;
        } else if (id === 'grape-day') {
          this.vy += 0.2; // heavy grape gravity
        } else if (id === 'personal-birthday') {
          this.vy += 0.15; // gravity on confetti
          this.vx *= 0.98;
        } else if (id === 'come-to-beijing-anniversary') {
          this.vy += 0.01;
          this.vx += Math.sin(this.life * 0.02) * 0.02 - 0.02;
        } else if (id === 'facai-birthday') {
          // Both coins and snowflakes
          this.vy += 0.12;
        } else if (id === 'love-anniversary') {
          this.vy += -0.01; // float up gently
        } else if (id === 'poetry-mianmian-birthday') {
          this.vy += -0.005;
          this.vx += (Math.random() - 0.5) * 0.1;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Bounce grapes on the ground
        if (id === 'grape-day' && this.y > height - this.radius && this.vy > 0) {
          this.y = height - this.radius;
          this.vy = -this.vy * 0.6; // bounce bounce
        }

        this.alpha = 1 - this.life / this.maxLife;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        c.globalAlpha = Math.max(0, this.alpha);

        if (id === 'love-anniversary') {
          // Draw heart SVG shape
          c.beginPath();
          c.fillStyle = this.color;
          const r = this.radius;
          c.moveTo(0, r / 4);
          c.bezierCurveTo(r / 2, -r / 2, r * 1.5, -r / 3, r * 1.5, r / 3);
          c.bezierCurveTo(r * 1.5, r, r / 3, r * 1.6, 0, r * 2.2);
          c.bezierCurveTo(-r / 3, r * 1.6, -r * 1.5, r, -r * 1.5, r / 3);
          c.bezierCurveTo(-r * 1.5, -r / 3, -r / 2, -r / 2, 0, r / 4);
          c.fill();
        } else if (id === 'poetry-mianmian-birthday') {
          // Word cloud
          c.fillStyle = this.color;
          c.font = `bold ${this.radius * 1.3}px sans-serif`;
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          c.fillText(this.char || '诗', 0, 0);
        } else if (id === 'pillow-fight-day') {
          // Draw soft feather
          c.beginPath();
          c.fillStyle = this.color;
          // Feather shape using ellipses
          c.ellipse(0, 0, this.radius * 1.6, this.radius * 0.45, 0, 0, Math.PI * 2);
          c.shadowBlur = 10;
          c.shadowColor = 'rgba(255,255,255,0.4)';
          c.fill();

          // shaft
          c.beginPath();
          c.strokeStyle = 'rgba(255,255,255,0.5)';
          c.lineWidth = 1;
          c.moveTo(-this.radius * 1.8, 0);
          c.lineTo(this.radius * 1.8, 0);
          c.stroke();
        } else if (id === 'come-to-beijing-anniversary') {
          // Draw warm, gorgeous ginkgo leaves
          c.beginPath();
          c.fillStyle = this.color;
          c.moveTo(0, 0);
          // A fan shape representing dynamic ginkgo leaf
          c.arc(0, 0, this.radius, Math.PI / 4, Math.PI * 0.95);
          c.closePath();
          c.fill();
          // stem
          c.beginPath();
          c.strokeStyle = '#d97706';
          c.lineWidth = 1.3;
          c.moveTo(0, 0);
          c.lineTo(this.radius * 0.5, this.radius * 0.5);
          c.stroke();
        } else if (id === 'intimacy-anniversary') {
          // Sensual waves & glowing pulse circles
          c.beginPath();
          const grad = c.createRadialGradient(0, 0, 0, 0, 0, this.radius);
          grad.addColorStop(0, 'rgba(240, 70, 180, 0.95)');
          grad.addColorStop(0.4, 'rgba(236, 72, 153, 0.5)');
          grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
          c.fillStyle = grad;
          c.arc(0, 0, this.radius * 2, 0, Math.PI * 2);
          c.fill();
        } else if (id === 'grape-day') {
          // Juicy grapes spheres with shiny gloss dot
          c.beginPath();
          c.fillStyle = this.color;
          c.arc(0, 0, this.radius, 0, Math.PI * 2);
          c.fill();

          // gloss dot
          c.beginPath();
          c.fillStyle = 'rgba(255, 255, 255, 0.7)';
          c.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.25, 0, Math.PI * 2);
          c.fill();
        } else if (id === 'personal-birthday') {
          // Celebratory confetti slips
          c.fillStyle = this.color;
          c.scale(1, this.scaleY || 1);
          c.fillRect(-this.radius, -this.radius * 0.5, this.radius * 2, this.radius);
        } else if (id === 'dengdeng-birthday') {
          // Paw prints
          c.fillStyle = this.color;
          const r = this.radius * 0.6;
          // Main pad
          c.beginPath();
          c.ellipse(0, r * 0.3, r * 1.3, r, 0, 0, Math.PI * 2);
          c.fill();
          // 4 toes
          c.beginPath();
          c.arc(-r * 0.9, -r * 0.5, r * 0.45, 0, Math.PI * 2);
          c.arc(-r * 0.3, -r * 1.0, r * 0.45, 0, Math.PI * 2);
          c.arc(r * 0.3, -r * 1.0, r * 0.45, 0, Math.PI * 2);
          c.arc(r * 0.9, -r * 0.5, r * 0.45, 0, Math.PI * 2);
          c.fill();
        } else if (id === 'facai-birthday') {
          // Christmas snowflakes or golden coins
          if (this.radius > 5.5) {
            // Draw a spinning gold coin with "¥" symbol
            c.beginPath();
            c.fillStyle = '#f59e0b';
            c.strokeStyle = '#eab308';
            c.lineWidth = 1.8;
            c.arc(0, 0, this.radius, 0, Math.PI * 2);
            c.fill();
            c.stroke();
            // inner square
            c.beginPath();
            c.rect(-this.radius * 0.35, -this.radius * 0.35, this.radius * 0.7, this.radius * 0.7);
            c.stroke();
          } else {
            // White crystal snowflakes
            c.strokeStyle = '#ffffff';
            c.lineWidth = 1.5;
            for (let i = 0; i < 6; i++) {
              c.moveTo(0, 0);
              c.lineTo(0, this.radius * 1.3);
              c.rotate(Math.PI / 3);
            }
            c.stroke();
          }
        } else {
          // Standard gorgeous starlight particle
          c.beginPath();
          c.fillStyle = this.color;
          c.arc(0, 0, this.radius, 0, Math.PI * 2);
          c.fill();
        }

        c.restore();
      }
    }

    const particles: Particle[] = [];

    // Trigger anniversary intro bursts automatically
    const createBurst = (cx: number, cy: number, count = 25) => {
      let typeList: string[] = ['standard'];
      if (id === 'love-anniversary') typeList = ['heart'];
      else if (id === 'poetry-mianmian-birthday') typeList = ['word', 'word'];
      else if (id === 'pillow-fight-day') typeList = ['feather'];
      else if (id === 'intimacy-anniversary') typeList = ['pulse'];
      else if (id === 'national-science-day') typeList = ['science', 'science'];
      else if (id === 'grape-day') typeList = ['grape'];
      else if (id === 'personal-birthday') typeList = ['confetti'];
      else if (id === 'come-to-beijing-anniversary') typeList = ['ginkgo'];
      else if (id === 'dengdeng-birthday') typeList = ['paw'];
      else if (id === 'facai-birthday') typeList = ['coin', 'snow'];

      for (let i = 0; i < count; i++) {
        const type = typeList[Math.floor(Math.random() * typeList.length)];
        particles.push(new Particle(cx, cy, type));
      }
    };

    // Initial burst
    createBurst(width / 2, height / 2, 40);

    // Continuous ambient particles
    let frames = 0;

    const render = () => {
      frames++;
      ctx.clearRect(0, 0, width, height);

      // Handle custom themed background animations directly on canvas for extra flair
      if (id === 'national-science-day') {
        // Neon network background grid
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
        ctx.lineWidth = 1;
        const gridGrad = 50;
        for (let x = 0; x < width; x += gridGrad) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridGrad) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (id === 'summer-solstice') {
        // Draw gorgeous sunset sunburst background that rotates
        ctx.save();
        ctx.translate(width / 2, height);
        const sunAngle = (frames * 0.001) % (Math.PI * 2);
        ctx.rotate(sunAngle);

        const rays = 12;
        ctx.fillStyle = 'rgba(251, 146, 60, 0.045)'; // orange-400
        for (let i = 0; i < rays; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, Math.max(width, height) * 1.5, (i * Math.PI * 2) / rays, ((i + 0.35) * Math.PI * 2) / rays);
          ctx.lineTo(0, 0);
          ctx.fill();
        }
        ctx.restore();

        // Draw sun glow
        const sunGrad = ctx.createRadialGradient(width / 2, height, 0, width / 2, height, 180);
        sunGrad.addColorStop(0, 'rgba(254, 215, 170, 0.3)'); // orange-100
        sunGrad.addColorStop(0.4, 'rgba(251, 146, 60, 0.1)');
        sunGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(width / 2, height, 180, 0, Math.PI * 2);
        ctx.fill();
      } else if (id === 'intimacy-anniversary') {
        // Visual sensual heartbeat waveforms
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.15)'; // pink-500
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(236, 72, 153, 0.4)';
        
        ctx.moveTo(0, height / 2);
        for (let x = 0; x < width; x++) {
          // Generate an elegant ECG-like wave when the mouse gets near, otherwise serene rolling sine waves
          const distToMouse = Math.abs(x - mouseRef.current.x);
          const influence = Math.max(0, 1 - distToMouse / 200);
          
          let y = height / 2 + Math.sin(x * 0.015 + frames * 0.02) * 15;
          if (influence > 0) {
            // Intense interactive cardiac peak
            const pulse = Math.sin(x * 0.08 - frames * 0.1) * 45 * Math.sin(x * 0.01) * influence;
            y += pulse;
          }
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      } else if (id === 'kontinue-release') {
        // Concentric LP grooves showing nice vinyl rotations
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.03)';
        ctx.lineWidth = 1.5;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRad = Math.min(width, height) * 0.42;
        for (let d = 40; d < maxRad; d += 20) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, d, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Add ambient floating elements
      if (frames % 12 === 0 && particles.length < 120) {
        if (id === 'love-anniversary') {
          particles.push(new Particle(Math.random() * width, height + 20, 'heart'));
        } else if (id === 'come-to-beijing-anniversary') {
          // Ginkgo leaves float from top-right to bottom-left
          particles.push(new Particle(width + 20, Math.random() * (height * 0.6), 'ginkgo'));
        } else if (id === 'facai-birthday') {
          // Floating christmas snowflakes
          particles.push(new Particle(Math.random() * width, -20, 'snow'));
        } else if (id === 'poetry-mianmian-birthday') {
          // Elegant floating poetry glyphs
          particles.push(new Particle(Math.random() * width, height + 25, 'word'));
        } else if (id === 'pillow-fight-day') {
          // Slow drifting pillow fight white feathers
          particles.push(new Particle(Math.random() * width, -25, 'feather'));
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();

        // Extra interactive forces: magnetic mouse pull/push
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const force = (110 - dist) / 110;
          if (id === 'pillow-fight-day') {
            // Feather is swirled by wind of moving mouse
            p.vx += mouseRef.current.vx * 0.05 * force;
            p.vy += mouseRef.current.vy * 0.05 * force;
          } else if (id === 'national-science-day' || id === 'love-anniversary') {
            // Gentle attraction
            p.vx -= (dx / dist) * 0.15 * force;
            p.vy -= (dy / dist) * 0.15 * force;
          }
        }

        p.draw(ctx);

        // Remove dead particles
        if (p.alpha <= 0 || p.x < -100 || p.x > width + 100 || p.y < -100 || p.y > height + 200) {
          particles.splice(i, 1);
        }
      }

      // National science day constellation nodes draw lines
      if (id === 'national-science-day') {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.255)';
        ctx.lineWidth = 0.85;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 85) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nextX = e.clientX - rect.left;
      const nextY = e.clientY - rect.top;

      mouseRef.current.vx = nextX - mouseRef.current.x;
      mouseRef.current.vy = nextY - mouseRef.current.y;
      mouseRef.current.x = nextX;
      mouseRef.current.y = nextY;
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      // Interaction bursts
      if (id === 'love-anniversary') {
        createBurst(cx, cy, 15);
        playSound(523.25, 'sine', 0.5); // C5 romantic bell
      } else if (id === 'poetry-mianmian-birthday') {
        // Spawns written calligraphy with chime sounds
        createBurst(cx, cy, 10);
        playSound(587.33, 'triangle', 0.6); // D5
      } else if (id === 'pillow-fight-day') {
        // Fluffy feather explosions!
        createBurst(cx, cy, 22);
        playSound(329.63, 'sine', 0.3); // E4 soft thump
      } else if (id === 'intimacy-anniversary') {
        createBurst(cx, cy, 8);
        playSound(261.63, 'sine', 0.8); // C4 heart rhythm
      } else if (id === 'national-science-day') {
        // Star science grid connections
        createBurst(cx, cy, 12);
        playSound(880, 'sine', 0.15); // A5 computer sound
      } else if (id === 'grape-day') {
        // Grape juice popping
        createBurst(cx, cy, 12);
        playSound(440, 'triangle', 0.2); // A4 juicy pop
      } else if (id === 'personal-birthday') {
        // Rainbow confetti explosion!
        createBurst(cx, cy, 30);
        playSound(659.25, 'triangle', 0.5); // E5
      } else if (id === 'come-to-beijing-anniversary') {
        createBurst(cx, cy, 15);
        playSound(392.00, 'sine', 0.4); // G4 travel chord
      } else if (id === 'dengdeng-birthday') {
        createBurst(cx, cy, 10);
        playSound(698.46, 'triangle', 0.25); // F5 doggy bark
      } else if (id === 'facai-birthday') {
        createBurst(cx, cy, 18);
        playSound(783.99, 'sine', 0.45); // G5 cash coin/bell chime
      } else {
        createBurst(cx, cy, 12);
        playSound(440, 'sine', 0.3);
      }
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.isDown = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [id, themeColorHex, isSpecialDay]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto h-full w-full">
      <canvas
        id={`anniversary-screen-canvas-${id}`}
        ref={canvasRef}
        className="block h-full w-full select-none"
      />
    </div>
  );
};
