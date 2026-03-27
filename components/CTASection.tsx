"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/*
  CTA Section — "System Entry Point"

  Canvas: grid + convergent flow lines toward button + ripple on hover
  Button: breathing glow + hover activation + click ripple
*/

const G = { r: 184, g: 151, b: 31 };
function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${a})`;
}

function CTACanvas({ started, btnRect }: { started: boolean; btnRect: React.RefObject<DOMRect | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const hoveredRef = useRef(false);
  const clickTimeRef = useRef(0);

  // Exposed methods
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cw = 0, ch = 0;

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      cw = canvas.offsetWidth;
      ch = canvas.offsetHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Flow particles that converge toward button
    interface FlowP {
      x: number; y: number;
      vx: number; vy: number;
      life: number; maxLife: number;
      size: number;
    }

    const particles: FlowP[] = [];

    function spawnParticle() {
      if (!btnRect.current || particles.length > 40) return;
      const br = btnRect.current;
      const targetX = br.left + br.width / 2;
      const targetY = br.top + br.height / 2;

      // Spawn from edges
      const edge = Math.random();
      let sx: number, sy: number;
      if (edge < 0.25) { sx = 0; sy = Math.random() * ch; }
      else if (edge < 0.5) { sx = cw; sy = Math.random() * ch; }
      else if (edge < 0.75) { sx = Math.random() * cw; sy = 0; }
      else { sx = Math.random() * cw; sy = ch; }

      const dx = targetX - sx;
      const dy = targetY - sy;
      const dist = Math.hypot(dx, dy);
      const speed = 0.4 + Math.random() * 0.6;

      particles.push({
        x: sx, y: sy,
        vx: (dx / dist) * speed,
        vy: (dy / dist) * speed,
        life: 0,
        maxLife: dist / speed,
        size: 1 + Math.random() * 1,
      });
    }

    let time = 0;
    let spawnTimer = 0;

    function draw() {
      if (!ctx) return;
      time += 0.016;
      ctx.clearRect(0, 0, cw, ch);

      if (!started) { animRef.current = requestAnimationFrame(draw); return; }

      // Background grid
      ctx.strokeStyle = rgba(255, 255, 255, 0.012);
      ctx.lineWidth = 0.5;
      const sp = 30;
      for (let x = 0; x < cw; x += sp) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke();
      }
      for (let y = 0; y < ch; y += sp) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
      }

      // Horizontal pulse
      const pulseX = ((time * 30) % (cw + 40)) - 20;
      const pulseY = ch * 0.5;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
      ctx.fillStyle = rgba(255, 255, 255, 0.04);
      ctx.fill();

      const isHovered = hoveredRef.current;
      const hoverIntensity = isHovered ? 1.5 : 1;

      // Spawn flow particles
      spawnTimer += 0.016;
      if (spawnTimer > (isHovered ? 0.08 : 0.25)) {
        spawnTimer = 0;
        spawnParticle();
      }

      // Update & draw particles
      const br = btnRect.current;
      const targetX = br ? br.left + br.width / 2 : cw / 2;
      const targetY = br ? br.top + br.height / 2 : ch * 0.65;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;

        // Steer toward button
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 5) {
          p.vx += (dx / dist) * 0.02 * hoverIntensity;
          p.vy += (dy / dist) * 0.02 * hoverIntensity;
        }

        // Dampen
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 2) {
          p.vx *= 0.98;
          p.vy *= 0.98;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Remove if arrived or too old
        if (dist < 15 || p.life > p.maxLife * 1.5) {
          particles.splice(i, 1);
          continue;
        }

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(lifeRatio * 4, 1);
        const fadeOut = dist < 40 ? dist / 40 : 1;
        const alpha = fadeIn * fadeOut * 0.12 * hoverIntensity;

        // Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = rgba(G.r, G.g, G.b, alpha);
        ctx.fill();

        // Trail line
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 5, p.y - p.vy * 5);
        ctx.strokeStyle = rgba(G.r, G.g, G.b, alpha * 0.4);
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Convergent guide lines (faint)
      if (br) {
        const corners = [
          { x: 0, y: 0 },
          { x: cw, y: 0 },
          { x: 0, y: ch },
          { x: cw, y: ch },
        ];
        for (const c of corners) {
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(targetX, targetY);
          ctx.strokeStyle = rgba(G.r, G.g, G.b, 0.015);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Click ripple
      const clickAge = time - clickTimeRef.current;
      if (clickAge < 1.2 && clickAge > 0) {
        const rippleR = clickAge * 300;
        const rippleA = (1 - clickAge / 1.2) * 0.12;
        ctx.beginPath();
        ctx.arc(targetX, targetY, rippleR, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(G.r, G.g, G.b, rippleA);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Second ripple
        if (clickAge > 0.15) {
          const r2 = (clickAge - 0.15) * 250;
          const a2 = (1 - (clickAge - 0.15) / 1.05) * 0.08;
          ctx.beginPath();
          ctx.arc(targetX, targetY, r2, 0, Math.PI * 2);
          ctx.strokeStyle = rgba(G.r, G.g, G.b, a2);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Button glow (when hovered)
      if (isHovered && br) {
        const glowA = 0.06 + Math.sin(time * 3) * 0.02;
        const grad = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, 80);
        grad.addColorStop(0, rgba(G.r, G.g, G.b, glowA));
        grad.addColorStop(1, rgba(G.r, G.g, G.b, 0));
        ctx.fillStyle = grad;
        ctx.fillRect(targetX - 80, targetY - 80, 160, 160);
      }

      if (!prefersReduced) {
        animRef.current = requestAnimationFrame(draw);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(draw);

    // Expose hover/click handlers via data attributes
    const handleHover = () => { hoveredRef.current = true; };
    const handleLeave = () => { hoveredRef.current = false; };
    const handleClick = () => { clickTimeRef.current = time; };

    canvas.dataset.ready = "true";
    (canvas as unknown as Record<string, () => void>).__onHover = handleHover;
    (canvas as unknown as Record<string, () => void>).__onLeave = handleLeave;
    (canvas as unknown as Record<string, () => void>).__onClick = handleClick;

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [started, btnRect]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

export default function CTASection({
  title,
  desc,
  buttonText,
}: {
  title: string;
  desc: string;
  buttonText: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const btnRectRef = useRef<DOMRect | null>(null);
  const [started, setStarted] = useState(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entries[0].isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    },
    []
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  // Track button position
  useEffect(() => {
    function measure() {
      if (!btnRef.current || !sectionRef.current) return;
      const sRect = sectionRef.current.getBoundingClientRect();
      const bRect = btnRef.current.getBoundingClientRect();
      btnRectRef.current = new DOMRect(
        bRect.left - sRect.left,
        bRect.top - sRect.top,
        bRect.width,
        bRect.height
      );
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [started]);

  // Forward hover/click to canvas
  function notifyCanvas(event: string) {
    const canvasEl = sectionRef.current?.querySelector("canvas") as unknown as Record<string, () => void> | null;
    if (canvasEl && typeof canvasEl[`__on${event}`] === "function") {
      canvasEl[`__on${event}`]();
    }
  }

  const show = started;
  const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  return (
    <div ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative py-4">
      <CTACanvas started={started} btnRect={btnRectRef} />

      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-text-on-dark relative z-10"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(20px)",
          transition: `opacity 600ms ${ease} 200ms, transform 600ms ${ease} 200ms`,
        }}
      >
        {title}
      </h2>

      <p
        className="text-text-muted-on-dark mb-10 max-w-lg mx-auto relative z-10"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(16px)",
          transition: `opacity 600ms ${ease} 400ms, transform 600ms ${ease} 400ms`,
        }}
      >
        {desc}
      </p>

      <Link
        ref={btnRef}
        href="/contact"
        className="cta-entry-btn relative z-10 inline-block px-6 sm:px-10 py-3 sm:py-3.5 rounded font-medium text-heading"
        onMouseEnter={() => notifyCanvas("Hover")}
        onMouseLeave={() => notifyCanvas("Leave")}
        onClick={() => notifyCanvas("Click")}
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "scale(1)" : "scale(0.92)",
          transition: `opacity 500ms ${ease} 600ms, transform 500ms ${ease} 600ms`,
        }}
      >
        {buttonText}
      </Link>

      <style jsx>{`
        .cta-entry-btn {
          background: #b8971f;
          box-shadow: 0 0 0px rgba(184, 151, 31, 0);
          transition:
            transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            filter 200ms ease;
          animation: btnBreathe 3s ease-in-out infinite;
        }

        .cta-entry-btn:hover {
          transform: scale(1.03) !important;
          box-shadow: 0 0 24px rgba(184, 151, 31, 0.2);
          filter: brightness(1.1);
          animation-play-state: paused;
        }

        .cta-entry-btn:active {
          transform: scale(0.97) !important;
          box-shadow: 0 0 12px rgba(184, 151, 31, 0.3);
        }

        @keyframes btnBreathe {
          0%, 100% { box-shadow: 0 0 0px rgba(184, 151, 31, 0); }
          50% { box-shadow: 0 0 16px rgba(184, 151, 31, 0.08); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cta-entry-btn {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
