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
      <div className="rain-overlay" aria-hidden />

      <div className="phone-shell">
        <div className="status-bar">11:58 PM</div>

        <div className="chat-area">
          <PhoneMessage sender="민서" text="기억 안 나?" delay={600} />

          {step === "idle" && (
            <div className="choices">
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
    </div>
  );
}
