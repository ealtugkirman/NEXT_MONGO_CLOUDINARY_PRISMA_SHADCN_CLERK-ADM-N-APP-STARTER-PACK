import React from "react";
import Link from "next/link";

const AdminCard = ({ href, title }) => {
  return (
    <Link
      href={href}
      className=" w-60 h-60 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-4 flex flex-col items-center justify-center text-center">
      <div className="w-8 h-8 mb-2 text-gray-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-full h-full">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    </Link>
  );
};

export default AdminCard;