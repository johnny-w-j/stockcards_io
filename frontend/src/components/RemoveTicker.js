import useNavigation from "../hooks/use-navigation";

import { backend_api } from "../helpers/api";

import { HiOutlineTrash } from "react-icons/hi";

function RemoveTicker({ ticker, onRemove, showLoading, hideLoading }) {
  const { navigate, currentPath } = useNavigation();

  const removeTicker = async () => {
    showLoading();
    try {
      const response = await backend_api.delete(`/api/stock/${ticker}`);
      console.log(`DELETE /api/stock/${ticker}`, response);
      onRemove();
    } catch (error) {
      console.error("Error removing ticker:", error);
    }
    hideLoading();
  };

  const handleClick = (event) => {
    if (`/${ticker}` === currentPath) {
      navigate("/");
    }
    removeTicker();
  };

  return (
    <div>
      <HiOutlineTrash
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      ></HiOutlineTrash>
    </div>
  );
}

export default RemoveTicker;
