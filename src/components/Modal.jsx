import React, { useEffect, useState } from "react";

const Modal = ({
  children,
  onClose,
  isOpen = true,
  className = "w-64",
  blockScroll = true,
  isOnTop = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && blockScroll) {
      document.body.style.overflow = "hidden";
    }

    const timer = setTimeout(() => {
      setIsVisible(isOpen);
    }, 10);

    return () => {
      if (blockScroll) {
        document.body.style.overflow = "unset";
      }
      clearTimeout(timer);
    };
  }, [blockScroll, isOpen]);

  const handleClose = () => {
    setIsVisible(false);

    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`backdrop-blur-[2px] fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      } ${isOnTop ? "z-99" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`flex flex-col justify-between gap-8 p-4 md:p-8 border-2 border-gray-300 rounded-2xl bg-white shadow-lg transform transition-all duration-300 ease-out ${className} ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-8 scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {typeof children === "function"
          ? children({ closeModal: handleClose })
          : children}
      </div>
    </div>
  );
};

export default Modal;
