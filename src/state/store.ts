import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createAuthSlice, AuthSlice } from "./authSlice";
import { createLeetCodeSlice, LeetCodeSlice } from "./leetCodeSlice";
import { createProblemSlice, ProblemSlice } from "./problemSlice";

/**
 * We merge all slice interfaces into one type.
 * So the final store has all fields from AuthSlice, LeetCodeSlice, and ProblemSlice.
 */
export type AppState = AuthSlice & LeetCodeSlice & ProblemSlice;

export const useAppStore = create<AppState>()(
  persist(
    // The "initializer" function merges slices:
    (set, get, api) => ({
      ...createAuthSlice(set, get, api),
      ...createLeetCodeSlice(set, get, api),
      ...createProblemSlice(set, get, api),
    }),
    {
      name: "appStore",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        problems: state.problems,
        problemLists: state.problemLists,
      }),
    }
  )
);
