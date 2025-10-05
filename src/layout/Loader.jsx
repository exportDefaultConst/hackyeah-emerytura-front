import React, { useEffect, useState } from "react";

const Loader = ({ isLoading = true, onExit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !isClosing) {
      setIsClosing(true);
      setIsVisible(false);

      const exitTimer = setTimeout(() => onExit, 300);

      return () => clearTimeout(exitTimer);
    }
  }, [isLoading, isClosing, onExit]);

  return (
    <div
      className={`backdrop-blur-[2px] fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`flex flex-row gap-2 transform transition-all duration-300 ease-out ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-8 scale-95 opacity-0"
        }`}
      >
        <div className="w-4 h-4 rounded-full bg-(--color-zus-green) animate-bounce" />
        <div className="w-4 h-4 rounded-full bg-(--color-zus-green) animate-bounce [animation-delay:.3s]" />
        <div className="w-4 h-4 rounded-full bg-(--color-zus-green) animate-bounce [animation-delay:.5s]" />
      </div>
    </div>
  );
};

export default Loader;
