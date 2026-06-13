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
        <h1 className="news-headline">학교 폭력 피해자, 실종자로 신고되다</h1>
        <div className="news-body">
          <div className="news-blur" aria-hidden />
          <p>제보자의 증언이 학교 측에 전달되었다. 교내 CCTV 화면도 단서로 제출되었다. 누군가가 이 사실을 알고 있었다는 게 드러났다.</p>
          <p>그러나 민서는 아직 돌아오지 않았다.</p>
        </div>
        <div className="ending-title">TRUTH</div>
      </div>

      <div className="phone-area">
        {!showMsg ? (
          <button className="reveal-btn" onClick={() => setShowMsg(true)}>
            메시지 확인
          </button>
        ) : (
          <PhoneMessage sender="Unknown" text="진실은 그래도 지워지지 않아?" delay={400} />
        )}
      </div>

      <button className="restart-btn" onClick={onRestart}>다시 시작</button>

      <style>{`
        .ending-wrap {
          position: fixed; inset: 0; background: #03040a;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 40px 24px; animation: fadeIn 1.2s ease both; cursor: auto;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .news-layout {
          max-width: 480px; width: 100%;
          border: 1px solid rgba(232,230,223,0.1); padding: 32px; margin-bottom: 32px;
        }
        .news-kicker {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.62rem; letter-spacing: 0.35em; color: #c04040; margin-bottom: 12px;
        }
        .news-headline {
          font-family: var(--font-myeongjo), serif;
          font-size: 1.3rem; color: var(--ink); margin: 0 0 20px; line-height: 1.4;
        }
        .news-body { position: relative; overflow: hidden; }
        .news-body p { font-size: 0.85rem; color: var(--ink-dim); line-height: 1.75; margin-bottom: 10px; }
        .news-blur {
          position: absolute; bottom: 0; left: 0; right: 0; height: 60px;
          background: linear-gradient(to bottom, transparent, #03040a);
        }
        .ending-title {
          font-family: var(--font-geist-mono), monospace; font-size: 2rem;
          letter-spacing: 0.5em; color: rgba(232,230,223,0.12); text-align: right; margin-top: 16px;
        }
        .phone-area { max-width: 360px; width: 100%; margin-bottom: 32px; }
        .reveal-btn, .restart-btn {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.72rem; letter-spacing: 0.2em; color: var(--ink-faint);
          background: transparent; border: 1px solid rgba(232,230,223,0.18);
          padding: 10px 24px; cursor: pointer; transition: color 0.3s, border-color 0.3s;
        }
        .reveal-btn:hover, .restart-btn:hover { color: var(--ink); border-color: var(--accent); }
        .restart-btn { display: block; margin: 0 auto; }
      `}</style>
    </div>
  );
}
