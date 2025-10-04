import React from "react";

const Card = ({ children, customClass, title, description }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 m-4 ${customClass}`}
    >
      <h2 className="font-bold text-2xl">{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
};

export default Card;
