"use client";

import { useEffect, useRef } from "react";

/**
 * 손전등 커서. 화면을 어둠으로 덮고, 커서 주변만 환하게 "드러낸다".
 * 어두운 학교를 손전등 하나로 탐험하는 핵심 장치.
 *  - maskRef : 빼기(어둡게) 레이어 — 커서 주변에 투명한 빛 웅덩이
 *  - glowRef : 더하기(밝게) 레이어 — 빛이 벽에 닿은 듯한 은은한 광
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      const { x, y } = pos;

      // 전역 마우스 위치(-1~1)를 CSS 변수로 → 배경 패럴럭스가 사용
      const nx = (pos.x / window.innerWidth - 0.5) * 2;
      const ny = (pos.y / window.innerHeight - 0.5) * 2;
      const root = document.documentElement.style;
      root.setProperty("--mx", nx.toFixed(3));
      root.setProperty("--my", ny.toFixed(3));

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.x}px, ${target.y}px)`;
      }
      if (maskRef.current) {
        // 빛 웅덩이: 중심 투명 → 바깥으로 갈수록 짙은 어둠
        maskRef.current.style.background = `radial-gradient(circle 340px at ${x}px ${y}px,
          rgba(3,4,7,0) 0%,
          rgba(3,4,7,0) 26%,
          rgba(3,4,7,0.55) 60%,
          rgba(3,4,7,0.86) 100%)`;
      }
      if (glowRef.current) {
        // 손전등 빔이 닿은 듯한 더하기 광
        glowRef.current.style.background = `radial-gradient(circle 260px at ${x}px ${y}px,
          rgba(200,212,220,0.12) 0%,
          rgba(200,212,220,0.04) 45%,
          rgba(0,0,0,0) 72%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* 어둠 마스크 — 커서 주변만 드러난다 */}
      <div
        ref={maskRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 hidden md:block"
      />
      {/* 빛 웅덩이(더하기) */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[51] hidden md:block"
        style={{ mixBlendMode: "screen" }}
      />
      {/* 커서 점 */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden md:block"
        style={{ marginLeft: -3, marginTop: -3 }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 14px 3px var(--accent)",
          }}
        />
      </div>
    </>
  );
}
