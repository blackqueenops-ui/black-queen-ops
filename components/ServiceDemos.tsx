"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════
   Mini Canvas Demo — shared hook
   ═══════════════════════════════════════ */
function useMiniCanvas(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, hovered: boolean) => void
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const hoveredRef = useRef(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let time = 0;
    let last = 0;

    function tick(now: number) {
      if (!ctx) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      time += dt;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, time, hoveredRef.current);
      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return {
    canvasRef,
    hovered,
    onEnter: () => { hoveredRef.current = true; setHovered(true); },
    onLeave: () => { hoveredRef.current = false; setHovered(false); },
  };
}

const G = { r: 184, g: 151, b: 31 };
function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${a})`;
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}
function easeOut(t: number) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3); }

/* ═══════════════════════════════════════
   DEMO 1: UI Assembly (Frontshop)
   Blocks slide into position forming a UI layout
   ═══════════════════════════════════════ */
function DemoAssembly() {
  const draw = useRef(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, hovered: boolean) => {
      const cycle = hovered ? 1.8 : 2.8;
      const phase = (t % cycle) / cycle;
      const speed = hovered ? 1.6 : 1.2;

      const blocks = [
        // header bar
        { tx: 0.05, ty: 0.05, tw: 0.9, th: 0.1, fromX: -0.5, fromY: 0.05, delay: 0 },
        // logo dot
        { tx: 0.08, ty: 0.065, tw: 0.06, th: 0.07, fromX: 0.08, fromY: -0.3, delay: 0.05 },
        // nav line
        { tx: 0.35, ty: 0.08, tw: 0.4, th: 0.03, fromX: 1.2, fromY: 0.08, delay: 0.08 },
        // hero text block
        { tx: 0.08, ty: 0.22, tw: 0.55, th: 0.06, fromX: -0.4, fromY: 0.22, delay: 0.12 },
        // sub text
        { tx: 0.08, ty: 0.32, tw: 0.42, th: 0.03, fromX: -0.3, fromY: 0.32, delay: 0.16 },
        // button 1
        { tx: 0.08, ty: 0.42, tw: 0.22, th: 0.08, fromX: 0.08, fromY: 1.2, delay: 0.2 },
        // button 2
        { tx: 0.34, ty: 0.42, tw: 0.22, th: 0.08, fromX: 0.34, fromY: 1.2, delay: 0.24 },
        // content block
        { tx: 0.08, ty: 0.58, tw: 0.5, th: 0.25, fromX: -0.6, fromY: 0.58, delay: 0.28 },
        // sidebar
        { tx: 0.62, ty: 0.22, tw: 0.3, th: 0.35, fromX: 1.3, fromY: 0.22, delay: 0.22 },
        // footer
        { tx: 0.05, ty: 0.88, tw: 0.9, th: 0.07, fromX: 0.05, fromY: 1.3, delay: 0.32 },
      ];

      for (const b of blocks) {
        const p = easeOut((phase * speed - b.delay) / 0.2);
        const x = lerp(b.fromX * w, b.tx * w, p);
        const y = lerp(b.fromY * h, b.ty * h, p);
        const bw = b.tw * w;
        const bh = b.th * h;
        const a = p;

        if (a < 0.01) continue;

        ctx.globalAlpha = a;
        ctx.fillStyle = rgba(255, 255, 255, hovered ? 0.12 : 0.08);
        ctx.beginPath();
        ctx.roundRect(x, y, bw, bh, 2);
        ctx.fill();
        ctx.strokeStyle = rgba(255, 255, 255, hovered ? 0.35 : 0.22);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  ).current;

  const { canvasRef, hovered, onEnter, onLeave } = useMiniCanvas(draw);
  return { canvasRef, hovered, onEnter, onLeave };
}

/* ═══════════════════════════════════════
   DEMO 2: Transformation Pipeline (Onboarding)
   Block moves through 3 zones, transforms
   ═══════════════════════════════════════ */
function DemoPipeline() {
  const draw = useRef(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, hovered: boolean) => {
      const cycle = hovered ? 2 : 3.5;
      const phase = (t % cycle) / cycle;
      const cy = h * 0.5;

      // Track
      ctx.strokeStyle = rgba(255, 255, 255, 0.06);
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(w * 0.08, cy);
      ctx.lineTo(w * 0.92, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3 zone markers
      const zones = [0.3, 0.55, 0.8];
      const labels = ["01", "02", "03"];
      for (let i = 0; i < 3; i++) {
        const zx = w * zones[i];
        const active = phase > zones[i] - 0.15;
        const a = active ? (hovered ? 0.4 : 0.25) : 0.08;
        ctx.strokeStyle = rgba(G.r, G.g, G.b, a);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(zx, cy - 22);
        ctx.lineTo(zx, cy + 22);
        ctx.stroke();
        ctx.font = "7px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = rgba(G.r, G.g, G.b, a);
        ctx.fillText(labels[i], zx, cy + 32);
      }

      // Moving block
      const bx = lerp(w * 0.06, w * 0.88, easeOut(phase));
      const bw = 28;
      const bh = 18;

      // Zone transitions
      const z1 = easeOut((phase - 0.2) / 0.15);
      const z2 = easeOut((phase - 0.45) / 0.15);
      const z3 = easeOut((phase - 0.7) / 0.15);

      const goldMix = z2 * 0.3 + z3 * 0.7;
      const cr = Math.round(lerp(255, G.r, goldMix));
      const cg = Math.round(lerp(255, G.g, goldMix));
      const cb = Math.round(lerp(255, G.b, goldMix));
      const borderA = 0.15 + z1 * 0.12 + z2 * 0.15 + z3 * 0.2;

      const fadeA = phase < 0.05 ? phase / 0.05 : phase > 0.92 ? (1 - phase) / 0.08 : 1;
      ctx.globalAlpha = fadeA;

      // Block
      ctx.fillStyle = rgba(cr, cg, cb, 0.04 + z3 * 0.06);
      ctx.beginPath();
      ctx.roundRect(bx - bw / 2, cy - bh / 2, bw, bh, 3);
      ctx.fill();
      ctx.strokeStyle = rgba(cr, cg, cb, borderA);
      ctx.lineWidth = 0.8 + z3 * 0.5;
      ctx.stroke();

      // Zone 1: inner grid
      if (z1 > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(bx - bw / 2, cy - bh / 2, bw, bh, 3);
        ctx.clip();
        ctx.strokeStyle = rgba(255, 255, 255, z1 * 0.12 * (1 - z3 * 0.5));
        ctx.lineWidth = 0.4;
        for (let gx = bx - bw / 2; gx < bx + bw / 2; gx += 4) {
          ctx.beginPath(); ctx.moveTo(gx, cy - bh / 2); ctx.lineTo(gx, cy + bh / 2); ctx.stroke();
        }
        for (let gy = cy - bh / 2; gy < cy + bh / 2; gy += 4) {
          ctx.beginPath(); ctx.moveTo(bx - bw / 2, gy); ctx.lineTo(bx + bw / 2, gy); ctx.stroke();
        }
        ctx.restore();
      }

      // Zone 2: glow
      if (z2 > 0.1 && z2 < 0.9) {
        ctx.shadowColor = rgba(G.r, G.g, G.b, z2 * 0.15);
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(bx - bw / 2, cy - bh / 2, bw, bh, 3);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
      }

      ctx.globalAlpha = 1;
    }
  ).current;

  const { canvasRef, hovered, onEnter, onLeave } = useMiniCanvas(draw);
  return { canvasRef, hovered, onEnter, onLeave };
}

/* ═══════════════════════════════════════
   DEMO 3: System Connection (Payment)
   Nodes connect with animated lines
   ═══════════════════════════════════════ */
function DemoConnection() {
  const draw = useRef(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, hovered: boolean) => {
      const nodes = [
        { x: 0.2, y: 0.25 },
        { x: 0.5, y: 0.15 },
        { x: 0.8, y: 0.3 },
        { x: 0.15, y: 0.65 },
        { x: 0.5, y: 0.55 },
        { x: 0.82, y: 0.7 },
        { x: 0.5, y: 0.85 },
      ];

      const connections = [
        [0, 1], [1, 2], [0, 4], [1, 4], [2, 5],
        [3, 4], [4, 5], [3, 6], [4, 6], [5, 6],
        [0, 3], [2, 4],
      ];

      const cycle = hovered ? 2 : 3.5;
      const phase = (t % cycle) / cycle;
      const visibleCount = Math.floor(lerp(3, connections.length, easeOut(phase)));

      // Draw connections
      for (let i = 0; i < connections.length; i++) {
        const [a, b] = connections[i];
        const na = nodes[a];
        const nb = nodes[b];
        const visible = i < visibleCount;
        const appearing = i === visibleCount - 1;

        const lineA = visible
          ? (appearing ? easeOut((phase * connections.length - i) / 1.5) : 1) * (hovered ? 0.3 : 0.18)
          : 0;

        if (lineA < 0.01) continue;

        ctx.strokeStyle = rgba(G.r, G.g, G.b, lineA);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(na.x * w, na.y * h);
        ctx.lineTo(nb.x * w, nb.y * h);
        ctx.stroke();

        // Flowing dot on active connections
        if (visible && !appearing) {
          const dotPhase = ((t * (hovered ? 2.5 : 1.5) + i * 0.7) % 1);
          const dx = lerp(na.x * w, nb.x * w, dotPhase);
          const dy = lerp(na.y * h, nb.y * h, dotPhase);
          ctx.beginPath();
          ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = rgba(G.r, G.g, G.b, hovered ? 0.5 : 0.3);
          ctx.fill();
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const nx = n.x * w;
        const ny = n.y * h;

        // Active node: center one (index 4)
        const isActive = i === 4;
        const pulse = Math.sin(t * 2 + i) * 0.3 + 0.7;
        const nodeA = hovered ? 0.7 : 0.45;

        // Outer ring
        if (isActive) {
          ctx.beginPath();
          ctx.arc(nx, ny, 7 + pulse * 2, 0, Math.PI * 2);
          ctx.strokeStyle = rgba(G.r, G.g, G.b, (hovered ? 0.2 : 0.1) * pulse);
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Node dot
        ctx.beginPath();
        ctx.arc(nx, ny, isActive ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isActive
          ? rgba(G.r, G.g, G.b, nodeA * pulse)
          : rgba(255, 255, 255, nodeA * 0.6);
        ctx.fill();

        // Node border
        ctx.strokeStyle = isActive
          ? rgba(G.r, G.g, G.b, nodeA * 0.8)
          : rgba(255, 255, 255, nodeA * 0.3);
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  ).current;

  const { canvasRef, hovered, onEnter, onLeave } = useMiniCanvas(draw);
  return { canvasRef, hovered, onEnter, onLeave };
}

/* ═══════════════════════════════════════
   Service Card wrapper
   ═══════════════════════════════════════ */
function ServiceCard({
  demo,
  title,
  description,
}: {
  demo: ReturnType<typeof DemoAssembly>;
  title: string;
  description: string;
}) {
  return (
    <div
      className="svc-card group"
      onMouseEnter={demo.onEnter}
      onMouseLeave={demo.onLeave}
    >
      {/* Demo area */}
      <div className="svc-demo-area">
        <canvas
          ref={demo.canvasRef}
          className="w-full h-full"
          style={{ display: "block" }}
        />
      </div>

      <h3 className="font-semibold text-lg mb-2 text-heading">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>

      <style jsx>{`
        .svc-card {
          background: var(--surface-dark-alt);
          border: 1px solid var(--border-dark);
          border-radius: 8px;
          padding: 16px;
          transition:
            transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            border-color 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .svc-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(184, 151, 31, 0.25);
          box-shadow: 0 8px 32px rgba(184, 151, 31, 0.06);
        }

        .svc-demo-area {
          width: 100%;
          height: 120px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: rgba(0, 0, 0, 0.3);
          margin-bottom: 16px;
          overflow: hidden;
        }

        @media (min-width: 640px) {
          .svc-card { padding: 24px; }
          .svc-demo-area { height: 140px; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   Export: 3 cards
   ═══════════════════════════════════════ */
export default function ServiceDemos({
  titles,
  descriptions,
}: {
  titles: [string, string, string];
  descriptions: [string, string, string];
}) {
  const demo1 = DemoAssembly();
  const demo2 = DemoPipeline();
  const demo3 = DemoConnection();

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <ServiceCard demo={demo1} title={titles[0]} description={descriptions[0]} />
      <ServiceCard demo={demo2} title={titles[1]} description={descriptions[1]} />
      <ServiceCard demo={demo3} title={titles[2]} description={descriptions[2]} />
    </div>
  );
}
