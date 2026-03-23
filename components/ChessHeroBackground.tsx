"use client";

import { useEffect, useRef } from "react";

// ---- Types ----
interface Cell {
  row: number;
  col: number;
  x: number;
  y: number;
  opacity: number;        // current board-cell opacity (0→1 wave)
  targetOpacity: number;  // 1 after wave reaches it
  fadeStart: number;      // timestamp when wave reaches
  fadeDuration: number;   // ms for fadeIn
  isDark: boolean;
  // trail
  trailOpacity: number;
  trailFadeStart: number;
  // hover
  hoverGlow: number;
}

interface QueenState {
  row: number;
  col: number;
  prevRow: number;
  prevCol: number;
  progress: number;       // 0→1 interpolation between prev→current
  moving: boolean;
  visible: boolean;
  waitUntil: number;      // timestamp when next move starts
}

const CELL = 60;
const QUEEN_CHAR = "\u265B";
const QUEEN_SIZE = 36;
const GOLD = "#b8971f";
const MOVE_DURATION = 600;   // ms per cell
const PAUSE_BETWEEN = 1200;  // ms pause between moves
const TRAIL_HOLD = 4000;     // ms trail stays
const TRAIL_FADE = 1500;     // ms trail fades out
const MAX_TRAIL = 8;
const WAVE_BASE_DELAY = 0;
const WAVE_RANDOM = 2000;

