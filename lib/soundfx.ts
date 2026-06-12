"use client";

/**
 * 코드로 합성하는 효과음 (오디오 파일 불필요, Web Audio API).
 * 단서 조사·사건 트리거에 즉각적인 청각 피드백을 준다.
 * 첫 클릭(사용자 제스처) 이후에만 소리가 난다 — 브라우저 정책 OK.
 */

let ctx: AudioContext | null = null;
let muted = false;

export function setFxMuted(v: boolean) {
  muted = v;
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(
  c: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType,
  peak: number,
  endFreq?: number
) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime + start);
  if (endFreq)
    o.frequency.exponentialRampToValueAtTime(
      endFreq,
      c.currentTime + start + dur
    );
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(peak, c.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur + 0.02);
}

function noiseThud(c: AudioContext, start: number, peak: number) {
  const len = Math.floor(c.sampleRate * 0.16);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 320;
  const g = c.createGain();
  g.gain.setValueAtTime(peak, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + 0.18);
  src.connect(f).connect(g).connect(c.destination);
  src.start(c.currentTime + start);
}

export type FxKind =
  | "reveal"
  | "message"
  | "heartbeat"
  | "footsteps"
  | "step"
  | "tension";

export function playFx(kind: FxKind) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  switch (kind) {
    case "reveal": // 단서 조사 — 부드러운 블립
      tone(c, 520, 0, 0.14, "sine", 0.14, 300);
      tone(c, 1040, 0.02, 0.1, "sine", 0.05);
      break;
    case "message": // 메시지 도착 — 2음 알림
      tone(c, 880, 0, 0.09, "triangle", 0.12);
      tone(c, 1320, 0.11, 0.12, "triangle", 0.12);
      break;
    case "heartbeat": // 두 번의 저음 박동
      tone(c, 64, 0, 0.18, "sine", 0.5);
      tone(c, 58, 0.26, 0.22, "sine", 0.42);
      break;
    case "step": // 한 걸음 — 묵직한 발소리 한 번
      noiseThud(c, 0, 0.34);
      tone(c, 90, 0, 0.16, "sine", 0.18, 60);
      break;
    case "footsteps": // 다가오는 발소리 (점점 커짐)
      noiseThud(c, 0, 0.12);
      noiseThud(c, 0.42, 0.18);
      noiseThud(c, 0.86, 0.28);
      noiseThud(c, 1.32, 0.4);
      break;
    case "tension": // 저음 긴장 스웰
      tone(c, 70, 0, 1.6, "sawtooth", 0.06, 50);
      break;
  }
}
