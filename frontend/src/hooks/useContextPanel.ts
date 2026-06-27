"use client";

import { create } from "zustand";

export type SelectionKind =
  | "issue"
  | "mission"
  | "department"
  | "agent"
  | "prediction"
  | null;

interface ContextPanelState {
  kind: SelectionKind;
  id: string | null;
  select: (kind: Exclude<SelectionKind, null>, id: string) => void;
  clear: () => void;
}

/**
 * One panel, infinite possibilities. The right context panel reads from this
 * store and renders intelligence for whatever the user last selected.
 */
export const useContextPanel = create<ContextPanelState>((set) => ({
  kind: null,
  id: null,
  select: (kind, id) => set({ kind, id }),
  clear: () => set({ kind: null, id: null }),
}));
