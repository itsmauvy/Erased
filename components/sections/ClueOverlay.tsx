"use client";

import { useEffect, useMemo } from "react";
import { useClueStore } from "@/hooks/useClueStore";
import { STAGE, type ClueData } from "@/lib/chapters";

/** id → {clue, accent} 룩업 (단서가 속한 층의 강조색을 함께) */
function buildIndex() {
  const map = new Map<string, { clue: ClueData; accent: string }>();
  for (const ch of STAGE.chapters) {
    for (const c of ch.clues) map.set(c.id, { clue: c, accent: ch.accent });
  }
  return map;
}

/**
 * 단서 내용을 보여주는 인-월드 오버레이.
 * kind별로 다른 종이/기기 질감으로 렌더 (전부 CSS, 이미지 0장).
 */
export default function ClueOverlay() {
  const openClue = useClueStore((s) => s.openClue);
  const close = useClueStore((s) => s.close);
  const index = useMemo(buildIndex, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  if (!openClue) return null;
  const entry = index.get(openClue);
  if (!entry) return null;
  const { clue, accent } = entry;
  const mono = clue.kind === "radio";

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center px-6"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="닫기"
        onClick={close}
        className="absolute inset-0"
        style={{ background: "rgba(3,4,6,0.78)", backdropFilter: "blur(3px)", cursor: "none" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={clue.title}
        className="evidence relative w-full max-w-lg"
      >
        <div className="ev-kicker">
          <span>EVIDENCE</span>
          <button type="button" onClick={close} className="ev-close" aria-label="닫기">
            닫기 ✕
          </button>
        </div>

        <h3 className="ev-title">{clue.title}</h3>
        {clue.meta && <div className="ev-meta">{clue.meta}</div>}

        {clue.image && (
          <div className="ev-photo">
            {/* 파일이 아직 없으면 조용히 숨긴다 */}
            <img
              src={clue.image}
              alt=""
              onError={(e) => {
                const p = e.currentTarget.closest(".ev-photo") as HTMLElement | null;
                if (p) p.style.display = "none";
              }}
            />
          </div>
        )}

        <div className={`ev-body ${mono ? "ev-mono" : ""}`}>
          {clue.body.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <div className="ev-foot">단서가 기록되었다.</div>
      </div>

      <style jsx>{`
        .evidence {
          border: 1px solid var(--line);
          background: linear-gradient(180deg, #111319 0%, #0a0b10 100%);
          box-shadow:
            0 40px 120px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(255, 255, 255, 0.02) inset;
          padding: 26px 28px 22px;
          animation: ev-in 0.5s var(--ease-slow) both;
        }
        .evidence::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--accent);
          box-shadow: 0 0 16px var(--accent);
        }
        .ev-kicker {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.64rem;
          letter-spacing: 0.34em;
          color: var(--accent);
          text-transform: uppercase;
        }
        .ev-close {
          letter-spacing: 0.1em;
          color: var(--ink-dim);
          cursor: none;
          transition: color 0.3s;
        }
        .ev-close:hover {
          color: var(--ink);
        }
        .ev-title {
          font-family: var(--font-myeongjo), serif;
          font-size: 1.5rem;
          margin: 14px 0 4px;
          color: var(--ink);
        }
        .ev-meta {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.7rem;
          color: var(--ink-faint);
          letter-spacing: 0.08em;
          margin-bottom: 16px;
        }
        .ev-photo {
          margin: 4px 0 18px;
          padding: 10px 10px 14px;
          background: #0e0f13;
          border: 1px solid var(--line);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.6);
          transform: rotate(-1.2deg);
        }
        .ev-photo img {
          display: block;
          width: 100%;
          height: auto;
          filter: brightness(0.92) contrast(1.05) saturate(0.9);
        }
        .ev-body {
          font-family: var(--font-myeongjo), serif;
          line-height: 1.85;
          color: var(--ink-dim);
          font-size: 1.02rem;
        }
        .ev-body p {
          margin: 0 0 10px;
        }
        .ev-mono p {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.82rem;
          letter-spacing: 0.02em;
          color: #8fb6b0;
        }
        .ev-foot {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid var(--line);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.62rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--ink-faint);
        }
        @keyframes ev-in {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
