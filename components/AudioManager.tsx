"use client";

import { Howl } from "howler";
import { useEffect, useRef } from "react";
import { create } from "zustand";

/**
 * 오디오 매니저 — 층별 BGM crossfade + 음소거 + 첫 제스처 unlock.
 *
 * 오디오 파일(public/audio/*.mp3)이 아직 없어도 안전하게 동작한다:
 * 로드 실패 시 조용히 무시하고, 음소거 토글 UI만 유지한다.
 */

const TRACKS: Record<string, string> = {
  prologue: "/audio/prologue.mp3",
  ch01: "/audio/ch01.mp3",
  ch02: "/audio/ch02.mp3",
  ch03: "/audio/ch03.mp3",
  ch04: "/audio/ch04.mp3",
  truth: "/audio/truth.mp3",
};

interface AudioState {
  muted: boolean;
  started: boolean;
  toggleMute: () => void;
  markStarted: () => void;
  setRequest: (fn: (id: string) => void) => void;
  request: (id: string) => void;
  _req: (id: string) => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  muted: true,
  started: false,
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  markStarted: () => set({ started: true }),
  setRequest: (fn) => set({ _req: fn }),
  request: (id) => get()._req(id),
  _req: () => {},
}));

export default function AudioManager() {
  const howls = useRef<Record<string, Howl>>({});
  const current = useRef<string | null>(null);

  const muted = useAudio((s) => s.muted);
  const started = useAudio((s) => s.started);

  // 트랙 lazy 생성 (실패해도 무시)
  const getHowl = (id: string): Howl | null => {
    const src = TRACKS[id];
    if (!src) return null;
    if (!howls.current[id]) {
      try {
        howls.current[id] = new Howl({
          src: [src],
          loop: true,
          volume: 0,
          html5: true,
          onloaderror: () => {},
          onplayerror: () => {},
        });
      } catch {
        return null;
      }
    }
    return howls.current[id] ?? null;
  };

  // 층 전환 요청 처리
  useEffect(() => {
    useAudio.getState().setRequest((id: string) => {
      if (current.current === id) return;
      const prevId = current.current;
      current.current = id;

      if (prevId && howls.current[prevId]) {
        howls.current[prevId].fade(howls.current[prevId].volume(), 0, 1600);
        const ref = howls.current[prevId];
        window.setTimeout(() => ref.pause(), 1700);
      }
      if (useAudio.getState().muted || !useAudio.getState().started) return;
      const next = getHowl(id);
      if (next) {
        try {
          next.play();
          next.fade(0, 0.5, 1800);
        } catch {
          /* ignore */
        }
      }
    });
  }, []);

  // 음소거/시작 상태 반영
  useEffect(() => {
    const id = current.current;
    if (!id) return;
    const h = howls.current[id];
    if (!h) return;
    if (muted || !started) {
      h.fade(h.volume(), 0, 600);
      window.setTimeout(() => h.pause(), 650);
    } else {
      try {
        h.play();
        h.fade(0, 0.5, 800);
      } catch {
        /* ignore */
      }
    }
  }, [muted, started]);

  // 첫 사용자 제스처에 오디오 unlock
  useEffect(() => {
    const onFirst = () => {
      useAudio.getState().markStarted();
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
    window.addEventListener("pointerdown", onFirst);
    window.addEventListener("keydown", onFirst);
    return () => {
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
  }, []);

  // 언마운트 정리
  useEffect(() => {
    const store = howls.current;
    return () => {
      Object.values(store).forEach((h) => h.unload());
    };
  }, []);

  return null;
}
