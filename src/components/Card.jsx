import React from "react";

const Card = ({ children, customClass, title, description, imageSrc, button }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-200 m-4 ${customClass} flex items-center`}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={"Card image"}
          className="w-16 h-16 rounded-full mr-4"
        />
      )}
      <div className="flex-1">
        <h2 className="font-bold text-2xl mb-2">{title}</h2>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      {button && <div className="ml-4">{button}</div>}
    </div>
  );
};

export default Card;
