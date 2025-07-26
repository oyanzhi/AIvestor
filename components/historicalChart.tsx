// components/HistoricalChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type HistoricalDataPoint = {
  date: string;
  close: number;
};

type HistoricalChartProps = {
  data: HistoricalDataPoint[];
};

export default function HistoricalChart({ data }: HistoricalChartProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-md w-full max-w-4xl">
      <h3 className="text-white font-bold mb-4 text-lg">Price History</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "white" }}
            labelStyle={{ color: "#ccc" }}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
