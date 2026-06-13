"use client";

import { useEffect, useRef, useState } from "react";
import PhoneMessage from "./PhoneMessage";
import ChoiceButton from "./ChoiceButton";
import { GameState, calcEnding, Scene } from "./GameState";

type Props = {
  state: GameState;
  onAdvance: (updates: Partial<GameState>, next: Scene) => void;
};

const CLUE_X = 62;
const CLUE_Y = 78;

export default function SceneRooftop({ state, onAdvance }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<"explore" | "phone-open" | "realization" | "final-choice">("explore");
  const [showHint, setShowHint] = useState(false);

  // 비/번개 캔버스
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    type Drop = { x: number; y: number; len: number; vy: number; a: number };
    const drops: Drop[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      len: 12 + Math.random() * 26, vy: 7 + Math.random() * 9,
      a: 0.05 + Math.random() * 0.14,
    }));
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    let flash = 0, raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);
      if (Math.random() < 0.003) flash = 0.5 + Math.random() * 0.4;
      if (flash > 0) { ctx.fillStyle = `rgba(150,170,200,${flash * 0.18})`; ctx.fillRect(0, 0, w, h); flash -= 0.04; }
      ctx.strokeStyle = "rgba(180,200,220,1)"; ctx.lineWidth = 1;
      for (const d of drops) {
        ctx.globalAlpha = d.a;
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 1.5, d.y + d.len); ctx.stroke();
        d.y += d.vy; d.x -= 1.2;
        if (d.y > h) { d.y = -d.len; d.x = Math.random() * w; }
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  // 손전등
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
        maskRef.current.style.background = `radial-gradient(circle 300px at ${pos.x}px ${pos.y}px,
          rgba(3,4,7,0) 0%, rgba(3,4,7,0) 22%, rgba(3,4,7,0.65) 55%, rgba(3,4,7,0.94) 100%)`;
      if (glowRef.current)
        glowRef.current.style.background = `radial-gradient(circle 220px at ${pos.x}px ${pos.y}px,
          rgba(200,212,220,0.08) 0%, rgba(200,212,220,0.02) 45%, transparent 72%)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  const handleFinalChoice = (c: "A" | "B") => {
    setStep("final-choice");
    const merged: GameState = { ...state, finalChoice: c === "A" ? "truth" : "silence" };
    const ending = calcEnding(merged);
    setTimeout(() => onAdvance({ finalChoice: c === "A" ? "truth" : "silence" }, ending), 800);
  };

  return (
    <div className="scene-wrap">
      <div className="bg" />
      <canvas ref={canvasRef} aria-hidden className="rain-canvas" />
      <div ref={maskRef} aria-hidden className="mask-layer" />
      <div ref={glowRef} aria-hidden className="glow-layer" />

      {step === "explore" && (
        <>
          <div className="objective">마지막 단서를 확인하세요.</div>
          <button
            className="hint-btn"
            onClick={() => { setShowHint(true); setTimeout(() => setShowHint(false), 3000); }}
          >HINT</button>
          <button
            className={`hotspot ${showHint ? "hint-active" : ""}`}
            style={{ left: `${CLUE_X}%`, top: `${CLUE_Y}%` }}
            onClick={() => setStep("phone-open")}
            aria-label="바닥의 휴대폰"
          />
        </>
      )}

      {/* 휴대폰 잠금화면 모달 (코드로 구현) */}
      {step === "phone-open" && (
        <div className="modal-overlay" style={{ cursor: "auto" }}>
          <button className="modal-close" onClick={() => setStep("explore")}>✕ 닫기</button>
          <div className="phone-mockup">
            <div className="phone-status">03:41 AM</div>
            <div className="phone-name">김민서</div>
            <div className="phone-divider" />
            <div className="phone-row">
              <span className="phone-label">마지막 통화</span>
              <span className="phone-value">3일 전 11:58 PM</span>
            </div>
            <div className="phone-offline">⚠ 현재 꺼진 상태</div>
          </div>
          <button className="close-btn" onClick={() => setStep("realization")}>확인</button>
        </div>
      )}

      {/* 깨달음 + 최종 선택 */}
      {(step === "realization" || step === "final-choice") && (
        <div className="bottom-panel">
          <p className="realization-text">
            민서의 휴대폰은 3일 전부터 꺼져 있었다.<br />
            그럼 지금까지 문자를 보낸 사람은 누구지?
          </p>
          <PhoneMessage sender="민서" text={"고마워.\n\n이제 선택해."} delay={1000} />
          {step === "realization" && (
            <div style={{ marginTop: 16 }}>
              <ChoiceButton label="A.  진실을 공개한다" onClick={() => handleFinalChoice("A")} />
              <ChoiceButton label="B.  모든 걸 묻어둔다" onClick={() => handleFinalChoice("B")} />
            </div>
          )}
          {step === "final-choice" && (
            <p className="fading-text">선택하는 중...</p>
          )}
        </div>
      )}

      <style jsx>{`
        .scene-wrap { position: fixed; inset: 0; overflow: hidden; animation: fadeIn 0.6s ease both; cursor: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .bg { position: absolute; inset: 0; background: url('/bg/scene-rooftop.jpg') center/cover no-repeat; }
        .rain-canvas { position: fixed; inset: 0; z-index: 5; pointer-events: none; }
        .mask-layer { pointer-events: none; position: fixed; inset: 0; z-index: 10; background: rgba(3,4,7,0.94); }
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
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;
          animation: fadeIn 0.3s ease both; cursor: auto;
        }
        .modal-close {
          position: absolute; top: 24px; right: 28px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem; letter-spacing: 0.15em; color: var(--ink-faint);
          background: transparent; border: 1px solid rgba(232,230,223,0.15);
          padding: 8px 16px; cursor: pointer;
          transition: color 0.3s, border-color 0.3s;
        }
        .modal-close:hover { color: var(--ink); border-color: var(--accent); }
        .phone-mockup {
          width: min(300px, 85vw); background: #0d0f16;
          border: 1px solid rgba(232,230,223,0.1); border-radius: 20px;
          padding: 32px 28px; text-align: center;
        }
        .phone-status {
          font-family: var(--font-geist-mono), monospace; font-size: 2.2rem;
          color: var(--ink); margin-bottom: 6px; letter-spacing: 0.05em;
        }
        .phone-name { font-size: 0.9rem; color: var(--ink-dim); margin-bottom: 20px; }
        .phone-divider { height: 1px; background: rgba(232,230,223,0.08); margin-bottom: 16px; }
        .phone-row {
          display: flex; justify-content: space-between; margin-bottom: 10px;
        }
        .phone-label {
          font-family: var(--font-geist-mono), monospace; font-size: 0.68rem;
          color: var(--ink-faint); letter-spacing: 0.08em;
        }
        .phone-value {
          font-family: var(--font-geist-mono), monospace; font-size: 0.68rem;
          color: var(--ink-dim);
        }
        .phone-offline {
          font-family: var(--font-geist-mono), monospace; font-size: 0.62rem;
          color: rgba(200,90,90,0.7); margin-top: 14px; letter-spacing: 0.1em;
        }
        .close-btn {
          font-family: var(--font-geist-mono), monospace; font-size: 0.72rem;
          letter-spacing: 0.2em; color: var(--ink-faint); background: transparent;
          border: 1px solid rgba(232,230,223,0.18); padding: 10px 28px; cursor: pointer;
          transition: color 0.3s, border-color 0.3s;
        }
        .close-btn:hover { color: var(--ink); border-color: var(--accent); }
        .bottom-panel {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 20;
          background: linear-gradient(to top, rgba(3,4,7,0.98) 70%, transparent);
          padding: 56px 28px 40px; max-width: 480px; margin: 0 auto;
        }
        .realization-text {
          font-family: var(--font-myeongjo), serif; font-size: 0.92rem;
          color: var(--ink-dim); line-height: 1.8; margin-bottom: 24px;
          animation: fadeUp 0.5s ease both;
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        .fading-text {
          font-family: var(--font-geist-mono), monospace; font-size: 0.72rem;
          letter-spacing: 0.2em; color: var(--ink-faint); text-align: center; margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
