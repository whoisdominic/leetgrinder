import { VictoryThemeDefinition } from "victory";

export const customTheme: VictoryThemeDefinition = {
  area: {
    style: {
      data: {
        fill: "#2D7FF9",
        strokeWidth: 2,
        fillOpacity: 0.5,
      },
      labels: {
        fontFamily:
          "'Inter', 'Helvetica Neue', 'Seravek', 'Helvetica', sans-serif",
        fontSize: 12,
        fontWeight: 300,
        letterSpacing: "normal",
        padding: 8,
        fill: "#292929",
        stroke: "transparent",
      },
    },
    width: 450,
    height: 300,
    padding: 60,
    colorScale: [
      "#2D7FF9",
      "#18BFFF",
      "#20C933",
      "#FCB400",
      "#FF6F2C",
      "#F82B60",
      "#8B46FF",
      "#20D9D2",
    ],
  },
  line: {
    style: {
      data: {
        fill: "transparent",
        opacity: 1,
        stroke: "#2D7FF9",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
      labels: {
        fontFamily:
          "'Inter', 'Helvetica Neue', 'Seravek', 'Helvetica', sans-serif",
        fontSize: 12,
        fontWeight: 300,
        letterSpacing: "normal",
        padding: 8,
        fill: "#292929",
        stroke: "transparent",
      },
    },
    width: 450,
    height: 300,
    padding: 60,
    colorScale: [
      "#2D7FF9",
      "#18BFFF",
      "#20C933",
      "#FCB400",
      "#FF6F2C",
      "#F82B60",
      "#8B46FF",
      "#20D9D2",
    ],
  },
  pie: {
    style: {
      parent: {
        backgroundColor: "#FFFFFF",
      },
      data: {
        padding: 8,
        stroke: "#FFFFFF",
        strokeWidth: 1,
      },
      labels: {
        fontFamily:
          "'Inter', 'Helvetica Neue', 'Seravek', 'Helvetica', sans-serif",
        fontSize: 10,
        fontWeight: 300,
        letterSpacing: "normal",
        padding: 20,
        fill: "#5C5C5C",
        stroke: "transparent",
      },
    },
    colorScale: [
      "#2D7FF9",
      "#18BFFF",
      "#20C933",
      "#FCB400",
      "#FF6F2C",
      "#F82B60",
      "#8B46FF",
      "#20D9D2",
    ],
    cornerRadius: 1,
    width: 450,
    height: 300,
    padding: 60,
  },
  stack: {
    colorScale: [
      "#2D7FF9",
      "#18BFFF",
      "#20C933",
      "#FCB400",
      "#FF6F2C",
      "#F82B60",
      "#8B46FF",
      "#20D9D2",
    ],
    width: 450,
    height: 300,
    padding: 60,
  },
};

export default customTheme;
