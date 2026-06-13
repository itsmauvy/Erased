"use client";

import { useState, useRef, useEffect } from "react";
import ChoiceButton from "./ChoiceButton";
import PhoneMessage from "./PhoneMessage";
import { GameState } from "./GameState";

type Props = {
  onAdvance: (updates: Partial<GameState>, next: "rooftop") => void;
};

const SCRIPT = [
  { t: 0,     speaker: "남자 음성", text: "그 이름 다시 말하지 마." },
  { t: 3000,  speaker: "남자 음성", text: "다 끝난 일이야." },
  { t: 6500,  speaker: "민서",      text: "끝난 게 아니잖아요." },
  { t: 9500,  speaker: "민서",      text: "그날 옥상에 있던 사람들, 전부 알고 있잖아요." },
  { t: 14000, speaker: "남자 음성", text: "네가 입 다물면, 아무 일도 없었던 거야." },
];

const CLUE_X = 62;
const CLUE_Y = 78;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function SceneBroadcast({ onAdvance }: Props) {
  const maskRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<"explore" | "recorder-open" | "playing" | "played" | "chosen">("explore");
  const [choice, setChoice] = useState<"A" | "B" | null>(null);
  const [scriptLines, setScriptLines] = useState<typeof SCRIPT>([]);
  const [showHint, setShowHint] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

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

  const handleChoice = (c: "A" | "B") => { setChoice(c); setStep("chosen"); };

  const handleAdvance = () => {
    const updates: Partial<GameState> = { playedRecording: true };
    if (choice === "A") updates.truthScore = 1;
    else updates.trustMinseo = 1;
    onAdvance(updates, "rooftop");
  };

  return (
    <div className="scene-wrap-explore">
      <div className="bg" style={{ backgroundImage: `url('${BASE}/bg/scene-broadcast.jpg')` }} />
      <div className="flicker" aria-hidden />
      <div ref={maskRef} aria-hidden className="mask-layer" />
      <div ref={glowRef} aria-hidden className="glow-layer" />

      {step === "explore" && (
        <>
          <div className="objective">방송실에서 남겨진 목소리를 확인하세요.</div>
          <button className="hint-btn"
            onClick={() => { setShowHint(true); setTimeout(() => setShowHint(false), 3000); }}>
            HINT
          </button>
          <button
            className={`hotspot ${showHint ? "hint-active" : ""}`}
            style={{ left: `${CLUE_X}%`, top: `${CLUE_Y}%` }}
            onClick={() => setStep("recorder-open")}
            aria-label="녹음기"
          />
        </>
      )}

      {step === "recorder-open" && (
        <div className="modal-overlay">
          <button className="modal-close" onClick={() => setStep("explore")}>✕ 닫기</button>
          <div className="recorder-modal">
            <img src={`${BASE}/clues/detail-recorder.jpg`} alt="녹음기" className="recorder-img" />
            <div className="rec-filename">REC_0913.WAV</div>
            <button className="play-btn" onClick={handlePlay}>▶ 재생</button>
          </div>
        </div>
      )}

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
    </div>
  );
}
