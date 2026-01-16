import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface UsageChartProps {
  data: any[];
  title: string;
  color: string;
  label: string;
}

export default function UsageChart({
  data,
  title,
  color,
  label,
}: UsageChartProps) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="p-4 bg-white border border-gray-300 rounded-lg">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value: number) => [Math.round(value), label]}
            />
            <Legend />
            <Line
              type="step"
              dataKey="value"
              name={label}
              stroke={color}
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
