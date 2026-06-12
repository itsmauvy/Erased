"use client";

import { useClueStore } from "@/hooks/useClueStore";
import { useMessages } from "@/hooks/useMessages";
import { playFx } from "@/lib/soundfx";
import type { ClueData } from "@/lib/chapters";

const ICON: Record<ClueData["kind"], string> = {
  logbook: "❖",
  radio: "◎",
  calendar: "▦",
  photo: "▣",
  note: "✎",
};

/**
 * 단서 핫스팟. hover → glow, click → 인-월드 오버레이.
 * 발견 시 store에 기록되어 진행 카운터가 올라간다.
 */
export default function Clue({ clue }: { clue: ClueData }) {
  const found = useClueStore((s) => s.found.has(clue.id));
  const discover = useClueStore((s) => s.discover);
  const pushMsg = useMessages((s) => s.push);

  const handleClick = () => {
    const isNew = !found;
    discover(clue.id);
    if (isNew) {
      playFx("reveal");
      window.dispatchEvent(new Event("fx-flash"));
      if (clue.whisper) {
        window.setTimeout(() => {
          playFx("message");
          pushMsg("알 수 없음", clue.whisper!);
        }, 900);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={clue.label}
      className="clue group absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${clue.x}%`, top: `${clue.y}%` }}
      data-found={found}
    >
      <span className="clue-ring" aria-hidden />
      <span className="clue-core" aria-hidden>
        {found ? ICON[clue.kind] : ""}
      </span>
      <span className="clue-label">{clue.label}</span>

      <style jsx>{`
        .clue {
          z-index: 20;
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          cursor: none;
        }
        .clue-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid var(--accent);
          opacity: 0.7;
          animation: clue-pulse 2.6s ease-out infinite;
        }
        .clue[data-found="true"] .clue-ring {
          animation: none;
          opacity: 0.28;
        }
        .clue-core {
          position: relative;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 14px 3px var(--accent);
          display: grid;
          place-items: center;
          font-size: 11px;
          color: #06070a;
          transition: transform 0.4s var(--ease-slow);
        }
        .clue[data-found="true"] .clue-core {
          width: 26px;
          height: 26px;
          box-shadow: 0 0 10px 1px var(--accent);
        }
        .clue:hover .clue-core {
          transform: scale(1.25);
        }
        .clue-label {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          white-space: nowrap;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.66rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink);
          background: rgba(6, 7, 10, 0.7);
          padding: 4px 10px;
          border: 1px solid var(--line);
          opacity: 0;
          pointer-events: none;
          transition: all 0.35s var(--ease-slow);
        }
        .clue:hover .clue-label {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        @keyframes clue-pulse {
          0% {
            transform: scale(0.7);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}
