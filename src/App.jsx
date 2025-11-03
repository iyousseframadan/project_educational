import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// استيراد الـ Layout والصفحات
import Layout from "./Components/Layout/Layout.jsx";
import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login.jsx";
import Register from "./Pages/Register/Register.jsx";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./Pages/ResetPassword/ResetPassword.jsx";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.jsx";
import CategoryPage from "./Pages/Category/Category.jsx";
import Dashboard from "./Pages/Student/Dashboard.jsx"; // صفحة لوحة التحكم الجديدة

// 2. تعريف الراوتر
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "category/:id",
        element: <CategoryPage />,
      }, // ==================================== //             الروابط المحمية // ====================================
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "my-plan", // تم توجيهه مؤقتاً للداشبورد
        element: (
          <ProtectedRoute>
            <Dashboard />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "my-courses", // مسار كورساتي (تحتاج بناء صفحة my-courses.jsx)
        element: (
          <ProtectedRoute>
            {" "}
            <div className="p-8" dir="rtl">
              {" "}
              <h1 className="text-3xl font-bold">
                صفحة كورساتي (تحتاج بناء)
              </h1>{" "}
            </div>{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "my-transfers", // مسار المعاملات (تحتاج بناء صفحة my-transfers.jsx)
        element: (
          <ProtectedRoute>
            {" "}
            <div className="p-8" dir="rtl">
              {" "}
              <h1 className="text-3xl font-bold">
                سجل المعاملات (تحتاج بناء)
              </h1>{" "}
            </div>{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "cart", // السلة (افتراضياً تحتاج مصادقة للدفع)
        element: (
          <ProtectedRoute>
            {" "}
            <div className="p-8" dir="rtl">
              {" "}
              <h1 className="text-3xl font-bold">صفحة السلة (محمية)</h1>{" "}
            </div>{" "}
          </ProtectedRoute>
        ),
      }, // ==================================== //             الروابط العامة // ====================================
      {
        path: "featured-courses",
        element: (
          <div className="p-8" dir="rtl">
            {" "}
            <h1 className="text-3xl font-bold">
              صفحة الدورات المميزة (عامة){" "}
            </h1>{" "}
          </div>
        ),
      },
      {
        path: "about-us",
        element: (
          <div className="p-8" dir="rtl">
            {" "}
            <h1 className="text-3xl font-bold">من نحن (تحتاج بناء)</h1>{" "}
          </div>
        ),
      },
      {
        path: "articles",
        element: (
          <div className="p-8" dir="rtl">
            {" "}
            <h1 className="text-3xl font-bold">المقالات (تحتاج بناء)</h1>{" "}
          </div>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
