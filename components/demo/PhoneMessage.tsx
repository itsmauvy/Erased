"use client";

import { useEffect, useState } from "react";

type Props = {
  sender: string;
  text: string;
  delay?: number;
  align?: "left" | "right";
};

export default function PhoneMessage({
  sender,
  text,
  delay = 0,
  align = "left",
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  const isRight = align === "right";

  return (
    <div
      className="msg-wrap"
      style={{ justifyContent: isRight ? "flex-end" : "flex-start" }}
    >
      {!isRight && (
        <span className="sender">{sender}</span>
      )}
      <div className={`bubble ${isRight ? "bubble-right" : "bubble-left"}`}>
        {text}
      </div>
      <style>{`
        .msg-wrap {
          display: flex;
          flex-direction: column;
          margin-bottom: 14px;
          animation: fadeUp 0.4s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sender {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          color: var(--ink-faint);
          margin-bottom: 4px;
          padding-left: 4px;
        }
        .bubble {
          display: inline-block;
          max-width: 75%;
          padding: 10px 14px;
          font-size: 0.9rem;
          line-height: 1.55;
          border-radius: 4px;
          white-space: pre-line;
        }
        .bubble-left {
          background: rgba(232, 230, 223, 0.08);
          color: var(--ink-dim);
          align-self: flex-start;
        }
        .bubble-right {
          background: rgba(205, 178, 122, 0.18);
          color: var(--ink);
          align-self: flex-end;
        }
      `}</style>
    </div>
  );
}

