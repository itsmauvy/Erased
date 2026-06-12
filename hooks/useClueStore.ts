"use client";

import { create } from "zustand";

interface ClueState {
  /** 발견한 단서 id 집합 */
  found: Set<string>;
  /** 현재 열려 있는 단서 id (오버레이) */
  openClue: string | null;
  /** 전체 단서 수 (config에서 1회 주입) */
  total: number;
  setTotal: (n: number) => void;
  discover: (id: string) => void;
  open: (id: string) => void;
  close: () => void;
}

export const useClueStore = create<ClueState>((set) => ({
  found: new Set<string>(),
  openClue: null,
  total: 0,
  setTotal: (n) => set({ total: n }),
  discover: (id) =>
    set((s) => {
      if (s.found.has(id)) return { openClue: id };
      const next = new Set(s.found);
      next.add(id);
      return { found: next, openClue: id };
    }),
  open: (id) => set({ openClue: id }),
  close: () => set({ openClue: null }),
}));
