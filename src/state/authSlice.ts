import { StateCreator } from "zustand";
import { User } from "@supabase/supabase-js";
import Supabase from "./supabase";

export interface AuthSlice {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const supabaseSingleton = new Supabase();

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    try {
      const { data, error } = await supabaseSingleton.signInWithPassword(
        email,
        password
      );
      console.log({ data });

      if (error) throw error;
      set({ user: data.user });
    } catch (err) {
      console.error(err);
      throw err; // let caller handle
    }
  },

  signUp: async (email, password) => {
    try {
      const { data, error } = await supabaseSingleton.signUpWithPassword(
        email,
        password
      );
      console.log({ data, error });

      if (error) throw error;
      set({ user: data.user });
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  logout: async () => {
    try {
      await supabaseSingleton.signOut();
      set({ user: null });
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
});
