// src/Components/Dashboard/DashboardCourseCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const API_STORAGE_URL = "https://api-ed.zynqor.org/storage";
const placeholderImage =
  "https://placehold.co/400x220/E9D5FF/8B5CF6?text=Course";

const DashboardCourseCard = ({ course }) => {
  // بيانات الكورس في لوحة التحكم تأتي من recent_courses:
  // { id, title, slug, thumbnail_url, progress, status }
  const courseImage = course.thumbnail_url
    ? `${API_STORAGE_URL}/${course.thumbnail_url}`
    : placeholderImage;

  const progress = course.progress || 0;
  const statusText =
    course.status === "completed"
      ? "مكتمل"
      : course.status === "dropped"
      ? "متوقف"
      : "نشط";

  const statusColor =
    course.status === "completed"
      ? "bg-green-500"
      : course.status === "dropped"
      ? "bg-red-500"
      : "bg-purple-500";

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
      {" "}
      <Link
        to={`/course/${course.slug || course.id}`}
        className="block relative"
      >
        {" "}
        <img
          src={courseImage}
          alt={course.title}
          className="w-full h-36 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage;
          }}
        />{" "}
        <span
          className={`absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10 ${statusColor}`}
        >
          {statusText}{" "}
        </span>{" "}
      </Link>{" "}
      <div className="p-4 flex flex-col flex-grow">
        {" "}
        <Link to={`/course/${course.slug || course.id}`} className="block">
          {" "}
          <h3 className="text-lg font-bold text-gray-800 hover:text-purple-700 transition-colors line-clamp-2 min-h-[50px]">
            {course.title}{" "}
          </h3>{" "}
        </Link>
        {/* شريط التقدم */}{" "}
        <div className="mt-4 pt-4 border-t border-gray-100">
          {" "}
          <div className="flex justify-between items-center text-sm mb-2 text-gray-600">
            <span>التقدم:</span>{" "}
            <span className="font-bold text-purple-600">{progress}%</span>{" "}
          </div>{" "}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            {" "}
            <div
              className="h-2.5 rounded-full bg-purple-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default DashboardCourseCard;
