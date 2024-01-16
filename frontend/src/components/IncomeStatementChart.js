import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  GraphDataBuilder,
  ChooseCurrencyFormatter,
  CustomToolTip,
} from "../helpers/rechartformatters";

import { dataValidator } from "../helpers/datachecker";

function IncomeStatementChart({ data, items, title }) {
  let graphData = [];
  let formatter = ChooseCurrencyFormatter(0, true);
  console.log(items, "validationResult:", dataValidator(data, items));
  if (dataValidator(data, items)) {
    graphData = GraphDataBuilder(data, items);
    formatter = ChooseCurrencyFormatter(graphData[0]["revenue"], true);
  }

  return (
    <div>
      <h2 className="ml-24 underline underline-offset-4 decoration-4 decoration-green-800/50">
        {title}
      </h2>
      <AreaChart
        width={1000}
        height={750}
        data={graphData}
        margin={{
          top: 15,
          right: 30,
          left: 30,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCogs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF2210" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FF2210" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorOpex" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF9D00" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FF9D00" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorEbitda" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#fff" />
        <XAxis dataKey="name" stroke="#fff" />
        <YAxis tickFormatter={formatter} stroke="#fff" />
        <Tooltip content={<CustomToolTip dollarOn={true} />} />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stackId="1"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorRev)"
        />
        <Area
          type="monotone"
          dataKey="cogs"
          name="Cost of Goods Sold"
          stackId="2"
          stroke="#FF2210"
          fillOpacity={1}
          fill="url(#colorCogs)"
        />
        <Area
          type="monotone"
          dataKey="total_opex"
          name="Op. Expenditures"
          stackId="2"
          stroke="#FF9D00"
          fillOpacity={1}
          fill="url(#colorOpex)"
        />
        <Area
          type="monotone"
          dataKey="ebitda"
          name="EBITDA"
          stackId="3"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorEbitda)"
        />
      </AreaChart>
    </div>
  );
}

export default IncomeStatementChart;
