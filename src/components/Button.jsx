import React from "react";

const Button = ({
  children,
  type = "primary",
  text,
  onClick,
  disabled = false,
  customStyle = "",
}) => {
  const baseClasses =
    "px-4 py-2 font-semibold rounded-lg shadow-md duration-200 transform hover:scale-105 focus:outline-none focus:ring-none w-full cursor-pointer";

  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-300 text-gray-800 hover:bg-zinc-400",
    danger: "bg-red-600 text-white hover:bg-red-700",
    warning: "bg-yellow-400",
    success: "bg-green-600 text-white hover:bg-green-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[type]} ${customStyle} ${
        disabled ? "cursor-not-allowed opacity-80" : "active:scale-100"
      }`}
      disabled={disabled}
    >
      {!children ? (
        text
      ) : (
        <div className="flex flex-row space-x-2">
          <span>{text}</span>
          {children}
        </div>
      )}
    </button>
  );
};

export default Button;
