import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// استيراد الـ Layout والصفحات
import Layout from "./Components/Layout/Layout.jsx";
import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login.jsx";
import Register from "./Pages/Register/Register.jsx";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./Pages/ResetPassword/ResetPassword.jsx";
// import VerifyEmail from "./Pages/VerifyEmail/VerifyEmail.jsx"; // <<< 1. مش محتاجينه
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.jsx";
import CategoryPage from "./Pages/Category/Category.jsx";

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
      // {
      //   path: "verify-email", // <<< 2. شيلنا الراوت ده
      //   element: <VerifyEmail />,
      // },
      {
        path: "category/:id",
        element: <CategoryPage />,
      },
      {
        path: "my-plan",
        element: (
          <ProtectedRoute>
            <div className="p-8" dir="rtl">
              <h1 className="text-3xl font-bold">صفحة خطتي (محمية)</h1>
              <p>هذه الصفحة لا يمكن الوصول إليها إلا بعد تسجيل الدخول.</p>
            </div>
          </ProtectedRoute>
        ),
      },
      {
        path: "featured-courses",
        element: (
          <ProtectedRoute>
            <div className="p-8" dir="rtl">
              <h1 className="text-3xl font-bold">
                صفحة الدورات المميزة (محمية)
              </h1>
            </div>
          </ProtectedRoute>
        ),
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <div className="p-8" dir="rtl">
              <h1 className="text-3xl font-bold">صفحة السلة (محمية)</h1>
            </div>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
