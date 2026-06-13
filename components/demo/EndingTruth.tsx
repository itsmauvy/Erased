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
          <p>제보자의 증언이 학교 측에 전달되었다. 교내 CCTV 화면도 단서로 제출되었다.</p>
          <p>그러나 민서는 아직 돌아오지 않았다.</p>
        </div>
        <div className="ending-title">TRUTH</div>
      </div>

      <div className="phone-area">
        {!showMsg ? (
          <button className="reveal-btn" onClick={() => setShowMsg(true)}>메시지 확인</button>
        ) : (
          <PhoneMessage sender="Unknown" text="진실은 그래도 지워지지 않아?" delay={400} />
        )}
      </div>

      <button className="restart-btn" onClick={onRestart}>다시 시작</button>
    </div>
  );
}
