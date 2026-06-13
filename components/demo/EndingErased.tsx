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
    <div className="ending-wrap">
      {/* 번개 플래시 */}
      <div className={`flash ${flashOn ? "on" : ""}`} aria-hidden />

      <div className="content">
        {/* 찢어진 사진 */}
        <div className="photo-frame">
          <div className="photo-inner">
            <div className="face-slot minseo">
              {faceRevealed ? (
                <span className="face-revealed" title="민서">民</span>
              ) : (
                <span className="scratch-x">✕</span>
              )}
            </div>
            <div className="face-slot player">
              {lastVisible ? (
                <span className="scratch-x erasing">✕</span>
              ) : (
                <span className="face-revealed" style={{ opacity: 0.4 }}>?</span>
              )}
            </div>
          </div>
        </div>

        <div className="ending-title">ERASED</div>

        {msgVisible && (
          <div className="lines">
            <p>민서는 사라진 게 아니었다.</p>
            <p>누군가에 의해 지워진 것이었다.</p>
          </div>
        )}

        {msgVisible && (
          <div className="phone-area">
            <PhoneMessage sender="민서" text={"이제 기억났어?\n\n다음은 네 차례야."} delay={600} />
          </div>
        )}

        <button className="restart-btn" onClick={onRestart} style={{ opacity: lastVisible ? 1 : 0 }}>
          다시 하기
        </button>
      </div>

      <style jsx>{`
        .ending-wrap {
          position: fixed; inset: 0;
          background: #010203;
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 1.5s ease both;
          cursor: auto;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .flash {
          position: fixed; inset: 0;
          background: rgba(180,200,230,0.7);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.05s;
          z-index: 100;
        }
        .flash.on { opacity: 1; }
        .content {
          max-width: 400px; width: 90%;
          text-align: center; padding: 24px;
        }
        .photo-frame {
          border: 1px solid rgba(232,230,223,0.1);
          padding: 20px; margin-bottom: 24px;
          background: #0d0f14;
          display: inline-block;
        }
        .photo-inner {
          display: flex; gap: 12px; justify-content: center;
        }
        .face-slot {
          width: 60px; height: 60px;
          background: #1a1c22; border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(232,230,223,0.1);
        }
        .scratch-x {
          font-size: 1.5rem; color: #2d2f38; font-weight: 900;
        }
        .scratch-x.erasing {
          animation: glitch 0.15s steps(2) infinite;
          color: rgba(200,100,80,0.5);
        }
        @keyframes glitch {
          0%,100% { opacity: 1; transform: none; }
          50%      { opacity: 0.3; transform: translate(1px,-1px); }
        }
        .face-revealed {
          font-family: var(--font-myeongjo), serif;
          font-size: 1.2rem; color: var(--ink-dim);
          animation: fadeIn 0.4s ease both;
        }
        .ending-title {
          font-family: var(--font-geist-mono), monospace;
          font-size: 2.5rem; letter-spacing: 0.5em;
          color: rgba(232,230,223,0.06);
          margin-bottom: 24px;
        }
        .lines { margin-bottom: 28px; animation: fadeIn 0.6s ease both; }
        .lines p {
          font-family: var(--font-myeongjo), serif;
          font-size: 0.95rem; color: var(--ink-dim);
          line-height: 1.9; margin: 0;
        }
        .phone-area { max-width: 320px; margin: 0 auto 24px; text-align: left; }
        .restart-btn {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem; letter-spacing: 0.2em; color: var(--ink-faint);
          background: transparent;
          border: 1px solid rgba(232,230,223,0.18);
          padding: 10px 24px; cursor: pointer;
          transition: color 0.3s, border-color 0.3s, opacity 0.8s;
          display: block; margin: 0 auto;
        }
        .restart-btn:hover { color: var(--ink); border-color: var(--accent); }
      `}</style>
    </div>
  );
}
