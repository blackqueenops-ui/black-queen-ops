"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

export default function ChessHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    // Will be initialized by onReady callback after scripts load
    return () => {
      initRef.current = false;
    };
  }, []);

  function tryInit() {
    if (
      initRef.current ||
      typeof window === "undefined" ||
      !(window as unknown as Record<string, unknown>).THREE ||
      !(window as unknown as Record<string, unknown>).ChessBackground3D
    )
      return;
    initRef.current = true;
    new (window as unknown as Record<string, new (id: string) => void>).ChessBackground3D("chess-hero-3d");
  }

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Load addons sequentially after Three.js
          const s1 = document.createElement("script");
          s1.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js";
          s1.onload = () => {
            const s2 = document.createElement("script");
            s2.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js";
            s2.onload = () => {
              const s3 = document.createElement("script");
              s3.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js";
              s3.onload = () => {
                // Load ShaderPass and CopyShader (needed by EffectComposer)
                const s4 = document.createElement("script");
                s4.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js";
                s4.onload = () => {
                  const s5 = document.createElement("script");
                  s5.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js";
                  s5.onload = () => {
                    const s6 = document.createElement("script");
                    s6.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js";
                    s6.onload = () => {
                      // Finally load our chess script
                      const cs = document.createElement("script");
                      cs.src = "/chess-3d.js";
                      cs.onload = () => tryInit();
                      document.body.appendChild(cs);
                    };
                    document.body.appendChild(s6);
                  };
                  document.body.appendChild(s5);
                };
                document.body.appendChild(s4);
              };
              document.body.appendChild(s3);
            };
            document.body.appendChild(s2);
          };
          document.body.appendChild(s1);
        }}
      />
      <div
        ref={containerRef}
        id="chess-hero-3d"
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ zIndex: 0 }}
      />
    </>
  );
}
