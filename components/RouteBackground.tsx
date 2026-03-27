"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  baseOpacity: number;
  phase: number;
}

interface Packet {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  opacity: number;
}

export default function RouteBackground({
  variant = "default",
  theme = "dark",
}: {
  variant?: "default" | "dense" | "sparse" | "flow";
  theme?: "light" | "dark";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const packetsRef = useRef<Packet[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cw = 0;
    let ch = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio;
      cw = canvas.offsetWidth;
      ch = canvas.offsetHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    };

    const density =
      variant === "dense" ? 1.5 :
      variant === "sparse" ? 0.6 :
      variant === "flow" ? 1.2 :
      1;

    function initNodes() {
      nodesRef.current = [];
      const spacing = 80 / density;
      const cols = Math.ceil(cw / spacing) + 1;
      const rows = Math.ceil(ch / spacing) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          nodesRef.current.push({
            x: c * spacing + (Math.random() - 0.5) * spacing * 0.3,
            y: r * spacing + (Math.random() - 0.5) * spacing * 0.3,
            baseOpacity: 0.03 + Math.random() * 0.04,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }

      // Init packets
      packetsRef.current = [];
      const packetCount = Math.floor(6 * density);
      for (let i = 0; i < packetCount; i++) {
        spawnPacket();
      }
    }

    function spawnPacket() {
      const nodes = nodesRef.current;
      if (nodes.length < 2) return;
      const fromIdx = Math.floor(Math.random() * nodes.length);
      let toIdx = fromIdx;
      // Pick a nearby node
      let bestDist = Infinity;
      const candidates = 8;
      for (let j = 0; j < candidates; j++) {
        const idx = Math.floor(Math.random() * nodes.length);
        if (idx === fromIdx) continue;
        const dx = nodes[idx].x - nodes[fromIdx].x;
        const dy = nodes[idx].y - nodes[fromIdx].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < bestDist && dist > 20) {
          bestDist = dist;
          toIdx = idx;
        }
      }
      if (toIdx === fromIdx) return;

      packetsRef.current.push({
        fromIdx,
        toIdx,
        progress: 0,
        speed: 0.005 + Math.random() * 0.008,
        opacity: 0.1 + Math.random() * 0.12,
      });
    }

    const lineColor = theme === "dark" ? "255,255,255" : "0,0,0";
    const nodeColor = theme === "dark" ? "184,151,31" : "184,151,31";

    let time = 0;

    function draw() {
      if (!ctx) return;
      time += 0.016;
      ctx.clearRect(0, 0, cw, ch);

      const nodes = nodesRef.current;
      const packets = packetsRef.current;

      // Draw nodes as faint dots
      for (const node of nodes) {
        const pulse = Math.sin(time * 0.8 + node.phase) * 0.5 + 0.5;
        const alpha = node.baseOpacity + pulse * 0.01;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${lineColor}, ${alpha})`;
        ctx.fill();
      }

      // Draw packets and their trail lines
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          packets.splice(i, 1);
          spawnPacket();
          continue;
        }

        const from = nodes[p.fromIdx];
        const to = nodes[p.toIdx];
        if (!from || !to) continue;

        // L-shaped route: go horizontal first, then vertical
        const midX = to.x;
        const midY = from.y;

        let px: number, py: number;
        if (p.progress < 0.5) {
          const t = p.progress * 2;
          px = from.x + (midX - from.x) * t;
          py = from.y;
        } else {
          const t = (p.progress - 0.5) * 2;
          px = midX;
          py = midY + (to.y - midY) * t;
        }

        // Trail line
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        if (p.progress < 0.5) {
          ctx.lineTo(px, py);
        } else {
          ctx.lineTo(midX, midY);
          ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(${nodeColor}, ${p.opacity * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Packet dot
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeColor}, ${p.opacity})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [variant, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
