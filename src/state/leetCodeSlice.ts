import { StateCreator } from "zustand";
import { Difficulty } from "../services";

export interface LeetCodeSlice {
  isLeetCode: boolean;
  isLeetCodeProblem: boolean;
  activeProblem: string | null;
  activeProblemDifficulty: Difficulty | null;
  activeProblemType: string[];
  setIsLeetCode: (isLeetCode: boolean) => void;
  setIsLeetCodeProblem: (isLeetCodeProblem: boolean) => void;
  setActiveProblem: (activeProblem: string | null) => void;
  setActiveProblemDifficulty: (
    activeProblemDifficulty: Difficulty | null
  ) => void;
  setActiveProblemType: (activeProblemType: string[]) => void;
}

export const createLeetCodeSlice: StateCreator<LeetCodeSlice> = (set) => ({
  isLeetCode: false,
  isLeetCodeProblem: false,
  activeProblem: null,
  activeProblemDifficulty: null,
  activeProblemType: [],
  setIsLeetCode: (isLeetCode) => set({ isLeetCode }),
  setIsLeetCodeProblem: (isLeetCodeProblem) => set({ isLeetCodeProblem }),
  setActiveProblem: (activeProblem) => set({ activeProblem }),
  setActiveProblemDifficulty: (activeProblemDifficulty) =>
    set({ activeProblemDifficulty }),
  setActiveProblemType: (activeProblemType) => set({ activeProblemType }),
});
