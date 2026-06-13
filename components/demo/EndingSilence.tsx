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
    <div className="ending-wrap" style={{ background: "#020304" }}>
      <div className="text-area">
        <p className="days-later">일주일 후</p>
        <div className="ending-title" style={{ fontSize: "2.5rem" }}>SILENCE</div>
        <p className="line1">학교는 다시 정상으로 돌아왔다.</p>
        {lineVisible && <p className="line2">출석부에서 그 이름 하나가 빠져 있다.</p>}
      </div>

      <div className="phone-area" style={{ marginTop: 40 }}>
        <PhoneMessage sender="민서" text="결국 아무것도 안 했네?" delay={3200} />
      </div>

      <button className="restart-btn" style={{ marginTop: 32 }} onClick={onRestart}>다시 시작</button>
    </div>
  );
}
