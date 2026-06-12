"use client";

import { useEffect, useState } from "react";

/**
 * 등대 회전빛 — 화면을 주기적으로 쓸고 지나가는 광원.
 * 등대 정체성 + 시네마틱 무드의 중심 모티프 (플랜 §2-4).
 * useBeam=false (학교 전환) 시 렌더되지 않는다.
 */
export default function LighthouseBeam({ accent }: { accent: string }) {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      style={{ mixBlendMode: "screen" }}
    >
      <div
        className="beam-rotor"
        style={{
          position: "absolute",
          top: "-60vmax",
          left: "50%",
          width: "120vmax",
          height: "120vmax",
          marginLeft: "-60vmax",
          animation: reduce ? "none" : "beam-spin 14s linear infinite",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `conic-gradient(from 0deg at 50% 100%,
              transparent 0deg,
              ${hexA(accent, 0)} 4deg,
              ${hexA(accent, 0.10)} 9deg,
              ${hexA(accent, 0.02)} 16deg,
              transparent 22deg,
              transparent 360deg)`,
          }}
        />
      </div>
      <style jsx>{`
        @keyframes beam-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

/** hex(#rrggbb) → rgba(r,g,b,a) */
function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
