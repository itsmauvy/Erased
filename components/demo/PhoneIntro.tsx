"use client";

import { useState } from "react";
import ChoiceButton from "./ChoiceButton";
import PhoneMessage from "./PhoneMessage";
import { GameState } from "./GameState";

type Props = {
  onAdvance: (updates: Partial<GameState>, next: "classroom") => void;
};

export default function PhoneIntro({ onAdvance }: Props) {
  const [step, setStep] = useState<"idle" | "chosen" | "done">("idle");
  const [choice, setChoice] = useState<"A" | "B" | null>(null);

  const handleChoice = (c: "A" | "B") => {
    setChoice(c);
    setStep("chosen");
  };

  const handleEnter = () => {
    const delta = choice === "B" ? 1 : -1;
    onAdvance({ trustMinseo: delta }, "classroom");
  };

  return (
    <div className="scene-wrap">
      {/* 배경 비/번개 효과 */}
      <div className="rain-overlay" aria-hidden />

      <div className="phone-shell">
        {/* 잠금화면 상태바 */}
        <div className="status-bar">
          <span>11:58 PM</span>
        </div>

        {/* 메시지 대화창 */}
        <div className="chat-area">
          <PhoneMessage sender="민서" text="기억 안 나?" delay={600} />

          {step === "idle" && (
            <div className="choices" style={{ marginTop: 24 }}>
              <ChoiceButton label="A.  누구세요?" onClick={() => handleChoice("A")} />
              <ChoiceButton label="B.  민서야...?" onClick={() => handleChoice("B")} />
            </div>
          )}

          {step !== "idle" && choice && (
            <>
              <PhoneMessage
                sender="나"
                text={choice === "A" ? "누구세요?" : "민서야...?"}
                align="right"
                delay={0}
              />
              <PhoneMessage
                sender="민서"
                text={choice === "A" ? "그럴 줄 알았어." : "아직 기억하고 있네."}
                delay={700}
              />
              <PhoneMessage
                sender="민서"
                text={"우리가 마지막으로 만난 곳으로 와.\n2학년 3반."}
                delay={1600}
              />

              {step === "chosen" && (
                <div style={{ textAlign: "center", marginTop: 28 }}>
                  <button
                    className="enter-btn"
                    onClick={() => {
                      setStep("done");
                      setTimeout(handleEnter, 200);
                    }}
                  >
                    학교로 들어간다
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .scene-wrap {
          position: fixed;
          inset: 0;
          background: #03040a;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.6s ease both;
          cursor: auto;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .rain-overlay {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            170deg,
            transparent 0px,
            transparent 3px,
            rgba(180, 200, 220, 0.03) 3px,
            rgba(180, 200, 220, 0.03) 4px
          );
          animation: rain 0.8s linear infinite;
          pointer-events: none;
        }
        @keyframes rain {
          from { background-position: 0 0; }
          to   { background-position: -20px 80px; }
        }
        .phone-shell {
          position: relative;
          width: min(360px, 90vw);
          min-height: 520px;
          background: #0d0f14;
          border: 1px solid rgba(232, 230, 223, 0.1);
          border-radius: 32px;
          padding: 24px 20px 32px;
          box-shadow: 0 0 60px rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .status-bar {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          color: var(--ink-faint);
          letter-spacing: 0.12em;
          text-align: center;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(232, 230, 223, 0.08);
        }
        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .choices {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .enter-btn {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          color: var(--ink-dim);
          background: transparent;
          border: 1px solid rgba(232, 230, 223, 0.25);
          padding: 12px 28px;
          cursor: pointer;
          margin-top: 12px;
          transition: color 0.3s, border-color 0.3s;
        }
        .enter-btn:hover {
          color: var(--ink);
          border-color: var(--accent);
        }
      `}</style>
    </div>
  );
}
