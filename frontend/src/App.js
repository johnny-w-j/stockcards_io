import SideBarPage from "./pages/SideBarPage";
import Route from "./components/Route";
import StockCardPage from "./pages/StockCardPage";
import { useState, useEffect } from "react";
import demoImage from "./images/demo_screenshot.png";

function App() {
  const [tickers, setTickers] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1600 || window.innerHeight < 500);
    };
    checkScreenSize(); // Check on initial render
    // Attach event listener to handle changes in screen size
    window.addEventListener("resize", checkScreenSize);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const routes = tickers.map((data, idx, arr) => {
    return (
      <Route key={idx} path={`/${data.ticker}`}>
        <StockCardPage ticker={data.ticker}></StockCardPage>
      </Route>
    );
  });

  return (
    <div>
      {isSmallScreen ? (
        <div className="text-center text-white p-4">
          <p className="text-sm	italic">
            Stock Cards IO was designed to display graphical data visualizations
            on screens larger than 1600x500. Expand the browser window or view
            the application on a device with a larger screen.
          </p>
          <hr />
          <div className="max-w-full h-auto block mx-auto border border-white p-4">
            <img
              src={demoImage}
              alt="Demo Screenshot"
              className="max-w-full h-auto"
            />
            <p className="text-white text-lg font-bold mt-4">
              Stock Cards IO Screenshot
            </p>
          </div>
        </div>
      ) : (
        <div className="dark:bg-gray-800 font-sans container mx-auto grid grid-cols-6 gap-4 mt-4">
          <SideBarPage tickers={tickers} setTickers={setTickers}></SideBarPage>
          <div className="col-span-5">{routes}</div>
        </div>
      )}
    </div>
  );
}

export default App;
