"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const MARKERS = ["01", "02", "03", "04"];

export default function StrategicSection({
  tag,
  title,
  items,
}: {
  tag: string;
  title: string;
  items: { title: string; desc: string }[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [started, setStarted] = useState(false);
  // Which item the signal is currently highlighting (0-3, or -1)
  const activeRef = useRef(-1);
  const [activeItem, setActiveItem] = useState(-1);

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
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  // Connection lines + signal canvas
  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    const grid = gridRef.current;
    if (!canvas || !grid) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const G = { r: 184, g: 151, b: 31 };
    function rgba(r: number, g: number, b: number, a: number) {
      return `rgba(${r},${g},${b},${a})`;
    }

    let cw = 0, ch = 0;
    // Item center positions relative to canvas
    let nodes: { x: number; y: number }[] = [];

    function measure() {
      if (!canvas || !ctx || !grid) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = grid.getBoundingClientRect();
      cw = rect.width;
      ch = rect.height;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = cw + "px";
      canvas.style.height = ch + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Find item positions
      const items = grid.querySelectorAll(".strat-item");
      nodes = [];
      const gridRect = grid.getBoundingClientRect();
      items.forEach((el) => {
        const r = el.getBoundingClientRect();
        nodes.push({
          x: r.left - gridRect.left + 12,
          y: r.top - gridRect.top + r.height / 2,
        });
      });
    }

    // Build path: 01 → 02 → 03 → 04 with L-shaped connections
    function getPathPoints(): { x: number; y: number }[] {
      if (nodes.length < 4) return [];
      const pts: { x: number; y: number }[] = [];
      // 01 (top-left) → 02 (top-right)
      pts.push(nodes[0]);
      pts.push({ x: (nodes[0].x + nodes[1].x) / 2, y: nodes[0].y });
      pts.push({ x: (nodes[0].x + nodes[1].x) / 2, y: nodes[1].y });
      pts.push(nodes[1]);
      // 02 (top-right) → 03 (bottom-left) — diagonal through center
      pts.push({ x: nodes[1].x, y: (nodes[1].y + nodes[2].y) / 2 });
      pts.push({ x: nodes[2].x, y: (nodes[1].y + nodes[2].y) / 2 });
      pts.push(nodes[2]);
      // 03 (bottom-left) → 04 (bottom-right)
      pts.push({ x: (nodes[2].x + nodes[3].x) / 2, y: nodes[2].y });
      pts.push({ x: (nodes[2].x + nodes[3].x) / 2, y: nodes[3].y });
      pts.push(nodes[3]);
      return pts;
    }

    function totalLength(pts: { x: number; y: number }[]): number {
      let len = 0;
      for (let i = 1; i < pts.length; i++) {
        len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      }
      return len;
    }

    function pointAtLength(pts: { x: number; y: number }[], targetLen: number): { x: number; y: number } {
      let len = 0;
      for (let i = 1; i < pts.length; i++) {
        const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        if (len + seg >= targetLen) {
          const t = (targetLen - len) / seg;
          return {
            x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t,
            y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t,
          };
        }
        len += seg;
      }
      return pts[pts.length - 1];
    }

    // Which node is closest to a given path progress (0-1)?
    function closestNode(pts: { x: number; y: number }[], progress: number): number {
      const total = totalLength(pts);
      const p = pointAtLength(pts, progress * total);
      let best = 0, bestDist = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        const d = Math.hypot(p.x - nodes[i].x, p.y - nodes[i].y);
        if (d < bestDist) { bestDist = d; best = i; }
      }
      return bestDist < 40 ? best : -1;
    }

    let time = 0;

    function draw() {
      if (!ctx) return;
      time += 0.016;
      ctx.clearRect(0, 0, cw, ch);

      const pts = getPathPoints();
      if (pts.length < 2) { animRef.current = requestAnimationFrame(draw); return; }

      const total = totalLength(pts);

      // Draw connection lines — main
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = rgba(255, 255, 255, 0.12);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Glow line (wider, softer)
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = rgba(G.r, G.g, G.b, 0.04);
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const isActive = activeRef.current === i;
        const na = isActive ? 0.45 : 0.14;
        const nr = isActive ? 5 : 3;
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nr, 0, Math.PI * 2);
        ctx.fillStyle = rgba(G.r, G.g, G.b, na);
        ctx.fill();

        // Outer ring (always visible, stronger when active)
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, isActive ? 10 : 6, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(G.r, G.g, G.b, isActive ? 0.18 : 0.05);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      if (prefersReduced) { return; }

      // Traveling signal
      const SIGNAL_CYCLE = 4; // seconds for full loop
      const signalPhase = (time % SIGNAL_CYCLE) / SIGNAL_CYCLE;
      const signalPos = pointAtLength(pts, signalPhase * total);

      // Signal glow
      ctx.beginPath();
      ctx.arc(signalPos.x, signalPos.y, 16, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(signalPos.x, signalPos.y, 0, signalPos.x, signalPos.y, 16);
      grad.addColorStop(0, rgba(G.r, G.g, G.b, 0.2));
      grad.addColorStop(0.5, rgba(G.r, G.g, G.b, 0.06));
      grad.addColorStop(1, rgba(G.r, G.g, G.b, 0));
      ctx.fillStyle = grad;
      ctx.fill();

      // Signal dot
      ctx.beginPath();
      ctx.arc(signalPos.x, signalPos.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = rgba(G.r, G.g, G.b, 0.7);
      ctx.fill();

      // Trail
      for (let t = 1; t <= 10; t++) {
        const trailPhase = signalPhase - t * 0.007;
        if (trailPhase < 0) continue;
        const tp = pointAtLength(pts, trailPhase * total);
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 2.5 - t * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = rgba(G.r, G.g, G.b, 0.25 * (1 - t / 10));
        ctx.fill();
      }

      // Highlighted path segment behind signal
      const trailLen = total * 0.1;
      const trailStart = Math.max(0, signalPhase * total - trailLen);
      ctx.beginPath();
      let drawing = false;
      let accumulated = 0;
      for (let i = 1; i < pts.length; i++) {
        const segLen = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        const segEnd = accumulated + segLen;
        if (segEnd >= trailStart && accumulated <= signalPhase * total) {
          const s = Math.max(0, (trailStart - accumulated) / segLen);
          const e = Math.min(1, (signalPhase * total - accumulated) / segLen);
          const sx = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * s;
          const sy = pts[i - 1].y + (pts[i].y - pts[i - 1].y) * s;
          const ex = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * e;
          const ey = pts[i - 1].y + (pts[i].y - pts[i - 1].y) * e;
          if (!drawing) { ctx.moveTo(sx, sy); drawing = true; }
          ctx.lineTo(ex, ey);
        }
        accumulated = segEnd;
      }
      ctx.strokeStyle = rgba(G.r, G.g, G.b, 0.35);
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Update active item
      const newActive = closestNode(pts, signalPhase);
      if (newActive !== activeRef.current) {
        activeRef.current = newActive;
        setActiveItem(newActive);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    measure();
    // Start animation after a short delay for layout to settle
    const startTimer = setTimeout(() => {
      measure();
      animRef.current = requestAnimationFrame(draw);
    }, 100);

    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", measure);
    };
  }, [started]);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = started || reduced;
  const ease = "cubic-bezier(0.25,0.46,0.45,0.94)";

  return (
    <div ref={sectionRef}>
      {/* Header */}
      <div className="text-center mb-8 md:mb-14">
        <p
          className="text-gold text-sm font-medium tracking-widest uppercase mb-2"
          style={
            show
              ? { opacity: 1, letterSpacing: "4px", transition: `opacity 600ms ${ease}, letter-spacing 600ms ${ease}` }
              : { opacity: 0, letterSpacing: "8px" }
          }
        >
          {tag}
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold text-text-on-dark"
          style={
            show
              ? { opacity: 1, transform: "translateY(0)", transition: `opacity 500ms ${ease} 200ms, transform 500ms ${ease} 200ms` }
              : { opacity: 0, transform: "translateY(16px)" }
          }
        >
          {title}
        </h2>
      </div>

      {/* Grid with canvas overlay */}
      <div className="relative" ref={gridRef}>
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        <div className="grid md:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-6 md:gap-y-10 relative" style={{ zIndex: 2 }}>
          {items.map((item, i) => {
            const delay = 400 + i * 150;
            const isActive = activeItem === i;

            return (
              <div
                key={i}
                className="strat-item group cursor-default"
                style={
                  show
                    ? {
                        opacity: 1,
                        transform: "translateY(0)",
                        transition: `opacity 500ms ${ease} ${delay}ms, transform 500ms ${ease} ${delay}ms`,
                      }
                    : { opacity: 0, transform: "translateY(16px)" }
                }
              >
                <div className="flex items-start gap-4">
                  {/* Marker */}
                  <span
                    className="shrink-0 font-mono text-xs tracking-widest mt-1 transition-all duration-500"
                    style={{
                      color: isActive ? "rgba(184,151,31,0.7)" : "rgba(184,151,31,0.3)",
                      textShadow: isActive ? "0 0 8px rgba(184,151,31,0.15)" : "none",
                    }}
                  >
                    {MARKERS[i]}
                  </span>

                  <div className="min-w-0">
                    <h3
                      className="font-semibold mb-1 transition-colors duration-400 group-hover:text-white"
                      style={{
                        color: isActive ? "#f0f0f4" : "var(--text-on-dark)",
                      }}
                    >
                      {item.title}
                    </h3>

                    {/* Accent line */}
                    <div
                      className="mb-2 transition-all duration-500 group-hover:w-[80px]"
                      style={{
                        height: "1px",
                        background: "linear-gradient(to right, rgba(184,151,31,0.4), transparent)",
                        width: isActive ? "80px" : "40px",
                        opacity: isActive ? 1 : 0.5,
                      }}
                    />

                    <p
                      className="text-sm leading-relaxed transition-colors duration-400"
                      style={{
                        color: isActive ? "var(--text-on-dark)" : "var(--text-muted-on-dark)",
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
