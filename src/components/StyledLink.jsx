import React from "react";
import { Link } from "react-router";

const styles = {
  default:
    "text-gray-600 hover:text-indigo-600 transition-colors duration-300 font-semibold",
  footer: "text-gray-300 hover:text-white transition-colors duration-300",
};

const StyledLink = ({
  children,
  type = "default",
  target,
  text,
  customStyle = "",
}) => {
  return (
    <Link to={target} className={`${styles[type]} ${customStyle}`}>
      {children ? (
        <div className="flex flex-row">
          <span>{text}</span> {children}
        </div>
      ) : (
        text
      )}
    </Link>
  );
};

export default StyledLink;
