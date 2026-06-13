"use client";

import { useEffect, useState } from "react";
import PhoneMessage from "./PhoneMessage";

type Props = { onRestart: () => void };

export default function EndingSilence({ onRestart }: Props) {
  const [lineVisible, setLineVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLineVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="ending-wrap">
      <div className="text-area">
        <p className="days-later">며칠 후.</p>
        <div className="ending-title">SILENCE</div>
        <p className="line1">사건은 다시 조용해졌다.</p>
        {lineVisible && (
          <p className="line2">출석부에서 이름 하나가 더 지워졌다.</p>
        )}
      </div>

      <div className="phone-area" style={{ marginTop: 40 }}>
        <PhoneMessage sender="민서" text="왜 또 모른 척해?" delay={3200} />
      </div>

      <button className="restart-btn" onClick={onRestart}>다시 하기</button>

      <style jsx>{`
        .ending-wrap {
          position: fixed; inset: 0;
          background: #020304;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px 24px;
          animation: fadeIn 1.5s ease both;
          cursor: auto;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .text-area { max-width: 480px; width: 100%; text-align: center; }
        .days-later {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.7rem; letter-spacing: 0.25em;
          color: var(--ink-faint); margin-bottom: 24px;
        }
        .ending-title {
          font-family: var(--font-geist-mono), monospace;
          font-size: 2.5rem; letter-spacing: 0.5em;
          color: rgba(232,230,223,0.08);
          margin-bottom: 32px;
        }
        .line1, .line2 {
          font-family: var(--font-myeongjo), serif;
          font-size: 1rem; color: var(--ink-dim);
          line-height: 1.8; margin: 0 0 10px;
        }
        .line2 { animation: fadeIn 0.8s ease both; color: var(--ink-faint); }
        .phone-area { max-width: 360px; width: 100%; }
        .restart-btn {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem; letter-spacing: 0.2em; color: var(--ink-faint);
          background: transparent;
          border: 1px solid rgba(232,230,223,0.18);
          padding: 10px 24px; cursor: pointer; margin-top: 32px;
          transition: color 0.3s, border-color 0.3s;
          display: block;
        }
        .restart-btn:hover { color: var(--ink); border-color: var(--accent); }
      `}</style>
    </div>
  );
}
