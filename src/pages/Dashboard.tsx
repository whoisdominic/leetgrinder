import { BasicButton, PieChart } from "../components";
import { useLeetcode } from "../hooks";
import { useAppStore } from "../state";
import { LeetCodeProblem } from "../state/supabase";

export function Dashboard() {
  useLeetcode({ autoNavigate: true });
  const user = useAppStore((state) => state.user);

  const data: LeetCodeProblem[] = [
    {
      id: "6",
      name: "Zigzag Conversion",
      difficulty: "medium",
      problem_type: "String",
      notes: "This is a test note",
      last_solved: "2021-01-01",
      best_time: "",
      leet_url: "https://leetcode.com/problems/zigzag-conversion/",
      comfort: 2,
      status: "completed",
    },
    {
      id: "1",
      name: "Two Sum",
      difficulty: "easy",
      problem_type: "Array",
      notes: "This is a test note",
      last_solved: "2021-01-01",
      best_time: "",
      leet_url: "https://leetcode.com/problems/two-sum/",
      comfort: 0,
      status: "completed",
    },
  ];

  return (
    <div className="flex flex-col gap-4 items-center text-white w-full">
      <div className="flex justify-between w-full px-4">
        <BasicButton
          title="Daily"
          color="bg-gradient-to-r from-teal-400 to-yellow-200"
          onClick={() => {}}
        />
        <BasicButton
          title="Weak"
          onClick={() => {}}
          color="bg-gradient-to-r from-teal-400 to-yellow-200"
        />
        <BasicButton
          title="Lists"
          onClick={() => {}}
          color="bg-gradient-to-r from-teal-400 to-yellow-200"
        />
      </div>
      {user && <PieChart data={data} />}
    </div>
  );
}

export default Dashboard;
