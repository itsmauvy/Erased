"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { STAGE } from "@/lib/chapters";

/** 결말 미공개 → The story continues. PLAY GAME */
export default function PlayCTA() {
  const ref = useRef<HTMLElement>(null);
  const p = STAGE.play;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".reveal")).forEach(
        (node) => {
          ScrollTrigger.create({
            trigger: node,
            start: "top 85%",
            onEnter: () => node.classList.add("is-in"),
          });
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 text-center"
      style={{ "--accent": STAGE.accent } as React.CSSProperties}
    >
      <p className="reveal narrative mb-10 text-xl tracking-wide md:text-2xl">
        {p.tagline}
      </p>

      <Link href="/demo" className="reveal play-btn">
        <span>{p.cta}</span>
      </Link>

      <p className="reveal mt-12 font-mono text-[0.66rem] tracking-[0.3em] text-[var(--ink-faint)]">
        {p.footnote}
      </p>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] tracking-[0.3em] text-[var(--ink-faint)]/60">
        {STAGE.siteTitle} — interactive prologue
      </div>

      <style jsx>{`
        .play-btn {
          position: relative;
          padding: 20px 64px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 1.05rem;
          letter-spacing: 0.5em;
          color: var(--ink);
          background: transparent;
          border: 1px solid var(--accent);
          cursor: none;
          overflow: hidden;
          transition: color 0.5s var(--ease-slow);
        }
        .play-btn span {
          position: relative;
          z-index: 1;
          padding-left: 0.5em;
        }
        .play-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--accent);
          transform: translateY(101%);
          transition: transform 0.5s var(--ease-slow);
        }
        .play-btn:hover {
          color: #06070a;
        }
        .play-btn:hover::before {
          transform: translateY(0);
        }
        .play-btn::after {
          content: "";
          position: absolute;
          inset: -40%;
          background: radial-gradient(
            circle,
            var(--accent) 0%,
            transparent 60%
          );
          opacity: 0.18;
          animation: halo 4s ease-in-out infinite;
        }
        @keyframes halo {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.28;
          }
        }
      `}</style>
    </section>
  );
}
