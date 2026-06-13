"use client";

import { useState, useRef, useEffect } from "react";
import ChoiceButton from "./ChoiceButton";
import PhoneMessage from "./PhoneMessage";
import { GameState } from "./GameState";

type Props = {
  onAdvance: (updates: Partial<GameState>, next: "rooftop") => void;
};

const SCRIPT = [
  { t: 0,    speaker: "남자 음성", text: "그 이름 다시 말하지 마." },
  { t: 3000, speaker: "남자 음성", text: "다 끝난 일이야." },
  { t: 6500, speaker: "민서",     text: "끝난 게 아니잖아요." },
  { t: 9500, speaker: "민서",     text: "그날 옥상에 있던 사람들, 전부 알고 있잖아요." },
  { t: 14000,speaker: "남자 음성", text: "네가 입 다물면, 아무 일도 없었던 거야." },
];

// 녹음기 핫스팟 위치
const CLUE_X = 62;
const CLUE_Y = 78;

export default function SceneBroadcast({ onAdvance }: Props) {
  const maskRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<"explore" | "recorder-open" | "playing" | "played" | "chosen">("explore");
  const [choice, setChoice] = useState<"A" | "B" | null>(null);
  const [scriptLines, setScriptLines] = useState<typeof SCRIPT>([]);
  const [showHint, setShowHint] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

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

  const handlePlay = () => {
    setStep("playing");
    SCRIPT.forEach((line) => {
      const id = setTimeout(() => setScriptLines((p) => [...p, line]), line.t);
      timers.current.push(id);
    });
    const doneId = setTimeout(() => setStep("played"), SCRIPT.at(-1)!.t + 2500);
    timers.current.push(doneId);
  };

  const handleChoice = (c: "A" | "B") => {
    setChoice(c);
    setStep("chosen");
  };

  const handleAdvance = () => {
    const updates: Partial<GameState> = { playedRecording: true };
    if (choice === "A") updates.truthScore = 1;
    else updates.trustMinseo = 1;
    onAdvance(updates, "rooftop");
  };

  return (
    <div className="scene-wrap">
      <div className="bg" />
      <div className="flicker" aria-hidden />
      <div ref={maskRef} aria-hidden className="mask-layer" />
      <div ref={glowRef} aria-hidden className="glow-layer" />

      {step === "explore" && (
        <>
          <div className="objective">방송실에서 남겨진 목소리를 확인하세요.</div>
          <button
            className="hint-btn"
            onClick={() => { setShowHint(true); setTimeout(() => setShowHint(false), 3000); }}
          >HINT</button>
          <button
            className={`hotspot ${showHint ? "hint-active" : ""}`}
            style={{ left: `${CLUE_X}%`, top: `${CLUE_Y}%` }}
            onClick={() => setStep("recorder-open")}
            aria-label="녹음기"
          />
        </>
      )}

      {/* 녹음기 모달 */}
      {step === "recorder-open" && (
        <div className="modal-overlay" style={{ cursor: "auto" }}>
          <button className="modal-close" onClick={() => setStep("explore")}>✕ 닫기</button>
          <div className="recorder-modal">
            <img src="/clues/detail-recorder.jpg" alt="녹음기" className="recorder-img" />
            <div className="rec-filename">REC_0913.WAV</div>
            <button className="play-btn" onClick={handlePlay}>▶ 재생</button>
          </div>
        </div>
      )}

      {/* 재생 중 / 완료 */}
      {(step === "playing" || step === "played" || step === "chosen") && (
        <div className="transcript-panel">
          <div className="rec-header">
            REC_0913.WAV — {step === "playing" ? "재생 중..." : "재생 완료"}
          </div>
          {scriptLines.map((l, i) => (
            <div key={i} className={`script-line ${l.speaker === "민서" ? "minseo" : "male"}`}>
              <span className="spk">{l.speaker}</span>
              <span className="txt">{l.text}</span>
            </div>
          ))}
          {(step === "played" || step === "chosen") && (
            <>
              <div className="static-line">— [녹음 끊김] —</div>
              <PhoneMessage sender="민서" text="끝까지 믿지 마." delay={300} />
              {step === "played" && (
                <div style={{ marginTop: 12 }}>
                  <ChoiceButton label="A.  누굴?" onClick={() => handleChoice("A")} />
                  <ChoiceButton label="B.  왜?" onClick={() => handleChoice("B")} />
                </div>
              )}
              {step === "chosen" && choice && (
                <>
                  <PhoneMessage sender="나" text={choice === "A" ? "누굴?" : "왜?"} align="right" delay={0} />
                  <PhoneMessage
                    sender="민서"
                    text={choice === "A" ? "목소리.\n기록.\n그리고 너 자신." : "기억은 쉽게 바뀌니까."}
                    delay={700}
                  />
                  <PhoneMessage sender="민서" text={"옥상으로 와.\n거기서 끝났어."} delay={1800} />
                  <div style={{ textAlign: "center", marginTop: 20 }}>
                    <button className="move-btn" onClick={handleAdvance}>옥상으로 이동</button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .scene-wrap {
          position: fixed; inset: 0; overflow: hidden;
          animation: fadeIn 0.6s ease both; cursor: none;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .bg {
          position: absolute; inset: 0;
          background: url('/bg/scene-broadcast.jpg') center/cover no-repeat;
        }
        .flicker {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: rgba(210,220,190,0.04);
          animation: flicker 4.2s ease-in-out infinite;
        }
        @keyframes flicker {
          0%,95%,100% { opacity: 1; } 96% { opacity: 0.1; } 97% { opacity: 0.9; } 98% { opacity: 0.2; }
        }
        .mask-layer { pointer-events: none; position: fixed; inset: 0; z-index: 10; background: rgba(3,4,7,0.96); }
        .glow-layer { pointer-events: none; position: fixed; inset: 0; z-index: 11; mix-blend-mode: screen; }
        .objective {
          position: absolute; top: 28px; left: 50%; transform: translateX(-50%);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.68rem; letter-spacing: 0.22em; color: var(--ink-faint);
          z-index: 20; white-space: nowrap; background: rgba(3,4,7,0.6); padding: 6px 16px;
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
        .hotspot.hint-active {
          animation: hintPulse 0.6s ease-in-out infinite alternate;
        }
        @keyframes hintPulse {
          from { box-shadow: 0 0 0 4px rgba(205,178,122,0.5), 0 0 20px 8px rgba(205,178,122,0.2); }
          to   { box-shadow: 0 0 0 8px rgba(205,178,122,0.8), 0 0 40px 15px rgba(205,178,122,0.4); }
        }
        .modal-overlay {
          position: fixed; inset: 0; z-index: 50; background: rgba(3,4,7,0.9);
          display: flex; align-items: center; justify-content: center;
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
        .recorder-modal {
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .recorder-img {
          width: min(280px, 70vw); border: 1px solid rgba(232,230,223,0.1);
        }
        .rec-filename {
          font-family: var(--font-geist-mono), monospace; font-size: 0.72rem;
          letter-spacing: 0.2em; color: var(--ink-faint);
        }
        .play-btn {
          font-family: var(--font-geist-mono), monospace; font-size: 0.9rem;
          letter-spacing: 0.3em; color: var(--accent); background: transparent;
          border: 1px solid var(--accent); padding: 12px 32px; cursor: pointer;
          transition: background 0.3s, color 0.3s;
        }
        .play-btn:hover { background: var(--accent); color: #06070a; }
        .transcript-panel {
          position: absolute; inset: 0; z-index: 20;
          display: flex; flex-direction: column; justify-content: center;
          padding: 40px 28px; max-width: 540px; margin: 0 auto; overflow-y: auto;
          background: linear-gradient(to top, rgba(3,4,7,0.98) 60%, rgba(3,4,7,0.7) 100%);
        }
        .rec-header {
          font-family: var(--font-geist-mono), monospace; font-size: 0.65rem;
          letter-spacing: 0.2em; color: var(--ink-faint); margin-bottom: 20px;
        }
        .script-line {
          display: flex; gap: 14px; margin-bottom: 14px;
          animation: fadeUp 0.4s ease both;
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        .spk {
          font-family: var(--font-geist-mono), monospace; font-size: 0.66rem;
          letter-spacing: 0.1em; color: var(--ink-faint); white-space: nowrap;
          min-width: 76px; padding-top: 2px;
        }
        .txt { font-size: 0.9rem; color: var(--ink-dim); line-height: 1.65; }
        .minseo .txt { color: var(--ink); }
        .male .spk { color: rgba(200,90,90,0.75); }
        .static-line {
          font-family: var(--font-geist-mono), monospace; font-size: 0.62rem;
          letter-spacing: 0.2em; color: var(--ink-faint); margin: 8px 0 18px;
        }
        .move-btn {
          font-family: var(--font-geist-mono), monospace; font-size: 0.78rem;
          letter-spacing: 0.18em; color: var(--ink-dim); background: transparent;
          border: 1px solid rgba(232,230,223,0.25); padding: 12px 28px; cursor: pointer;
          transition: color 0.3s, border-color 0.3s;
        }
        .move-btn:hover { color: var(--ink); border-color: var(--accent); }
      `}</style>
    </div>
  );
}
