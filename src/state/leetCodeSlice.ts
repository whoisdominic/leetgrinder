import { StateCreator } from "zustand";

export interface LeetCodeSlice {
  isLeetCode: boolean;
  isLeetCodeProblem: boolean;
  activeProblem: string | null;
  setIsLeetCode: (isLeetCode: boolean) => void;
  setIsLeetCodeProblem: (isLeetCodeProblem: boolean) => void;
  setActiveProblem: (activeProblem: string | null) => void;
}

export const createLeetCodeSlice: StateCreator<LeetCodeSlice> = (set) => ({
  isLeetCode: false,
  isLeetCodeProblem: false,
  activeProblem: null,

  setIsLeetCode: (isLeetCode) => set({ isLeetCode }),
  setIsLeetCodeProblem: (isLeetCodeProblem) => set({ isLeetCodeProblem }),
  setActiveProblem: (activeProblem) => set({ activeProblem }),
});
