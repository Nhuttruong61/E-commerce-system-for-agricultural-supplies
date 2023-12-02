import React, { memo } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ConverChartComposed } from "../../until";

function ComposedChartComponent({ orders }) {
  const data = ConverChartComposed(orders);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
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
        <XAxis dataKey="name" scale="band" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar name="Doanh thu (VNĐ)" dataKey="uv" barSize={20} fill="#413ea0" />
        <Line
          name="Doanh thu (VNĐ)"
          type="monotone"
          dataKey="uv"
          stroke="#ff7300"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default memo(ComposedChartComponent);
