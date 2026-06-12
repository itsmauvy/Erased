"use client";

import { useEffect } from "react";
import { useMessages, type IncomingMessage } from "@/hooks/useMessages";

/**
 * 의문의 메시지가 화면 우하단에 스윽 도착한다 (휴대폰 알림처럼).
 * 사건 트리거의 핵심 연출 — "누군가 보고 있다"는 긴장.
 */
export default function MessageFeed() {
  const list = useMessages((s) => s.list);
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[90] flex w-[min(340px,80vw)] flex-col gap-3">
      {list.map((m) => (
        <MessageCard key={m.id} msg={m} />
      ))}
    </div>
  );
}

function MessageCard({ msg }: { msg: IncomingMessage }) {
  const dismiss = useMessages((s) => s.dismiss);
  useEffect(() => {
    const t = window.setTimeout(() => dismiss(msg.id), 9000);
    return () => window.clearTimeout(t);
  }, [msg.id, dismiss]);

  return (
    <div className="msg">
      <div className="msg-head">
        <span className="msg-dot" />
        {msg.sender}
        <span className="msg-time">방금</span>
      </div>
      <div className="msg-body">{msg.text}</div>
      <style jsx>{`
        .msg {
          border: 1px solid var(--line);
          border-left: 2px solid var(--accent);
          background: rgba(10, 11, 15, 0.94);
          backdrop-filter: blur(6px);
          padding: 12px 14px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.6);
          animation: msg-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .msg-head {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-dim);
        }
        .msg-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
        }
        .msg-time {
          margin-left: auto;
          color: var(--ink-faint);
          letter-spacing: 0.1em;
        }
        .msg-body {
          margin-top: 8px;
          font-family: var(--font-myeongjo), serif;
          font-size: 1.02rem;
          line-height: 1.5;
          color: var(--ink);
        }
        @keyframes msg-in {
          from {
            opacity: 0;
            transform: translateX(40px) translateY(6px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
