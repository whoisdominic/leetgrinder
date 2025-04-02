import Airtable from "airtable";
import { format } from "date-fns";

type SelectedType = "weakest" | "drill" | "random";

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export type Comfort = 0 | 1 | 2 | 3 | 4 | 5;

export type ProblemType =
  | "Stack"
  | "Binary Search"
  | "Dynamic"
  | "Math & Geo"
  | "Dynamic 1-D"
  | "Linked List"
  | "Graphs"
  | "Heap/Priority Queue"
  | "Backtracking"
  | "Intervals"
  | "Greedy"
  | "Bit Manipulation"
  | "Trees"
  | "Two Pointer"
  | "Sliding Window"
  | "Dynamic 2-D"
  | "Arrays & Hashing"
  | "Advanced Graphs"
  | "Trie"
  | "Simulation";

export interface AirtableProblem {
  id: string;
  Name: string;
  Difficulty: Difficulty;
  Comfort: Comfort;
  "Problem Link": string;
  type: ProblemType[];
  "Problem Sets": string[];
  "Last drilled": string;
}

class AirtableService {
  private baseId: string;
  private apiKey: string;
  private base: Airtable.Base;
  private problemSetsCache: Map<string, string> = new Map();

  constructor() {
    this.baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
    this.apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
    this.base = new Airtable({ apiKey: this.apiKey }).base(this.baseId);
  }

  private async loadProblemSets() {
    if (this.problemSetsCache.size > 0) return;

    try {
      const records = await this.base("Problem Sets").select().all();
      records.forEach((record) => {
        this.problemSetsCache.set(record.id, record.get("Name") as string);
      });
    } catch (error) {
      console.error("Error loading problem sets:", error);
      throw error;
    }
  }

  private resolveProblemSetNames(
    problemSetIds: string[] | undefined | null
  ): string[] {
    if (!problemSetIds) return [];
    return problemSetIds.map((id) => this.problemSetsCache.get(id) || id);
  }
  private problemsCache: Map<string, AirtableProblem> = new Map();
  private lastProblemsFetchTime: number = 0;
  private readonly CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache TTL

  async getAllProblems(forceRefresh = false): Promise<AirtableProblem[]> {
    try {
      await this.loadProblemSets();

      const now = Date.now();
      const shouldRefreshCache =
        forceRefresh ||
        this.problemsCache.size === 0 ||
        now - this.lastProblemsFetchTime > this.CACHE_TTL;

      if (shouldRefreshCache) {
        const records = await this.base("All Problems").select().all();
        this.problemsCache.clear();

        records.forEach((record) => {
          const problemSetIds = record.get("Problem Sets") as string[];
          const problem: AirtableProblem = {
            id: record.id,
            Name: record.get("Name") as string,
            Difficulty: record.get("Difficulty") as Difficulty,
            Comfort: record.get("Comfort") as Comfort,
            "Problem Link": record.get("Problem Link") as string,
            type: record.get("type") as ProblemType[],
            "Problem Sets": this.resolveProblemSetNames(problemSetIds),
            "Last drilled": record.get("Last drilled") as string,
          };
          this.problemsCache.set(problem.Name, problem);
        });

        this.lastProblemsFetchTime = now;
      }

      return Array.from(this.problemsCache.values());
    } catch (error) {
      console.error("Error fetching problems:", error);
      throw error;
    }
  }

  hasProblem(name: string): boolean {
    return this.problemsCache.has(name);
  }

  async updateComfort(problemId: string, comfort: Comfort) {
    try {
      const today = new Date();
      const localDate = format(today, "yyyy-MM-dd");

      await this.base("All Problems").update(problemId, {
        Comfort: comfort,
        "Last drilled": localDate,
      });
    } catch (error) {
      console.error("Error updating comfort:", error);
      throw error;
    }
  }

  async updateProblem(problemId: string, updatedProblem: AirtableProblem) {
    try {
      await this.base("All Problems").update(problemId, {
        ...updatedProblem,
      });
    } catch (error) {
      console.error("Error updating problem:", error);
      throw error;
    }
  }

