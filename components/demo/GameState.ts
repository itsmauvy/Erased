export type Scene =
  | "intro"
  | "classroom"
  | "broadcast"
  | "rooftop"
  | "ending-truth"
  | "ending-silence"
  | "ending-erased";

export type GameState = {
  trustMinseo: number;
  truthScore: number;
  foundPhoto: boolean;
  playedRecording: boolean;
  foundPhone: boolean;
  finalChoice: "truth" | "silence" | null;
};

export const initialState: GameState = {
  trustMinseo: 0,
  truthScore: 0,
  foundPhoto: false,
  playedRecording: false,
  foundPhone: false,
  finalChoice: null,
};

export function calcEnding(
  s: GameState
): "ending-erased" | "ending-truth" | "ending-silence" {
  if (
    s.finalChoice === "truth" &&
    s.trustMinseo >= 1 &&
    s.truthScore >= 2
  )
    return "ending-erased";
  if (s.finalChoice === "truth") return "ending-truth";
  return "ending-silence";
}
