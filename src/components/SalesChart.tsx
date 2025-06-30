"use client";

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from "recharts";

export default function SalesChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) =>
            new Date(date).toLocaleDateString("es-PE", { weekday: "short" })
          }
        />
        <YAxis allowDecimals={false} />
        <Tooltip
          formatter={(value: number) => [`${value} tickets`, "Ventas"]}
          labelFormatter={(label) =>
            new Date(label).toLocaleDateString("es-PE", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })
          }
        />
        <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
