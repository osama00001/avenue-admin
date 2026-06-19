import React, { useContext } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DigiContext } from "../../context/DigiContext";
import { formatMoney } from "@/lib/avenueClient";

const SalesChart = ({ data = [] }) => {
  const { isLightTheme, isRechartHeight } = useContext(DigiContext);

  return (
    <ResponsiveContainer width="100%" maxHeight={410} minHeight={isRechartHeight}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3"
          stroke={`${isLightTheme ? "hsl(0deg 0% 0% / 20%)" : "rgba(255, 255, 255, 0.2)"}`}
        />
        <XAxis
          dataKey="name"
          stroke={`${isLightTheme ? "hsl(0deg 0% 27.45% / 70%)" : "hsl(0deg 0% 89.41% / 70%)"}`}
        />
        <YAxis
          yAxisId="left"
          stroke={`${isLightTheme ? "hsl(0deg 0% 27.45% / 70%)" : "hsl(0deg 0% 89.41% / 70%)"}`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke={`${isLightTheme ? "hsl(0deg 0% 27.45% / 70%)" : "hsl(0deg 0% 89.41% / 70%)"}`}
        />
        <Tooltip
          formatter={(value, name) =>
            name === "Revenue" ? formatMoney(value) : value
          }
        />
        <Legend className="sales" />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="hsl(205.29deg 100% 52.55% / 80%)"
          fill="hsl(205.29deg 100% 52.55% / 30%)"
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="orders"
          name="Orders"
          stroke="#a9b4cc"
          fill="#a9b4cc55"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
