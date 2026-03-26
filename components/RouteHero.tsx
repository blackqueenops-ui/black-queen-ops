"use client";

import { useEffect, useRef } from "react";

interface HeroNode {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  connections: number[];
}

interface FlowDot {
  pathIdx: number;
  progress: number;
  speed: number;
  size: number;
}

export default function RouteHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cw = 0;
    let ch = 0;
    const nodes: HeroNode[] = [];
    const flowDots: FlowDot[] = [];
    const paths: [number, number][] = [];

    const isMobile = window.innerWidth < 768;

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      cw = canvas.offsetWidth;
      ch = canvas.offsetHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initGrid();
    }

    function initGrid() {
      nodes.length = 0;
      paths.length = 0;
      flowDots.length = 0;

      const spacing = isMobile ? 70 : 55;
      const cols = Math.ceil(cw / spacing) + 2;
      const rows = Math.ceil(ch / spacing) + 2;
      const offsetX = (cw - (cols - 1) * spacing) / 2;
      const offsetY = (ch - (rows - 1) * spacing) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          nodes.push({
            x: offsetX + c * spacing,
            y: offsetY + r * spacing,
            radius: 1.5 + Math.random() * 0.5,
            opacity: 0.04 + Math.random() * 0.06,
            connections: [],
          });
        }
      }

      // Create connections (right and down neighbors, with some randomness)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          // Connect right
          if (c < cols - 1 && Math.random() < 0.4) {
            const right = idx + 1;
            paths.push([idx, right]);
            nodes[idx].connections.push(right);
            nodes[right].connections.push(idx);
          }
          // Connect down
          if (r < rows - 1 && Math.random() < 0.3) {
            const down = idx + cols;
            paths.push([idx, down]);
            nodes[idx].connections.push(down);
            nodes[down].connections.push(idx);
          }
        }
      }

      // Spawn flow dots
      const dotCount = isMobile ? 8 : 20;
      for (let i = 0; i < dotCount; i++) {
        flowDots.push({
          pathIdx: Math.floor(Math.random() * paths.length),
          progress: Math.random(),
          speed: 0.004 + Math.random() * 0.008,
          size: 1.5 + Math.random() * 1.5,
        });
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouseRef.current.x = -1;
      mouseRef.current.y = -1;
    }

    let time = 0;

    function draw() {
      if (!ctx) return;
      time += 0.016;
      ctx.clearRect(0, 0, cw, ch);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw path lines
      for (const [a, b] of paths) {
        const na = nodes[a];
        const nb = nodes[b];
        let alpha = 0.04;

        // Brighten near mouse
        if (mx >= 0) {
          const cx = (na.x + nb.x) / 2;
          const cy = (na.y + nb.y) / 2;
          const dist = Math.hypot(cx - mx, cy - my);
          if (dist < 120) {
            alpha += (1 - dist / 120) * 0.12;
          }
        }

        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        let alpha = node.opacity;
        const pulse = Math.sin(time * 1.2 + node.x * 0.01 + node.y * 0.01) * 0.02;
        alpha += pulse;

        // Mouse proximity glow
        if (mx >= 0) {
          const dist = Math.hypot(node.x - mx, node.y - my);
          if (dist < 100) {
            alpha += (1 - dist / 100) * 0.3;
          }
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Gold accent on some nodes near mouse
        if (mx >= 0) {
          const dist = Math.hypot(node.x - mx, node.y - my);
          if (dist < 60 && node.connections.length > 1) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius + 2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(184, 151, 31, ${(1 - dist / 60) * 0.4})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw flow dots
      for (const dot of flowDots) {
        dot.progress += dot.speed;
        if (dot.progress >= 1) {
          dot.progress = 0;
          dot.pathIdx = Math.floor(Math.random() * paths.length);
        }

        const [a, b] = paths[dot.pathIdx] || [0, 0];
        const na = nodes[a];
        const nb = nodes[b];
        if (!na || !nb) continue;

        const px = na.x + (nb.x - na.x) * dot.progress;
        const py = na.y + (nb.y - na.y) * dot.progress;

        ctx.beginPath();
        ctx.arc(px, py, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 151, 31, ${0.15 + dot.speed * 8})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    if (!isMobile) {
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseleave", onMouseLeave);
    }
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: "auto" }}
    />
  );
}
