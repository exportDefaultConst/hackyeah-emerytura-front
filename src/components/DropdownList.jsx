import React from "react";

const DropdownList = ({
  children,
  value,
  onChange,
  customClass,
  options,
  placeholder,
}) => {
  if (children) throw new Error("'DropdownList' component cannot receive children");

  return (
    <select
      value={value || ""}
      onChange={onChange}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none
        focus:ring-2 ring-0 focus:ring-indigo-500 focus:border-transparent transition-all
        duration-200 ${customClass}`}
    >
      {placeholder && (
        <option value="" disabled hidden selected>
          {placeholder}
        </option>
      )}
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default DropdownList;