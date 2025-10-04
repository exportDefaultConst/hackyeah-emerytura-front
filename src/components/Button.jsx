import React from "react";

const Button = ({
  children,
  type = "primary",
  text,
  onClick,
  disabled = false,
  customStyle = "",
}) => {
  const baseClasses = "px-4 py-2 font-semibold rounded-lg shadow-md duration-200 transform focus:outline-none focus:ring-none w-full";

  const variantClasses = {
    primary: "bg-(--color-zus-green) text-white transition-all duration-300",
    secondary: "bg-gray-300 text-gray-800",
    danger: "bg-red-600 text-white",
    warning: "bg-yellow-400",
    success: "bg-green-600 text-white",
  };

  const hoverClasses = {
    primary: "hover:bg-(--color-zus-white) hover:text-(--color-zus-green) hover:scale-105",
    secondary: "hover:bg-zinc-400 hover:scale-105",
    danger: "hover:bg-red-700 hover:scale-105",
    warning: "hover:scale-105",
    success: "hover:bg-green-700 hover:scale-105",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[type]} ${customStyle} ${
        disabled 
          ? "cursor-not-allowed opacity-80" 
          : `cursor-pointer active:scale-100 ${hoverClasses[type]}`
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
