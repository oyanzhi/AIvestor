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

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-2xl shadow-md w-full max-w-4xl text-white">
        <h3 className="font-bold mb-4 text-lg">Price History</h3>
        <p>No data available.</p>
      </div>
    );
  }

  // Calculate min and max close prices with padding
  const closePrices = data.map(d => d.close).filter(val => val !== null && !isNaN(val));
  const minPrice = Math.min(...closePrices);
  const maxPrice = Math.max(...closePrices);
  const buffer = (maxPrice - minPrice) * 0.05 || 1;

  const domain: [number, number] = [minPrice - buffer, maxPrice + buffer];

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-md w-full max-w-4xl">
      <h3 className="text-white font-bold mb-4 text-lg">Price History</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis domain={domain} stroke="#ccc" allowDecimals={false} tickFormatter={(value) => Math.round(value).toString()} />
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
