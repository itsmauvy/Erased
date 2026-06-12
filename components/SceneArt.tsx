"use client";

/**
 * 코드로 그린 "장소" 배경. 사진 AI 이미지 대신, 실루엣·원근·광원으로
 * 각 층이 실제 공간처럼 보이게 한다. (이미지 0장으로 몰입 확보)
 *
 * 위에 StormFX(비) · grain · 손전등 커서가 겹쳐 더 시네마틱해진다.
 * 나중에 AI 이미지가 준비되면 chapters.ts의 bg에 경로만 넣어 교체 가능.
 */

function rgba(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function SceneArt({
  id,
  accent,
}: {
  id: string;
  accent: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <radialGradient id={`glow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={rgba(accent, 0.55)} />
          <stop offset="45%" stopColor={rgba(accent, 0.14)} />
          <stop offset="100%" stopColor={rgba(accent, 0)} />
        </radialGradient>
        <linearGradient id={`depth-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
          <stop offset="45%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
        </linearGradient>
      </defs>

      {id === "exterior" && <Exterior accent={accent} />}
      {id === "ch01" && <Hallway accent={accent} />}
      {id === "ch02" && <Classroom accent={accent} />}
      {id === "ch03" && <SpecialRoom accent={accent} />}
      {id === "ch04" && <Rooftop accent={accent} />}

      <rect width="1600" height="900" fill={`url(#depth-${id})`} />
    </svg>
  );
}

/* ── 학교 외관 (Prologue) ── */
function Exterior({ accent }: { accent: string }) {
  const cols = 9;
  const rows = 4;
  const litCol = 5;
  const litRow = 1;
  const wins = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = r === litRow && c === litCol;
      wins.push(
        <rect
          key={`${r}-${c}`}
          x={360 + c * 96}
          y={470 + r * 78}
          width="60"
          height="50"
          fill={lit ? rgba(accent, 0.85) : "#0c0f14"}
          stroke="rgba(255,255,255,0.05)"
        />
      );
    }
  }
  return (
    <g>
      {/* 하늘 */}
      <rect width="1600" height="900" fill="#080a0f" />
      <ellipse cx="800" cy="350" rx="900" ry="320" fill={rgba(accent, 0.05)} />
      {/* 건물 블록 */}
      <rect x="300" y="430" width="1000" height="470" fill="#0b0d12" />
      <rect x="300" y="430" width="1000" height="470" fill="rgba(0,0,0,0.25)" />
      {/* 옥상 라인 */}
      <rect x="300" y="430" width="1000" height="14" fill="#070809" />
      {wins}
      {/* 켜진 창 글로우 */}
      <circle cx={360 + litCol * 96 + 30} cy={470 + litRow * 78 + 25} r="120" fill={`url(#glow-exterior)`} />
      {/* 정문 */}
      <rect x="120" y="300" width="22" height="600" fill="#0a0b10" />
      <rect x="1458" y="300" width="22" height="600" fill="#0a0b10" />
      {/* 바닥 */}
      <rect y="880" width="1600" height="20" fill="#050608" />
    </g>
  );
}

/* ── 복도 (Ch01) ── */
function Hallway({ accent }: { accent: string }) {
  const vx = 800;
  const vy = 430;
  // 원근 가이드 라인 (양 벽 로커 이음새)
  const seams = [];
  for (let i = 1; i <= 5; i++) {
    const lx = i * 130;
    const rx = 1600 - i * 130;
    const s = "rgba(180,210,205,0.13)";
    seams.push(
      <line key={`l${i}`} x1={lx} y1="0" x2={vx} y2={vy} stroke={s} />,
      <line key={`l2${i}`} x1={lx} y1="900" x2={vx} y2={vy} stroke={s} />,
      <line key={`r${i}`} x1={rx} y1="0" x2={vx} y2={vy} stroke={s} />,
      <line key={`r2${i}`} x1={rx} y1="900" x2={vx} y2={vy} stroke={s} />
    );
  }
  // 천장 조명 (원근으로 줄어듦)
  const lights = [0, 1, 2, 3].map((i) => {
    const t = i / 4;
    const y = 60 + t * (vy - 80);
    const w = 240 * (1 - t) + 24;
    return <rect key={i} x={vx - w / 2} y={y} width={w} height={10 * (1 - t) + 3} fill={rgba(accent, 0.85 - t * 0.4)} />;
  });
  return (
    <g>
      <rect width="1600" height="900" fill="#0d1c1a" />
      {/* 바닥 / 천장 / 벽 */}
      <polygon points={`0,900 1600,900 ${vx + 200},${vy + 6} ${vx - 200},${vy + 6}`} fill="#1a342f" />
      <polygon points={`0,0 1600,0 ${vx + 200},${vy - 6} ${vx - 200},${vy - 6}`} fill="#102220" />
      <polygon points={`0,0 0,900 ${vx - 200},${vy + 6} ${vx - 200},${vy - 6}`} fill="#234440" />
      <polygon points={`1600,0 1600,900 ${vx + 200},${vy + 6} ${vx + 200},${vy - 6}`} fill="#234440" />
      {/* 로커 칸 (벽면 사각) */}
      <g fill="#2b524d" opacity="0.5">
        <rect x="40" y="280" width="120" height="360" />
        <rect x="180" y="300" width="100" height="320" />
        <rect x="1440" y="280" width="120" height="360" />
        <rect x="1320" y="300" width="100" height="320" />
      </g>
      {seams}
      {/* 복도 전체를 비추는 은은한 빛 */}
      <ellipse cx={vx} cy={vy + 120} rx="760" ry="520" fill={rgba(accent, 0.14)} />
      {/* 바닥 반사 */}
      <polygon points={`0,900 1600,900 ${vx + 200},${vy + 6} ${vx - 200},${vy + 6}`} fill={rgba(accent, 0.08)} />
      {lights}
      {/* 복도 끝 문 + 글로우 */}
      <circle cx={vx} cy={vy + 10} r="280" fill="url(#glow-ch01)" />
      <rect x={vx - 46} y={vy - 70} width="92" height="150" fill={rgba(accent, 0.4)} stroke={rgba(accent, 0.85)} strokeWidth="3" />
    </g>
  );
}

