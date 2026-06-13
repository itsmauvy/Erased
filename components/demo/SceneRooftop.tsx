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
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function SceneRooftop({ state, onAdvance }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<"explore" | "phone-open" | "realization" | "final-choice">("explore");
  const [showHint, setShowHint] = useState(false);

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
    <div className="scene-wrap-explore">
      <div className="bg" style={{ backgroundImage: `url('${BASE}/bg/scene-rooftop.jpg')` }} />
      <canvas ref={canvasRef} aria-hidden className="rain-canvas" />
      <div ref={maskRef} aria-hidden className="mask-layer" />
      <div ref={glowRef} aria-hidden className="glow-layer" />

      {step === "explore" && (
        <>
          <div className="objective">마지막 단서를 확인하세요.</div>
          <button className="hint-btn"
            onClick={() => { setShowHint(true); setTimeout(() => setShowHint(false), 3000); }}>
            HINT
          </button>
          <button
            className={`hotspot ${showHint ? "hint-active" : ""}`}
            style={{ left: `${CLUE_X}%`, top: `${CLUE_Y}%` }}
            onClick={() => setStep("phone-open")}
            aria-label="민서의 휴대폰"
          />
        </>
      )}

      {step === "phone-open" && (
        <div className="modal-overlay">
          <button className="modal-close" onClick={() => setStep("explore")}>✕ 닫기</button>
          <div className="phone-mockup">
            <div className="phone-status">03:41 AM</div>
            <div className="phone-name">김민서</div>
            <div className="phone-divider" />
            <div className="phone-row">
              <span className="phone-label">마지막 통화</span>
              <span className="phone-value">3일 전  11:58 PM</span>
            </div>
            <div className="phone-offline">— 현재 오프라인 상태</div>
          </div>
          <button className="close-btn" onClick={() => setStep("realization")}>확인</button>
        </div>
      )}

      {(step === "realization" || step === "final-choice") && (
        <div className="bottom-panel">
          <p className="realization-text">
            민서의 전화기가 여기 있었다. 3일째 꺼져 있다.<br />
            그날 밤까지 마지막으로 통화한 사람을 알고 있다.
          </p>
          <PhoneMessage sender="민서" text={"결정해.\n\n지금 선택해."} delay={1000} />
          {step === "realization" && (
            <div style={{ marginTop: 16 }}>
              <ChoiceButton label="A.  진실을 드러낸다" onClick={() => handleFinalChoice("A")} />
              <ChoiceButton label="B.  모든 걸 묻어버린다" onClick={() => handleFinalChoice("B")} />
            </div>
          )}
          {step === "final-choice" && (
            <p className="fading-text">선택되는 중...</p>
          )}
        </div>
      )}
    </div>
  );
}
