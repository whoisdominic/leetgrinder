import { useQuery } from "@tanstack/react-query";
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
