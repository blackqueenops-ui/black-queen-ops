"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Types ─── */
interface CounterConfig {
  target: number;
  suffix: string;
  duration: number;
}

interface TextRevealConfig {
  text: string;
  stagger: number;
}

type StatConfig =
  | { type: "counter"; config: CounterConfig }
  | { type: "text"; config: TextRevealConfig };

const STAT_CONFIGS: StatConfig[] = [
  { type: "counter", config: { target: 50, suffix: "+", duration: 2000 } },
  { type: "text", config: { text: "EU & UK", stagger: 80 } },
  { type: "counter", config: { target: 24, suffix: "h", duration: 2000 } },
  { type: "counter", config: { target: 95, suffix: "%+", duration: 2000 } },
];

/* ─── easeOutQuart ─── */
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/* ─── Numeric counter hook ─── */
function useCounter(target: number, duration: number, started: boolean) {
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setValue(target);
      setDone(true);
      return;
    }

    let raf: number;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const progress = easeOutQuart(t);
      setValue(Math.round(progress * target));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return { value, done };
}

/* ─── Counter cell ─── */
function CounterCell({
  config,
  label,
  started,
}: {
  config: CounterConfig;
  label: string;
  started: boolean;
}) {
  const { value, done } = useCounter(config.target, config.duration, started);

  return (
    <div className="text-center stat-cell">
      <div
        className={`text-2xl md:text-3xl font-bold text-gold stat-value ${
          done ? "stat-bounce" : ""
        }`}
      >
        {started ? value : 0}
        {done && <span>{config.suffix}</span>}
      </div>
      <div
        className={`text-sm text-muted mt-1 stat-label transition-all duration-400 ${
          started ? "stat-label-in" : "opacity-0 translate-y-1"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

/* ─── Text reveal cell (EU & UK) ─── */
function TextRevealCell({
  config,
  label,
  started,
}: {
  config: TextRevealConfig;
  label: string;
  started: boolean;
}) {
  const chars = config.text.split("");

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="text-center stat-cell">
      <div className="text-2xl md:text-3xl font-bold text-gold stat-value flex justify-center">
        {chars.map((ch, i) => (
          <span
            key={i}
            className="inline-block transition-all"
            style={
              started
                ? {
                    opacity: 1,
                    transform: "translateY(0)",
                    transitionDuration: "300ms",
                    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transitionDelay: prefersReduced
                      ? "0ms"
                      : `${i * config.stagger}ms`,
                  }
                : {
                    opacity: 0,
                    transform: "translateY(-4px)",
                  }
            }
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>
      <div
        className={`text-sm text-muted mt-1 stat-label transition-all duration-400 ${
          started ? "stat-label-in" : "opacity-0 translate-y-1"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function StatsCounter({
  labels,
}: {
  labels: string[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    },
    []
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.3,
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <div
      ref={sectionRef}
      className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8"
    >
      {STAT_CONFIGS.map((stat, i) =>
        stat.type === "counter" ? (
          <CounterCell
            key={i}
            config={stat.config}
            label={labels[i]}
            started={started}
          />
        ) : (
          <TextRevealCell
            key={i}
            config={stat.config}
            label={labels[i]}
            started={started}
          />
        )
      )}
    </div>
  );
}
