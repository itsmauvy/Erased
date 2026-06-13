"use client";

import { useEffect, useRef, useState } from "react";
import ChoiceButton from "./ChoiceButton";
import PhoneMessage from "./PhoneMessage";
import { GameState } from "./GameState";

type Props = {
  onAdvance: (updates: Partial<GameState>, next: "broadcast") => void;
};

const CLUE_X = 65;
const CLUE_Y = 75;

export default function SceneClassroom({ onAdvance }: Props) {
  const maskRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<"explore" | "photo-front" | "photo-back" | "chosen" | "done">("explore");
  const [choice, setChoice] = useState<"A" | "B" | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    const onMove = (e: PointerEvent) => { target.x = e.clientX; target.y = e.clientY; };
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.15;
      pos.y += (target.y - pos.y) * 0.15;
      if (maskRef.current)
        maskRef.current.style.background = `radial-gradient(circle 280px at ${pos.x}px ${pos.y}px,
          rgba(3,4,7,0) 0%, rgba(3,4,7,0) 20%, rgba(3,4,7,0.7) 55%, rgba(3,4,7,0.96) 100%)`;
      if (glowRef.current)
        glowRef.current.style.background = `radial-gradient(circle 200px at ${pos.x}px ${pos.y}px,
          rgba(220,225,215,0.09) 0%, rgba(220,225,215,0.03) 45%, transparent 72%)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  const handleChoice = (c: "A" | "B") => { setChoice(c); setStep("chosen"); };

  const handleAdvance = () => {
    const updates: Partial<GameState> = { foundPhoto: true };
    if (choice === "A") { updates.truthScore = 1; updates.trustMinseo = -1; }
    else { updates.trustMinseo = 1; }
    setStep("done");
    setTimeout(() => onAdvance(updates, "broadcast"), 200);
  };

  const isModalOpen = step === "photo-front" || step === "photo-back";

  return (
    <div className="scene-wrap">
      <div className="bg" />
      <div ref={maskRef} aria-hidden className="mask-layer" />
      <div ref={glowRef} aria-hidden className="glow-layer" />

      {step === "explore" && (
        <div className="objective">교실 안에서 민서의 흔적을 찾으세요.</div>
      )}
      {step === "explore" && (
        <button className="hint-btn"
          onClick={() => { setShowHint(true); setTimeout(() => setShowHint(false), 3000); }}>
          HINT
        </button>
      )}
      {step === "explore" && (
        <button
          className={`hotspot ${showHint ? "hint-active" : ""}`}
          style={{ left: `${CLUE_X}%`, top: `${CLUE_Y}%` }}
          onClick={() => setStep("photo-front")}
          aria-label="찢어진 사진"
        />
      )}

      {isModalOpen && (
        <div className="modal-overlay" style={{ cursor: "auto" }}>
          <button className="modal-close" onClick={() => setStep("explore")}>✕ 닫기</button>
          <div className="modal-inner">
            <div className={`photo-card ${step === "photo-back" ? "flipped" : ""}`}>
              <div className="card-face card-front">
                <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/clues/detail-photo-front.jpg`} alt="단체사진 앞면" />
                <button className="flip-btn" onClick={() => setStep("photo-back")}>뒤집기 ↺</button>
              </div>
              <div className="card-face card-back">
                <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/clues/detail-photo-back.jpg`} alt="단체사진 뒷면" />
                <button className="flip-btn" onClick={() => setStep("photo-front")}>앞면 보기 ↺</button>
              </div>
            </div>
            <p className="clue-label">단서 획득: 찢어진 사진</p>
          </div>
          <div className="modal-choices">
            <ChoiceButton label="A.  왜 얼굴이 지워져 있어?" onClick={() => handleChoice("A")} />
            <ChoiceButton label="B.  이 사진 누가 찍었어?" onClick={() => handleChoice("B")} />
          </div>
        </div>
      )}

      {(step === "chosen" || step === "done") && choice && (
        <div className="chat-panel">
          <PhoneMessage sender="민서" text="사진 찾았네." delay={0} />
          <PhoneMessage sender="나" text={choice === "A" ? "왜 얼굴이 지워져 있어?" : "이 사진 누가 찍었어?"} align="right" delay={400} />
          <PhoneMessage sender="민서" text={choice === "A" ? "네가 제일 먼저 지웠잖아." : "방송실에 가면 들을 수 있어."} delay={1200} />
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button className="move-btn" onClick={handleAdvance}>방송실로 이동</button>
          </div>
        </div>
      )}

      <style>{`
        .scene-wrap { position: fixed; inset: 0; overflow: hidden; animation: fadeIn 0.6s ease both; cursor: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .bg { position: absolute; inset: 0; background: url('${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/bg/scene-classroom.jpg') center/cover no-repeat; }
        .mask-layer { pointer-events: none; position: fixed; inset: 0; z-index: 10; background: rgba(3,4,7,0.96); }
        .glow-layer { pointer-events: none; position: fixed; inset: 0; z-index: 11; mix-blend-mode: screen; }
        .objective {
          position: absolute; top: 28px; left: 50%; transform: translateX(-50%);
          font-family: var(--font-geist-mono), monospace; font-size: 0.68rem;
          letter-spacing: 0.22em; color: var(--ink-faint); z-index: 20; white-space: nowrap;
          background: rgba(3,4,7,0.6); padding: 6px 16px;
        }
        .hint-btn {
          position: absolute; bottom: 32px; right: 32px; z-index: 20;
          font-family: var(--font-geist-mono), monospace; font-size: 0.65rem; letter-spacing: 0.25em;
          color: var(--ink-faint); background: rgba(3,4,7,0.7);
          border: 1px solid rgba(232,230,223,0.15); padding: 8px 18px; cursor: pointer;
          transition: color 0.3s, border-color 0.3s;
        }
        .hint-btn:hover { color: var(--ink); border-color: var(--accent); }
        .hotspot {
          position: absolute; width: 120px; height: 120px; border-radius: 50%;
          transform: translate(-50%, -50%); cursor: pointer; z-index: 40;
          background: transparent; border: none; pointer-events: auto;
        }
        .hotspot.hint-active { animation: hintPulse 0.6s ease-in-out infinite alternate; }
        @keyframes hintPulse {
          from { box-shadow: 0 0 0 4px rgba(205,178,122,0.5), 0 0 20px 8px rgba(205,178,122,0.2); }
          to   { box-shadow: 0 0 0 8px rgba(205,178,122,0.8), 0 0 40px 15px rgba(205,178,122,0.4); }
        }
        .modal-overlay {
          position: fixed; inset: 0; z-index: 50; background: rgba(3,4,7,0.88);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 24px; animation: fadeIn 0.3s ease both;
        }
        .modal-close {
          position: absolute; top: 24px; right: 28px;
          font-family: var(--font-geist-mono), monospace; font-size: 0.72rem; letter-spacing: 0.15em;
          color: var(--ink-faint); background: transparent;
          border: 1px solid rgba(232,230,223,0.15); padding: 8px 16px; cursor: pointer;
          transition: color 0.3s, border-color 0.3s;
        }
        .modal-close:hover { color: var(--ink); border-color: var(--accent); }
        .modal-inner { display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .photo-card {
          width: min(400px, 85vw); aspect-ratio: 1; position: relative;
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .photo-card.flipped { transform: rotateY(180deg); }
        .card-face {
          position: absolute; inset: 0; backface-visibility: hidden;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .card-face img { width: 100%; height: calc(100% - 48px); object-fit: cover; border: 1px solid rgba(232,230,223,0.1); }
        .card-back { transform: rotateY(180deg); }
        .flip-btn {
          font-family: var(--font-geist-mono), monospace; font-size: 0.68rem; letter-spacing: 0.18em;
          color: var(--ink-faint); background: transparent; border: 1px solid rgba(232,230,223,0.15);
          padding: 7px 18px; cursor: pointer; transition: color 0.3s, border-color 0.3s;
        }
        .flip-btn:hover { color: var(--ink); border-color: var(--accent); }
        .clue-label {
          font-family: var(--font-geist-mono), monospace; font-size: 0.65rem;
          letter-spacing: 0.2em; color: var(--accent); margin: 0;
        }
        .modal-choices { display: flex; flex-direction: column; gap: 8px; width: min(360px, 90vw); }
        .chat-panel {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 30;
          background: linear-gradient(to top, rgba(3,4,7,0.97) 70%, transparent);
          padding: 48px 24px 36px; max-width: 480px; margin: 0 auto;
        }
        .move-btn {
          font-family: var(--font-geist-mono), monospace; font-size: 0.78rem; letter-spacing: 0.18em;
          color: var(--ink-dim); background: transparent; border: 1px solid rgba(232,230,223,0.25);
          padding: 12px 28px; cursor: pointer; transition: color 0.3s, border-color 0.3s;
        }
        .move-btn:hover { color: var(--ink); border-color: var(--accent); }
      `}</style>
    </div>
  );
}
