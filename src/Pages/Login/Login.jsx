import React, { useState, useContext, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import toast from "react-hot-toast";

// <<< *** بداية التعديل ***
// (استخدام الرابط الكامل)
const BASE_URL = "https://api-ed.zynqor.org/api/auth";
// >>> *** نهاية التعديل ***

// (كومبوننت AuthInfo زي ما بعتهولي بالظبط)
function AuthInfo() {
  const features = [
    {
      icon: "🎓",
      title: "تأسيس من البداية",
      desc: "هذا النص مثال يمكن استبداله في نفس المكان.",
    },
    {
      icon: "🎯",
      title: "تدريب حتى الإتقان",
      desc: "أكثر من 5000 سؤال تدريبي وحلول مفصلة.",
    },
    {
      icon: "👨‍🏫",
      title: "معلمون خبراء",
      desc: "خبرة في أفضل المعلمين بمتوسط خبرة 10 سنوات.",
    },
    {
      icon: "📊",
      title: "متابعة مستمرة",
      desc: "تقارير مفصلة لمتابعة مستواك وتطورك.",
    },
  ];
  const stats = [
    { number: "10K+", label: "طالب شغوف" },
    { number: "98%", label: "نسبة النجاح" },
    { number: "150+", label: "دورة تدريبية" },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between w-1/3 bg-gradient-to-br from-purple-600 to-indigo-700 p-8 text-white rounded-r-2xl">
      <div>
        <h2 className="text-3xl font-bold mb-4">لماذا تختار منصة المئة؟</h2>
        <p className="mb-8 opacity-90">
          انضم لأكثر من 10,000 طالب حققوا أحلامهم معنا.
        </p>
        <ul className="space-y-6">
          {features.map((feature) => (
            <li key={feature.title} className="flex items-start">
              <span className="text-3xl mr-4">{feature.icon}</span>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm opacity-80">{feature.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold">{stat.number}</p>
            <p className="text-sm opacity-90">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// الكومبوننت الأساسي لصفحة الدخول
export default function Login() {
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const captcha = useMemo(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    const num3 = Math.floor(Math.random() * 5) + 1;
    const answer = num1 + num2 - num3;
    const question = `${num1} + ${num2} - ${num3}`;
    return { question, answer };
  }, []);

  async function handleLogin(values) {
    // 1. التحقق من الإيميل والباسورد السحري (للتست)
    if (
      values.emailOrPhone === "test@test.com" &&
      values.password === "123456"
    ) {
      console.warn("!!! FAKE LOGIN ACTIVATED !!!");
      toast.success("تم تسجيل الدخول (وهمياً) للتست.");
      const FAKE_TOKEN = "THIS_IS_A_FAKE_TEST_TOKEN";
      localStorage.setItem("userToken", FAKE_TOKEN);
      setUserData(FAKE_TOKEN);
      navigate("/");
      return;
    }

    // (اللوجن العادي)
    setLoading(true);
    setApiError(null);
    const payload = {
      email: values.emailOrPhone,
      password: values.password,
    };

    try {
      const { data } = await axios.post(`${BASE_URL}/login`, payload);
      console.log("Login Success:", data);
      localStorage.setItem("userToken", data.token);
      setUserData(data.token);
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  const validationSchema = Yup.object({
    emailOrPhone: Yup.string().required(
      "البريد الإلكتروني أو رقم الجوال مطلوب"
    ),
    password: Yup.string().required("كلمة المرور مطلوبة"),
    captcha: Yup.string()
      .required("الرجاء حل اللغز")
      .test(
        "captcha-test",
        "الإجابة غير صحيحة",
        (value) => parseInt(value, 10) === captcha.answer
      ),
  });

  const formik = useFormik({
    initialValues: {
      emailOrPhone: "",
      password: "",
      captcha: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-100 p-4"
      dir="rtl"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-5xl">🎓</span>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">المئة</h1>
        <p className="text-gray-600">التعليمية</p>
        <h2 className="text-4xl font-extrabold text-gray-900 mt-6">
          مرحباً بك مرة أخرى!
        </h2>
        <p className="text-lg text-gray-500">
          أفضل منصة تعليمية للقدرات والتحصيلي في المملكة
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl flex overflow-hidden">
        {/* Form Area */}
        <div className="w-full lg:w-2/3 p-8 sm:p-12">
          {/* Tabs */}
          <div className="flex mb-8">
            <Link
              to="/login"
              className="py-3 px-6 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md"
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/register"
              className="py-3 px-6 rounded-lg text-gray-600 font-semibold"
            >
              إنشاء حساب
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {apiError && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            {/* Email or Phone */}
            <div>
              <label
                htmlFor="emailOrPhone"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                البريد الإلكتروني أو رقم الجوال
              </label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.emailOrPhone}
                placeholder="ادخل بريدك الإلكتروني أو رقم جوالك"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {formik.touched.emailOrPhone && formik.errors.emailOrPhone ? (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.emailOrPhone}
                </p>
              ) : null}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700"
                >
                  كلمة المرور
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-600 hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder="ادخل كلمة المرور"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </p>
              ) : null}
            </div>

            {/* Captcha */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-center bg-gray-100 p-3 rounded-lg">
                <span className="text-lg font-mono tracking-widest text-gray-700">
                  {captcha.question} = ?
                </span>
              </div>
              <div>
                <input
                  type="text"
                  id="captcha"
                  name="captcha"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.captcha}
                  placeholder="اكتب الإجابة هنا"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            {formik.touched.captcha && formik.errors.captcha ? (
              <p className="text-red-500 text-xs -mt-3">
                {formik.errors.captcha}
              </p>
            ) : null}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formik.isValid || !formik.dirty}
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
                "دخول"
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="flex items-center my-6">
            <hr className="grow border-gray-300" />
            <span className="mx-4 text-gray-500 text-sm">أو</span>
            <hr className="grow border-gray-300" />
          </div>

          {/* Google Button */}
          <button className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
            <svg
              className="w-5 h-5 ml-3"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691c-1.645 3.119-2.615 6.58-2.615 10.309C3.691 30.63 7.546 38.245 14.63 41.944l-5.657 5.657C2.909 41.258 0 32.734 0 24C0 19.518.909 15.299 2.61 11.393L8.916 17.7l-2.61 3.007z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-5.657-5.657C30.01 31.61 27.208 32 24 32c-5.226 0-9.66-3.343-11.303-7.917l-5.736 5.736C9.701 36.61 16.299 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.736 5.736C40.091 36.61 44 31.023 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            التسجيل حساب جوجل
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            ليس لديك حساب؟{" "}
            <Link
              to="/register"
              className="text-purple-600 font-semibold hover:underline"
            >
              قم بالتسجيل الآن
            </Link>
          </p>
        </div>

        {/* Info Column (Visible on Desktop) */}
        <AuthInfo />
      </div>
    </div>
  );
}
