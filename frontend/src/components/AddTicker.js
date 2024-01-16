import { useState } from "react";
import { backend_api } from "../helpers/api";
import { HiOutlinePlus } from "react-icons/hi";
import AsyncSelectTicker from "./AsyncSelectTicker";

function AddTicker({ onSubmit, showLoading, hideLoading }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSelectChange = (selectedOption) => {
    setSelectedValue(selectedOption);
  };

  const toggleSubmitDisable = () => {
    setIsDisabled((state) => !state);
  };
  const handleButtonClick = async () => {
    if (selectedValue == null) return;
    toggleSubmitDisable();
    showLoading();
    try {
      const postData = {
        ticker: selectedValue["value"],
      };
      const response = await backend_api.post("/api/stock/", postData);
      console.log("POST AsyncSelectForm", postData);
      console.log("POST /api/stock/", response);
      setSelectedValue(null);
      onSubmit();
    } catch (error) {
      console.error("Error posting data:", error);
    }
    hideLoading();
    toggleSubmitDisable();
  };

  return (
    <div className="space-y-4">
      <div className="mb-9 mt-3">
        <span className="flex text-white font-bold mb-2 items-center">
          <HiOutlinePlus className="mr-2 mb-1" />
          <span className="inline-block pb-1">Add Ticker</span>
        </span>
        <AsyncSelectTicker
          value={selectedValue}
          onChange={handleSelectChange}
        />
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isDisabled}
          className="bg-green-800 text-white subpixel-antialiased font-semibold px-4 py-2 rounded-md w-full mt-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default AddTicker;
