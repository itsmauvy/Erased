"use client";

import { useEffect, useRef } from "react";

/**
 * 폭풍 — 비 파티클(Canvas) + 가끔의 번개 플래시.
 * 결정론적 CSS/Canvas라 항상 멋지고 AI 이미지에 의존하지 않는다 (플랜 §3-3).
 */
export default function StormFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let running = true;

    const COUNT = Math.min(160, Math.floor(w / 9));
    type Drop = { x: number; y: number; len: number; vy: number; a: number };
    const drops: Drop[] = Array.from({ length: COUNT }, () => mk());

    function mk(): Drop {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        len: 12 + Math.random() * 26,
        vy: 7 + Math.random() * 9,
        a: 0.06 + Math.random() * 0.16,
      };
    }

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // 화면이 보이지 않으면 일시정지
    const io = new IntersectionObserver(
      ([e]) => (running = e.isIntersecting),
      { threshold: 0 }
    );
    io.observe(canvas);

    let flash = 0;
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      // 드물게 번개
      if (Math.random() < 0.0016) flash = 0.5 + Math.random() * 0.4;
      if (flash > 0) {
        ctx.fillStyle = `rgba(150,170,200,${flash * 0.18})`;
        ctx.fillRect(0, 0, w, h);
        flash -= 0.04;
      }

      ctx.strokeStyle = "rgba(180,200,220,1)";
      ctx.lineWidth = 1;
      for (const d of drops) {
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1.5, d.y + d.len);
        ctx.stroke();
        d.y += d.vy;
        d.x -= 1.2;
        if (d.y > h) {
          d.y = -d.len;
          d.x = Math.random() * w;
        }
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
    />
  );
}
