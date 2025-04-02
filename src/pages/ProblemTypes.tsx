import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import airtableService, { ProblemType } from "../services/AirtableService";
import { BasicButton, RadioButton } from "../components";

type SelectedType = "weakest" | "drill" | "random";

export const ProblemTypes = () => {
  const {
    isPending,
    error,
    data = [],
  } = useQuery({
    queryKey: ["airtableProblems"],
    queryFn: () => airtableService.getAllProblems(),
  });

  const problemTypes = useMemo(() => {
    // Extract all problem types and flatten the array since problem.type is an array
    const allTypes = data.flatMap((problem) => problem.type || []);
    // Remove duplicates by using a Set and convert back to array
    return [...new Set(allTypes)].filter(Boolean).sort();
  }, [data]);

  const getRandomProblemByType = useMutation({
    mutationFn: ({
      type,
      selectedType,
    }: {
      type: ProblemType;
      selectedType: SelectedType;
    }) => {
      return airtableService.getRandomProblemByType(type, selectedType);
    },
    onSuccess: (data) => {
      console.log(data);
      window.open(data["Problem Link"], "_blank");
    },
  });

  const [selectedType, setSelectedType] = useState<SelectedType>("weakest");

  return (
    <div className="flex flex-col gap-2 items-center text-white rounded-lg h-full w-full justify-between py-12">
      <div className="flex justify-between w-full px-4 mb-4">
        <RadioButton
          title="Weakest"
          onClick={() => setSelectedType("weakest")}
          color="bg-gradient-to-r from-amber-200 to-yellow-500"
          selected={selectedType === "weakest"}
        />
        <RadioButton
          title="Drill"
          onClick={() => setSelectedType("drill")}
          color="bg-gradient-to-r from-amber-200 to-yellow-500"
          selected={selectedType === "drill"}
        />
        <RadioButton
          title="Random"
          onClick={() => setSelectedType("random")}
          color="bg-gradient-to-r from-amber-200 to-yellow-500"
          selected={selectedType === "random"}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[70vh] w-full px-4">
        {problemTypes.map((type) => (
          <div
            key={type}
            className="flex p-2 border border-gray-700 rounded cursor-pointer items-center bg-gray-800/50 hover:bg-gray-700/70 transition-colors duration-200"
            onClick={() =>
              getRandomProblemByType.mutate({ type, selectedType })
            }
          >
            {type}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemTypes;
