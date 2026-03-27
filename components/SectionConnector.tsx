"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/*
  SectionConnector — routing signal separator

  Scroll-triggered entrance pulse → idle breathing → hover boost
  Sharper lines, brighter node, crisper chevrons
*/

export default function SectionConnector({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [visible, setVisible] = useState(false);
  const hoveredRef = useRef(false);
  const entranceTimeRef = useRef(0); // time when it became visible

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    },
    []
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let cw = canvas.offsetWidth;
    const ch = 32;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const G = { r: 184, g: 151, b: 31 };
    const W = { r: 232, g: 232, b: 236 };
    const cy = ch / 2;

    let time = 0;
    entranceTimeRef.current = 0;
    let entrancePhase = 0; // 0-1, drives entrance animation

    function rgba(r: number, g: number, b: number, a: number) {
      return `rgba(${r},${g},${b},${Math.max(0, a)})`;
    }

    function draw() {
      if (!ctx) return;
      time += 0.016;
      const hovered = hoveredRef.current;
      const hoverBoost = hovered ? 1.4 : 1;

      // Entrance animation (first 0.8s)
      entrancePhase = Math.min(1, time / 0.8);
      const ep = entrancePhase;
      const epEased = 1 - Math.pow(1 - ep, 3);

      ctx.clearRect(0, 0, cw, ch);

      const cx = cw / 2;
      const lineStart = cw * 0.08;
      const lineEnd = cw * 0.92;
      const lineLen = lineEnd - lineStart;

      // === LINE — draws from center outward on entrance ===
      const lineDrawn = epEased;
      const drawLeft = cx - (cx - lineStart) * lineDrawn;
      const drawRight = cx + (lineEnd - cx) * lineDrawn;

      // Main line
      ctx.strokeStyle = rgba(G.r, G.g, G.b, 0.18 * hoverBoost);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(drawLeft, cy);
      ctx.lineTo(drawRight, cy);
      ctx.stroke();

      // Glow line
      const glowShift = Math.sin(time * 0.8) * 0.02;
      ctx.strokeStyle = rgba(G.r, G.g, G.b, (0.06 + glowShift) * hoverBoost);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(drawLeft + 10, cy);
      ctx.lineTo(drawRight - 10, cy);
      ctx.stroke();

      // === CHEVRONS — appear after line draws ===
      const chevronAlpha = Math.max(0, (ep - 0.4) / 0.6);
      const chevronSize = 6;
      const drift = Math.sin(time * 1.2) * 1.5 * epEased;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Left chevrons ‹‹
      const lx = lineStart + 25;
      for (let i = 0; i < 2; i++) {
        const off = i * 12;
        const a = chevronAlpha * (0.2 + i * 0.12) * hoverBoost;
        ctx.strokeStyle = rgba(G.r, G.g, G.b, a);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(lx + off + chevronSize - drift, cy - chevronSize);
        ctx.lineTo(lx + off - drift, cy);
        ctx.lineTo(lx + off + chevronSize - drift, cy + chevronSize);
        ctx.stroke();
      }

      // Right chevrons ››
      const rx = lineEnd - 25;
      for (let i = 0; i < 2; i++) {
        const off = i * 12;
        const a = chevronAlpha * (0.2 + i * 0.12) * hoverBoost;
        ctx.strokeStyle = rgba(G.r, G.g, G.b, a);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(rx - off - chevronSize + drift, cy - chevronSize);
        ctx.lineTo(rx - off + drift, cy);
        ctx.lineTo(rx - off - chevronSize + drift, cy + chevronSize);
        ctx.stroke();
      }

      // === SMALL TICKS along the line ===
      const tickCount = 8;
      for (let i = 1; i < tickCount; i++) {
        if (i === tickCount / 2) continue; // skip center (node is there)
        const tx = lineStart + (lineLen / tickCount) * i;
        if (tx < drawLeft || tx > drawRight) continue;
        const ta = 0.06 * epEased * hoverBoost;
        ctx.strokeStyle = rgba(W.r, W.g, W.b, ta);
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(tx, cy - 3);
        ctx.lineTo(tx, cy + 3);
        ctx.stroke();
      }

      // === CENTER NODE ===
      const breathe = Math.sin(time * 1.5) * 0.5 + 0.5;
      const entrancePulse = ep < 1 ? Math.sin(ep * Math.PI) * 0.5 : 0;

      // Outer ring
      const outerR = 7 + breathe * 1 + entrancePulse * 4;
      const outerA = (0.1 + breathe * 0.08 + entrancePulse * 0.12) * hoverBoost;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(G.r, G.g, G.b, outerA);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Node fill
      const nodeR = 4.5 + breathe * 1 + entrancePulse * 2;
      const nodeA = (0.3 + breathe * 0.12) * hoverBoost;
      ctx.beginPath();
      ctx.arc(cx, cy, nodeR, 0, Math.PI * 2);
      ctx.fillStyle = rgba(G.r, G.g, G.b, nodeA);
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = rgba(G.r, G.g, G.b, 0.6 * hoverBoost);
      ctx.fill();

      // === ENTRANCE RIPPLE (first 0.8s only) ===
      if (ep < 1 && !prefersReduced) {
        const rippleR = ep * 30;
        const rippleA = (1 - ep) * 0.15;
        ctx.beginPath();
        ctx.arc(cx, cy, rippleR, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(G.r, G.g, G.b, rippleA);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // === TRAVELING SIGNALS (idle, every 3.5s) ===
      if (!prefersReduced && ep >= 1) {
        const sigCycle = 3.5;
        const sigPhase = ((time - 0.8) % sigCycle) / sigCycle;

        // Dual signal: edges → center
        if (sigPhase < 0.35) {
          const t = sigPhase / 0.35;
          const easeT = 1 - Math.pow(1 - t, 2);

          // Left signal
          const px1 = lineStart + easeT * (cx - lineStart);
          const sa = (1 - t) * 0.35 * hoverBoost;
          ctx.beginPath();
          ctx.arc(px1, cy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = rgba(G.r, G.g, G.b, sa);
          ctx.fill();
          // Trail
          for (let tr = 1; tr <= 4; tr++) {
            const tpx = px1 - tr * 6 * easeT;
            if (tpx < lineStart) break;
            ctx.beginPath();
            ctx.arc(tpx, cy, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = rgba(G.r, G.g, G.b, sa * (1 - tr / 5));
            ctx.fill();
          }

          // Right signal (mirror)
          const px2 = lineEnd - easeT * (lineEnd - cx);
          ctx.beginPath();
          ctx.arc(px2, cy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = rgba(G.r, G.g, G.b, sa);
          ctx.fill();
          for (let tr = 1; tr <= 4; tr++) {
            const tpx = px2 + tr * 6 * easeT;
            if (tpx > lineEnd) break;
            ctx.beginPath();
            ctx.arc(tpx, cy, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = rgba(G.r, G.g, G.b, sa * (1 - tr / 5));
            ctx.fill();
          }
        }

        // Center burst when signals arrive
        if (sigPhase > 0.3 && sigPhase < 0.5) {
          const bt = (sigPhase - 0.3) / 0.2;
          const br = 6 + bt * 18;
          const ba = (1 - bt) * 0.12 * hoverBoost;
          ctx.beginPath();
          ctx.arc(cx, cy, br, 0, Math.PI * 2);
          ctx.strokeStyle = rgba(G.r, G.g, G.b, ba);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.lineCap = "butt";
      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [visible]);

  return (
    <div
      ref={wrapRef}
      className={`w-full max-w-3xl mx-auto py-3 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
      onMouseEnter={() => { hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; }}
    >
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: "32px", display: "block" }}
      />
    </div>
  );
}
