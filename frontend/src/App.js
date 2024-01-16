import SideBarPage from "./pages/SideBarPage";
import Route from "./components/Route";
import StockCardPage from "./pages/StockCardPage";
import { useState } from "react";

function App() {
  const [tickers, setTickers] = useState([]);

  const routes = tickers.map((data, idx, arr) => {
    return (
      <Route key={idx} path={`/${data.ticker}`}>
        <StockCardPage ticker={data.ticker}></StockCardPage>
      </Route>
    );
  });

  return (
    <div className="dark:bg-gray-800 font-sans container mx-auto grid grid-cols-6 gap-4 mt-4">
      <SideBarPage tickers={tickers} setTickers={setTickers}></SideBarPage>
      <div className="col-span-5">{routes}</div>
    </div>
  );
}

export default App;
