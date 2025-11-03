/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserContext } from "../../context/UserContext.jsx";
import CourseCard from "../../Components/CourseCard/CourseCard.jsx";
import Pagination from "../../Components/Pagination/Pagination.jsx";
import toast from "react-hot-toast";

// --- Endpoints ---
const API_BASE_URL = "https://api-ed.zynqor.org/api/student";

// 1. دالة جلب كورسات الطالب
const fetchMyCourses = async (token, filters) => {
  if (!token) throw new Error("Authentication token is missing.");

  const params = {
    locale: "ar",
    take: filters.take,
    search: filters.search,
    status: filters.status,
  };

  try {
    const { data } = await axios.get(`${API_BASE_URL}/my-courses`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return { courses: data?.data || [], meta: data?.meta || {} };
  } catch (error) {
    console.error("My Courses API Error:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "فشل في جلب دوراتي");
  }
};

export default function MyCourses() {
  const { userData: token } = useContext(UserContext);

  const [filters, setFilters] = useState({
    status: "all", // active, completed, dropped, all
    search: "",
    take: "all", // نستخدم 'all' مبدئياً لعرض جميع الكورسات
  });

  const {
    data: coursesData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["myCourses", token, filters],
    queryFn: () => fetchMyCourses(token, filters),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const handleStatusChange = (status) => {
    setFilters((prev) => ({ ...prev, status, take: "all" }));
  };
  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, take: "all" }));
  };

  const coursesList = coursesData?.courses || [];
  const totalCourses = coursesData?.meta?.total_count || 0;

  if (isLoading && !isFetching) {
    return (
      <div className="text-center p-20">جاري تحميل دوراتك المسجل فيها...</div>
    );
  }
  if (isError) {
    return (
      <div className="text-center p-20 text-red-600" dir="rtl">
        <h1 className="text-2xl font-bold">🚫 خطأ في جلب كورساتي</h1>
        <p className="mt-2 text-gray-700">{error.message}</p>{" "}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      {" "}
      <h1 className="text-4xl font-black text-gray-800 mb-8">
        دوراتي المسجل فيها
      </h1>
      {/* فلاتر البحث والحالة */}{" "}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex flex-wrap gap-4 items-center justify-between">
        {/* أزرار الحالة */}{" "}
        <div className="flex gap-3">
          {" "}
          {["all", "active", "completed", "dropped"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                filters.status === status
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              }`}
            >
              {" "}
              {status === "all"
                ? "الكل"
                : status === "active"
                ? "نشطة"
                : status === "completed"
                ? "مكتملة"
                : "متوقفة"}{" "}
            </button>
          ))}{" "}
        </div>
        {/* حقل البحث */}{" "}
        <div className="relative w-full md:w-auto md:flex-grow max-w-sm">
          {" "}
          <input
            type="text"
            placeholder="ابحث باسم الدورة..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          />{" "}
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>{" "}
        </div>{" "}
      </div>
      {/* نتائج الدورات */}{" "}
      <h2 className="text-xl font-bold text-gray-700 mb-6">
        {isFetching ? "جاري البحث..." : `النتائج: ${totalCourses} دورة`}{" "}
      </h2>{" "}
      {coursesList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {" "}
          {coursesList.map(
            (
              course // ملاحظة: نستخدم CourseCard العادي، لكن يجب أن نمرر بيانات الـ enrollment لـ CourseCard إذا أردنا عرض شريط التقدم!
            ) => (
              <CourseCard
                key={course.course_id} // ندمج بيانات الكورس مع بيانات التسجيل لتمكين عرض التقدم
                course={{
                  ...course,
                  progress: course.enrollment.progress_percentage,
                  status: course.enrollment.status,
                }}
              />
            )
          )}{" "}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-2xl shadow-sm text-center">
          {" "}
          <p className="text-xl font-semibold text-gray-700">
            لا توجد دورات مسجل فيها حالياً مطابقة لهذه الفلاتر.{" "}
          </p>{" "}
          <p className="text-gray-500 mt-2">
            إذا كنتِ قد سجلتِ في دورات بالفعل، حاولي مسح شريط البحث.{" "}
          </p>{" "}
        </div>
      )}{" "}
      {/* ملاحظة: الـ API الحالي لا يوفر ترقيم صفحات (Pagination) لهذا المسار، لذا لا نحتاج لـ Pagination Component */}{" "}
    </div>
  );
}