  async getProblemByName(name: string): Promise<AirtableProblem | null> {
    console.log("getProblemByName", name);
    try {
      await this.loadProblemSets();

      const records = await this.base("All Problems")
        .select({
          filterByFormula: `{Name} = '${name}'`,
        })
        .all();

      if (records.length === 0) {
        return null;
      }

      const problemSetIds = records[0].get("Problem Sets") as string[];

      return {
        id: records[0].id,
        Name: records[0].get("Name") as string,
        Difficulty: records[0].get("Difficulty") as Difficulty,
        Comfort: records[0].get("Comfort") as Comfort,
        "Problem Link": records[0].get("Problem Link") as string,
        type: (records[0].get("type") as ProblemType[]) || [],
        "Problem Sets": this.resolveProblemSetNames(problemSetIds),
        "Last drilled": records[0].get("Last drilled") as string,
      };
    } catch (error) {
      console.error("Error fetching problem by name:", error);
      throw error;
    }
  }

  async addProblemToAirtable(
    problem: Omit<AirtableProblem, "id" | "Last drilled">
  ) {
    try {
      // Check if the problem already exists
      const existingProblem = await this.getProblemByName(problem.Name);

      if (existingProblem) {
        console.log(`Problem "${problem.Name}" already exists in Airtable`);
        return existingProblem;
      }

      // If problem doesn't exist, create it
      const createdRecord = await this.base("All Problems").create({
        ...problem,
      });

      return {
        ...problem,
        id: createdRecord.id,
      };
    } catch (error) {
      console.error("Error adding problem to airtable:", error);
      throw error;
    }
  }

  async getRandomWeakProblem(weakness: Comfort): Promise<AirtableProblem> {
    try {
      const problems = await this.getAllProblems();
      const weakProblems = problems.filter(
        (problem) => problem.Comfort === weakness
      );

      // Separate problems into never drilled and previously drilled
      const neverDrilledProblems = weakProblems.filter(
        (problem) => !problem["Last drilled"]
      );
      const drilledProblems = weakProblems.filter(
        (problem) => problem["Last drilled"]
      );

      // Sort drilled problems by last drilled date (oldest first)
      const sortedDrilledProblems = drilledProblems.sort((a, b) => {
        return (
          new Date(a["Last drilled"]).getTime() -
          new Date(b["Last drilled"]).getTime()
        );
      });

      if (neverDrilledProblems.length > 0) {
        // Pick a random problem from never drilled problems
        const randomIndex = Math.floor(
          Math.random() * neverDrilledProblems.length
        );
        return neverDrilledProblems[randomIndex];
      } else if (sortedDrilledProblems.length > 0) {
        // Return the oldest drilled problem
        return sortedDrilledProblems[0];
      }

      throw new Error(`No problems found with comfort level ${weakness}`);
    } catch (error) {
      console.error("Error fetching random weak problem:", error);
      throw error;
    }
  }

  async getRandomProblemByType(
    type: ProblemType,
    selectedType: SelectedType
  ): Promise<AirtableProblem> {
    try {
      const problems = await this.getAllProblems();
      let filteredProblems = problems.filter(
        (problem) => problem.type?.includes(type) ?? false
      );

      // Further filter based on selectedType
      if (selectedType === "drill") {
        filteredProblems = filteredProblems.filter(
          (problem) => problem.Comfort === 3
        );
      } else if (selectedType === "weakest") {
        filteredProblems = filteredProblems.filter(
          (problem) => problem.Comfort <= 2
        );
      } else if (selectedType === "random") {
        filteredProblems = filteredProblems.filter(
          (problem) => problem.Comfort >= 1
        );
      }

      if (filteredProblems.length === 0) {
        throw new Error(
          `No problems found with type ${type} and selected criteria ${selectedType}`
        );
      }

      const randomIndex = Math.floor(Math.random() * filteredProblems.length);
      return filteredProblems[randomIndex];
    } catch (error) {
      console.error("Error fetching random problem by type:", error);
      throw error;
    }
  }
}

export const airtableService = new AirtableService();

export default airtableService;
