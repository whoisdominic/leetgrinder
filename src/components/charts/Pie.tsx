import React from "react";
import { VictoryPie, VictoryTooltip, VictoryChart } from "victory";
import { customTheme } from "./theme";
import { LeetCodeProblem } from "../../state/supabase";

interface PieChartProps {
  data: LeetCodeProblem[];
  colorScale?: string[];
  width?: number;
  height?: number;
}

const defaultColorScale = ["#20C933", "#FCB400", "#F82B60"];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  colorScale = customTheme.pie?.colorScale ?? defaultColorScale,
  width = 300,
  height = 300,
}) => {
  // Group problems by difficulty
  const groupedData = data.reduce((acc, problem) => {
    const { difficulty } = problem;
    if (!acc[difficulty]) {
      acc[difficulty] = 0;
    }
    acc[difficulty]++;
    return acc;
  }, {} as Record<string, number>);

  // Transform for Victory format
  const chartData = Object.entries(groupedData).map(([difficulty, count]) => ({
    x: difficulty,
    y: count,
    label: `${difficulty}: ${count}`,
  }));

  // Map difficulty to specific colors
  const getColorForDifficulty = (dataPoint: { x: string; y: number }) => {
    switch (dataPoint.x) {
      case "easy":
        return "#20C933";
      case "medium":
        return "#FCB400";
      case "hard":
        return "#F82B60";
      default:
        return "#cccccc"; // fallback color
    }
  };

  return (
    <div>
      <VictoryPie
        data={chartData}
        width={width}
        height={height}
        padding={50}
        labelRadius={({ innerRadius }) =>
          typeof innerRadius === "number" ? innerRadius + 30 : 30
        }
        labels={({ datum }) => datum.x}
        style={{
          data: {
            stroke: "#fff",
            strokeWidth: 1,
            fill: ({ datum }) => getColorForDifficulty(datum),
          },
          labels: {
            fontSize: 12,
            fill: "#262323",
            fontWeight: "bold",
          },
        }}
        animate={{
          duration: 500,
          easing: "bounce",
        }}
      />
    </div>
  );
};
