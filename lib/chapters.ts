/**
 * 무대(STAGE) CONFIG — 「자정의 교실」 (야간 학교 실종 미스터리)
 *
 * 엔진(스크롤/오디오/단서 시스템)과 콘텐츠를 분리한 데이터 레이어.
 * 등대 버전과 동일한 인터페이스 — 이 파일만 갈아끼우면 무대가 바뀐다 (플랜 §3.6).
 */

export type ClueKind = "logbook" | "radio" | "calendar" | "photo" | "note";

export interface ClueData {
  id: string;
  label: string;
  kind: ClueKind;
  x: number;
  y: number;
  title: string;
  meta?: string;
  body: string[];
  /** 선택: 사진류 단서의 실제 이미지 (public/clues/..). 없으면 글자만. */
  image?: string;
  /** 선택: 이 단서를 조사하면 도착하는 의문의 메시지 */
  whisper?: string;
}

export interface ChapterData {
  id: string;
  index: string;
  place: string;
  title: string;
  lines: string[];
  accent: string;
  gradient: string;
  bg?: string;
  clues: ClueData[];
  /** 단서를 모두 모았을 때 터지는 사건 (발소리 + 메시지 + 다음 층 유도) */
  event?: {
    sender: string;
    lines: string[];
    /** 사건 후 다음 층으로 유도하는 문구 */
    cue: string;
  };
}

export interface StageConfig {
  /** 화면 좌상단/푸터 로고 텍스트 */
  siteTitle: string;
  /** 진입/종료 화면 강조색 */
  accent: string;
  /** 등대 전용 회전빛 (학교에선 false) */
  useBeam: boolean;
  /** 수직 상승 parallax 강도 (0~1) */
  ascent: number;
  prologue: {
    title: string;
    subtitle: string;
    lines: string[];
    signal: string;
    scrollHint: string;
  };
  chapters: ChapterData[];
  truth: {
    kicker: string;
    accent: string;
    lines: string[];
    cut: string;
  };
  play: {
    tagline: string;
    cta: string;
    footnote: string;
  };
}

