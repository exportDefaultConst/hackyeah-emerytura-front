import React from "react";
import Divider from "./Divider";

const Details = ({ details }) => {
  if (!details) return <span>Brak danych do wyświetlenia</span>;

  return Object.keys(details).map((detail, i) => {
    return (
      <div key={detail}>
        {i !== 0 && <Divider />}
        <div className="flex justify-between py-3" key={detail}>
          <span className="text-gray-600 font-medium">
            {detail[0].toUpperCase() + detail.slice(1)}:
          </span>
          <span className="text-gray-900">{details[detail]}</span>
        </div>
      </div>
    );
  });
};

export default Details;
