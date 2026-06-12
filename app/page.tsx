"use client";

import { useEffect, useMemo, useCallback } from "react";
import { STAGE } from "@/lib/chapters";
import { useClueStore } from "@/hooks/useClueStore";
import { useAudio } from "@/components/AudioManager";

import SmoothScroll from "@/components/SmoothScroll";
import AudioManager from "@/components/AudioManager";
import Cursor from "@/components/Cursor";
import StormFX from "@/components/StormFX";
import LighthouseBeam from "@/components/LighthouseBeam";
import HUD from "@/components/HUD";
import MessageFeed from "@/components/MessageFeed";
import ScreenFX from "@/components/ScreenFX";

import Prologue from "@/components/sections/Prologue";
import Floor from "@/components/sections/Floor";
import TruthReveal from "@/components/sections/TruthReveal";
import PlayCTA from "@/components/sections/PlayCTA";
import ClueOverlay from "@/components/sections/ClueOverlay";

// 인라인 SVG 필름 그레인 (이미지 파일 불필요)
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Home() {
  const setTotal = useClueStore((s) => s.setTotal);

  const total = useMemo(
    () => STAGE.chapters.reduce((n, c) => n + c.clues.length, 0),
    []
  );

  useEffect(() => {
    setTotal(total);
    // 진입 강조색 + 시작 BGM 예약 (음소거 해제 시 재생)
    document.documentElement.style.setProperty("--accent", STAGE.accent);
    useAudio.getState().request("prologue");
  }, [setTotal, total]);

  const handleActivate = useCallback((id: string) => {
    useAudio.getState().request(id);
  }, []);

  return (
    <SmoothScroll>
      {/* ── 고정 분위기 레이어 ── */}
      {STAGE.useBeam && <LighthouseBeam accent="#d8be86" />}
      <StormFX />
      <Cursor />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden style={{ backgroundImage: GRAIN_URI }} />

      {/* ── HUD / 오디오 / 단서 오버레이 ── */}
      <HUD total={total} />
      <AudioManager />
      <ClueOverlay />
      <MessageFeed />
      <ScreenFX />

      {/* ── 경험 시퀀스 ── */}
      <main className="relative">
        <Prologue />
        {STAGE.chapters.map((ch) => (
          <Floor key={ch.id} data={ch} onActivate={handleActivate} />
        ))}
        <TruthReveal />
        <PlayCTA />
      </main>
    </SmoothScroll>
  );
}
