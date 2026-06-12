"use client";

import { useEffect, useRef } from "react";

/**
 * 화면 전체 반응 레이어. window 이벤트로 트리거된다:
 *  - 'fx-flash' : 짧은 빛/어둠 펄스 (단서 발견)
 *  - 'fx-pulse' : 강한 적색 펄스 (사건 트리거)
 */
export default function ScreenFX() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const flash = () => {
      el.style.animation = "none";
      // reflow
      void el.offsetWidth;
      el.style.animation = "fx-flash 0.5s ease-out";
    };
    const pulse = () => {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "fx-pulse 1.2s ease-out";
    };
    window.addEventListener("fx-flash", flash);
    window.addEventListener("fx-pulse", pulse);
    return () => {
      window.removeEventListener("fx-flash", flash);
      window.removeEventListener("fx-pulse", pulse);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[68]"
      style={{ opacity: 0 }}
    >
      <style jsx>{`
        @keyframes fx-flash {
          0% {
            opacity: 0;
            box-shadow: inset 0 0 0 rgba(255, 255, 255, 0);
          }
          15% {
            opacity: 1;
            box-shadow: inset 0 0 220px rgba(180, 200, 210, 0.18);
          }
          100% {
            opacity: 0;
            box-shadow: inset 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        @keyframes fx-pulse {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
            box-shadow: inset 0 0 260px rgba(214, 91, 91, 0.4);
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