export const STAGE: StageConfig = {
  siteTitle: "MIDNIGHT CLASS",
  accent: "#9bb3c9", // 차가운 달빛 블루
  useBeam: false,
  ascent: 0.85,

  prologue: {
    title: "자정의 교실",
    subtitle: "00:00 AM",
    lines: [
      "야간 자율학습이 끝난 밤.",
      "한 학생이 교실에서 사라졌다.",
      "출석부엔 이름이 있는데, 아무도 그날을 기억하지 못한다.",
    ],
    signal: "수신된 마지막 메시지 — “교실에 두고 온 게 있어. 같이 가줄래?”",
    scrollHint: "스크롤하여 학교로 들어선다",
  },

  chapters: [
    {
      id: "ch01",
      index: "01",
      place: "복도 · 신발장",
      title: "꺼지지 않은 불",
      lines: [
        "교문은 열려 있었다.",
        "모든 교실의 불은 꺼졌는데, 3층 한 칸만 켜져 있다.",
        "복도엔 그녀의 실내화 한 짝만 놓여 있었다.",
      ],
      accent: "#82b3a8", // 차가운 형광 청록
      gradient:
        "radial-gradient(120% 80% at 30% 20%, #0e1d1b 0%, #0a1212 45%, #07080b 100%)",
      bg: "/bg/ch01.jpg",
      clues: [
        {
          id: "ch01-shoe",
          label: "남겨진 실내화",
          kind: "note",
          x: 24,
          y: 60,
          title: "신발장 — 311번",
          meta: "한 짝만 남아 있다",
          body: [
            "311번 칸. 이름표는 손톱으로 긁어낸 듯 지워져 있다.",
            "실내화 한 짝은 복도에, 다른 한 짝은 끝내 찾지 못했다.",
            "마치 급히 어딘가로 끌려간 것처럼.",
          ],
          whisper: "한 짝은… 아직 여기 있어.",
        },
        {
          id: "ch01-board",
          label: "게시판의 단체사진",
          kind: "photo",
          x: 56,
          y: 40,
          title: "표창 게시판",
          meta: "작년 가을, 3학년 2반",
          body: [
            "웃고 있는 반 아이들. 그런데 맨 뒷줄 한 명의 얼굴만 검게 칠해져 있다.",
            "지워진 자리 아래 작은 글씨: “쟤는 원래 없었잖아.”",
          ],
          image: "/clues/ch01-board.jpg",
          whisper: "왜 자꾸 그 애를 찾아?",
        },
        {
          id: "ch01-roll",
          label: "출석부",
          kind: "calendar",
          x: 80,
          y: 66,
          title: "3학년 2반 출석부",
          meta: "그날 — 빈칸",
          body: [
            "그녀의 이름은 분명히 적혀 있다. 출석 표시도 매일 채워져 있다.",
            "단 하루, 그녀가 사라진 그날만 — 공란이다.",
            "그리고 그 공란을, 나중에 누군가 연필로 슬쩍 채워 넣었다.",
          ],
          whisper: "그날을 들추지 마.",
        },
      ],
      event: {
        sender: "알 수 없음",
        lines: ["복도 끝에서 발소리가 들린다.", "지금 거기서 나와."],
        cue: "계단을 오른다",
      },
    },
    {
      id: "ch02",
      index: "02",
      place: "교실",
      title: "빈 책상",
      lines: [
        "3층 끝 교실. 불은 그녀의 자리 위에서만 켜져 있었다.",
        "책상엔 펼쳐진 노트, 그리고 급히 지운 낙서.",
        "교실은 그날 그대로 멈춰 있었다.",
      ],
      accent: "#c9a96a", // 흐릿한 호박빛 (스탠드 조명)
      gradient:
        "radial-gradient(120% 80% at 65% 25%, #1a1407 0%, #0c0a07 50%, #07080b 100%)",
      bg: "/bg/ch02.jpg",
      clues: [
        {
          id: "ch02-desk",
          label: "책상 위 낙서",
          kind: "note",
          x: 28,
          y: 62,
          title: "그녀의 책상",
          meta: "지우개로 문질러 지운 흔적",
          body: [
            "연필 자국 위로 희미하게 남은 글씨.",
            "“들켰다. 걔네가 안다. 오늘은 집에 못 갈 것 같아.”",
            "마지막 줄은 손이 떨렸는지 알아볼 수 없다.",
          ],
        },
        {
          id: "ch02-note",
          label: "펼쳐진 노트",
          kind: "logbook",
          x: 58,
          y: 46,
          title: "노트 — 마지막 장",
          meta: "수업 필기 사이에 끼어 있던",
          body: [
            "필기 사이, 갑자기 다른 글씨체로 적힌 메모.",
            "“그날 옥상에서 본 걸 말하면 안 됐어.”",
            "“선생님도, 반장도 — 다들 못 본 척했어.”",
          ],
        },
        {
          id: "ch02-locker",
          label: "사물함 311",
          kind: "photo",
          x: 82,
          y: 68,
          title: "사물함 311",
          meta: "자물쇠가 부서져 있다",
          body: [
            "안에는 교과서 대신 사진 한 묶음. 전부 같은 장소 — 학교 옥상이다.",
            "그중 한 장만 뒤집혀 있고, 뒷면에 날짜와 시간이 적혀 있다.",
            "그녀가 사라진 바로 그날 밤.",
          ],
          image: "/clues/ch02-locker.jpg",
        },
      ],
    },
    {
      id: "ch03",
      index: "03",
      place: "특별실",
      title: "들리지 않은 말",
      lines: [
        "복도 끝 상담실. 문은 안에서 잠겨 있었다.",
        "녹취 파일 하나와, 부치지 못한 진술서가 남아 있었다.",
        "그녀는 누군가에게 도움을 청하려 했다.",
      ],
      accent: "#9a86c4", // 창백한 보라
      gradient:
        "radial-gradient(120% 80% at 40% 25%, #15102a 0%, #0d0b18 50%, #07080b 100%)",
      bg: "/bg/ch03.jpg",
      clues: [
        {
          id: "ch03-rec",
          label: "녹취된 상담",
          kind: "radio",
          x: 30,
          y: 58,
          title: "상담 녹취 — 03분 12초",
          meta: "마지막 면담일",
          body: [
            "…학생: 무서워서요. 제가 본 걸 말하면…",
            "…선생: 그건… 네가 잘못 본 거야. 알겠지?…",
            "…(침묵 11초)… 학생: …네. 잘못 봤어요.",
          ],
        },
        {
          id: "ch03-log",
          label: "상담 일지",
          kind: "note",
          x: 60,
          y: 44,
          title: "상담 일지",
          meta: "마지막 기록 이후 백지",
          body: [
            "“정서 불안. 피해망상 의심. 추가 상담 권고.”",
            "그러나 ‘추가 상담’ 칸은 영원히 비어 있다.",
            "그녀에게 다음 상담은 오지 않았다.",
          ],
        },
        {
          id: "ch03-letter",
          label: "부치지 못한 진술서",
          kind: "logbook",
          x: 82,
          y: 66,
          title: "진술서 (미제출)",
          meta: "서랍 깊숙이 접혀 있었다",
          body: [
            "누구라도 이걸 읽는다면.",
            "나는 거짓말을 한 게 아니다. 그날 옥상에서 분명히 봤다.",
            "그들이 무엇을 했는지. 그리고 — 누가 떨어졌는지.",
          ],
        },
      ],
    },
    {
      id: "ch04",
      index: "04",
      place: "옥상",
      title: "마지막 계단",
      lines: [
        "옥상으로 향하는 문은 잠겨 있어야 했다. 열려 있었다.",
        "난간 너머로 도시의 불빛이 멀었다.",
        "그리고 거기, 그녀가 남긴 것들이 있었다 —",
      ],
      accent: "#d65b5b", // 경고등 적색
      gradient:
        "radial-gradient(120% 90% at 50% 30%, #2a0c0c 0%, #160a0a 45%, #07080b 100%)",
      bg: "/bg/ch04.jpg",
      clues: [
        {
          id: "ch04-rail",
          label: "난간의 손글씨",
          kind: "note",
          x: 26,
          y: 54,
          title: "난간 페인트 위 손글씨",
          meta: "비에 번진 채로",
          body: [
            "차가운 금속 난간에 매니큐어로 눌러쓴 글자.",
            "“여기서 다 봤어. 나도 여기서 사라질 거야.”",
            "끝의 한 글자는 누군가 일부러 문질러 지웠다.",
          ],
        },
        {
          id: "ch04-final",
          label: "마지막 음성 메모",
          kind: "logbook",
          x: 58,
          y: 64,
          title: "휴대폰 — 마지막 음성 메모",
          meta: "23:58 · 14초",
          body: [
            "“지금 옥상이야. 뒤에 누가 올라오고 있어.”",
            "“■■■■■ (소거됨) ■■■■■”",
            "“…아, 너였구나.”",
          ],
        },
        {
          id: "ch04-photo",
          label: "마지막 사진",
          kind: "photo",
          x: 80,
          y: 44,
          title: "휴대폰 — 마지막 촬영",
          meta: "플래시가 터진 한 장",
          body: [
            "어둠 속, 플래시에 반사된 두 사람의 그림자.",
            "한 명은 그녀. 다른 한 명의 얼굴은 — 빛 때문에 하얗게 날아갔다.",
            "사진은 거기서 끝난다.",
          ],
          image: "/clues/ch04-photo.jpg",
        },
      ],
    },
  ],

  truth: {
    kicker: "TRUTH",
    accent: "#d65b5b",
    lines: [
      "그녀는 도망친 게 아니었다.",
      "그날, 교실엔 그녀 혼자가 아니었다.",
      "그리고 모두가 — 그것을 잊기로 했다.",
    ],
    cut: "그녀가 마지막으로 본 얼굴은 —",
  },

  play: {
    tagline: "The story continues.",
    cta: "PLAY GAME",
    footnote: "교실은 아직 그날을 기억한다.",
  },
};