/* ── 교실 (Ch02) ── */
function Classroom({ accent }: { accent: string }) {
  const desks = [];
  const rows = 4;
  const colsArr = [4, 4, 5, 5];
  for (let r = 0; r < rows; r++) {
    const t = r / rows;
    const y = 470 + t * 380;
    const dw = 90 + t * 70;
    const dh = 26 + t * 16;
    const cols = colsArr[r];
    const spread = 1100 + t * 360;
    const startX = 800 - spread / 2;
    for (let c = 0; c < cols; c++) {
      const x = startX + (c / (cols - 1)) * spread;
      const lit = r === 1 && c === 2;
      desks.push(
        <g key={`${r}-${c}`}>
          {lit && <circle cx={x} cy={y} r="120" fill="url(#glow-ch02)" />}
          <rect x={x - dw / 2} y={y - dh / 2} width={dw} height={dh} rx="3" fill={lit ? rgba(accent, 0.5) : "#13110b"} stroke="rgba(255,255,255,0.05)" />
          <rect x={x - dw / 2 + 6} y={y + dh / 2} width="6" height={dh} fill="#0d0b07" />
          <rect x={x + dw / 2 - 12} y={y + dh / 2} width="6" height={dh} fill="#0d0b07" />
        </g>
      );
    }
  }
  return (
    <g>
      <rect width="1600" height="900" fill="#0c0a06" />
      {/* 칠판 */}
      <rect x="540" y="150" width="520" height="200" fill="#0a0f0c" stroke={rgba(accent, 0.25)} strokeWidth="3" />
      {/* 창문 + 달빛 */}
      <rect x="80" y="120" width="200" height="380" fill="#0a0e14" stroke="rgba(255,255,255,0.06)" />
      <rect x="80" y="120" width="200" height="380" fill={rgba("#9bb3c9", 0.12)} />
      <polygon points="280,200 280,460 620,860 360,860" fill={rgba("#9bb3c9", 0.05)} />
      {desks}
    </g>
  );
}

/* ── 특별실 / 상담실 (Ch03) ── */
function SpecialRoom({ accent }: { accent: string }) {
  const shelves = [0, 1, 2, 3, 4].map((i) => (
    <rect key={i} x={120 + i * 60} y="300" width="38" height="520" fill="#0c0a14" stroke="rgba(255,255,255,0.04)" />
  ));
  return (
    <g>
      <rect width="1600" height="900" fill="#0b0912" />
      {shelves}
      {/* 매달린 등 + 빛 원뿔 */}
      <polygon points="980,120 700,900 1260,900" fill="url(#glow-ch03)" opacity="0.9" />
      <circle cx="980" cy="120" r="10" fill={rgba(accent, 0.9)} />
      <line x1="980" y1="0" x2="980" y2="120" stroke="rgba(255,255,255,0.1)" />
      {/* 책상 */}
      <rect x="820" y="560" width="320" height="34" rx="4" fill="#151225" stroke={rgba(accent, 0.3)} />
      <rect x="838" y="594" width="14" height="180" fill="#0d0b18" />
      <rect x="1108" y="594" width="14" height="180" fill="#0d0b18" />
      {/* 잠긴 문 */}
      <rect x="1360" y="280" width="150" height="540" fill="#0a0810" stroke="rgba(255,255,255,0.06)" />
      <line x1="1362" y1="280" x2="1362" y2="820" stroke={rgba(accent, 0.4)} strokeWidth="2" />
    </g>
  );
}

/* ── 옥상 (Ch04) ── */
function Rooftop({ accent }: { accent: string }) {
  // 도시 불빛 (창문 점들)
  const dots = [];
  for (let i = 0; i < 140; i++) {
    const x = (i * 137) % 1600;
    const y = 470 + ((i * 53) % 150);
    const on = i % 3 === 0;
    dots.push(
      <rect key={i} x={x} y={y} width="4" height="6" fill={on ? "rgba(220,210,180,0.5)" : "rgba(120,130,150,0.12)"} />
    );
  }
  // 빌딩 실루엣
  const blds = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const x = i * 240 - 40;
    const h = 80 + ((i * 67) % 140);
    return <rect key={i} x={x} y={620 - h} width="200" height={h + 40} fill="#070a10" />;
  });
  // 난간
  const posts = [];
  for (let i = 0; i <= 13; i++) {
    posts.push(<rect key={i} x={i * 124} y="690" width="10" height="150" fill="#0c0e12" />);
  }
  return (
    <g>
      <rect width="1600" height="900" fill="#06070b" />
      <ellipse cx="800" cy="640" rx="1000" ry="160" fill={rgba(accent, 0.06)} />
      {blds}
      {dots}
      {/* 멀리 경고등 */}
      <circle cx="1180" cy="430" r="60" fill="url(#glow-ch04)" />
      <circle cx="1180" cy="430" r="5" fill={rgba(accent, 0.95)} />
      {/* 바닥(옥상) */}
      <rect y="640" width="1600" height="260" fill="#080a0e" />
      {/* 난간 */}
      <rect x="0" y="690" width="1600" height="12" fill="#101216" />
      <rect x="0" y="760" width="1600" height="10" fill="#0d0f13" />
      {posts}
    </g>
  );
}
