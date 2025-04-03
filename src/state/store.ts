import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createAuthSlice, AuthSlice } from "./authSlice";
import { createLeetCodeSlice, LeetCodeSlice } from "./leetCodeSlice";
import { createProblemSlice, ProblemSlice } from "./problemSlice";
import { createSettingsSlice, SettingsSlice } from "./settingsSlice";

/**
 * We merge all slice interfaces into one type.
 * So the final store has all fields from AuthSlice, LeetCodeSlice, ProblemSlice, and SettingsSlice.
 */
export type AppState = AuthSlice & LeetCodeSlice & ProblemSlice & SettingsSlice;

export const useAppStore = create<AppState>()(
  persist(
    // The "initializer" function merges slices:
    (set, get, api) => ({
      ...createAuthSlice(set, get, api),
      ...createLeetCodeSlice(set, get, api),
      ...createProblemSlice(set, get, api),
      ...createSettingsSlice(set, get, api),
    }),
    {
      name: "appStore",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        problems: state.problems,
        problemLists: state.problemLists,
        airtableApiKey: state.airtableApiKey,
        airtableBaseName: state.airtableBaseName,
      }),
    }
  )
);
