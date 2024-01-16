import { useState, useEffect, useCallback } from "react";

import IncomeStatementChart from "../components/IncomeStatementChart";
import BalanceSheetChart from "../components/BalanceSheetChart";
import CashFlowChart from "../components/CashFlowChart";
import SimpleAreaChart from "../components/SimpleAreaChart";

import { backend_api } from "../helpers/api";

function StockCardPage({ ticker }) {
  const [stockData, setStockData] = useState(null);

  const fetchStockData = useCallback(async () => {
    try {
      const response = await backend_api.get(`/api/stock/${ticker}`);
      console.log(`GET /api/stock/${ticker}`, response);
      setStockData(response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  }, [ticker]);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  let content = <div></div>;

  const isItems = ["revenue", "cogs", "total_opex", "ebitda"];
  const bsItems = ["net_debt", "cash_and_equiv"];
  const cfItems = ["fcf", "capex"];
  const osItems = ["shares_eop"];
  const mcItems = ["market_cap"];

  if (stockData !== null && stockData !== undefined) {
    content = (
      <div>
        <h1 className="ml-24 mb-4 text-2xl subpixel-antialiased font-semibold text-green-600 uppercase">
          {ticker.toUpperCase()}
        </h1>
        <div className="mb-4">
          <IncomeStatementChart
            data={stockData}
            items={isItems}
            title={
              "Quarterly Income Statement Figures with Stacked COGS + Op.Ex."
            }
          ></IncomeStatementChart>
        </div>
        <div className="mb-4">
          <BalanceSheetChart
            data={stockData}
            items={bsItems}
            title={"Quarterly Cash and Debt Levels"}
          ></BalanceSheetChart>
        </div>
        <div className="mb-4">
          <CashFlowChart
            data={stockData}
            items={cfItems}
            title={"Quarterly Free Cash Flow (Cash from Op. - CAPEX)"}
          ></CashFlowChart>
        </div>
        <div className="mb-4">
          <SimpleAreaChart
            data={stockData}
            items={osItems}
            title={"Quarterly Shares Outstanding"}
            label={"Shares at End of Period"}
            dollarOn={false}
            colour={"#A020F0"}
          ></SimpleAreaChart>
        </div>
        <div className="mb-4">
          <SimpleAreaChart
            data={stockData}
            items={mcItems}
            title={"End of Quarter Market Capitalization"}
            label={"Market Cap. at End of Quarter"}
            dollarOn={true}
            colour={"#39FF14"}
          ></SimpleAreaChart>
        </div>
      </div>
    );
  }

  return <div className="dark:bg-gray-800 text-white">{content}</div>;
}

export default StockCardPage;
