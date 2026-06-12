"use client";

import { useEffect, useState } from "react";
import SceneArt from "./SceneArt";

/**
 * 배경 해석기: AI 이미지(src)가 있으면 그걸 쓰고,
 * 없거나 로드 실패하면 코드로 그린 SceneArt로 자동 폴백한다.
 * → 사용자는 public/bg/ 에 파일만 넣고 새로고침하면 끝.
 *
 * MJ 이미지가 너무 어두워서(평균 밝기 ~5%) CSS로 끌어올린다.
 */
export default function SceneBackground({
  id,
  accent,
  src,
}: {
  id: string;
  accent: string;
  src?: string;
}) {
  const [status, setStatus] = useState<"idle" | "ok" | "fail">(
    src ? "idle" : "fail"
  );

  useEffect(() => {
    if (!src) {
      setStatus("fail");
      return;
    }
    let active = true;
    const img = new window.Image();
    img.onload = () => active && setStatus("ok");
    img.onerror = () => active && setStatus("fail");
    img.src = src;
    return () => {
      active = false;
    };
  }, [src]);

  if (status === "ok" && src) {
    return (
      <div className="sb-root absolute inset-0 overflow-hidden">
        {/* 마우스 패럴럭스: 커서 따라 살짝 이동 */}
        <div className="sb-parallax absolute inset-0">
          {/* 켄번스: 가만 있어도 천천히 줌·이동 */}
          <div
            className="sb-kenburns absolute inset-0"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(1.7) saturate(1.15) contrast(1.0)",
            }}
          />
        </div>
        <style jsx>{`
          .sb-parallax {
            transform: translate3d(
              calc(var(--mx, 0) * 22px),
              calc(var(--my, 0) * 15px),
              0
            );
            will-change: transform;
          }
          .sb-kenburns {
            animation: sb-ken 32s ease-in-out infinite alternate;
            will-change: transform;
          }
          @keyframes sb-ken {
            from {
              transform: scale(1.14) translate(0%, 0%);
            }
            to {
              transform: scale(1.24) translate(-2.5%, -1.8%);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .sb-parallax {
              transform: none;
            }
            .sb-kenburns {
              animation: none;
              transform: scale(1.14);
            }
          }
        `}</style>
      </div>
    );
  }
  return <SceneArt id={id} accent={accent} />;
}
