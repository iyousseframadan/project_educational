import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const BASE_URL = "https://api-ed.zynqor.org/api/auth";

export default function ResetPassword() {
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 1. قراءة التوكن والإيميل من اللينك (URL)

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email"); // 2. لوجيك إرسال الفورم

  async function handleResetPassword(values) {
    setLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    const payload = {
      email: email, // من الـ URL
      token: token, // من الـ URL
      password: values.password,
      password_confirmation: values.password_confirmation,
    };

    try {
      const { data } = await axios.post(`${BASE_URL}/reset-password`, payload);
      setSuccessMessage(data.message || "تم تغيير كلمة المرور بنجاح!"); // بعد 3 ثواني، وديه لصفحة اللوجن
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error(
        "Reset Password Error:",
        error.response?.data || error.message
      );
      setApiError(
        error.response?.data?.message ||
          "حدث خطأ ما. قد يكون الرابط غير صالح أو انتهت صلاحيته."
      );
    } finally {
      setLoading(false);
    }
  } // 3. قواعد التحقق

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      .required("كلمة المرور الجديدة مطلوبة"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password")], "كلمتا المرور غير متطابقتين")
      .required("تأكيد كلمة المرور مطلوب"),
  }); // 4. إعداد Formik

  const formik = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validationSchema,
    onSubmit: handleResetPassword,
  }); // لو مفيش توكن أو إيميل في اللينك، نعرض رسالة خطأ

  if (!token || !email) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-100 p-4"
        dir="rtl"
      >
                            
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
                                    
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            رابط غير صالح
          </h2>
                                    
          <p className="text-gray-700">
                                          رابط إعادة تعيين كلمة المرور هذا غير مكتمل أو
            غير صالح. يرجى المحاولة مرة أخرى من صفحة "نسيت كلمة المرور".            
                          
          </p>
                                    
          <Link
            to="/forgot-password"
            className="text-purple-600 font-semibold hover:underline mt-4 inline-block"
          >
                                          العودة                           
          </Link>
                              
        </div>
                   {" "}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-100 p-4"
      dir="rtl"
    >
              {" "}
      <div className="text-center mb-8">
                    <span className="text-5xl">🎓</span>           {" "}
        <h1 className="text-3xl font-bold text-gray-800 mt-2">المئة</h1>           {" "}
        <p className="text-gray-600">التعليمية</p>        {" "}
      </div>
              {" "}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-12">
                   {" "}
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
                         إعادة تعيين كلمة المرور            {" "}
        </h2>
                   {" "}
        <p className="text-center text-gray-600 mb-8">
                         أدخل كلمة مرور جديدة لحسابك.            {" "}
        </p>
                   {" "}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {" "}
          {successMessage && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                                   {successMessage}                 {" "}
            </div>
          )}
                        {" "}
          {apiError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                   {apiError}                 {" "}
            </div>
          )}
                         {/* Password */}              {" "}
          <div>
                             {" "}
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
                                   كلمة المرور الجديدة                  {" "}
            </label>
                             {" "}
            <input
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="ادخل كلمة المرور الجديدة"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
                             {" "}
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500 text-xs mt-1">
                                        {formik.errors.password}                    {" "}
              </p>
            ) : null}
                          {" "}
          </div>
                         {/* Password Confirmation */}              {" "}
          <div>
                             {" "}
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
                                   تأكيد كلمة المرور الجديدة                  {" "}
            </label>
                             {" "}
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password_confirmation}
              placeholder="أعد إدخال كلمة المرور"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
                             {" "}
            {formik.touched.password_confirmation &&
            formik.errors.password_confirmation ? (
              <p className="text-red-500 text-xs mt-1">
                                        {formik.errors.password_confirmation}                 
                  {" "}
              </p>
            ) : null}
                          {" "}
          </div>
                         {/* Submit Button */}              {" "}
          <button
            type="submit"
            disabled={loading || !!successMessage}
            className="w-full p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
                             {" "}
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                                       {" "}
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                                       {" "}
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
                                    {" "}
              </svg>
            ) : (
              "تأكيد وتغيير كلمة المرور"
            )}
                        {" "}
          </button>
                     {" "}
        </form>
                {" "}
      </div>
           {" "}
    </div>
  );
}
