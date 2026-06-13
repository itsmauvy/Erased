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
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
    <div className="scene-wrap-explore">
      <div className="bg" style={{ backgroundImage: `url('${BASE}/bg/scene-classroom.jpg')` }} />
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
        <div className="modal-overlay">
          <button className="modal-close" onClick={() => setStep("explore")}>✕ 닫기</button>
          <div className="modal-inner">
            <div className={`photo-card ${step === "photo-back" ? "flipped" : ""}`}>
              <div className="card-face card-front">
                <img src={`${BASE}/clues/detail-photo-front.jpg`} alt="단체사진 앞면" />
                <button className="flip-btn" onClick={() => setStep("photo-back")}>뒤집기 ↺</button>
              </div>
              <div className="card-face card-back">
                <img src={`${BASE}/clues/detail-photo-back.jpg`} alt="단체사진 뒷면" />
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
    </div>
  );
}
