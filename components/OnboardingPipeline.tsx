"use client";

import { useEffect, useRef } from "react";

/*
  Hero Animation — Full right-side block

  Phase 1: Frontshop assembles (top half)
  Phase 2: PSP Dashboard assembles (bottom half)
  Phase 3: Active revenue flow line between them

  Then loop.
*/

export default function OnboardingPipeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cw = 0;
    let ch = 0;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      cw = canvas.offsetWidth;
      ch = canvas.offsetHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const CYCLE = 7; // seconds
    const G = { r: 184, g: 151, b: 31 };
    const W = { r: 255, g: 255, b: 255 };

    function rgba(r: number, g: number, b: number, a: number) {
      return `rgba(${r},${g},${b},${a})`;
    }
    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * Math.max(0, Math.min(1, t));
    }
    function clamp(t: number) { return Math.max(0, Math.min(1, t)); }
    function easeOut(t: number) { return 1 - Math.pow(1 - clamp(t), 3); }
    function easeInOut(t: number) {
      const c = clamp(t);
      return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
    }

    // --- Layout ---
    // Card padding from edges
    const PAD = 0.06;

    function cardLayout() {
      const gap = ch * 0.1; // space between cards for the flow line
      const cardW = cw * (1 - PAD * 2);
      const totalH = ch * (1 - PAD * 2);
      const cardH = (totalH - gap) / 2;
      const x = cw * PAD;
      const topY = ch * PAD;
      const botY = topY + cardH + gap;
      const flowY = topY + cardH; // top of gap
      const flowH = gap;
      return { cardW, cardH, x, topY, botY, flowY, flowH };
    }

    // --- Frontshop UI elements (relative to card) ---
    interface UIEl {
      x: number; y: number; w: number; h: number;
      type: "rect" | "line" | "circle" | "text-block";
      delay: number; // build order (0-1)
    }

    const FRONT_ELS: UIEl[] = [
      // Nav bar
      { x: 0, y: 0, w: 1, h: 0.07, type: "rect", delay: 0 },
      // Logo dot
      { x: 0.03, y: 0.015, w: 0.025, h: 0.04, type: "circle", delay: 0.02 },
      // Nav links
      { x: 0.3, y: 0.025, w: 0.45, h: 0.02, type: "line", delay: 0.04 },
      // CTA button in nav
      { x: 0.82, y: 0.015, w: 0.14, h: 0.04, type: "rect", delay: 0.06 },
      // Hero heading
      { x: 0.05, y: 0.12, w: 0.65, h: 0.06, type: "rect", delay: 0.08 },
      // Hero subtext line 1
      { x: 0.05, y: 0.2, w: 0.55, h: 0.02, type: "line", delay: 0.1 },
      // Hero subtext line 2
      { x: 0.05, y: 0.24, w: 0.45, h: 0.02, type: "line", delay: 0.12 },
      // CTA button
      { x: 0.05, y: 0.3, w: 0.2, h: 0.06, type: "rect", delay: 0.14 },
      // Secondary button
      { x: 0.28, y: 0.3, w: 0.2, h: 0.06, type: "rect", delay: 0.16 },
      // Product image placeholder
      { x: 0.05, y: 0.42, w: 0.5, h: 0.3, type: "rect", delay: 0.18 },
      // Sidebar card 1
      { x: 0.6, y: 0.42, w: 0.35, h: 0.14, type: "rect", delay: 0.2 },
      // Sidebar card 2
      { x: 0.6, y: 0.58, w: 0.35, h: 0.14, type: "rect", delay: 0.22 },
      // Footer line
      { x: 0.05, y: 0.8, w: 0.6, h: 0.02, type: "line", delay: 0.24 },
      // Footer text
      { x: 0.05, y: 0.84, w: 0.4, h: 0.015, type: "line", delay: 0.26 },
      // Footer bottom
      { x: 0, y: 0.9, w: 1, h: 0.06, type: "rect", delay: 0.28 },
    ];

    // --- PSP Dashboard elements ---
    const PSP_ELS: UIEl[] = [
      // Top bar
      { x: 0, y: 0, w: 1, h: 0.06, type: "rect", delay: 0 },
      // Logo
      { x: 0.03, y: 0.015, w: 0.025, h: 0.03, type: "circle", delay: 0.02 },
      // Tab bar
      { x: 0.15, y: 0.02, w: 0.5, h: 0.02, type: "line", delay: 0.04 },
      // Title
      { x: 0.04, y: 0.1, w: 0.35, h: 0.04, type: "rect", delay: 0.06 },
      // Subtitle
      { x: 0.04, y: 0.16, w: 0.25, h: 0.02, type: "line", delay: 0.08 },
      // Metric card 1
      { x: 0.04, y: 0.22, w: 0.28, h: 0.18, type: "rect", delay: 0.1 },
      // Metric card 2
      { x: 0.36, y: 0.22, w: 0.28, h: 0.18, type: "rect", delay: 0.13 },
      // Metric card 3
      { x: 0.68, y: 0.22, w: 0.28, h: 0.18, type: "rect", delay: 0.16 },
      // Chart area
      { x: 0.04, y: 0.46, w: 0.6, h: 0.25, type: "rect", delay: 0.19 },
      // Right panel
      { x: 0.68, y: 0.46, w: 0.28, h: 0.25, type: "rect", delay: 0.22 },
      // Table row 1
      { x: 0.04, y: 0.76, w: 0.92, h: 0.03, type: "line", delay: 0.25 },
      // Table row 2
      { x: 0.04, y: 0.81, w: 0.92, h: 0.03, type: "line", delay: 0.27 },
      // Table row 3
      { x: 0.04, y: 0.86, w: 0.92, h: 0.03, type: "line", delay: 0.29 },
      // Status bar
      { x: 0, y: 0.92, w: 1, h: 0.05, type: "rect", delay: 0.31 },
    ];

    /* --- PHASE TIMELINE ---
       0.00 - 0.04  fade in
       0.04 - 0.30  frontshop builds (elements appear sequentially)
       0.30 - 0.35  frontshop fully built, brief hold
       0.35 - 0.60  PSP dashboard builds
       0.60 - 0.65  both built, pause
       0.65 - 0.90  revenue flow active (fat line + running dots)
       0.90 - 1.00  fade out, reset
    */

    function frontBuild(phase: number): number {
      return clamp((phase - 0.03) / 0.20);
    }
    function pspBuild(phase: number): number {
      return clamp((phase - 0.26) / 0.20);
    }
    function flowIntensity(phase: number): number {
      if (phase < 0.48) return 0;
      if (phase < 0.53) return easeOut((phase - 0.48) / 0.05);
      if (phase < 0.88) return 1;
      if (phase < 0.95) return 1 - (phase - 0.88) / 0.07;
      return 0;
    }
    function globalAlpha(phase: number): number {
      if (phase < 0.04) return easeOut(phase / 0.04);
      if (phase > 0.92) return clamp((1 - phase) / 0.08);
      return 1;
    }

    // --- Draw a single UI element ---
    function drawUIEl(
      el: UIEl, cardX: number, cardY: number, cardW: number, cardH: number,
      buildProgress: number, // 0-1 how built the overall card is
      color: { r: number; g: number; b: number },
      accentAlpha: number
    ) {
      if (!ctx) return;

      // Element appears when buildProgress passes its delay
      const elProg = clamp((buildProgress - el.delay) / 0.04);
      if (elProg <= 0) return;

      const ap = easeOut(elProg);
      const ex = cardX + el.x * cardW;
      const ey = cardY + el.y * cardH;
      const ew = el.w * cardW * ap; // grows in width
      const eh = el.h * cardH;

      const fillA = (0.08 + ap * 0.14) * accentAlpha;
      const strokeA = (0.15 + ap * 0.35) * accentAlpha;

      if (el.type === "rect") {
        ctx.fillStyle = rgba(color.r, color.g, color.b, fillA);
        ctx.beginPath();
        ctx.roundRect(ex, ey, ew, eh, 2);
        ctx.fill();
        ctx.strokeStyle = rgba(color.r, color.g, color.b, strokeA);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      } else if (el.type === "line") {
        ctx.strokeStyle = rgba(color.r, color.g, color.b, strokeA * 1.2);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ex, ey + eh / 2);
        ctx.lineTo(ex + ew, ey + eh / 2);
        ctx.stroke();
      } else if (el.type === "circle") {
        const r = Math.min(ew, eh) * 0.5;
        ctx.beginPath();
        ctx.arc(ex + ew / 2, ey + eh / 2, r * ap, 0, Math.PI * 2);
        ctx.fillStyle = rgba(color.r, color.g, color.b, fillA * 2);
        ctx.fill();
      } else if (el.type === "text-block") {
        for (let i = 0; i < 3; i++) {
          const lw = ew * (1 - i * 0.2);
          ctx.strokeStyle = rgba(color.r, color.g, color.b, strokeA * 0.7);
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(ex, ey + i * eh * 0.35);
          ctx.lineTo(ex + lw, ey + i * eh * 0.35);
          ctx.stroke();
        }
      }
    }

    // --- Draw card frame ---
    function drawCardFrame(
      x: number, y: number, w: number, h: number,
      label: string, color: { r: number; g: number; b: number },
      alpha: number, builtProgress: number
    ) {
      if (!ctx || alpha < 0.01) return;
      ctx.globalAlpha = alpha;

      // Background
      ctx.fillStyle = rgba(color.r, color.g, color.b, 0.025 + builtProgress * 0.02);
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.fill();

      // Border — draws progressively
      const borderA = 0.1 + builtProgress * 0.25;
      ctx.strokeStyle = rgba(color.r, color.g, color.b, borderA);
      ctx.lineWidth = 1 + builtProgress * 1;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.stroke();

      // Glow when fully built
      if (builtProgress > 0.9) {
        const ga = (builtProgress - 0.9) / 0.1;
        ctx.shadowColor = rgba(color.r, color.g, color.b, ga * 0.08);
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
      }

      // Label
      ctx.font = "bold 10px 'Geist Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = rgba(color.r, color.g, color.b, 0.35 + builtProgress * 0.4);
      ctx.fillText(label, x + 10, y - 8);

      ctx.globalAlpha = 1;
    }

    // --- Draw inner chart content for PSP ---
    function drawPSPCharts(
      x: number, y: number, w: number, h: number,
      progress: number, animTime: number
    ) {
      if (!ctx || progress < 0.7) return;
      const a = easeOut((progress - 0.7) / 0.3);
      ctx.globalAlpha = a * 0.9;

      // Bar chart inside metric card 1 area
      const cx = x + w * 0.06;
      const cy = y + h * 0.28;
      const cw2 = w * 0.24;
      const ch2 = h * 0.13;
      for (let i = 0; i < 5; i++) {
        const bh = ch2 * (0.3 + Math.abs(Math.sin(animTime * 0.7 + i * 1.2)) * 0.6);
        const bw = cw2 / 5 - 2;
        ctx.fillStyle = rgba(G.r, G.g, G.b, 0.2);
        ctx.fillRect(cx + i * (bw + 2), cy + ch2 - bh, bw, bh);
      }

      // Percentage text in card 2
      ctx.font = "bold 16px 'Geist Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = rgba(G.r, G.g, G.b, 0.35);
      ctx.fillText("95%", x + w * 0.5, y + h * 0.34);
      ctx.font = "8px 'Geist Mono', monospace";
      ctx.fillStyle = rgba(G.r, G.g, G.b, 0.2);
      ctx.fillText("APPROVAL", x + w * 0.5, y + h * 0.38);

      // Sparkline in chart area
      ctx.beginPath();
      const spx = x + w * 0.06;
      const spy = y + h * 0.58;
      const spw = w * 0.56;
      ctx.moveTo(spx, spy);
      for (let i = 1; i <= 12; i++) {
        const px = spx + (spw / 12) * i;
        const py = spy - Math.sin(animTime * 0.5 + i * 0.7) * h * 0.05 - h * 0.04;
        ctx.lineTo(px, py);
      }
      ctx.strokeStyle = rgba(G.r, G.g, G.b, 0.35);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Fill under sparkline
      ctx.lineTo(spx + spw, spy + h * 0.05);
      ctx.lineTo(spx, spy + h * 0.05);
      ctx.closePath();
      ctx.fillStyle = rgba(G.r, G.g, G.b, 0.03);
      ctx.fill();

      ctx.globalAlpha = 1;
    }

    // --- Draw frontshop inner content (image placeholder etc) ---
    function drawFrontContent(
      x: number, y: number, w: number, h: number,
      progress: number
    ) {
      if (!ctx || progress < 0.5) return;
      const a = easeOut((progress - 0.5) / 0.5);
      ctx.globalAlpha = a * 0.5;

      // Image placeholder cross
      const ix = x + w * 0.07;
      const iy = y + h * 0.44;
      const iw = w * 0.48;
      const ih = h * 0.28;
      ctx.strokeStyle = rgba(255, 255, 255, 0.06);
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(ix, iy); ctx.lineTo(ix + iw, iy + ih);
      ctx.moveTo(ix + iw, iy); ctx.lineTo(ix, iy + ih);
      ctx.stroke();

      ctx.globalAlpha = 1;
    }

    // --- Revenue flow line ---
    interface FlowDot {
      pos: number; // 0-1 along the line
      speed: number;
      size: number;
    }

    const flowDots: FlowDot[] = [];
    function ensureFlowDots() {
      if (flowDots.length >= 20) return;
      while (flowDots.length < 20) {
        flowDots.push({
          pos: Math.random(),
          speed: 0.012 + Math.random() * 0.018,
          size: 2.5 + Math.random() * 2.5,
        });
      }
    }

    function drawRevenueFlow(
      layout: ReturnType<typeof cardLayout>,
      intensity: number, animTime: number
    ) {
      if (!ctx || intensity < 0.01) return;

      const { cardW, x, flowY, flowH } = layout;
      const lineX = x + cardW * 0.15;
      const lineW = cardW * 0.7;
      const centerY = flowY + flowH / 2;

      // Main fat line
      const lineAlpha = intensity * 0.7;
      ctx.strokeStyle = rgba(G.r, G.g, G.b, lineAlpha);
      ctx.lineWidth = 3 + intensity * 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lineX, centerY);
      ctx.lineTo(lineX + lineW, centerY);
      ctx.stroke();

      // Glow behind line
      ctx.shadowColor = rgba(G.r, G.g, G.b, intensity * 0.35);
      ctx.shadowBlur = 25;
      ctx.strokeStyle = rgba(G.r, G.g, G.b, lineAlpha * 0.3);
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(lineX, centerY);
      ctx.lineTo(lineX + lineW, centerY);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      // Outer thin lines
      for (const offset of [-8, 8]) {
        ctx.strokeStyle = rgba(G.r, G.g, G.b, intensity * 0.08);
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(lineX + 20, centerY + offset);
        ctx.lineTo(lineX + lineW - 20, centerY + offset);
        ctx.stroke();
      }

      // Arrow at start and end
      const arrowA = intensity * 0.4;
      // Left arrow (incoming from frontshop)
      ctx.fillStyle = rgba(255, 255, 255, arrowA);
      ctx.beginPath();
      ctx.moveTo(lineX, centerY);
      ctx.lineTo(lineX - 6, centerY - 4);
      ctx.lineTo(lineX - 6, centerY + 4);
      ctx.closePath();
      ctx.fill();
      // Right arrow (going to PSP)
      ctx.fillStyle = rgba(G.r, G.g, G.b, arrowA);
      ctx.beginPath();
      ctx.moveTo(lineX + lineW, centerY);
      ctx.lineTo(lineX + lineW + 6, centerY - 4);
      ctx.lineTo(lineX + lineW + 6, centerY + 4);
      ctx.closePath();
      ctx.fill();

      // Running dots along the line
      ensureFlowDots();
      for (const dot of flowDots) {
        dot.pos += dot.speed;
        if (dot.pos > 1) dot.pos -= 1;

        const dx = lineX + dot.pos * lineW;
        const pulse = Math.sin(animTime * 3 + dot.pos * 8) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.arc(dx, centerY, dot.size * intensity * pulse, 0, Math.PI * 2);
        ctx.fillStyle = rgba(G.r, G.g, G.b, intensity * 0.4 * pulse);
        ctx.fill();

        // Small tail
        ctx.beginPath();
        ctx.moveTo(dx, centerY);
        ctx.lineTo(dx - dot.speed * lineW * 4, centerY);
        ctx.strokeStyle = rgba(G.r, G.g, G.b, intensity * 0.15 * pulse);
        ctx.lineWidth = dot.size * 0.6;
        ctx.stroke();
      }

      // Label
      ctx.font = "bold 8px 'Geist Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = rgba(G.r, G.g, G.b, intensity * 0.4);
      ctx.fillText("REVENUE FLOW", lineX + lineW / 2, centerY - 16);

      // Amount indicator
      if (intensity > 0.5) {
        const amtA = (intensity - 0.5) * 2;
        ctx.font = "bold 11px 'Geist Mono', monospace";
        ctx.fillStyle = rgba(G.r, G.g, G.b, amtA * 0.35);
        ctx.fillText("ACTIVE", lineX + lineW / 2, centerY + 18);
      }

      ctx.lineCap = "butt";
    }

    // --- Background grid ---
    function drawBg() {
      if (!ctx) return;
      ctx.strokeStyle = rgba(255, 255, 255, 0.015);
      ctx.lineWidth = 0.5;
      const sp = 28;
      for (let gx = 0; gx < cw; gx += sp) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, ch); ctx.stroke();
      }
      for (let gy = 0; gy < ch; gy += sp) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(cw, gy); ctx.stroke();
      }
    }

    // --- Main loop ---
    let time = 0;
    let lastFrame = 0;

    function draw(now: number) {
      if (!ctx) return;
      const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0.016;
      lastFrame = now;
      time += dt;

      ctx.clearRect(0, 0, cw, ch);

      const ph = (time % CYCLE) / CYCLE;
      const lay = cardLayout();
      const ga = globalAlpha(ph);

      if (prefersReduced) {
        drawBg();
        drawCardFrame(lay.x, lay.topY, lay.cardW, lay.cardH, "FRONTSHOP", W, 0.5, 1);
        drawCardFrame(lay.x, lay.botY, lay.cardW, lay.cardH, "PSP DASHBOARD", G, 0.6, 1);
        return;
      }

      ctx.globalAlpha = ga;

      drawBg();

      const fb = frontBuild(ph);
      const pb = pspBuild(ph);
      const fi = flowIntensity(ph);

      // Frontshop card (top)
      const frontA = fb > 0 ? lerp(0.3, 1, clamp(fb / 0.3)) : 0;
      drawCardFrame(lay.x, lay.topY, lay.cardW, lay.cardH, "FRONTSHOP", W, frontA * ga, fb);
      for (const el of FRONT_ELS) {
        drawUIEl(el, lay.x, lay.topY, lay.cardW, lay.cardH, fb, W, frontA * ga);
      }
      drawFrontContent(lay.x, lay.topY, lay.cardW, lay.cardH, fb);

      // PSP Dashboard (bottom)
      const pspA = pb > 0 ? lerp(0.3, 1, clamp(pb / 0.3)) : 0;
      drawCardFrame(lay.x, lay.botY, lay.cardW, lay.cardH, "PSP DASHBOARD", G, pspA * ga, pb);
      for (const el of PSP_ELS) {
        drawUIEl(el, lay.x, lay.botY, lay.cardW, lay.cardH, pb, G, pspA * ga);
      }
      drawPSPCharts(lay.x, lay.botY, lay.cardW, lay.cardH, pb, time);

      // Revenue flow
      drawRevenueFlow(lay, fi * ga, time);

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
