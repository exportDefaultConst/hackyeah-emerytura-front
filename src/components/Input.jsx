import React from "react";

const Input = ({
  children,
  type,
  placeholder,
  value,
  onChange,
  customClass,
  step = 1,
  min = 1000,
  max = 10000,
}) => {
  if (children) throw new Error("'Input' component cannot receive children");

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-0 focus:ring-(--color-zus-green) focus:border-transparent transition-all duration-200 ${customClass}`}
      step={step}
      min={min}
      max={max}
    />
  );
};

export default Input;
