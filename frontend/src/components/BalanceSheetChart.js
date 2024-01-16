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

function BalanceSheetChart({ data, items, title }) {
  let graphData = [];
  let formatter = ChooseCurrencyFormatter(0, true);
  console.log(items, "validationResult:", dataValidator(data, items));
  if (dataValidator(data, items)) {
    graphData = GraphDataBuilder(data, items);
    graphData.forEach((obj) => {
      obj["total_debt"] = obj["net_debt"] + obj["cash_and_equiv"];
    });
    formatter = ChooseCurrencyFormatter(data["cash_and_equiv"][0], true);
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
          <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorTotalDebt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF2210" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FF2210" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#fff" />
        <XAxis dataKey="name" stroke="#fff" />
        <YAxis tickFormatter={formatter} stroke="#fff" />
        <Tooltip content={<CustomToolTip dollarOn={true} />} />
        <Area
          type="monotone"
          dataKey="total_debt"
          name="Total Debt"
          stackId="1"
          stroke="#FF2210"
          fillOpacity={1}
          fill="url(#colorTotalDebt)"
        />
        <Area
          type="monotone"
          dataKey="cash_and_equiv"
          name="Cash and Equivalents"
          stackId="2"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorCash)"
        />
      </AreaChart>
    </div>
  );
}

export default BalanceSheetChart;
