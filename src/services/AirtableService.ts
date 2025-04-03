import Airtable from "airtable";
import { format } from "date-fns";
import { useAppStore } from "../state";

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
  Icebox: "true" | "false";
}

class AirtableService {
  private baseId: string;
  private apiKey: string;
  private base: Airtable.Base | null = null;
  private problemSetsCache: Map<string, string> = new Map();

  constructor(apiKey: string = "", baseId: string = "") {
    const { airtableApiKey, airtableBaseName } = useAppStore.getState();
    this.apiKey = apiKey || airtableApiKey;
    this.baseId = baseId || airtableBaseName;
    if (this.canMakeRequests) {
      this.initializeBase();
    }
    console.log("AirtableService constructor", this.apiKey, this.baseId);
  }

  private initializeBase() {
    this.base = new Airtable({ apiKey: this.apiKey }).base(this.baseId);
  }

  private get canMakeRequests(): boolean {
    return !!this.apiKey && !!this.baseId;
  }

  private getBase(): Airtable.Base {
    if (!this.canMakeRequests) {
      throw new Error(
        "Airtable credentials not set. Please set API key and base ID first."
      );
    }
    if (!this.base) {
      this.initializeBase();
    }
    return this.base!;
  }

  updateCredentials(apiKey: string, baseId: string) {
    this.apiKey = apiKey;
    this.baseId = baseId;
    if (this.canMakeRequests) {
      this.initializeBase();
    }
    // Clear caches when credentials change
    this.problemSetsCache.clear();
    this.problemsCache.clear();
    this.lastProblemsFetchTime = 0;
  }

  private async loadProblemSets() {
    if (this.problemSetsCache.size > 0) return;

    try {
      const records = await this.getBase()("Problem Sets").select().all();
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
        const records = await this.getBase()("All Problems").select().all();
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
            Icebox: record.get("Icebox") as "true" | "false",
          };
          console.log("Icebox", record.get("Icebox"));

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

      await this.getBase()("All Problems").update(problemId, {
        Comfort: comfort,
        "Last drilled": localDate,
      });
    } catch (error) {
      console.error("Error updating comfort:", error);
      throw error;
    }
  }

  async updateIcebox(problemId: string, icebox: "true" | "false") {
    try {
      await this.getBase()("All Problems").update(problemId, {
        Icebox: icebox,
      });
    } catch (error) {
      console.error("Error updating icebox:", error);
      throw error;
    }
  }

  async updateProblem(problemId: string, updatedProblem: AirtableProblem) {
    try {
      if (!this.canMakeRequests) {
        console.error(
          "Airtable credentials not set. Please set API key and base ID first."
        );
        return;
      }
      await this.getBase()("All Problems").update(problemId, {
        ...updatedProblem,
      });
    } catch (error) {
      console.error("Error updating problem:", error);
      throw error;
    }
  }

  async getProblemByName(name: string): Promise<AirtableProblem | null> {
    if (!this.canMakeRequests) {
      console.error(
        "Airtable credentials not set. Please set API key and base ID first."
      );
      throw new Error(
        "Airtable credentials not set. Please set API key and base ID first."
      );
    }
    try {
      await this.loadProblemSets();

      const records = await this.getBase()("All Problems")
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
        Icebox: records[0].get("Icebox") as "true" | "false",
      };
    } catch (error) {
      console.error("Error fetching problem by name:", error);
      throw error;
    }
  }

  async addProblemToAirtable(
    problem: Omit<AirtableProblem, "id" | "Last drilled">
  ) {
    if (!this.canMakeRequests) {
      console.error(
        "Airtable credentials not set. Please set API key and base ID first."
      );
      throw new Error(
        "Airtable credentials not set. Please set API key and base ID first."
      );
    }
    try {
      // Check if the problem already exists
      const existingProblem = await this.getProblemByName(problem.Name);

      if (existingProblem) {
        console.log(`Problem "${problem.Name}" already exists in Airtable`);
        return existingProblem;
      }

      // If problem doesn't exist, create it
      const createdRecord = await this.getBase()("All Problems").create({
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
      if (!this.canMakeRequests) {
        console.error(
          "Airtable credentials not set. Please set API key and base ID first."
        );
        throw new Error(
          "Airtable credentials not set. Please set API key and base ID first."
        );
      }
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
      if (!this.canMakeRequests) {
        console.error(
          "Airtable credentials not set. Please set API key and base ID first."
        );
        throw new Error(
          "Airtable credentials not set. Please set API key and base ID first."
        );
      }
      const problems = await this.getAllProblems();
      const typeProblems = problems.filter((problem) =>
        problem.type.includes(type)
      );

      if (typeProblems.length === 0) {
        throw new Error(`No problems found with type ${type}`);
      }

      switch (selectedType) {
        case "weakest":
          // Find problems with lowest comfort level
          const minComfort = Math.min(...typeProblems.map((p) => p.Comfort));
          const weakestProblems = typeProblems.filter(
            (p) => p.Comfort === minComfort
          );
          return weakestProblems[
            Math.floor(Math.random() * weakestProblems.length)
          ];

        case "drill":
          // Find problems that haven't been drilled recently
          const today = new Date();
          const drilledProblems = typeProblems.filter((problem) => {
            if (!problem["Last drilled"]) return true;
            const lastDrilled = new Date(problem["Last drilled"]);
            return (
              today.getTime() - lastDrilled.getTime() > 7 * 24 * 60 * 60 * 1000
            ); // 7 days
          });

          if (drilledProblems.length === 0) {
            throw new Error(`No problems found with type ${type} to drill`);
          }

          return drilledProblems[
            Math.floor(Math.random() * drilledProblems.length)
          ];

        case "random":
          return typeProblems[Math.floor(Math.random() * typeProblems.length)];

        default:
          throw new Error(`Invalid selected type: ${selectedType}`);
      }
    } catch (error) {
      console.error("Error fetching random problem by type:", error);
      throw error;
    }
  }

  async getRandomIceboxProblem(): Promise<AirtableProblem> {
    try {
      const problems = await this.getAllProblems();
      const iceboxProblems = problems.filter((problem) => problem.Icebox);
      return iceboxProblems[Math.floor(Math.random() * iceboxProblems.length)];
    } catch (error) {
      console.error("Error fetching random icebox problem:", error);
      throw error;
    }
  }
}

// Create a singleton instance
export const airtableService = new AirtableService();

export default airtableService;
