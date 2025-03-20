import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY ?? "";

// Base problem (public info)
export interface Problem {
  id: string;
  name: string;
  leet_url: string;
  difficulty: "easy" | "medium" | "hard";
}

// User-specific problem data
export interface LeetCodeProblem extends Problem {
  best_time: string;
  problem_type: string;
  notes: string;
  last_solved: string;
  comfort: 0 | 1 | 2 | 3 | 4 | 5;
  status: "not started" | "in progress" | "completed";
}

// A user's named list of problems
export interface ProblemList {
  id: string;
  name: string;
  problems: LeetCodeProblem[];
}

class Supabase {
  supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // ---------------------------------------------------------------------------
  // Auth
  // ---------------------------------------------------------------------------

  async isSignedIn(): Promise<boolean> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();
    return session !== null;
  }

  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  async signInWithPassword(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signUpWithPassword(email: string, password: string) {
    return await this.supabase.auth.signUp({
      email,
      password,
    });
  }
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  // ---------------------------------------------------------------------------
  // 1. USER PROBLEMS (Retrieving your personal "LeetCodeProblem" rows)
  // ---------------------------------------------------------------------------
  /**
   * Fetch all the user_problems for the logged-in user,
   * joined with the base `problems` table. Returns data shaped
   * like the `LeetCodeProblem` interface.
   */
  async getUserProblems(): Promise<LeetCodeProblem[]> {
    const user = await this.getUser();
    if (!user) throw new Error("No user authenticated.");

    const { data, error } = await this.supabase
      .from("user_problems")
      .select(
        `
        id,
        best_time,
        problem_type,
        notes,
        last_solved,
        comfort,
        status,
        problem_id,
        problems (
          id,
          name,
          leet_url,
          difficulty
        )
      `
      )
      .eq("user_id", user.id);

    if (error) throw error;

    /**
     * We need to merge the user_problems fields with
     * the base "problems" fields so it looks like a
     * LeetCodeProblem to the caller.
     */
    return (data ?? []).map((row: any) => {
      const base = row.problems;
      const leetProblem: LeetCodeProblem = {
        id: base.id,
        name: base.name,
        leet_url: base.leet_url,
        difficulty: base.difficulty,
        best_time: row.best_time,
        problem_type: row.problem_type,
        notes: row.notes,
        last_solved: row.last_solved,
        comfort: row.comfort,
        status: row.status,
      };
      return leetProblem;
    });
  }

  // ---------------------------------------------------------------------------
  // 2. BASE PROBLEMS (CRUD on the publicly available "problems" table)
  //
  //    Note: You might restrict who can update/delete base problems
  //    via RLS or an admin check. The code below just demonstrates
  //    the possible calls.
  // ---------------------------------------------------------------------------

  /**
   * Add a new base problem to the `problems` table.
   * If your RLS policy prevents users from adding or
   * you want an upsert, adapt as needed.
   */
  async addProblem(problem: Omit<Problem, "id">): Promise<Problem> {
    const { data, error } = await this.supabase
      .from("problems")
      .insert([
        {
          name: problem.name,
          leet_url: problem.leet_url,
          difficulty: problem.difficulty,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update an existing base problem in the `problems` table.
   * This might fail if your RLS forbids it.
   */
  async updateProblem(problem: Problem): Promise<Problem> {
    const { data, error } = await this.supabase
      .from("problems")
      .update({
        name: problem.name,
        leet_url: problem.leet_url,
        difficulty: problem.difficulty,
      })
      .eq("id", problem.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete a base problem from the `problems` table.
   * This might fail if RLS forbids it.
   */
  async deleteProblem(problem: Problem): Promise<Problem> {
    const { data, error } = await this.supabase
      .from("problems")
      .delete()
      .eq("id", problem.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ---------------------------------------------------------------------------
  // 3. PROBLEM LISTS (the user's named lists)
  // ---------------------------------------------------------------------------
  /**
   * Fetch all the user's problem lists, including the "LeetCodeProblem" data
   * for each problem in the list (joined all the way through to base `problems`).
   */
  async getUserProblemLists(): Promise<ProblemList[]> {
    const user = await this.getUser();
    if (!user) throw new Error("No user authenticated.");

    const { data, error } = await this.supabase
      .from("problem_lists")
      .select(
        `
        id,
        name,
        problem_list_user_problems (
          id,
          user_problem_id (
            id,
            best_time,
            problem_type,
            notes,
            last_solved,
            comfort,
            status,
            problem_id,
            problems (
              id,
              name,
              leet_url,
              difficulty
            )
          )
        )
      `
      )
      .eq("user_id", user.id);

    if (error) throw error;

    if (!data) return [];

    // Transform the nested join into a ProblemList shape
    return data.map((list: any) => {
      const problems = list.problem_list_user_problems.map((pivot: any) => {
        const up = pivot.user_problem_id;
        const base = up?.problems;
        const leetProblem: LeetCodeProblem = {
          id: base.id,
          name: base.name,
          leet_url: base.leet_url,
          difficulty: base.difficulty,
          best_time: up.best_time,
          problem_type: up.problem_type,
          notes: up.notes,
          last_solved: up.last_solved,
          comfort: up.comfort,
          status: up.status,
        };
        return leetProblem;
      });

      const result: ProblemList = {
        id: list.id,
        name: list.name,
        problems,
      };
      return result;
    });
  }

  /**
   * Add a user-specific problem to a specific list.
   * Steps:
   * 1) Ensure the user_problems row exists for (user_id, problem_id).
   * 2) Insert a row in problem_list_user_problems referencing that user_problem.
   *
   * Here, `list` is assumed to be the ProblemList ID. (You can adapt as needed.)
   */
  async addProblemToList(problem: Problem, listId: string) {
    const user = await this.getUser();
    if (!user) throw new Error("No user authenticated.");

    // 1) Find or create user_problems row
    //    (We only store user-specific data if it doesn't exist.)
    //    If you need to store more fields (e.g. best_time), adapt this.
    let { data: existingRows, error: findErr } = await this.supabase
      .from("user_problems")
      .select("*")
      .eq("user_id", user.id)
      .eq("problem_id", problem.id)
      .limit(1);

    if (findErr) throw findErr;

    let userProblem;
    if (existingRows && existingRows.length > 0) {
      userProblem = existingRows[0];
    } else {
      // Insert a new row
      const { data: insertData, error: insertErr } = await this.supabase
        .from("user_problems")
        .insert([{ user_id: user.id, problem_id: problem.id }])
        .select()
        .single();
      if (insertErr) throw insertErr;
      userProblem = insertData;
    }

    // 2) Insert pivot row (problem_list_user_problems)
    const { error: pivotErr } = await this.supabase
      .from("problem_list_user_problems")
      .insert([
        {
          problem_list_id: listId,
          user_problem_id: userProblem.id,
        },
      ]);

    if (pivotErr) throw pivotErr;

    return true;
  }

  /**
   * Remove a user-specific problem from a list (but do NOT delete the user_problem row).
   * We just delete the pivot row in `problem_list_user_problems`.
   */
  async removeProblemFromList(problem: Problem, listId: string) {
    const user = await this.getUser();
    if (!user) throw new Error("No user authenticated.");

    // Find the user_problem row for this user & problem
    const { data: existingRows, error: findErr } = await this.supabase
      .from("user_problems")
      .select("id")
      .eq("user_id", user.id)
      .eq("problem_id", problem.id)
      .limit(1);

    if (findErr) throw findErr;
    if (!existingRows || existingRows.length === 0) {
      // Nothing to remove
      return true;
    }
    const userProblem = existingRows[0];

    // Delete pivot row
    const { error: deleteErr } = await this.supabase
      .from("problem_list_user_problems")
      .delete()
      .eq("problem_list_id", listId)
      .eq("user_problem_id", userProblem.id);

    if (deleteErr) throw deleteErr;

    return true;
  }

  /**
   * Delete an entire ProblemList (and automatically
   * all pivot rows referencing it). The user_problems
   * remain, though, so they can appear in other lists.
   */
  async deleteProblemList(listId: string) {
    const { error } = await this.supabase
      .from("problem_lists")
      .delete()
      .eq("id", listId);

    if (error) throw error;
    return true;
  }
}

export default Supabase;
