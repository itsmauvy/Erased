"use client";

import { useState } from "react";
import PhoneMessage from "./PhoneMessage";

type Props = { onRestart: () => void };

export default function EndingTruth({ onRestart }: Props) {
  const [showMsg, setShowMsg] = useState(false);

  return (
    <div className="ending-wrap">
      <div className="news-layout">
        <div className="news-kicker">BREAKING</div>
        <h1 className="news-headline">학교 은폐 의혹, 세상에 알려지다</h1>
        <div className="news-body">
          <div className="news-blur" aria-hidden />
          <p>취재진이 학교 앞에 몰려들었다. 흐릿한 CCTV 화면이 반복해서 재생됐다. 누군가는 말했다 — 진실은 늘 이렇게 밝혀진다고.</p>
          <p>그러나 민서는 끝내 발견되지 않았다.</p>
        </div>
        <div className="ending-title">TRUTH</div>
      </div>

      <div className="phone-area">
        {!showMsg ? (
          <button className="reveal-btn" onClick={() => setShowMsg(true)}>
            메시지 확인
          </button>
        ) : (
          <PhoneMessage sender="Unknown" text="정말 그게 진실일까?" delay={400} />
        )}
      </div>

      <button className="restart-btn" onClick={onRestart}>다시 하기</button>

      <style jsx>{`
        .ending-wrap {
          position: fixed; inset: 0;
          background: #03040a;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px 24px;
          animation: fadeIn 1.2s ease both;
          cursor: auto;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .news-layout {
          max-width: 480px; width: 100%;
          border: 1px solid rgba(232,230,223,0.1);
          padding: 32px;
          margin-bottom: 32px;
        }
        .news-kicker {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.62rem; letter-spacing: 0.35em;
          color: #c04040; margin-bottom: 12px;
        }
        .news-headline {
          font-family: var(--font-myeongjo), serif;
          font-size: 1.3rem; color: var(--ink);
          margin: 0 0 20px; line-height: 1.4;
        }
        .news-body {
          position: relative; overflow: hidden;
        }
        .news-body p {
          font-size: 0.85rem; color: var(--ink-dim);
          line-height: 1.75; margin-bottom: 10px;
        }
        .news-blur {
          position: absolute; bottom: 0; left: 0; right: 0; height: 60px;
          background: linear-gradient(to bottom, transparent, #03040a);
        }
        .ending-title {
          font-family: var(--font-geist-mono), monospace;
          font-size: 2rem; letter-spacing: 0.5em;
          color: rgba(232,230,223,0.12);
          text-align: right; margin-top: 16px;
        }
        .phone-area { max-width: 360px; width: 100%; margin-bottom: 32px; }
        .reveal-btn, .restart-btn {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem; letter-spacing: 0.2em; color: var(--ink-faint);
          background: transparent;
          border: 1px solid rgba(232,230,223,0.18);
          padding: 10px 24px; cursor: pointer;
          transition: color 0.3s, border-color 0.3s;
        }
        .reveal-btn:hover, .restart-btn:hover {
          color: var(--ink); border-color: var(--accent);
        }
        .restart-btn { display: block; margin: 0 auto; }
      `}</style>
    </div>
  );
}
