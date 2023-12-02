import React from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { coverVertialUserChart } from "../../until";

function VerticalComposedChart({ user }) {
  const data = coverVertialUserChart(user);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        layout="vertical"
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis type="number" />
        <Tooltip />
        <Legend />
        <XAxis dataKey="name" scale="band" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Legend />

        <Bar dataKey="pv" name="Số tiền (VNĐ)" barSize={20} fill="#92d14c" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default VerticalComposedChart;
