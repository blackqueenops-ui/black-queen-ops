"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const NOTATIONS = ["e4·", "Qh5·", "d5·", "O-O·"];

// Direction: items 0,2 slide from left; items 1,3 slide from right
const SLIDE_DIR = [-40, 40, -40, 40];
// Delay: row 1 (items 0,1) = 0ms; row 2 (items 2,3) = 200ms
const ROW_DELAY = [0, 0, 200, 200];

export default function StrategicSection({
  tag,
  title,
  items,
}: {
  tag: string;
  title: string;
  items: { title: string; desc: string }[];
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
      threshold: 0.25,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = started || reduced;

  return (
    <div ref={sectionRef}>
      {/* Section heading */}
      <div className="text-center mb-14">
        <p
          className="text-gold text-sm font-medium tracking-widest uppercase mb-2"
          style={
            show
              ? {
                  opacity: 1,
                  letterSpacing: "4px",
                  transition: "opacity 600ms cubic-bezier(0.25,0.46,0.45,0.94), letter-spacing 600ms cubic-bezier(0.25,0.46,0.45,0.94)",
                }
              : {
                  opacity: 0,
                  letterSpacing: "8px",
                }
          }
        >
          {tag}
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold text-text-on-dark"
          style={
            show
              ? {
                  opacity: 1,
                  transform: "translateY(0)",
                  transition:
                    "opacity 500ms cubic-bezier(0.25,0.46,0.45,0.94) 200ms, transform 500ms cubic-bezier(0.25,0.46,0.45,0.94) 200ms",
                }
              : {
                  opacity: 0,
                  transform: "translateY(16px)",
                }
          }
        >
          {title}
        </h2>
      </div>

      {/* 2×2 grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {items.map((item, i) => {
          const itemDelay = ROW_DELAY[i];
          const dir = SLIDE_DIR[i];
          const notationDelay = itemDelay + 150;
          const lineDelay = itemDelay + 200;

          return (
            <div
              key={i}
              className="flex gap-4 strategic-item"
              style={
                show
                  ? {
                      opacity: 1,
                      transform: "translateX(0)",
                      transition: `opacity 500ms cubic-bezier(0.25,0.46,0.45,0.94) ${itemDelay}ms, transform 500ms cubic-bezier(0.25,0.46,0.45,0.94) ${itemDelay}ms`,
                    }
                  : {
                      opacity: 0,
                      transform: `translateX(${dir}px)`,
                    }
              }
            >
              <div>
                <h3 className="font-semibold mb-1 text-text-on-dark flex items-center strategic-title">
                  {/* Chess notation bullet */}
                  <span
                    className={`chess-notation ${show ? "chess-notation-visible" : ""}`}
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: "11px",
                      color: "#b8971f",
                      letterSpacing: "1px",
                      marginRight: "8px",
                      display: "inline-block",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      maxWidth: show ? "60px" : "0",
                      opacity: show ? 0.7 : 0,
                      transition: `max-width 300ms cubic-bezier(0.25,1,0.5,1) ${notationDelay}ms, opacity 300ms cubic-bezier(0.0,0.0,0.2,1) ${notationDelay}ms`,
                      verticalAlign: "middle",
                    }}
                  >
                    {NOTATIONS[i]}
                  </span>
                  {item.title}
                </h3>

                {/* Tactical line */}
                <div
                  className="tactical-line"
                  style={{
                    height: "1px",
                    background:
                      "linear-gradient(to right, rgba(184,151,31,0.4), transparent)",
                    width: show ? "60px" : "0",
                    marginBottom: "8px",
                    transition: `width 400ms cubic-bezier(0.16,1,0.3,1) ${lineDelay}ms`,
                  }}
                />

                <p className="text-sm text-text-muted-on-dark leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
