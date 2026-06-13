"use client";

import { useEffect, useState } from "react";
import PhoneMessage from "./PhoneMessage";

type Props = { onRestart: () => void };

export default function EndingErased({ onRestart }: Props) {
  const [flashOn, setFlashOn] = useState(false);
  const [faceRevealed, setFaceRevealed] = useState(false);
  const [msgVisible, setMsgVisible] = useState(false);
  const [lastVisible, setLastVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFlashOn(true), 1000);
    const t2 = setTimeout(() => setFlashOn(false), 1200);
    const t3 = setTimeout(() => setFaceRevealed(true), 1200);
    const t4 = setTimeout(() => setMsgVisible(true), 2400);
    const t5 = setTimeout(() => setLastVisible(true), 4500);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  return (
    <div className="ending-wrap" style={{ background: "#010203" }}>
      <div className={`flash ${flashOn ? "on" : ""}`} aria-hidden />

      <div className="content">
        <div className="photo-frame">
          <div className="photo-inner">
            <div className="face-slot">
              {faceRevealed
                ? <span className="face-revealed">민서</span>
                : <span className="scratch-x">✕</span>}
            </div>
            <div className="face-slot">
              {lastVisible
                ? <span className="scratch-x erasing">✕</span>
                : <span className="face-revealed" style={{ opacity: 0.4 }}>나</span>}
            </div>
          </div>
        </div>

        <div className="ending-title" style={{ fontSize: "2.5rem", color: "rgba(232,230,223,0.06)" }}>ERASED</div>

        {msgVisible && (
          <div className="lines">
            <p>민서의 얼굴이 다시 보였다.</p>
            <p>누군가가 나를 지우고 있었다.</p>
          </div>
        )}

        {msgVisible && (
          <div className="phone-area" style={{ maxWidth: 320, margin: "0 auto 24px", textAlign: "left" }}>
            <PhoneMessage sender="민서" text={"이제 기억났어?\n\n다음은 네 차례야."} delay={600} />
          </div>
        )}

        <button
          className="restart-btn"
          onClick={onRestart}
          style={{ opacity: lastVisible ? 1 : 0, transition: "opacity 0.8s" }}
        >
          다시 시작
        </button>
      </div>
    </div>
  );
}
