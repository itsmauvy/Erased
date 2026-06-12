"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { type ChapterData } from "@/lib/chapters";
import { useClueStore } from "@/hooks/useClueStore";
import { useMessages } from "@/hooks/useMessages";
import { playFx } from "@/lib/soundfx";
import SceneBackground from "../SceneBackground";
import Clue from "./Clue";

/**
 * 재사용 층 셸. chapters.ts 데이터를 받아 렌더만 한다 (엔진/콘텐츠 분리, §3.6).
 * 진입 시: 전역 --accent 갱신, 활성 층을 부모에 알림(오디오 전환용).
 */
export default function Floor({
  data,
  onActivate,
}: {
  data: ChapterData;
  onActivate?: (id: string) => void;
}) {
  const rootRef = useRef<HTMLElement>(null);

  // ── 단서 모두 수집 시 사건 트리거 ──
  const found = useClueStore((s) => s.found);
  const pushMsg = useMessages((s) => s.push);
  const [done, setDone] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current || !data.event || data.clues.length === 0) return;
    const all = data.clues.every((c) => found.has(c.id));
    if (!all) return;
    firedRef.current = true;
    setDone(true);

    // 발소리가 다가오고 → 심장박동 → 의문의 메시지들이 도착
    playFx("footsteps");
    window.dispatchEvent(new Event("fx-pulse"));
    window.setTimeout(() => playFx("heartbeat"), 1600);
    data.event.lines.forEach((line, i) => {
      window.setTimeout(() => {
        playFx("message");
        pushMsg(data.event!.sender, line);
      }, 2000 + i * 1500);
    });
  }, [found, data, pushMsg]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // reveal 요소
      gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".reveal")).forEach(
        (node) => {
          ScrollTrigger.create({
            trigger: node,
            start: "top 82%",
            onEnter: () => node.classList.add("is-in"),
          });
        }
      );

      // 활성화: 전역 accent + 오디오 전환
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (self.isActive) {
            document.documentElement.style.setProperty("--accent", data.accent);
            onActivate?.(data.id);
          }
        },
      });
    }, el);

    return () => ctx.revert();
  }, [data, onActivate]);

  return (
    <section
      ref={rootRef}
      id={data.id}
      className="floor relative isolate flex min-h-[130vh] w-full items-center"
      style={{ "--accent": data.accent } as React.CSSProperties}
      aria-label={`Chapter ${data.index} — ${data.place}`}
    >
      {/* 배경 무대: 뷰포트 높이로 고정(sticky)되어 16:9 이미지가 제 비율로 보인다.
          내용이 스크롤되는 동안 배경은 화면에 머문다 → 깊이감. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{ backgroundImage: data.gradient }}
        >
          <SceneBackground id={data.id} accent={data.accent} src={data.bg} />
        </div>
      </div>

      {/* 텍스트 가독성 스크림 (좌·하단을 어둡게 깔아 글자가 항상 읽힘) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5]"
        style={{
          background:
            "linear-gradient(100deg, rgba(4,5,8,0.7) 0%, rgba(4,5,8,0.28) 24%, transparent 48%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:px-10">
        {/* 텍스트 블록 */}
        <div className="max-w-xl">
          <div className="reveal kicker mb-5">
            Chapter {data.index} · {data.place}
          </div>
          <h2 className="reveal display mb-8 text-5xl md:text-7xl">
            {data.title}
          </h2>
          <div className="narrative space-y-1 text-lg md:text-xl">
            {data.lines.map((line, i) => (
              <p key={i} className="reveal" style={{ transitionDelay: `${i * 90}ms` }}>
                {line}
              </p>
            ))}
          </div>
          <div className="reveal mt-8 font-mono text-xs tracking-[0.3em] text-[var(--ink-faint)]">
            빛 속의 점을 조사하라
          </div>
        </div>
      </div>

      {/* 단서 핫스팟 레이어 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute inset-0">
          {data.clues.map((clue) => (
            <Clue key={clue.id} clue={clue} />
          ))}
        </div>
      </div>

      {/* 사건 후: 다음 층으로 유도하는 신호 */}
      {done && data.event && (
        <div className="ascend-cue pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 text-center">
          <div className="font-mono text-[0.7rem] tracking-[0.35em] text-[var(--accent)]">
            {data.event.cue}
          </div>
          <div className="cue-chev mx-auto mt-2 text-2xl text-[var(--accent)]">⌄</div>
          <style jsx>{`
            .ascend-cue {
              animation: cue-appear 0.8s var(--ease-slow) both;
            }
            .cue-chev {
              animation: cue-bounce 1.6s ease-in-out infinite;
            }
            @keyframes cue-appear {
              from {
                opacity: 0;
                transform: translate(-50%, 10px);
              }
              to {
                opacity: 1;
                transform: translate(-50%, 0);
              }
            }
            @keyframes cue-bounce {
              0%,
              100% {
                transform: translateY(0);
                opacity: 0.5;
              }
              50% {
                transform: translateY(6px);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}

      {/* 층 번호 워터마크 */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 right-8 font-serif text-[18vw] leading-none text-white/[0.025] md:text-[12vw]"
      >
        {data.index}
      </div>
    </section>
  );
}
