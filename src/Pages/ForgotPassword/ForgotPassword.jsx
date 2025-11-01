import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = "https://api-ed.zynqor.org/api/auth";

export default function ForgotPassword() {
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // <<< رسالة النجاح
  const [loading, setLoading] = useState(false);

  // 1. لوجيك إرسال الفورم
  async function handleForgotPassword(values) {
    setLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const { data } = await axios.post(`${BASE_URL}/forgot-password`, values);
      console.log("Forgot Password Success:", data);
      setSuccessMessage(
        data.message ||
          "تم إرسال رابط إعادة التعيين بنجاح. يرجى مراجعة بريدك الإلكتروني."
      );
    } catch (error) {
      console.error("Forgot Password Error:", error);
      setApiError(
        error.response?.data?.message || "حدث خطأ ما، يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  }

  // 2. قواعد التحقق (Validation)
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("البريد الإلكتروني غير صالح")
      .required("البريد الإلكتروني مطلوب"),
  });

  // 3. إعداد Formik
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: handleForgotPassword,
  });

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-100 p-4"
      dir="rtl"
    >
      <div className="text-center mb-8">
        <span className="text-5xl">🎓</span>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">المئة</h1>
        <p className="text-gray-600">التعليمية</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-12">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          نسيت كلمة المرور؟
        </h2>
        <p className="text-center text-gray-600 mb-8">
          لا تقلق. أدخل بريدك الإلكتروني المسجل لدينا وسنرسل لك رابطاً لإعادة
          تعيين كلمة المرور.
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* رسالة النجاح */}
          {successMessage && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {successMessage}
            </div>
          )}
          {/* رسالة الخطأ */}
          {apiError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="example@mail.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            ) : null}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!successMessage} // تعطيل الزرار لو بيحمل أو لو نجح
            className="w-full p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "إرسال الرابط"
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="text-center text-sm text-gray-600 mt-8">
          تذكرت كلمة المرور؟{" "}
          <Link
            to="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            العودة لتسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
