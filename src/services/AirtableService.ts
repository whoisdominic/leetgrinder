import Airtable from "airtable";

enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export type Comfort = 0 | 1 | 2 | 3 | 4 | 5;

type ProblemType =
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
}

class AirtableService {
  private baseId: string;
  private apiKey: string;
  private base: Airtable.Base;

  constructor() {
    this.baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
    this.apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
    this.base = new Airtable({ apiKey: this.apiKey }).base(this.baseId);
  }

  async getAllProblems(): Promise<AirtableProblem[]> {
    try {
      const records = await this.base("All Problems").select().all();
      return records.map((record) => ({
        id: record.id,
        Name: record.get("Name") as string,
        Difficulty: record.get("Difficulty") as Difficulty,
        Comfort: record.get("Comfort") as Comfort,
        "Problem Link": record.get("Problem Link") as string,
        type: record.get("type") as ProblemType[],
        "Problem Sets": record.get("Problem Sets") as string[],
      }));
    } catch (error) {
      console.error("Error fetching problems:", error);
      throw error;
    }
  }

  async updateComfort(problemId: string, comfort: Comfort) {
    try {
      await this.base("All Problems").update(problemId, {
        Comfort: comfort,
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
      const records = await this.base("All Problems")
        .select({
          filterByFormula: `{Name} = '${name}'`,
        })
        .all();

      if (records.length === 0) {
        return null;
      }

      return {
        id: records[0].id,
        Name: records[0].get("Name") as string,
        Difficulty: records[0].get("Difficulty") as Difficulty,
        Comfort: records[0].get("Comfort") as Comfort,
        "Problem Link": records[0].get("Problem Link") as string,
        type: records[0].get("type") as ProblemType[],
        "Problem Sets": records[0].get("Problem Sets") as string[],
      };
    } catch (error) {
      console.error("Error fetching problem by name:", error);
      throw error;
    }
  }

  async addProblemToProblemSet(problemId: string, problemSet: string) {}
}

export const airtableService = new AirtableService();

export default airtableService;
