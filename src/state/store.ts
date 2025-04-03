import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createLeetCodeSlice, LeetCodeSlice } from "./leetCodeSlice";
import { createSettingsSlice, SettingsSlice } from "./settingsSlice";

/**
 * We merge all slice interfaces into one type.
 * So the final store has all fields from AuthSlice, LeetCodeSlice, and SettingsSlice.
 */
export type AppState = LeetCodeSlice & SettingsSlice;

export const useAppStore = create<AppState>()(
  persist(
    // The "initializer" function merges slices:
    (set, get, api) => ({
      ...createLeetCodeSlice(set, get, api),
      ...createSettingsSlice(set, get, api),
    }),
    {
      name: "appStore",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        airtableApiKey: state.airtableApiKey,
        airtableBaseName: state.airtableBaseName,
      }),
    }
  )
);
