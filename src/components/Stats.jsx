import React from "react";

const Stats = ({ title, stats }) => {
  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(stats).map((stat) => {
            return (
              <div className="text-center" key={stat}>
                <div className="text-2xl font-bold text-indigo-600 mb-2">
                  {stats[stat]}
                </div>
                <div className="text-gray-600 text-sm">{stat}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stats;
