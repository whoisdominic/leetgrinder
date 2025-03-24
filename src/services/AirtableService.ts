import Airtable from "airtable";

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
      await this.base("All Problems").update(problemId, {
        Comfort: comfort,
        "Last drilled": new Date().toISOString().split("T")[0],
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

  async addProblemToAirtable(problem: Omit<AirtableProblem, "id">) {
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
}

export const airtableService = new AirtableService();

export default airtableService;
