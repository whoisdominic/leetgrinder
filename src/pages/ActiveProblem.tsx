import { useEffect } from "react";
import { BasicButton, Stars } from "../components";
import { useAppStore } from "../state/store";
import { transformProblemName } from "../utils";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import airtableService, {
  AirtableProblem,
  Comfort,
} from "../services/AirtableService";

const ProblemStats: React.FC<{ problem: AirtableProblem }> = ({ problem }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-400";
      case "Medium":
        return "text-yellow-400";
      case "Hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-800/50 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Problem Stats</h3>
        <span
          className={`font-bold text-lg ${getDifficultyColor(
            problem.Difficulty
          )}`}
        >
          {problem.Difficulty}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Types</h4>
          <div className="flex flex-wrap gap-2">
            {problem.type.map((type) => (
              <span
                key={type}
                className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm text-gray-400 mb-2">Problem Sets</h4>
          <div className="flex flex-wrap gap-2">
            {problem["Problem Sets"].map((set) => (
              <span
                key={set}
                className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
              >
                {set}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export function ActiveProblem() {
  const isLeetCodeProblem = useAppStore((state) => state.isLeetCodeProblem);
  const activeProblem = useAppStore((state) => state.activeProblem);
  const queryClient = useQueryClient();

  const { data: problem, isLoading: isLoadingProblem } = useQuery({
    queryKey: ["problem", activeProblem],
    queryFn: () =>
      airtableService.getProblemByName(
        transformProblemName(activeProblem || "")
      ),
  });

  const updateComfortMutation = useMutation({
    mutationFn: ({
      problemId,
      comfort,
    }: {
      problemId: string;
      comfort: Comfort;
    }) => airtableService.updateComfort(problemId, comfort),
    onSuccess: () => {
      // Invalidate and refetch the problem query to get updated data
      queryClient.invalidateQueries({ queryKey: ["problem", activeProblem] });
      // Also invalidate the problems list on the dashboard
      queryClient.invalidateQueries({ queryKey: ["airtableProblems"] });
    },
  });

  const handleStarChange = (stars: number) => {
    if (problem?.id) {
      updateComfortMutation.mutate({
        problemId: problem.id,
        comfort: stars as Comfort,
      });
    }
  };

  const navigate = useNavigate();

  const handleAddProblem = () => {
    console.log(activeProblem);
  };

  useEffect(() => {
    if (!isLeetCodeProblem || !activeProblem) {
      navigate("/");
    }
  }, [isLeetCodeProblem, activeProblem, navigate]);

  return (
    <div className="flex flex-col gap-4 items-center text-white w-full">
      {isLeetCodeProblem && activeProblem ? (
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {transformProblemName(activeProblem)}
              </h3>
              <Stars
                stars={problem?.Comfort || 0}
                onChange={handleStarChange}
                disabled={updateComfortMutation.isPending || isLoadingProblem}
                isLoading={updateComfortMutation.isPending || isLoadingProblem}
              />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">
          No active LeetCode problem detected. Please navigate to a LeetCode
          problem page.
        </p>
      )}
      {problem && <ProblemStats problem={problem} />}
    </div>
  );
}

export default ActiveProblem;
