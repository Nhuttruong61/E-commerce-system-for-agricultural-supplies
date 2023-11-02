import React, { PureComponent, memo } from "react";
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
  class CustomizedAxisTick extends PureComponent {
    render() {
      const { x, y, stroke, payload } = this.props;

      return (
        <g transform={`translate(${x},${y})`}>
          <text
            x={0}
            y={0}
            dy={16}
            textAnchor="end"
            fill="#666"
            transform="rotate(-20)"
          >
            {payload.value}
          </text>
        </g>
      );
    }
  }
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
        <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar
          dataKey="sold_out"
          name="Số lượng"
          fill="#8884d8"
          background={{ fill: "#eee" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default memo(BarChartNoPaddingComponent);
