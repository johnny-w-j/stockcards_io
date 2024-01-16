import { useState } from "react";
import { backend_api } from "../helpers/api";
import AsyncSelect from "react-select/async";

function AsyncSelectTicker({ value, onChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const loadOptions = (inputValue, callback) => {
    setIsLoading((state) => !state);
    backend_api
      .get(`/api/fuzzymatch/${inputValue}`)
      .then((response) => {
        const dataOptions = response.data.map((item) => ({
          label: `${item.ticker} (${item.country})`,
          value: item.ticker,
        }));
        callback(dataOptions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching fuzzy options", error);
        callback([]);
        setIsLoading((state) => !state);
      });
  };

  const handleInputChange = (inputValue) => {
    const filteredInput = inputValue.replace(/[^a-zA-Z.]/g, "");
    const truncatedInput = filteredInput.slice(0, 5);
    setInputValue(truncatedInput);
  };

  const onKeyDown = (e) => {
    if (!/[A-Za-z.]/.test(e.key)) {
      e.preventDefault();
    } else if (inputValue.length > 5) {
      e.preventDefault();
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "black",
      color: "white",
      width: "200px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "darkgreen"
        : state.isFocused
        ? "darkgreen"
        : "black",
      color: "white",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "white",
      backgroundColor: "black",
    }),
    input: (provided, state) => ({
      ...provided,
      color: "white",
      fontStyle: "italic",
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: "black",
    }),
    menuList: (provided, state) => ({
      ...provided,
      color: "white",
      border: "2px solid white",
      borderRadius: "4px",
      "&::-webkit-scrollbar": {
        width: "16px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "black",
        border: "2px solid dimgrey",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "black",
      },
    }),
  };

  const customNoOptionsMessage = () => "Type for options.";

  return (
    <AsyncSelect
      cacheOptions={true}
      isClearable={true}
      loadOptions={(inputValue, callback) => loadOptions(inputValue, callback)}
      isLoading={isLoading}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      styles={customStyles}
      placeholder="Search..."
      noOptionsMessage={customNoOptionsMessage}
    />
  );
}

export default AsyncSelectTicker;
