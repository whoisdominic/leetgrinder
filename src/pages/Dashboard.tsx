import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  BasicButton,
  DifficultyPieChart,
  ComfortPieChart,
} from "../components";
import { useLeetcode, useAirtableAuth } from "../hooks";
import airtableService from "../services/AirtableService";

export function Dashboard() {
  useLeetcode({ autoNavigate: true });
  useAirtableAuth();

  const navigate = useNavigate();

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
  const handleGetRandomIceboxProblem = useMutation({
    mutationFn: () => airtableService.getRandomIceboxProblem(),
    onSuccess: (data) => {
      window.open(data["Problem Link"], "_blank");
    },
  });

  const handleNavigateToTypes = () => {
    navigate("/types");
  };

  return (
    <div className="flex flex-col gap-4 items-center text-white w-full">
      {isPending && (
        <div className="flex flex-col items-center justify-center w-full h-[80vh]">
          <div className="animate-spin text-8xl">😱</div>
          <div className="text-2xl font-bold mt-4">Loading...</div>
        </div>
      )}
      {error && (
        <div className="text-red-500 text-2xl font-bold">
          Error: {error.message}
        </div>
      )}
      {data && !isPending && !error && (
        <div className="flex flex-col gap-4 items-center text-white w-full">
          <div className="flex justify-between w-full px-2">
            <BasicButton
              title="ICE"
              color="bg-gradient-to-r from-blue-800 to-slate-600"
              onClick={handleGetRandomIceboxProblem.mutate}
            />
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
              title="Types"
              onClick={handleNavigateToTypes}
              color="bg-gradient-to-r from-teal-400 to-yellow-200"
            />
          </div>
          <DifficultyPieChart data={data} height={180} />
          <ComfortPieChart data={data} height={180} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
