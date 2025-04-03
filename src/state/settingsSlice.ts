import { StateCreator } from "zustand";

export interface SettingsSlice {
  airtableApiKey: string;
  airtableBaseName: string;
  setAirtableApiKey: (key: string) => void;
  setAirtableBaseName: (name: string) => void;
}

export const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  airtableApiKey: import.meta.env.VITE_AIRTABLE_API_KEY ?? "",
  airtableBaseName: import.meta.env.VITE_AIRTABLE_BASE_ID ?? "",
  setAirtableApiKey: (key) => set({ airtableApiKey: key }),
  setAirtableBaseName: (name) => set({ airtableBaseName: name }),
});
