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
        focus:ring-2 ring-0 focus:ring-(--color-zus-green) focus:border-transparent transition-all
        duration-200 placeholder:text-gray-500 bg-white text-gray-700 font-inherit text-base ${customClass}`}
      style={{
        fontFamily: 'inherit',
        fontSize: 'inherit'
      }}
    >
      {placeholder && (
        <option 
          value="" 
          disabled 
          hidden
          className="text-gray-400 bg-white"
        >
          {placeholder}
        </option>
      )}
      {options.map((option, index) => (
        <option 
          key={index} 
          value={option}
          className="text-gray-700 bg-white py-2 px-4"
        >
          {option}
        </option>
      ))}
    </select>
  );
};

export default DropdownList;