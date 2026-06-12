# 자정의 교실 — The Last Light

스크롤하며 사건을 직접 조사하는 **인터랙티브 프롤로그** 웹사이트.
일반적인 게임 소개 사이트가 아니라, **사이트 자체가 게임의 0번째 챕터**가 되어
방문자가 단서를 추적하다 진실 직전에서 멈추고 *PLAY GAME* 으로 이어지도록 설계했다.

> 야간 자율학습이 끝난 밤, 한 학생이 교실에서 사라졌다.
> 당신은 밤의 학교에 들어가 그날의 흔적을 따라간다.

UX/UI 포트폴리오 프로젝트.

## 경험 흐름

`Prologue → 복도 → 교실 → 특별실 → 옥상 → Truth → Play`

- 🔦 **손전등 커서** — 어두운 학교를 커서로 비추며 탐험
- 🔎 **단서 조사** — 단서를 클릭하면 사운드 + 의문의 메시지가 도착하고, 모두 모으면 사건이 트리거됨
- 🎞️ **살아있는 화면** — 마우스 패럴럭스 + 켄번스, 폭풍 비/그레인
- 🧩 **엔진/무대 분리** — `lib/chapters.ts` 의 config 한 벌만 교체하면 무대(스토리)를 통째로 바꿀 수 있음

## 기술 스택

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS v4)
- [GSAP](https://gsap.com) + ScrollTrigger — 스크롤 연출
- [Lenis](https://lenis.darkroom.engineering) — 부드러운 스크롤
- [Howler.js](https://howlerjs.com) — 오디오 / Web Audio 합성 효과음
- [Zustand](https://github.com/pmndrs/zustand) — 상태 관리

## 개발

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

배경 이미지는 `public/bg/` (16:9), 사진 단서는 `public/clues/` (1:1) 에 넣는다.
파일이 없으면 코드로 그린 배경/텍스트로 자동 폴백된다.

---

🤖 일부 구현은 [Claude Code](https://claude.com/claude-code) 와 함께 작업했습니다.
