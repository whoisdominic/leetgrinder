import { StateCreator } from "zustand";
import { LeetCodeProblem, Problem } from "./supabase";
import Supabase from "./supabase";

// If you prefer a record-based approach:
export type ProblemsById = Record<string, LeetCodeProblem>;

// This is the "name" of the list mapped to an array of problem IDs.
export type ProblemListsByName = Record<
  string,
  {
    name: string;
    problems: string[];
  }
>;

export interface ProblemSlice {
  problems: ProblemsById;
  setProblems: (problems: ProblemsById) => void;

  problemLists: ProblemListsByName;
  setProblemLists: (problemLists: ProblemListsByName) => void;

  // Add new method for adding base problems
  addBaseProblem: (problem: Omit<Problem, "id">) => Promise<Problem>;

  // Potentially add more synchronous or async methods
  // for CRUD with Supabase if you want in this slice
  addProblemToList: (problemId: string, listId: string) => void;
  removeProblemFromList: (problemId: string, listId: string) => void;
  deleteProblemList: (listId: string) => void;
  createProblemList: (listId: string, listName: string) => void;
  updateProblemList: (listId: string, listName: string) => void;
  deleteProblem: (problemId: string) => void;
  updateProblem: (problemId: string, problem: LeetCodeProblem) => void;
}

export const createProblemSlice: StateCreator<ProblemSlice> = (set, get) => ({
  problems: {},
  setProblems: (problems) => set({ problems }),

  problemLists: {},
  setProblemLists: (problemLists) => set({ problemLists }),

  addBaseProblem: async (problem) => {
    const supabase = new Supabase();
    const newProblem = await supabase.addProblem(problem);
    return newProblem;
  },

  addProblemToList: (problemId, listId) =>
    set((state) => ({
      problemLists: {
        ...state.problemLists,
        [listId]: {
          ...state.problemLists[listId],
          problems: [
            ...(state.problemLists[listId]?.problems || []),
            problemId,
          ],
        },
      },
    })),

  removeProblemFromList: (problemId, listId) =>
    set((state) => ({
      problemLists: {
        ...state.problemLists,
        [listId]: {
          ...state.problemLists[listId],
          problems:
            state.problemLists[listId]?.problems.filter(
              (id) => id !== problemId
            ) || [],
        },
      },
    })),

  deleteProblemList: (listId) =>
    set((state) => ({
      problemLists: Object.fromEntries(
        Object.entries(state.problemLists).filter(([key]) => key !== listId)
      ),
    })),

  createProblemList: (listId, listName) =>
    set((state) => ({
      problemLists: {
        ...state.problemLists,
        [listId]: {
          name: listName,
          problems: [],
        },
      },
    })),

  updateProblemList: (listId, listName) =>
    set((state) => ({
      problemLists: {
        ...state.problemLists,
        [listId]: {
          ...state.problemLists[listId],
          name: listName,
        },
      },
    })),

  deleteProblem: (problemId) =>
    set((state) => ({
      problems: Object.fromEntries(
        Object.entries(state.problems).filter(([key]) => key !== problemId)
      ),
    })),

  updateProblem: (problemId, problem) =>
    set((state) => ({
      problems: {
        ...state.problems,
        [problemId]: problem,
      },
    })),
});
