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

function SimpleAreaChart({ data, items, title, label, dollarOn, colour }) {
  let graphData = [];
  let formatter = ChooseCurrencyFormatter(0, true);
  console.log(items, "validationResult:", dataValidator(data, items));
  if (dataValidator(data, items)) {
    graphData = GraphDataBuilder(data, items);
    formatter = ChooseCurrencyFormatter(graphData[0][items[0]], dollarOn);
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
          <linearGradient id={colour.substring(1)} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colour} stopOpacity={0.8} />
            <stop offset="95%" stopColor={colour} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#fff" />
        <XAxis dataKey="name" stroke="#fff" />
        <YAxis tickFormatter={formatter} stroke="#fff" />
        <Tooltip content={<CustomToolTip dollarOn={dollarOn} />} />
        <Area
          type="monotone"
          dataKey={items[0]}
          name={label}
          stackId="1"
          stroke={colour}
          fillOpacity={1}
          fill={`url(${colour})`}
        />
      </AreaChart>
    </div>
  );
}

export default SimpleAreaChart;
