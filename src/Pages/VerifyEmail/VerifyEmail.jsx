import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // هنستخدم التوست هنا

const BASE_URL = "https://api-ed.zynqor.org/api/auth";

export default function VerifyEmail() {
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false); // لوادينج لزرار إعادة الإرسال

  const navigate = useNavigate();
  const location = useLocation();

  // 1. هنجيب الإيميل اللي بعتناه من صفحة التسجيل
  const email = location.state?.email;

  // 2. لو مفيش إيميل (حد دخل اللينك ده مباشر)، رجعه للتسجيل
  useEffect(() => {
    if (!email) {
      toast.error("حدث خطأ، يرجى التسجيل أولاً.");
      navigate("/register");
    }
  }, [email, navigate]);

  // 3. لوجيك إرسال كود التفعيل
  async function handleVerify(values) {
    setLoading(true);
    setApiError(null);

    const payload = {
      email: email, // الإيميل اللي جبناه من الخطوة 1
      code: values.code, // الكود اللي اليوزر كتبه
    };

    try {
      const { data } = await axios.post(`${BASE_URL}/verify-email`, payload);
      console.log("Verification Success:", data);

      // نجح! اعرض رسالة وديه لصفحة الدخول
      toast.success(
        data.message || "تم تفعيل حسابك بنجاح! قم بتسجيل الدخول الآن."
      );

      // نوديه لصفحة الدخول بعد ثانيتين
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Verification Error:", error);
      const errorMessage =
        error.response?.data?.message || "الكود غير صحيح أو انتهت صلاحيته.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // 4. لوجيك إعادة إرسال الكود
  async function handleResendCode() {
    setResendLoading(true);
    setApiError(null); // نشيل أي أخطاء قديمة
    toast.loading("جاري إرسال كود جديد..."); // رسالة لوادينج

    try {
      const { data } = await axios.post(`${BASE_URL}/resend-email-code`, {
        email,
      });
      toast.dismiss(); // إخفاء رسالة اللوادينج
      toast.success(data.message || "تم إرسال كود جديد إلى بريدك.");
    } catch (error) {
      toast.dismiss();
      const errorMessage =
        error.response?.data?.message || "لا يمكن إرسال الكود الآن.";
      setApiError(errorMessage); // ممكن نعرض الخطأ في المكان المخصص
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  }

  // 5. قواعد التحقق (Validation)
  const validationSchema = Yup.object({
    code: Yup.string()
      .required("كود التفعيل مطلوب")
      .matches(/^[0-9]+$/, "يجب أن يكون أرقام فقط")
      .length(6, "الكود يجب أن يكون 6 أرقام"), // نفترض إن الكود 6 أرقام، عدلها لو مختلف
  });

  // 6. إعداد Formik
  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema,
    onSubmit: handleVerify,
  });

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-100 p-4"
      dir="rtl"
    >
      <div className="text-center mb-8">
        <span className="text-5xl">📨</span>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">المئة</h1>
        <p className="text-gray-600">التعليمية</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-12">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          تفعيل حسابك
        </h2>
        <p className="text-center text-gray-600 mb-8">
          لقد أرسلنا كود تفعيل مكون من 6 أرقام إلى بريدك الإلكتروني:
          <br />
          <strong className="text-gray-800">{email || "..."}</strong>
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* رسالة الخطأ */}
          {apiError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          {/* Code Input */}
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              كود التفعيل
            </label>
            <input
              type="text" // ممكن نخليه "tel" عشان يفتح كيبورد الأرقام في الموبايل
              id="code"
              name="code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.code}
              placeholder="123456"
              maxLength={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center tracking-[0.5em]" // تنسيق عشان شكل الكود
            />
            {formik.touched.code && formik.errors.code ? (
              <p className="text-red-500 text-xs mt-1">{formik.errors.code}</p>
            ) : null}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formik.isValid}
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
              "تأكيد الحساب"
            )}
          </button>
        </form>

        {/* Resend Code Link/Button */}
        <p className="text-center text-sm text-gray-600 mt-8">
          لم تستلم الكود؟{" "}
          <button
            onClick={handleResendCode}
            disabled={resendLoading}
            className="text-purple-600 font-semibold hover:underline disabled:opacity-50 disabled:cursor-wait"
          >
            {resendLoading ? "جاري الإرسال..." : "إعادة إرسال الكود"}
          </button>
        </p>

        <p className="text-center text-sm text-gray-600 mt-4">
          <Link
            to="/register"
            className="text-gray-500 hover:text-purple-600 hover:underline"
          >
            &rarr; العودة للتسجيل
          </Link>
        </p>
      </div>
    </div>
  );
}
