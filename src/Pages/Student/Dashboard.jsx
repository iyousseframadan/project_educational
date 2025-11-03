/* eslint-disable no-unused-vars */
// src/Pages/Student/Dashboard.jsx
import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserContext } from "../../context/UserContext.jsx";
import DashboardCard from "../../Components/Dashboard/DashboardCard.jsx";
import DashboardCourseCard from "../../Components/Dashboard/DashboardCourseCard.jsx"; // استخدام الكومبوننت الجديد
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// --- أيقونات (Emojis) ---
const Icons = {
  TotalCourses: "📚",
  CompletedCourses: "✅",
  ActiveCourses: "🏃",
  Wallet: "💰",
  Wishlist: "❤️",
};

// --- Endpoints ---
const API_BASE_URL = "https://api-ed.zynqor.org/api/student";

// 1. جلب بيانات لوحة التحكم (Overview)
const fetchDashboardOverview = async (token) => {
  if (!token) throw new Error("Authentication token is missing.");
  try {
    const { data } = await axios.get(`${API_BASE_URL}/overview?locale=ar`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": "ar",
      },
    });
    return data?.data;
  } catch (error) {
    console.error("Dashboard API Error:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message || "فشل في جلب بيانات لوحة التحكم"
    );
  }
};

export default function Dashboard() {
  const { userData: token } = useContext(UserContext); // الـ userData هو الـ token هنا

  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["studentDashboard", token],
    queryFn: () => fetchDashboardOverview(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  if (isLoading) {
    return <div className="text-center p-20">جاري تحميل لوحة التحكم... ⏳</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-20 text-red-600" dir="rtl">
        {" "}
        <h1 className="text-2xl font-bold">🚫 لا يمكن عرض لوحة التحكم</h1>
        <p className="mt-2 text-gray-700">{error.message}</p>{" "}
      </div>
    );
  }

  const stats = dashboardData?.statistics || {};
  const recentCourses = dashboardData?.recent_courses || [];
  const recentTransactions = dashboardData?.recent_transactions || []; // بيانات بطاقات الإحصائيات (ديناميكية)

  const dashboardCards = [
    {
      title: "إجمالي الدورات",
      value: stats.total_courses,
      icon: Icons.TotalCourses,
      color: "bg-purple-600",
    },
    {
      title: "دورات مكتملة",
      value: stats.completed_courses,
      icon: Icons.CompletedCourses,
      color: "bg-green-600",
    },
    {
      title: "دورات نشطة",
      value: stats.active_courses,
      icon: Icons.ActiveCourses,
      color: "bg-blue-600",
    },
    {
      title: "في المفضلة",
      value: stats.wishlist_count,
      icon: Icons.Wishlist,
      color: "bg-pink-600",
    },
    {
      title: "الرصيد الحالي",
      value: `${parseFloat(stats.wallet_balance).toFixed(2) || 0.0} ر.س`,
      icon: Icons.Wallet,
      color: "bg-amber-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      {" "}
      <h1 className="text-4xl font-black text-gray-800 mb-8">لوحة التحكم 👋</h1>
      {/* 1. إحصائيات سريعة */}{" "}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        {" "}
        {dashboardCards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}{" "}
      </div>
      {/* 2. آخر الدورات النشطة */}{" "}
      <div className="mb-12">
        {" "}
        <div className="flex justify-between items-center mb-6">
          {" "}
          <h2 className="text-2xl font-bold text-gray-800">
            آخر الدورات النشطة
          </h2>
          {/* سنفترض وجود رابط لصفحة my-courses */}{" "}
          <Link
            to="/my-courses"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            عرض الكل &larr;
          </Link>{" "}
        </div>{" "}
        {recentCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {" "}
            {recentCourses.map((course) => (
              <DashboardCourseCard key={course.id} course={course} />
            ))}{" "}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-lg shadow-sm text-center text-gray-600">
            لا توجد دورات نشطة مؤخراً.
          </div>
        )}{" "}
      </div>
      {/* 3. آخر المعاملات المالية */}{" "}
      <div>
        {" "}
        <div className="flex justify-between items-center mb-6">
          {" "}
          <h2 className="text-2xl font-bold text-gray-800">
            آخر المعاملات المالية
          </h2>
          {/* سنفترض وجود رابط لصفحة my-transfers */}{" "}
          <Link
            to="/my-transfers"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            عرض السجل &larr;
          </Link>{" "}
        </div>{" "}
        {recentTransactions.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {" "}
            <table className="min-w-full divide-y divide-gray-200">
              {" "}
              <thead className="bg-gray-50">
                {" "}
                <tr>
                  {" "}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الوصف
                  </th>{" "}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    النوع
                  </th>{" "}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المبلغ
                  </th>{" "}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody className="bg-white divide-y divide-gray-200">
                {" "}
                {recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    {" "}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tx.description}
                    </td>{" "}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {" "}
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.type === "deposit"
                            ? "bg-green-100 text-green-800"
                            : tx.type === "purchase"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {" "}
                        {tx.type === "deposit"
                          ? "إيداع"
                          : tx.type === "purchase"
                          ? "شراء"
                          : "سحب"}{" "}
                      </span>{" "}
                    </td>{" "}
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                        tx.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.amount.toFixed(2)} ر.س{" "}
                    </td>{" "}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {" "}
                      {new Date(tx.created_at).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                    </td>{" "}
                  </tr>
                ))}{" "}
              </tbody>{" "}
            </table>{" "}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-lg shadow-sm text-center text-gray-600">
            لا توجد معاملات مالية حديثة.
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}
