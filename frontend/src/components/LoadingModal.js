import ReactDOM from "react-dom";
import { useEffect } from "react";
import SpinnerAnimation from "./SpinnerAnimation";

function LoadingModal() {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    const handleEvents = (event) => {
      event.preventDefault();
    };
    document.addEventListener("keydown", handleEvents);
    document.addEventListener("keyup", handleEvents);
    document.addEventListener("mousedown", handleEvents);
    document.addEventListener("mouseup", handleEvents);
    document.addEventListener("mouseenter", handleEvents);
    document.addEventListener("mouseleave", handleEvents);

    return () => {
      document.body.classList.remove("overflow-hidden");

      document.removeEventListener("keydown", handleEvents);
      document.removeEventListener("keyup", handleEvents);
      document.removeEventListener("mousedown", handleEvents);
      document.removeEventListener("mouseup", handleEvents);
      document.removeEventListener("mouseenter", handleEvents);
      document.removeEventListener("mouseleave", handleEvents);
    };
  }, []);

  return ReactDOM.createPortal(
    <div>
      <div className="fixed inset-0 bg-gray-600 opacity-80"></div>
      <div className="flex flex-col justify-between h-full">
        <div className="pos-center">
          <SpinnerAnimation />
        </div>
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
}

export default LoadingModal;
