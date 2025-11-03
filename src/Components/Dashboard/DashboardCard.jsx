// src/Components/Dashboard/DashboardCard.jsx

import React from "react";

const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg text-white transform transition-all hover:scale-[1.03] ${color} flex flex-col justify-between h-full`}
    >
      {" "}
      <div className="flex justify-between items-start mb-4">
        <span className="text-4xl font-black">{icon}</span>{" "}
        <h3 className="text-sm font-semibold opacity-90 text-right">{title}</h3>{" "}
      </div>{" "}
      <p className="text-3xl md:text-4xl font-extrabold text-right mt-auto">
        {value}{" "}
      </p>{" "}
    </div>
  );
};

export default DashboardCard;
