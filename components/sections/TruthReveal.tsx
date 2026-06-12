"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { STAGE } from "@/lib/chapters";

/**
 * 진실 — 빛이 꺼지는 연출 + 끊기는 문장.
 * 핀 고정하며 화면이 서서히 암전되고, 마지막 문장이 중간에 잘린다.
 */
export default function TruthReveal() {
  const ref = useRef<HTMLElement>(null);
  const t = STAGE.truth;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".reveal")).forEach(
        (node, i) => {
          ScrollTrigger.create({
            trigger: node,
            start: "top 78%",
            onEnter: () =>
              gsap.delayedCall(reduce ? 0 : i * 0.15, () =>
                node.classList.add("is-in")
              ),
          });
        }
      );

      // 암전: 섹션을 지나는 동안 검은 베일이 짙어진다
      if (!reduce) {
        gsap.fromTo(
          el.querySelector(".truth-veil"),
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "center center",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[150vh] w-full items-center justify-center px-6 text-center"
      style={{ "--accent": STAGE.truth.accent } as React.CSSProperties}
    >
      <div className="relative z-10 max-w-2xl">
        <div className="reveal kicker mb-10">{t.kicker}</div>
        <div className="narrative space-y-3 text-2xl md:text-4xl">
          {t.lines.map((line, i) => (
            <p key={i} className="reveal display">
              {line}
            </p>
          ))}
        </div>

        <p className="reveal display mt-12 text-2xl text-[var(--ink)] md:text-4xl">
          {t.cut}
          <span className="cut-caret" aria-hidden>
            ▌
          </span>
        </p>
      </div>

      {/* 암전 베일 */}
      <div className="truth-veil pointer-events-none absolute inset-0 z-20 bg-black" />

      <style jsx>{`
        .cut-caret {
          margin-left: 4px;
          color: var(--accent);
          animation: blink 1s steps(1) infinite;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
