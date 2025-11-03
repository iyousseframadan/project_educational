/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CourseCard from "../../Components/CourseCard/CourseCard.jsx";
import FiltersSidebar from "../../Components/FiltersSidebar/FiltersSidebar.jsx";
import Pagination from "../../Components/Pagination/Pagination.jsx";

const API_BASE_URL = "https://api-ed.zynqor.org/api/public";

// --- أيقونات (للاختصار) ---
const Icons = {
  Sort: (props) => <span {...props}>⇅</span>,
};
// --------------------

// 1. دالة جلب معلومات القسم (مهمة: ترجع البيانات المضمنة)
const fetchCategoryInfo = async (id) => {
  if (!id) return null;
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/categories/${id}?locale=ar`
    );
    return data?.data || null;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return null;
  }
};

// 2. دالة جلب الدورات (تُستخدم فقط عند تطبيق الفلاتر)
const fetchCourses = async (categoryId, filters) => {
  // يجب أن نُنفذ هذه الدالة فقط إذا كانت هناك فلاتر مطبقة (غير الصفحة الأولى والترتيب الافتراضي)
  const hasFiltersApplied =
    filters.level !== null ||
    filters.price_min !== null ||
    filters.sort !== "popular";
  if (!categoryId || !hasFiltersApplied) {
    return null;
  }

  const params = {
    locale: "ar",
    category_id: categoryId,
    page: filters.page,
    sort: filters.sort,
    ...(filters.level && { difficulty_level: filters.level }),
    ...(filters.price_min !== null && { price_min: filters.price_min }),
    ...(filters.price_max !== null && { price_max: filters.price_max }),
  };

  try {
    const { data } = await axios.get(`${API_BASE_URL}/courses`, { params });
    return data?.data || null;
  } catch (error) {
    console.error("Error fetching filtered courses:", error);
    return null;
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
  });

  // تحديد ما إذا كان قد تم تطبيق أي فلاتر غير الافتراضية
  const isFiltering =
    filters.level !== null ||
    filters.price_key !== null ||
    filters.sort !== "popular" ||
    filters.page > 1;

  // Query 1: جلب بيانات القسم (للبانر والكورسات الأساسية)
  const {
    data: categoryData,
    isLoading: isCategoryInfoLoading,
    isError: isCategoryInfoError,
    error: categoryInfoError,
  } = useQuery({
    queryKey: ["categoryInfo", id],
    queryFn: () => fetchCategoryInfo(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Query 2: جلب الدورات (يتم تفعيله فقط إذا كان هناك فلاتر مطبقة)
  const {
    data: coursesData,
    isError: isCoursesError,
    isFetching: isCoursesFetching,
  } = useQuery({
    queryKey: ["courses", id, filters],
    queryFn: () => fetchCourses(id, filters),
    enabled: !!id && isFiltering, // <--- يتم التفعيل عند تطبيق الفلاتر فقط
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // دوال تغيير الفلاتر (كما هي)
  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }));
  };
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // *** حالة التحميل والأخطاء الأولية ***
  if (isCategoryInfoLoading) {
    return <div className="text-center p-20">جاري تحميل بيانات القسم...</div>;
  }

  // إذا فشل جلب بيانات القسم الأساسية
  if (isCategoryInfoError || !categoryData) {
    // هنا قد نحتاج للتعامل مع الحالة التي يُرجع فيها API /categories/1 قائمة بدلاً من Object
    return (
      <div className="text-center p-20 text-red-600" dir="rtl">
        <h1 className="text-2xl font-bold">
          🚫 حدث خطأ أثناء جلب بيانات القسم الأساسية.
        </h1>
        <p className="mt-2">
          (تأكد أن الـ Category ID `{id}` صحيح ومتاح في الباك إند)
        </p>
      </div>
    );
  }

  // ----------------------------------------------------
  // *** منطق تحديد مصدر البيانات (الإصلاح الذي يعيد الكاردات) ***

  // 1. محاولة استخراج بيانات القسم (سواء كانت Object أو مصفوفة)
  const categoryDetails =
    categoryData?.category || categoryData[0] || categoryData;

  // 2. تحديد مصدر الكورسات:
  // - إذا كانت الفلاتر مطبقة و coursesData موجودة وصحيحة، نستخدمها.
  // - وإلا، نستخدم الكورسات المضمنة في استجابة القسم الأصلية (categoryData.courses).
  const fallbackData = categoryData?.courses;

  const finalData = isFiltering && coursesData ? coursesData : fallbackData;

  // استخراج القائمة النهائية والعدد الإجمالي بأمان
  const coursesList = Array.isArray(finalData?.data) ? finalData.data : [];
  const totalCourses = finalData?.total || 0;

  // ----------------------------------------------------

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* البانر */}{" "}
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
      )}{" "}
      <div className="container mx-auto px-4 py-12">
        {" "}
        <div className="flex flex-col lg:flex-row gap-8" dir="rtl">
          {" "}
          <aside className="w-full lg:w-1/4">
            {" "}
            <FiltersSidebar
              currentFilters={filters}
              onFilterChange={handleFilterChange}
            />{" "}
          </aside>{" "}
          <main className="w-full lg:w-3/4">
            {/* شريط الترتيب */}{" "}
            <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between mb-6">
              {" "}
              <span className="font-semibold text-gray-700">
                {" "}
                {isCoursesFetching && coursesList.length === 0
                  ? "جاري البحث عن دورات..."
                  : `عثرنا على ${totalCourses} دورة`}{" "}
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
            {isCoursesFetching && coursesList.length === 0 ? (
              <div className="text-center p-20">جاري تحميل الدورات...</div>
            ) : coursesList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {" "}
                {coursesList.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}{" "}
              </div>
            ) : (
              <div className="text-center p-20 bg-white rounded-2xl shadow-sm">
                {" "}
                <p className="text-xl font-semibold text-gray-700">
                  😕 لا توجد دورات متاحة حالياً لهذا القسم.
                </p>{" "}
                <p className="text-gray-500 mt-2">
                  حاول تغيير اختياراتك أو مسح الفلاتر.
                </p>{" "}
              </div>
            )}
            {/* الـ Pagination */}{" "}
            {finalData?.last_page > 1 && (
              <Pagination
                currentPage={finalData.current_page}
                lastPage={finalData.last_page}
                onPageChange={handlePageChange}
              />
            )}{" "}
          </main>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
