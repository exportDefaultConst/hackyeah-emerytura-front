import React from "react";

const Card = ({
  children,
  customClass,
  title,
  description,
  secondaryDescription, // new optional prop
  imageSrc,
  button,
  variant = "default", // new prop for card variant
}) => {
  // Helper function to format text with bold numbers
  const formatTextWithBoldNumbers = (text) => {
    if (!text) return null;
    
    // Split text by numbers and format them
    const parts = text.toString().split(/(\d+(?:[\.,]\d+)*)/g);
    
    return parts.map((part, index) => {
      // Check if part is a number (including decimals and commas)
      if (/^\d+(?:[\.,]\d+)*$/.test(part)) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  // Determine card styling based on variant
  const getCardClasses = () => {
    if (variant === "zus") {
      return "bg-(--color-zus-green) border-2 border-gray-300 text-white";
    }
    if (variant === "highlight") {
      return "bg-white border-2 border-(--color-zus-green)";
    }
    return "bg-white border border-gray-200";
  };

  const getTitleClasses = () => {
    if (variant === "zus") {
      return "font-semibold text-lg mb-2 text-white"; // smaller font for ZUS variant
    }
    if (variant === "highlight") {
      return "font-medium text-lg mb-2 text-zus-dark-blue"; // smaller title for highlight variant
    }
    return "font-bold text-3xl mb-2";
  };

  const getDescriptionClasses = () => {
    if (variant === "zus") {
      return "text-gray-100"; // lighter text for ZUS variant
    }
    if (variant === "highlight") {
      return "text-3xl font-medium text-zus-blue"; // bigger, bold description for highlight variant
    }
    return "text-gray-600";
  };

  const getSecondaryDescriptionClasses = () => {
    if (variant === "highlight") {
      return "text-sm text-zus-dark-blue mt-1"; // small font for highlight variant
    }
    if (variant === "zus") {
      return "text-sm text-gray-200 mt-1"; // small font for ZUS variant
    }
    return "text-sm text-gray-500 mt-1"; // small font for default variant
  };

  return (
    <div
      className={`${getCardClasses()} rounded-2xl shadow-lg p-3 m-4 ${customClass} `}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={"Card image"}
          className="w-16 h-16 rounded-full mr-4"
        />
      )}
      <div className="flex-1">
        <h2 className={getTitleClasses()}>
          {formatTextWithBoldNumbers(title)}
        </h2>
        {description && (
          <p className={getDescriptionClasses()}>
            {formatTextWithBoldNumbers(description)}
          </p>
        )}
        {secondaryDescription && (
          <p className={getSecondaryDescriptionClasses()}>
            {formatTextWithBoldNumbers(secondaryDescription)}
          </p>
        )}
      </div>
      {button && <div className="ml-4">{button}</div>}
      {children}
    </div>
  );
};

export default Card;
