import { useQuery, useMutation } from "@tanstack/react-query";
import {
  BasicButton,
  DifficultyPieChart,
  ComfortPieChart,
} from "../components";
import { useLeetcode } from "../hooks";
import airtableService from "../services/AirtableService";

export function Dashboard() {
  useLeetcode({ autoNavigate: true });

  const {
    isPending,
    error,
    data = [],
  } = useQuery({
    queryKey: ["airtableProblems"],
    queryFn: () => airtableService.getAllProblems(),
  });

  const handleGetRandomWeakProblem = useMutation({
    mutationFn: () => airtableService.getRandomWeakProblem(1),
    onSuccess: (data) => {
      window.open(data["Problem Link"], "_blank");
    },
  });

  const handleGetRandomDrillProblem = useMutation({
    mutationFn: () => airtableService.getRandomWeakProblem(3),
    onSuccess: (data) => {
      window.open(data["Problem Link"], "_blank");
    },
  });

  return (
    <div className="flex flex-col gap-4 items-center text-white w-full">
      <div className="flex justify-between w-full px-4">
        <BasicButton
          title="Drill"
          color="bg-gradient-to-r from-teal-400 to-yellow-200"
          onClick={handleGetRandomDrillProblem.mutate}
        />
        <BasicButton
          title="Weak"
          onClick={handleGetRandomWeakProblem.mutate}
          color="bg-gradient-to-r from-amber-200 to-yellow-500"
        />
        <BasicButton
          title="Lists"
          onClick={() => {}}
          color="bg-gradient-to-r from-teal-400 to-yellow-200"
        />
      </div>
      <DifficultyPieChart data={data} height={180} />
      <ComfortPieChart data={data} height={180} />
    </div>
  );
}

export default Dashboard;
