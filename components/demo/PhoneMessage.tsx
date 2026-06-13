"use client";

import { useEffect, useState } from "react";

type Props = {
  sender: string;
  text: string;
  delay?: number;
  align?: "left" | "right";
};

export default function PhoneMessage({ sender, text, delay = 0, align = "left" }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  const isRight = align === "right";

  return (
    <div className="msg-wrap" style={{ justifyContent: isRight ? "flex-end" : "flex-start" }}>
      {!isRight && <span className="sender">{sender}</span>}
      <div className={`bubble ${isRight ? "bubble-right" : "bubble-left"}`}>{text}</div>
    </div>
  );
}
