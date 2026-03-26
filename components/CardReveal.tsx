"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Single card ─── */
function RevealCard({
  children,
  delay,
  started,
}: {
  children: React.ReactNode;
  delay: number;
  started: boolean;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [lidsGone, setLidsGone] = useState(false);

  useEffect(() => {
    if (!started) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setRevealed(true);
      setContentVisible(true);
      setLidsGone(true);
      return;
    }

    // Add lids to the inner wrapper via DOM
    const inner = innerRef.current;
    if (!inner) return;

    // Only add lids once
    if (!inner.querySelector(".card-lid")) {
      const lidTop = document.createElement("div");
      lidTop.className = "card-lid card-lid-top";
      const lidBottom = document.createElement("div");
      lidBottom.className = "card-lid card-lid-bottom";
      inner.appendChild(lidTop);
      inner.appendChild(lidBottom);
    }

    // Staggered reveal
    const t1 = setTimeout(() => {
      setRevealed(true);
      inner.classList.add("card-revealed");
    }, delay);
    const t2 = setTimeout(() => setContentVisible(true), delay + 400);
    const t3 = setTimeout(() => {
      // Remove lids from DOM after animation
      inner.querySelectorAll(".card-lid").forEach((lid) => lid.remove());
      setLidsGone(true);
    }, delay + 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [started, delay]);

  return (
    <div
      className="card-reveal-wrap bg-surface-dark-alt border border-border-dark rounded-lg group"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 300ms var(--ease-smooth), transform 300ms var(--ease-smooth)",
      }}
    >
      {/* Inner wrapper — clips the lids */}
      <div
        ref={innerRef}
        className="relative overflow-hidden rounded-lg p-6"
        style={{ perspective: "800px" }}
      >
        {/* Gold seam line at lid junction */}
        {!lidsGone && (
          <div
            className="absolute left-0 right-0 z-20 pointer-events-none"
            style={{
              top: "50%",
              height: "1px",
              background: "#b8971f",
              opacity: revealed ? 1 : 0,
              transition: "opacity 300ms cubic-bezier(0.25,0.46,0.45,0.94) 100ms",
            }}
          />
        )}

        {/* Content */}
        <div
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 250ms cubic-bezier(0.0,0.0,0.2,1), transform 250ms cubic-bezier(0.0,0.0,0.2,1)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Container with IntersectionObserver ─── */
export default function CardReveal({
  children,
}: {
  children: React.ReactNode[];
}) {
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

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.2,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <div ref={sectionRef} className="grid md:grid-cols-3 gap-6">
      {children.map((child, i) => (
        <RevealCard key={i} delay={i * 150} started={started}>
          {child}
        </RevealCard>
      ))}
    </div>
  );
}
