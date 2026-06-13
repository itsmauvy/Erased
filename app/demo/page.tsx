"use client";

import "./demo.css";
import { useState, useEffect } from "react";
import { GameState, Scene, initialState } from "@/components/demo/GameState";
import PhoneIntro from "@/components/demo/PhoneIntro";
import SceneClassroom from "@/components/demo/SceneClassroom";
import SceneBroadcast from "@/components/demo/SceneBroadcast";
import SceneRooftop from "@/components/demo/SceneRooftop";
import EndingTruth from "@/components/demo/EndingTruth";
import EndingSilence from "@/components/demo/EndingSilence";
import EndingErased from "@/components/demo/EndingErased";

export default function DemoPage() {
  const [scene, setScene] = useState<Scene>("intro");
  const [state, setState] = useState<GameState>(initialState);
  const [fading, setFading] = useState(false);

  // 씬 전환 (페이드)
  const advance = (updates: Partial<GameState>, next: Scene) => {
    setFading(true);
    setTimeout(() => {
      setState((prev) => {
        const merged = { ...prev };
        if (updates.trustMinseo !== undefined) merged.trustMinseo = prev.trustMinseo + updates.trustMinseo;
        if (updates.truthScore !== undefined)  merged.truthScore  = prev.truthScore  + updates.truthScore;
        if (updates.foundPhoto !== undefined)  merged.foundPhoto  = updates.foundPhoto;
        if (updates.playedRecording !== undefined) merged.playedRecording = updates.playedRecording;
        if (updates.foundPhone !== undefined)  merged.foundPhone  = updates.foundPhone;
        if (updates.finalChoice !== undefined) merged.finalChoice = updates.finalChoice;
        return merged;
      });
      setScene(next);
      setFading(false);
    }, 500);
  };

  const restart = () => {
    setFading(true);
    setTimeout(() => {
      setState(initialState);
      setScene("intro");
      setFading(false);
    }, 500);
  };

  const goBack = () => {
    setFading(true);
    setTimeout(() => {
      if (scene === "classroom") setScene("intro");
      else if (scene === "broadcast") setScene("classroom");
      else if (scene === "rooftop") setScene("broadcast");
      setFading(false);
    }, 500);
  };

  const canGoBack = scene === "classroom" || scene === "broadcast" || scene === "rooftop";

  return (
    <div style={{ opacity: fading ? 0 : 1, transition: "opacity 0.5s ease" }}>
      {/* 뒤로가기 버튼 */}
      {canGoBack && (
        <button onClick={goBack} style={{
          position: "fixed", top: 24, left: 24, zIndex: 100,
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.68rem", letterSpacing: "0.2em", color: "var(--ink-faint)",
          background: "rgba(3,4,7,0.7)", border: "1px solid rgba(232,230,223,0.15)",
          padding: "8px 16px", cursor: "pointer",
        }}>
          ← 뒤로
        </button>
      )}
      {scene === "intro" && (
        <PhoneIntro onAdvance={(u) => advance(u, "classroom")} />
      )}
      {scene === "classroom" && (
        <SceneClassroom onAdvance={(u) => advance(u, "broadcast")} />
      )}
      {scene === "broadcast" && (
        <SceneBroadcast onAdvance={(u) => advance(u, "rooftop")} />
      )}
      {scene === "rooftop" && (
        <SceneRooftop state={state} onAdvance={advance} />
      )}
      {scene === "ending-truth" && <EndingTruth onRestart={restart} />}
      {scene === "ending-silence" && <EndingSilence onRestart={restart} />}
      {scene === "ending-erased" && <EndingErased onRestart={restart} />}
    </div>
  );
}
