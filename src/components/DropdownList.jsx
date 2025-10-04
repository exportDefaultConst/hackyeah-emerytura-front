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
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none
        focus:ring-2 ring-0 focus:ring-indigo-500 focus:border-transparent transition-all
        duration-200 placeholder:text-gray-500 ${customClass}`}
    >
      {placeholder && (
        <option value="" disabled hidden>
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