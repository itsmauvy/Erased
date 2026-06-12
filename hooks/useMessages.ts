"use client";

import { create } from "zustand";

export interface IncomingMessage {
  id: number;
  sender: string;
  text: string;
}

interface MessageState {
  list: IncomingMessage[];
  _seq: number;
  push: (sender: string, text: string) => void;
  dismiss: (id: number) => void;
}

export const useMessages = create<MessageState>((set) => ({
  list: [],
  _seq: 0,
  push: (sender, text) =>
    set((s) => {
      const id = s._seq + 1;
      return { _seq: id, list: [...s.list, { id, sender, text }] };
    }),
  dismiss: (id) => set((s) => ({ list: s.list.filter((m) => m.id !== id) })),
}));
