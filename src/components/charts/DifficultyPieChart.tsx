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

export const DifficultyPieChart: React.FC<PieV2Props> = ({
  data,
  height = 200,
}) => {
  // Count problems by difficulty
  const difficultyCount = data.reduce((acc, problem) => {
    acc[problem.Difficulty] = (acc[problem.Difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        data: [
          difficultyCount["Easy"] || 0,
          difficultyCount["Medium"] || 0,
          difficultyCount["Hard"] || 0,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)", // Teal for Easy
          "rgba(255, 206, 86, 0.8)", // Yellow for Medium
          "rgba(255, 99, 132, 0.8)", // Red for Hard
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
        ],
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
