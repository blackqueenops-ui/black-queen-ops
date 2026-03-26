"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

function RippleCanvas({ started }: { started: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setHidden(true);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const maxRadius = 600;
    const ringDuration = 1200;
    const ringDelay = 300;
    const ringCount = 3;
    const totalDuration = ringDuration + ringDelay * (ringCount - 1);
    const start = performance.now();

    let raf: number;
    function draw(now: number) {
      const elapsed = now - start;
      ctx!.clearRect(0, 0, rect.width, rect.height);

      for (let r = 0; r < ringCount; r++) {
        const ringElapsed = elapsed - r * ringDelay;
        if (ringElapsed < 0) continue;
        const t = Math.min(ringElapsed / ringDuration, 1);
        const radius = t * maxRadius;
        const opacity = 0.8 * (1 - t);

        ctx!.beginPath();
        ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(184, 151, 31, ${opacity * 0.08})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }

      if (elapsed < totalDuration) {
        raf = requestAnimationFrame(draw);
      } else {
        setHidden(true);
      }
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [started]);

  if (hidden) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export default function CTASection({
  title,
  desc,
  buttonText,
}: {
  title: string;
  desc: string;
  buttonText: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
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
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  // Add chevron to button via DOM
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn || btn.querySelector(".btn-chevron")) return;

    btn.style.position = "relative";
    btn.style.overflow = "hidden";

    const chevron = document.createElement("span");
    chevron.className = "btn-chevron";
    chevron.textContent = "\u276F\u276F";
    btn.appendChild(chevron);
  }, []);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = started || reduced;
  const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  const bounceEase = "cubic-bezier(0.34, 1.56, 0.64, 1)";

  return (
    <div ref={sectionRef} className="max-w-6xl mx-auto px-6 text-center relative">
      <RippleCanvas started={started} />

      <h2
        className="text-3xl md:text-4xl font-bold mb-4 text-heading relative z-10"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(20px)",
          transition: `opacity 600ms ${ease} 200ms, transform 600ms ${ease} 200ms`,
        }}
      >
        {title}
      </h2>

      <p
        className="text-muted mb-8 max-w-lg mx-auto relative z-10"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(20px)",
          transition: `opacity 600ms ${ease} 400ms, transform 600ms ${ease} 400ms`,
        }}
      >
        {desc}
      </p>

      <Link
        ref={btnRef}
        href="/contact"
        className="cta-btn inline-block bg-gold text-heading px-8 py-3 rounded font-medium relative z-10"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "scale(1)" : "scale(0.92)",
          transition: `opacity 500ms ${bounceEase} 600ms, transform 500ms ${bounceEase} 600ms, filter 200ms ${ease}`,
        }}
      >
        <span className="cta-btn-text inline-block transition-transform duration-200">
          {buttonText}
        </span>
      </Link>
    </div>
  );
}
