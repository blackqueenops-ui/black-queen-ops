"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Easing ─── */
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/* ─── Numeric counter hook ─── */
function useCounter(target: number, duration: number, started: boolean) {
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setValue(target); setDone(true); return; }

    let raf: number;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      setValue(Math.round(easeOutQuart(t) * target));
      if (t < 1) { raf = requestAnimationFrame(tick); }
      else { setDone(true); }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return { value, done };
}

const G = { r: 184, g: 151, b: 31 };
function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${a})`;
}

/* ═══════════════════════════════════════
   Background connector canvas
   Thin horizontal lines + nodes + pulse
   ═══════════════════════════════════════ */
function ConnectorBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let cw = canvas.offsetWidth;
    let ch = canvas.offsetHeight;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let time = 0;

    function draw() {
      if (!ctx) return;
      time += 0.016;
      ctx.clearRect(0, 0, cw, ch);

      const cy = ch / 2;

      // Horizontal connector line
      ctx.strokeStyle = rgba(255, 255, 255, 0.03);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(cw, cy);
      ctx.stroke();

      // 4 node positions (center of each metric column)
      const nodes = [0.125, 0.375, 0.625, 0.875];

      // Secondary connector lines to nodes
      for (const nx of nodes) {
        const x = nx * cw;
        ctx.strokeStyle = rgba(255, 255, 255, 0.02);
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, cy - 15);
        ctx.lineTo(x, cy + 15);
        ctx.stroke();

        // Node dot
        ctx.beginPath();
        ctx.arc(x, cy, 2, 0, Math.PI * 2);
        ctx.fillStyle = rgba(G.r, G.g, G.b, 0.06);
        ctx.fill();
      }

      // Segment connectors between nodes
      for (let i = 0; i < nodes.length - 1; i++) {
        const x1 = nodes[i] * cw;
        const x2 = nodes[i + 1] * cw;
        ctx.strokeStyle = rgba(G.r, G.g, G.b, 0.03);
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x1 + 6, cy);
        ctx.lineTo(x2 - 6, cy);
        ctx.stroke();
      }

      // Traveling pulse
      const pulseX = ((time * 60) % (cw + 40)) - 20;
      const pulseA = 0.18;
      ctx.beginPath();
      ctx.arc(pulseX, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = rgba(G.r, G.g, G.b, pulseA);
      ctx.fill();

      // Pulse trail
      for (let t = 1; t <= 5; t++) {
        ctx.beginPath();
        ctx.arc(pulseX - t * 8, cy, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = rgba(G.r, G.g, G.b, pulseA * (1 - t / 5));
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ═══════════════════════════════════════
   Micro-animation canvases per metric
   ═══════════════════════════════════════ */

/* 50+ Merchants — dots settling */
function MicroMerchants({ started }: { started: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const anim = useRef<number>(0);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = c.offsetWidth, h = c.offsetHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let time = 0;
    const dots: { x: number; ty: number; y: number; delay: number }[] = [];
    for (let i = 0; i < 6; i++) {
      dots.push({
        x: 4 + (i % 3) * 10,
        ty: 4 + Math.floor(i / 3) * 8,
        y: -10 - Math.random() * 15,
        delay: i * 0.12,
      });
    }

    function draw() {
      if (!ctx) return;
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      if (!started) { anim.current = requestAnimationFrame(draw); return; }

      for (const d of dots) {
        const t = Math.max(0, (time - d.delay) * 2);
        const progress = Math.min(1, easeOutQuart(t));
        d.y = d.y + (d.ty - d.y) * 0.08;
        const a = progress * 0.4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = rgba(G.r, G.g, G.b, a);
        ctx.fill();
      }
      anim.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(anim.current);
  }, [started]);

  return <canvas ref={ref} className="w-[32px] h-[20px] mx-auto mb-1" style={{ display: "block" }} />;
}

/* EU & UK — alternating highlight */
function MicroJurisdictions({ started }: { started: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const anim = useRef<number>(0);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = c.offsetWidth, h = c.offsetHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let time = 0;
    function draw() {
      if (!ctx) return;
      time += 0.016;
      ctx.clearRect(0, 0, w, h);
      if (!started) { anim.current = requestAnimationFrame(draw); return; }

      const cy = h / 2;
      // Two dots with alternating pulse
      const p1 = Math.sin(time * 1.5) * 0.5 + 0.5;
      const p2 = 1 - p1;

      // EU dot
      ctx.beginPath();
      ctx.arc(w * 0.3, cy, 3 + p1 * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = rgba(G.r, G.g, G.b, 0.15 + p1 * 0.2);
      ctx.fill();

      // UK dot
      ctx.beginPath();
      ctx.arc(w * 0.7, cy, 3 + p2 * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = rgba(G.r, G.g, G.b, 0.15 + p2 * 0.2);
      ctx.fill();

      // Connector
      ctx.strokeStyle = rgba(G.r, G.g, G.b, 0.08);
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.3 + 5, cy);
      ctx.lineTo(w * 0.7 - 5, cy);
      ctx.stroke();

      // Pulse dot traveling
      const px = w * 0.3 + 5 + (w * 0.4 - 10) * ((time * 0.5) % 1);
      ctx.beginPath();
      ctx.arc(px, cy, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = rgba(G.r, G.g, G.b, 0.25);
      ctx.fill();

      anim.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(anim.current);
  }, [started]);

  return <canvas ref={ref} className="w-[40px] h-[14px] mx-auto mb-1" style={{ display: "block" }} />;
}

/* 24h — circular progress sweep */
function MicroSpeed({ started }: { started: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const anim = useRef<number>(0);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = c.offsetWidth, h = c.offsetHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let time = 0;
    function draw() {
      if (!ctx) return;
      time += 0.016;
      ctx.clearRect(0, 0, w, h);
      if (!started) { anim.current = requestAnimationFrame(draw); return; }

      const cx = w / 2, cy = h / 2, r = 7;
      const sweep = (time * 0.6) % 1;

      // Track circle
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(255, 255, 255, 0.06);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Progress arc
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + sweep * Math.PI * 2);
      ctx.strokeStyle = rgba(G.r, G.g, G.b, 0.3);
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.lineCap = "butt";

      // Dot at sweep end
      const angle = -Math.PI / 2 + sweep * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = rgba(G.r, G.g, G.b, 0.4);
      ctx.fill();

      anim.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(anim.current);
  }, [started]);

  return <canvas ref={ref} className="w-[20px] h-[20px] mx-auto mb-1" style={{ display: "block" }} />;
}

/* 95%+ — pipeline bar segments */
function MicroApproval({ started }: { started: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const anim = useRef<number>(0);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = c.offsetWidth, h = c.offsetHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let time = 0;
    function draw() {
      if (!ctx) return;
      time += 0.016;
      ctx.clearRect(0, 0, w, h);
      if (!started) { anim.current = requestAnimationFrame(draw); return; }

      const segments = 5;
      const segW = (w - 4) / segments - 2;
      const cy = h / 2;
      const segH = 4;

      for (let i = 0; i < segments; i++) {
        const sx = 2 + i * (segW + 2);
        const delay = i * 0.15;
        const progress = easeOutQuart(Math.max(0, Math.min(1, (time - delay) * 1.5)));

        // Background
        ctx.fillStyle = rgba(255, 255, 255, 0.04);
        ctx.beginPath();
        ctx.roundRect(sx, cy - segH / 2, segW, segH, 1);
        ctx.fill();

        // Fill (first 4 are gold = approved, 5th is dim = the 5% gap)
        if (i < 4 || (i === 4 && time > 1.5)) {
          const fillA = i < 4 ? 0.3 * progress : 0.08 * progress;
          ctx.fillStyle = rgba(G.r, G.g, G.b, fillA);
          ctx.beginPath();
          ctx.roundRect(sx, cy - segH / 2, segW * progress, segH, 1);
          ctx.fill();
        }
      }

      anim.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(anim.current);
  }, [started]);

  return <canvas ref={ref} className="w-[40px] h-[10px] mx-auto mb-1" style={{ display: "block" }} />;
}

/* ═══════════════════════════════════════
   Counter Cell
   ═══════════════════════════════════════ */
function CounterCell({
  target, suffix, label, started, micro,
}: {
  target: number; suffix: string; label: string; started: boolean;
  micro: React.ReactNode;
}) {
  const { value, done } = useCounter(target, 1200, started);

  return (
    <div className="text-center stat-cell relative z-10">
      {micro}
      <div className={`text-2xl md:text-3xl font-bold text-gold stat-value ${done ? "stat-bounce" : ""}`}>
        {started ? value : 0}
        {done && <span>{suffix}</span>}
      </div>
      <div className={`text-sm text-muted mt-1 stat-label transition-all duration-400 ${started ? "stat-label-in" : "opacity-0 translate-y-1"}`}>
        {label}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Text Reveal Cell (EU & UK)
   ═══════════════════════════════════════ */
function TextCell({ label, started, micro }: { label: string; started: boolean; micro: React.ReactNode }) {
  const text = "EU & UK";
  const chars = text.split("");
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="text-center stat-cell relative z-10">
      {micro}
      <div className="text-2xl md:text-3xl font-bold text-gold stat-value flex justify-center">
        {chars.map((ch, i) => (
          <span
            key={i}
            className="inline-block transition-all"
            style={
              started
                ? {
                    opacity: 1, transform: "translateY(0)",
                    transitionDuration: "300ms",
                    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transitionDelay: prefersReduced ? "0ms" : `${i * 80}ms`,
                  }
                : { opacity: 0, transform: "translateY(-4px)" }
            }
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>
      <div className={`text-sm text-muted mt-1 stat-label transition-all duration-400 ${started ? "stat-label-in" : "opacity-0 translate-y-1"}`}>
        {label}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Main export
   ═══════════════════════════════════════ */
export default function StatsCounter({ labels }: { labels: string[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
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

  return (
    <div ref={sectionRef} className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
      <ConnectorBg />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        <CounterCell target={50} suffix="+" label={labels[0]} started={started}
          micro={<MicroMerchants started={started} />} />
        <TextCell label={labels[1]} started={started}
          micro={<MicroJurisdictions started={started} />} />
        <CounterCell target={24} suffix="h" label={labels[2]} started={started}
          micro={<MicroSpeed started={started} />} />
        <CounterCell target={95} suffix="%+" label={labels[3]} started={started}
          micro={<MicroApproval started={started} />} />
      </div>
    </div>
  );
}
