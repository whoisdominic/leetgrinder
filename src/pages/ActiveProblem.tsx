import { useEffect } from "react";
import { BasicButton, Stars } from "../components";
import { useAppStore } from "../state/store";
import { transformProblemName } from "../utils";
import { useNavigate } from "react-router-dom";
import { useLeetcode } from "../hooks";

const ProblemStats = () => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-gray-300">Problem Stats</p>
    </div>
  );
};

export function ActiveProblem() {
  const isLeetCodeProblem = useAppStore((state) => state.isLeetCodeProblem);
  const activeProblem = useAppStore((state) => state.activeProblem);
  const isAuthenticated = useAppStore((state) => !!state.user);
  const { addBaseProblem } = useAppStore();

  const navigate = useNavigate();

  const handleAddProblem = () => {
    console.log(activeProblem);

    //   if (!activeProblem) return;

    //   addBaseProblem({
    //     name: activeProblem.name,
    //     difficulty: activeProblem.difficulty,
    //     leet_url: activeProblem.leet_url,
    //   });
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
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium mb-2">
                {transformProblemName(activeProblem)}
              </h3>
              <Stars stars={0} onChange={() => {}} />
            </div>
            {isAuthenticated ? (
              <ProblemStats />
            ) : (
              <p className="text-yellow-400">
                Please configure your Login in settings to track problems
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-400">
          No active LeetCode problem detected. Please navigate to a LeetCode
          problem page.
        </p>
      )}
      <div className="flex gap-2">
        <BasicButton
          title="Add"
          color="bg-gradient-to-r from-teal-400 to-yellow-200 "
          onClick={handleAddProblem}
        />
        <BasicButton
          title="Hints"
          color="bg-gradient-to-br from-pink-500 to-orange-400"
          onClick={() => {}}
        />
        <BasicButton title="AI" onClick={() => {}} />
        <BasicButton title="Solve" onClick={() => {}} />
      </div>
    </div>
  );
}

export default ActiveProblem;
