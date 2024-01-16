import { useState, useEffect, useCallback } from "react";

import Link from "../components/Link";
import AddTicker from "../components/AddTicker";
import RemoveTicker from "../components/RemoveTicker";
import LoadingModal from "../components/LoadingModal";

import { backend_api } from "../helpers/api";

import { HiOutlineDocument } from "react-icons/hi";
import { HiCurrencyDollar } from "react-icons/hi";

function SideBarPage({ tickers, setTickers }) {
  const [showModal, setShowModal] = useState(false);
  const showLoading = () => {
    setShowModal((state) => {
      if (state) return state;
      return !state;
    });
  };
  const hideLoading = () => {
    setShowModal((state) => {
      if (state) return !state;
      return state;
    });
  };
  const loadingModal = <LoadingModal></LoadingModal>;

  const fetchTickers = useCallback(async () => {
    try {
      const response = await backend_api.get("/api/tickers");
      console.log("GET /api/tickers", response);
      setTickers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [setTickers]);

  useEffect(() => {
    fetchTickers();
  }, [fetchTickers]);

  const renderedLinks = tickers.map((data) => {
    return (
      <div key={data.ticker} className="flex items-center">
        <Link
          to={`/${data.ticker}`}
          className="inline-block px-4 py-2 bg-green-800 text-white rounded-md w-36 text-center mr-2"
          activeClassName="font-bold border-2 border-white"
        >
          <div className="flex items-center">
            <HiCurrencyDollar className="mr-1" />
            {`${data.ticker}`.toUpperCase()}
          </div>
        </Link>
        <RemoveTicker
          ticker={data.ticker}
          onRemove={fetchTickers}
          showLoading={showLoading}
          hideLoading={hideLoading}
        ></RemoveTicker>
      </div>
    );
  });

  return (
    <div>
      <div className="dark:bg-gray-800 text-white p-4 space-y-4 max-w-xl mx-auto">
        <div>
          <AddTicker
            onSubmit={fetchTickers}
            showLoading={showLoading}
            hideLoading={hideLoading}
          ></AddTicker>
        </div>
        <div className="sticky top-0 overflow-y-auto flex flex-col">
          <div className="flex items-center">
            <HiOutlineDocument className="mr-2 mb-4" />
            <h2 className="font-bold mb-3 inline-block pb-1">Stock Cards</h2>
          </div>
          <div className="flex flex-col items-start space-y-2 ml-6">
            {renderedLinks}
          </div>
        </div>
      </div>
      {showModal && loadingModal}
    </div>
  );
}

export default SideBarPage;