export default function ChessHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    cells: Cell[][];
    cols: number;
    rows: number;
    queen: QueenState;
    trail: { row: number; col: number; time: number }[];
    mouse: { x: number; y: number; active: boolean };
    startTime: number;
    waveOriginRow: number;
    waveOriginCol: number;
    moveQueue: { row: number; col: number }[];
    totalMoveCells: number;
    moveStartTime: number;
    isMobile: boolean;
  } | null>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ---- Init ----
    function initGrid() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(w / CELL) + 1;
      const rows = Math.ceil(h / CELL) + 1;
      const isMobile = w < 768;

      const centerRow = Math.floor(rows / 2);
      const centerCol = Math.floor(cols / 2);

      const cells: Cell[][] = [];
      for (let r = 0; r < rows; r++) {
        cells[r] = [];
        for (let c = 0; c < cols; c++) {
          const dist = Math.sqrt((r - centerRow) ** 2 + (c - centerCol) ** 2);
          const delay = WAVE_BASE_DELAY + dist * 150 + Math.random() * WAVE_RANDOM;
          cells[r][c] = {
            row: r,
            col: c,
            x: c * CELL,
            y: r * CELL,
            opacity: 0,
            targetOpacity: 1,
            fadeStart: performance.now() + delay,
            fadeDuration: 800,
            isDark: (r + c) % 2 === 1,
            trailOpacity: 0,
            trailFadeStart: 0,
            hoverGlow: 0,
          };
        }
      }

      const queenRow = centerRow;
      const queenCol = centerCol;

      // Compute wave complete time (max fadeStart + fadeDuration)
      let maxWaveEnd = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const end = cells[r][c].fadeStart + cells[r][c].fadeDuration;
          if (end > maxWaveEnd) maxWaveEnd = end;
        }
      }

      stateRef.current = {
        cells,
        cols,
        rows,
        queen: {
          row: queenRow,
          col: queenCol,
          prevRow: queenRow,
          prevCol: queenCol,
          progress: 1,
          moving: false,
          visible: false,
          waitUntil: maxWaveEnd + 500, // appear after wave
        },
        trail: [],
        mouse: { x: -1, y: -1, active: false },
        startTime: performance.now(),
        waveOriginRow: centerRow,
        waveOriginCol: centerCol,
        moveQueue: [],
        totalMoveCells: 0,
        moveStartTime: 0,
        isMobile,
      };
    }

    initGrid();

    // ---- Queen movement logic ----
    function getValidQueenMoves(
      row: number,
      col: number,
      rows: number,
      cols: number
    ): { row: number; col: number }[][] {
      const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],  // straight
        [-1, -1], [-1, 1], [1, -1], [1, 1], // diagonal
      ];
      const allMoves: { row: number; col: number }[][] = [];

      for (const [dr, dc] of directions) {
        // gather cells along this direction, 3-6 cells deep
        const path: { row: number; col: number }[] = [];
        for (let dist = 1; dist <= 6; dist++) {
          const nr = row + dr * dist;
          const nc = col + dc * dist;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) break;
          path.push({ row: nr, col: nc });
        }
        // only allow moves that are 3+ cells
        if (path.length >= 3) {
          // offer different lengths: 3, 4, 5, 6
          for (let len = 3; len <= path.length; len++) {
            allMoves.push(path.slice(0, len));
          }
        }
      }
      return allMoves;
    }

    function pickNextMove() {
      const s = stateRef.current!;
      const moves = getValidQueenMoves(s.queen.row, s.queen.col, s.rows, s.cols);
      if (moves.length === 0) {
        // fallback: teleport to center
        s.queen.row = Math.floor(s.rows / 2);
        s.queen.col = Math.floor(s.cols / 2);
        return;
      }
      const chosen = moves[Math.floor(Math.random() * moves.length)];
      s.moveQueue = chosen;
      s.totalMoveCells = chosen.length;
      s.moveStartTime = performance.now();
      s.queen.moving = true;
      s.queen.prevRow = s.queen.row;
      s.queen.prevCol = s.queen.col;
      s.queen.progress = 0;
    }

    // ---- Mouse ----
    function onMouseMove(e: MouseEvent) {
      if (stateRef.current?.isMobile) return;
      const rect = canvas!.getBoundingClientRect();
      stateRef.current!.mouse.x = e.clientX - rect.left;
      stateRef.current!.mouse.y = e.clientY - rect.top;
      stateRef.current!.mouse.active = true;
    }
    function onMouseLeave() {
      if (stateRef.current) {
        stateRef.current.mouse.active = false;
        stateRef.current.mouse.x = -1;
        stateRef.current.mouse.y = -1;
      }
    }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // ---- Resize ----
    function onResize() {
      initGrid();
    }
    window.addEventListener("resize", onResize);

    // ---- Render loop ----
    function draw(now: number) {
      const s = stateRef.current!;
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      // 1. Draw board cells with wave fadeIn
      for (let r = 0; r < s.rows; r++) {
        for (let c = 0; c < s.cols; c++) {
          const cell = s.cells[r][c];

          // Wave fadeIn
          if (now >= cell.fadeStart) {
            const elapsed = now - cell.fadeStart;
            cell.opacity = Math.min(1, elapsed / cell.fadeDuration);
          } else {
            cell.opacity = 0;
          }

          // Trail opacity
          if (cell.trailOpacity > 0) {
            const trailElapsed = now - cell.trailFadeStart;
            if (trailElapsed > TRAIL_HOLD) {
              const fadeElapsed = trailElapsed - TRAIL_HOLD;
              cell.trailOpacity = Math.max(0, 1 - fadeElapsed / TRAIL_FADE);
            }
          }

          // Hover glow
          if (s.mouse.active && !s.isMobile) {
            const mcol = Math.floor(s.mouse.x / CELL);
            const mrow = Math.floor(s.mouse.y / CELL);
            const dist = Math.max(Math.abs(r - mrow), Math.abs(c - mcol));
            const targetGlow = dist === 0 ? 1 : dist === 1 ? 0.5 : 0;
            cell.hoverGlow += (targetGlow - cell.hoverGlow) * 0.15;
          } else {
            cell.hoverGlow *= 0.9;
          }

          if (cell.opacity <= 0 && cell.trailOpacity <= 0 && cell.hoverGlow < 0.001) continue;

          // Draw cell
          const baseAlpha = cell.isDark ? 0 : 0.06;
          const cellAlpha = baseAlpha * cell.opacity;
          const trailAlpha = 0.15 * cell.trailOpacity;
          const hoverAlpha = 0.1 * cell.hoverGlow;
          const totalAlpha = Math.min(0.25, cellAlpha + trailAlpha + hoverAlpha);

          if (totalAlpha > 0.001) {
            ctx!.fillStyle = `rgba(184, 151, 31, ${totalAlpha})`;
            ctx!.fillRect(cell.x, cell.y, CELL, CELL);
          }
        }
      }

      // 2. Queen logic
      if (!s.queen.visible && now >= s.queen.waitUntil) {
        s.queen.visible = true;
        s.queen.waitUntil = now + PAUSE_BETWEEN;
      }

      if (s.queen.visible) {
        // If not moving and past wait time, pick next move
        if (!s.queen.moving && now >= s.queen.waitUntil) {
          pickNextMove();
        }

        // If moving, advance through queue
        if (s.queen.moving && s.moveQueue.length > 0) {
          const elapsed = now - s.moveStartTime;
          const totalDuration = s.totalMoveCells * MOVE_DURATION;
          const overallProgress = Math.min(1, elapsed / totalDuration);

          // figure out which segment we're in
          const segFloat = overallProgress * s.totalMoveCells;
          const segIndex = Math.min(Math.floor(segFloat), s.totalMoveCells - 1);
          const segProgress = segFloat - segIndex;

          // Determine prevRow/prevCol and target
          const prevCell = segIndex === 0
            ? { row: s.queen.prevRow, col: s.queen.prevCol }
            : s.moveQueue[segIndex - 1];
          const targetCell = s.moveQueue[segIndex];

          s.queen.progress = segProgress;

          // Add trail for cells we've passed
          for (let i = 0; i <= segIndex; i++) {
            const tc = s.moveQueue[i];
            const alreadyInTrail = s.trail.some(
              (t) => t.row === tc.row && t.col === tc.col && now - t.time < TRAIL_HOLD + TRAIL_FADE
            );
            if (!alreadyInTrail) {
              s.trail.push({ row: tc.row, col: tc.col, time: now });
              if (tc.row >= 0 && tc.row < s.rows && tc.col >= 0 && tc.col < s.cols) {
                s.cells[tc.row][tc.col].trailOpacity = 1;
                s.cells[tc.row][tc.col].trailFadeStart = now;
              }
              // Limit trail
              while (s.trail.length > MAX_TRAIL) {
                s.trail.shift();
              }
            }
          }

          // Draw queen interpolated
          const drawX = prevCell.col * CELL + (targetCell.col - prevCell.col) * CELL * easeInOut(segProgress) + CELL / 2;
          const drawY = prevCell.row * CELL + (targetCell.row - prevCell.row) * CELL * easeInOut(segProgress) + CELL / 2;

          ctx!.save();
          ctx!.font = `700 ${QUEEN_SIZE}px serif`;
          ctx!.fillStyle = GOLD;
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.fillText(QUEEN_CHAR, drawX, drawY);
          ctx!.restore();

          // Move complete
          if (overallProgress >= 1) {
            const last = s.moveQueue[s.moveQueue.length - 1];
            s.queen.row = last.row;
            s.queen.col = last.col;
            s.queen.prevRow = last.row;
            s.queen.prevCol = last.col;
            s.queen.moving = false;
            s.queen.progress = 1;
            s.moveQueue = [];
            s.queen.waitUntil = now + PAUSE_BETWEEN;
          }
        } else if (!s.queen.moving) {
          // Draw queen stationary
          const drawX = s.queen.col * CELL + CELL / 2;
          const drawY = s.queen.row * CELL + CELL / 2;
          ctx!.save();
          ctx!.font = `700 ${QUEEN_SIZE}px serif`;
          ctx!.fillStyle = GOLD;
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.fillText(QUEEN_CHAR, drawX, drawY);
          ctx!.restore();
        }
      }

      // Clean expired trail
      s.trail = s.trail.filter((t) => now - t.time < TRAIL_HOLD + TRAIL_FADE);

      animRef.current = requestAnimationFrame(draw);
    }

    function easeInOut(t: number): number {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ pointerEvents: "auto" }}
    />
  );
}
