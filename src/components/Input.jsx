import React from "react";

const Input = ({
  children,
  type,
  placeholder,
  value,
  onChange,
  customClass,
}) => {
  if (children) throw new Error("'Input' component cannot receive children");

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-0 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${customClass}`}
    />
  );
};

export default Input;
