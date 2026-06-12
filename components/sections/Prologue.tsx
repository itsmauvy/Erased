"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { STAGE } from "@/lib/chapters";
import SceneBackground from "../SceneBackground";

export default function Prologue() {
  const ref = useRef<HTMLElement>(null);
  const p = STAGE.prologue;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.querySelectorAll(".reveal").forEach((n) => n.classList.add("is-in"));
      return;
    }
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.5 })
        .to(el.querySelectorAll<HTMLElement>(".reveal"), {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.6,
          stagger: 0.55,
          ease: "power2.out",
          onStart: () =>
            el.querySelectorAll(".reveal").forEach((n) => n.classList.add("is-in")),
        });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-screen w-full flex-col items-center justify-center px-6 text-center"
      style={{ "--accent": STAGE.accent } as React.CSSProperties}
    >
      {/* 학교 외관 배경 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <SceneBackground id="exterior" accent={STAGE.accent} src="/bg/prologue.jpg" />
      </div>
      {/* 중앙 가독성 스크림 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5]"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 50%, rgba(4,5,8,0.82) 0%, rgba(4,5,8,0.4) 55%, transparent 100%)",
        }}
      />

      <div className="reveal kicker mb-8">{p.subtitle}</div>

      <h1 className="reveal display mb-10 text-6xl md:text-9xl">{p.title}</h1>

      <div className="narrative max-w-xl space-y-1 text-lg md:text-2xl">
        {p.lines.map((line, i) => (
          <p key={i} className="reveal">
            {line}
          </p>
        ))}
      </div>

      <div className="reveal mt-12 max-w-md border-t border-[var(--line)] pt-6 font-mono text-xs leading-relaxed tracking-[0.15em] text-[var(--ink-faint)]">
        {p.signal}
      </div>

      {/* 스크롤 힌트 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
        <div className="font-mono text-[0.62rem] tracking-[0.35em] text-[var(--ink-dim)]">
          {p.scrollHint}
        </div>
        <div className="scroll-cue mx-auto mt-3 h-10 w-px bg-[var(--ink-faint)]" />
      </div>

      <style jsx>{`
        .scroll-cue {
          transform-origin: top;
          animation: cue 2.2s ease-in-out infinite;
        }
        @keyframes cue {
          0%,
          100% {
            transform: scaleY(0.3);
            opacity: 0.3;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
