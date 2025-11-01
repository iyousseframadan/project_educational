import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CourseCard from "../../Components/CourseCard/CourseCard.jsx";
import FiltersSidebar from "../../Components/FiltersSidebar/FiltersSidebar.jsx";
import Pagination from "../../Components/Pagination/Pagination.jsx";

// <<< *** بداية التعديل ***
// (استخدام الرابط الكامل بدلاً من البروكسي)
const API_BASE_URL = "https://api-ed.zynqor.org/api/public";
// >>> *** نهاية التعديل ***

// --- أيقونات (زي ما هي) ---
const Icons = {
  Sort: (props) => <span {...props}>⇅</span>,
  Filter: (props) => <span {...props}>🔧</span>,
  Star: (props) => <span {...props}>⭐</span>,
};
// --------------------

const fetchCategoryInfo = async (id) => {
  if (!id) return null;
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/categories/${id}?locale=ar`
    ); // (حسب التوثيق، البيانات داخل data.data)
    return data?.data || null;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

const fetchCourses = async (categoryId, filters) => {
  if (!categoryId) return null;

  const params = {
    locale: "ar",
    category_id: categoryId,
    page: filters.page,
    sort: filters.sort,
  };
  if (filters.level) {
    params.difficulty_level = filters.level;
  }
  if (filters.price_min !== null) {
    params.price_min = filters.price_min;
  }
  if (filters.price_max !== null) {
    params.price_max = filters.price_max;
  }

  try {
    // (حسب التوثيق، الكورسات بتيجي من /courses)
    const { data } = await axios.get(`${API_BASE_URL}/courses`, { params });
    return data?.data || null;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};
// ----------------------------------------

export default function CategoryPage() {
  const { id } = useParams();

  const [filters, setFilters] = useState({
    sort: "popular",
    page: 1,
    level: null,
    price_key: null,
    price_min: null,
    price_max: null,
  }); // --- Query 1: جلب بيانات القسم (للبانر والكورسات المبدئية) ---

  const {
    data: categoryData,
    isLoading: isCategoryInfoLoading,
    isError: isCategoryInfoError,
    error: categoryInfoError, // (أضفنا متغير الخطأ)
  } = useQuery({
    queryKey: ["categoryInfo", id],
    queryFn: () => fetchCategoryInfo(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: 1, // (هيقلل محاولات إعادة الطلب عند الفشل)
  }); // --- Query 2: جلب الدورات (لما الفلاتر تتغير) ---

  const {
    data: coursesData,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
  } = useQuery({
    queryKey: ["courses", id, filters],
    queryFn: () => fetchCourses(id, filters), // (enabled: true دائماً لجلب الفلاتر، لكن سنعتمد على الدمج الذكي)
    enabled: !!id,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 1,
  }); // *** الدمج الذكي ***

  const finalCoursesData =
    filters.page === 1 &&
    !filters.level &&
    filters.price_key === null &&
    filters.sort === "popular"
      ? categoryData?.courses // (البيانات المبدئية من API القسم)
      : coursesData; // (البيانات المفلترة من API الكورسات) // --- دوال تغيير الفلاتر ---

  const handleSortChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      sort: e.target.value,
      page: 1,
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }; // ----------------------------- // --- حالات اللوادينج والأخطاء ---
  if (isCategoryInfoLoading) {
    return <div className="text-center p-20">جاري تحميل بيانات القسم...</div>;
  }

  if (isCategoryInfoError) {
    return (
      <div className="text-center p-20 text-red-600" dir="rtl">
        {" "}
        <h1 className="text-2xl font-bold">
          🚫 حدث خطأ أثناء جلب بيانات القسم.{" "}
        </h1>{" "}
        <p className="mt-2">
          (تأكد أن الـ ID `{id}` موجود وصحيح في الباك إند){" "}
        </p>{" "}
        <p className="mt-1 text-sm text-gray-500">
          {categoryInfoError?.message}{" "}
        </p>{" "}
      </div>
    );
  } // (إضافة: لو القسم موجود بس مفيش كورسات خالص)

  const categoryDetails = categoryData?.category;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* البانر (هيستخدم بيانات Query 1) */}{" "}
      {categoryDetails && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16 md:py-24 text-center">
          {" "}
          <div className="container mx-auto px-4">
            {" "}
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              {categoryDetails.name}{" "}
            </h1>{" "}
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              {categoryDetails.description}{" "}
            </p>{" "}
          </div>{" "}
        </div>
      )}
      {/* منطقة المحتوى (الفلاتر والدورات) */}{" "}
      <div className="container mx-auto px-4 py-12">
        {" "}
        <div className="flex flex-col lg:flex-row gap-8" dir="rtl">
          {/* السايدبار */}{" "}
          <aside className="w-full lg:w-1/4">
            {" "}
            <FiltersSidebar
              currentFilters={filters}
              onFilterChange={handleFilterChange}
            />{" "}
          </aside>
          {/* المحتوى الرئيسي */}{" "}
          <main className="w-full lg:w-3/4">
            {/* شريط الترتيب */}{" "}
            <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between mb-6">
              {" "}
              <span className="font-semibold text-gray-700">
                {" "}
                {isCoursesLoading
                  ? "جاري البحث..."
                  : `عثرنا على ${finalCoursesData?.total || 0} دورة`}{" "}
              </span>{" "}
              <div className="flex items-center gap-2">
                <Icons.Sort />{" "}
                <select
                  value={filters.sort}
                  onChange={handleSortChange}
                  className="border-gray-300 rounded-lg text-sm font-semibold focus:ring-purple-500 focus:border-purple-500"
                >
                  {" "}
                  <option value="popular">الأكثر شيوعاً</option>
                  <option value="newest">الأحدث</option>{" "}
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="price_low">السعر: من الأقل</option>
                  <option value="price_high">السعر: من الأعلى</option>{" "}
                </select>{" "}
              </div>{" "}
            </div>
            {/* شبكة الدورات */}{" "}
            {isCoursesLoading && !finalCoursesData ? (
              <div className="text-center p-20">جاري تحميل الدورات...</div>
            ) : isCoursesError ? (
              <div className="text-center p-20 text-red-600">
                <h1>حدث خطأ أثناء فلترة الدورات.</h1>{" "}
              </div>
            ) : finalCoursesData && finalCoursesData.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {" "}
                {finalCoursesData.data.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}{" "}
              </div>
            ) : (
              <div className="text-center p-20 bg-white rounded-2xl shadow-sm">
                {" "}
                <p className="text-xl font-semibold text-gray-700">
                  😕 لا توجد دورات تطابق هذه الفلاتر حالياً.{" "}
                </p>{" "}
                <p className="text-gray-500 mt-2">
                  حاول تغيير اختياراتك أو مسح الفلاتر.{" "}
                </p>{" "}
              </div>
            )}
            {/* الـ Pagination */}{" "}
            {finalCoursesData && finalCoursesData.last_page > 1 && (
              <Pagination
                currentPage={finalCoursesData.current_page}
                lastPage={finalCoursesData.last_page}
                onPageChange={handlePageChange}
              />
            )}{" "}
          </main>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
