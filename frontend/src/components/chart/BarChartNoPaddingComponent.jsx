import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { converDataChartProduct } from "../../until";

function BarChartNoPaddingComponent({ products }) {
  const data = converDataChartProduct(products);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        barSize={20}
      >
        <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar
          name="Lượt bán"
          dataKey="sold_out"
          fill="#2ca02c"
          background={{ fill: "#eee" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartNoPaddingComponent;
