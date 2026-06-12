"use client";

import { useEffect, useRef, useState } from "react";
import { useClueStore } from "@/hooks/useClueStore";
import { STAGE } from "@/lib/chapters";
import { useAudio } from "./AudioManager";

/**
 * 최소 게임 UI: 단서 카운터 + 상승 진행 게이지 + 음소거 토글.
 * 정보 전달이 아니라 "능동감"을 위한 장치 (플랜 §2-2).
 */
export default function HUD({ total }: { total: number }) {
  const found = useClueStore((s) => s.found.size);
  const muted = useAudio((s) => s.muted);
  const started = useAudio((s) => s.started);
  const toggleMute = useAudio((s) => s.toggleMute);

  const [progress, setProgress] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[65] select-none">
      {/* 좌상단: 타이틀 마크 */}
      <div className="absolute left-6 top-6 font-mono text-[0.62rem] tracking-[0.3em] text-[var(--ink-dim)]">
        {STAGE.siteTitle}
      </div>

      {/* 우상단: 단서 카운터 + 음소거 */}
      <div className="absolute right-6 top-6 flex items-center gap-5">
        <div className="font-mono text-[0.62rem] tracking-[0.28em] text-[var(--ink-dim)]">
          단서{" "}
          <span style={{ color: "var(--accent)" }}>
            {String(found).padStart(2, "0")}
          </span>
          <span className="text-[var(--ink-faint)]"> / {String(total).padStart(2, "0")}</span>
        </div>
        <button
          type="button"
          onClick={toggleMute}
          className="pointer-events-auto font-mono text-[0.62rem] tracking-[0.2em] text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)]"
          style={{ cursor: "none" }}
          aria-label={muted ? "소리 켜기" : "음소거"}
        >
          {muted || !started ? "♪ OFF" : "♪ ON"}
        </button>
      </div>

      {/* 우측: 상승 게이지 */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 md:block">
        <div className="relative h-44 w-px bg-[var(--line)]">
          <div
            className="absolute left-0 top-0 w-px"
            style={{
              height: `${progress * 100}%`,
              background: "var(--accent)",
              boxShadow: "0 0 8px var(--accent)",
            }}
          />
          <div
            className="absolute -left-[3px] h-[7px] w-[7px] rounded-full"
            style={{
              top: `calc(${progress * 100}% - 3px)`,
              background: "var(--accent)",
              boxShadow: "0 0 10px var(--accent)",
            }}
          />
        </div>
        <div className="mt-2 -rotate-0 font-mono text-[0.5rem] tracking-[0.2em] text-[var(--ink-faint)]">
          ASCENT
        </div>
      </div>
    </div>
  );
}
