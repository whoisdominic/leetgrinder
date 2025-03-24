import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { AirtableProblem } from "../../services/AirtableService";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface PieV2Props {
  data: AirtableProblem[];
  height?: number;
}

export const ComfortPieChart: React.FC<PieV2Props> = ({
  data,
  height = 200,
}) => {
  // Count problems by comfort level
  const comfortCount = data.reduce((acc, problem) => {
    acc[problem.Comfort] = (acc[problem.Comfort] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Define all possible comfort levels and their properties
  const comfortLevels = [
    { value: 0, label: "No Comfort", color: "rgba(0, 0, 0, 1)" },
    { value: 1, label: "Very Low", color: "rgba(255, 99, 132, 0.8)" },
    { value: 2, label: "Low", color: "rgba(255, 159, 64, 0.8)" },
    { value: 3, label: "Medium", color: "rgba(255, 205, 86, 0.8)" },
    { value: 4, label: "High", color: "rgba(75, 192, 151, 0.8)" },
    { value: 5, label: "Very High", color: "rgba(75, 192, 75, 0.8)" },
  ];

  // Filter out comfort levels with zero problems
  const activeComfortLevels = comfortLevels.filter(
    (level) => (comfortCount[level.value] || 0) > 0
  );

  const chartData = {
    labels: activeComfortLevels.map((level) => level.label),
    datasets: [
      {
        data: activeComfortLevels.map(
          (level) => comfortCount[level.value] || 0
        ),
        backgroundColor: activeComfortLevels.map((level) => level.color),
        borderColor: activeComfortLevels.map((level) =>
          level.color.replace("0.8", "1")
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "white",
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = data.length;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-md" style={{ height }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};
