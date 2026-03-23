"use client";

import { useEffect, useRef } from "react";

interface Piece {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  type: number;
}

// SVG path data for chess pieces
const chessPaths = [
  // Queen
  "M12 2c-1 0-2 1-2 2 0 .7.4 1.4 1 1.7V7c-4 .5-7 3-8 6l2 1 1.5-2L6 14l-1.5 2L6 17l1.5-2L9 17l-1.5 2L9 20H3v2h18v-2h-6l1.5-1L15 17l1.5 2L18 17l-1.5-2L18 14l1.5 2 2-1c-1-3-4-5.5-8-6V5.7c.6-.3 1-1 1-1.7 0-1-1-2-2-2z",
  // King
  "M12 2a1 1 0 00-1 1v1H9v2h2v1.3C7.4 8 4.5 11 4 14.5L6 16l1.5-2.5L9 16l-1.5 2.5L9 20H3v2h18v-2h-6l1.5-1.5L15 16l1.5 2.5L18 16l2-1.5C19.5 11 16.6 8 13 7.3V6h2V4h-2V3a1 1 0 00-1-1z",
  // Bishop
  "M12 2c-1.1 0-2 .9-2 2 0 .7.4 1.4 1 1.7v1.6C8.1 8.2 6 10.9 6 14c0 1.1.2 2.1.6 3L8 16l1.5-2L11 16l-1.5 2L11 19.5 9.5 21H6v1h12v-1h-3.5L13 19.5 11.5 18 13 16l1.5 2L16 16l1.4 1c.4-.9.6-1.9.6-3 0-3.1-2.1-5.8-5-6.7V5.7c.6-.3 1-1 1-1.7 0-1.1-.9-2-2-2z",
  // Rook
  "M5 3v3h2v1H5v3h3v8H5l-1 2v1h16v-1l-1-2h-3V10h3V7h-2V6h2V3h-4v3h-2V3h-4v3H8V3H5z",
  // Knight
  "M19 22H5v-1l2-2V12l-2.3-1.5c-.3-.2-.4-.6-.2-.9l3-4.5c.2-.3.5-.4.8-.3l2.7.9V4c0-.6.4-1 1-1h1c.6 0 1 .4 1 1v3l2 3v9l2 2v1z",
  // Pawn
  "M12 4a3 3 0 00-3 3c0 1.1.6 2 1.5 2.6C8.6 10.3 7 12.4 7 15h10c0-2.6-1.6-4.7-3.5-5.4A3 3 0 0015 7a3 3 0 00-3-3zM6 17v1h12v-1H6zm-1 3v2h14v-2H5z",
];

export default function ChessBackground({ variant = "default" }: { variant?: "default" | "strategy" | "shield" | "speed" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<Piece[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    // Determine pieces based on variant
    const typeFilter =
      variant === "strategy" ? [0, 1] : // queen & king for strategy
      variant === "shield" ? [2, 3] : // bishop & rook for compliance
      variant === "speed" ? [4, 5] : // knight & pawn for speed
      [0, 1, 2, 3, 4, 5]; // all

    // Init pieces
    const count = 12;
    if (piecesRef.current.length === 0) {
      for (let i = 0; i < count; i++) {
        piecesRef.current.push({
          x: Math.random() * 1200,
          y: Math.random() * 800,
          size: 20 + Math.random() * 30,
          speed: 0.15 + Math.random() * 0.3,
          opacity: 0.03 + Math.random() * 0.05,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 0.3,
          type: typeFilter[Math.floor(Math.random() * typeFilter.length)],
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w(), h());

      for (const p of piecesRef.current) {
        p.y -= p.speed;
        p.rotation += p.rotSpeed;

        if (p.y < -p.size * 2) {
          p.y = h() + p.size * 2;
          p.x = Math.random() * w();
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        const path = new Path2D(chessPaths[p.type]);
        const scale = p.size / 24;
        ctx.scale(scale, scale);
        ctx.translate(-12, -12);
        ctx.fillStyle = "#c9a84c";
        ctx.fill(path);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
}
