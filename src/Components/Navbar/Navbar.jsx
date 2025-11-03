import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../../context/UserContext.jsx";

// --- أيقونات Emojis (مبسطة) ---
const Icons = {
  GraduationCap: (props) => <span {...props}>🎓</span>,
  User: (props) => <span {...props}>👤</span>,
  Star: (props) => <span {...props}>⭐</span>,
  Newspaper: (props) => <span {...props}>📰</span>,
  Book: (props) => <span {...props}>📚</span>,
  Flask: (props) => <span {...props}>🧪</span>,
  Pencil: (props) => <span {...props}>✏️</span>,
  Desktop: (props) => <span {...props}>💻</span>,
  Lightbulb: (props) => <span {...props}>💡</span>,
  Gift: (props) => <span {...props}>🎁</span>,
  Home: (props) => <span {...props}>🏠</span>,
  CaretDown: (props) => <span {...props}>▼</span>,
  Bars: (props) => <span {...props}>☰</span>,
  Times: (props) => <span {...props}>✕</span>,
  ShoppingCart: (props) => <span {...props}>🛒</span>,
  Exclamation: (props) => <span {...props}>❗️</span>,
  Logout: (props) => <span {...props}>🚪</span>,
  DefaultCategory: (props) => <span {...props}>📚</span>,
  DefaultSubCategory: (props) => <span {...props}>📄</span>,
};

// --- API Endpoints ---
const AUTH_BASE_URL = "https://api-ed.zynqor.org/api/auth";
const API_BASE_URL = "https://api-ed.zynqor.org/api/public";

// --- fetch مع هيدر اللغة العربية ---
const fetchNavCategories = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/categories-parent`, {
      params: { locale: "ar" }, // جلب بالعربي
      headers: { "Accept-Language": "ar" }, // ضمان قبول اللغة من السيرفر
    });
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching nav categories:", error);
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to fetch categories"
    );
  }
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { userData: token, setUserData } = useContext(UserContext); // تغيير الاسم إلى token
  const navigate = useNavigate(); // useQuery

  const {
    data: navCategories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useQuery({
    queryKey: ["navCategories", "ar", "v1"],
    queryFn: fetchNavCategories,
    staleTime: 1000 * 60 * 60, // ساعة
    refetchOnWindowFocus: false,
    retry: 1,
  }); // --- لينكات ثابتة ---

  const staticNavLinks = [
    {
      name: "الرئيسية",
      icon: <Icons.Home className="text-blue-500" />,
      path: "/",
    },
    {
      name: token ? "لوحة التحكم" : "خطتي", // <--- تحديث الرابط
      icon: <Icons.Book className="text-green-500" />,
      path: token ? "/dashboard" : "/my-plan", // <--- توجيه للداشبورد للمسجلين
    },
    {
      name: "دورات مُميزة",
      icon: <Icons.Star className="text-yellow-400" />,
      path: "/featured-courses",
    },
    {
      name: "من نحن",
      icon: <Icons.Exclamation className="text-blue-400 font-bold" />,
      path: "/about-us",
    },
    {
      name: "المقالات",
      icon: <Icons.Newspaper className="text-purple-500" />,
      path: "/articles",
    },
  ]; // --- دالة تسجيل الخروج ---

  async function handleLogout() {
    setIsLoggingOut(true);
    if (!token) {
      setUserData(null);
      setIsLoggingOut(false);
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${AUTH_BASE_URL}/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Logout API Error:", error);
    } finally {
      localStorage.removeItem("userToken");
      setUserData(null);
      setIsLoggingOut(false);
      navigate("/login");
      closeMobileMenu();
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  }; // --- أيقونات تلقائية حسب الاسم ---

  const getIconForCategory = (name = "") => {
    if (name.includes("قدرات")) return <Icons.Book className="text-red-400" />;
    if (name.includes("تحصيلي"))
      return <Icons.Flask className="text-green-500" />;
    if (name.includes("تقنية") || name.includes("الإنجليزية"))
      return <Icons.Desktop className="text-teal-500" />;
    return <Icons.DefaultCategory />;
  };

  const getIconForSubCategory = (name = "") => {
    if (name.includes("كمي")) return <Icons.Book className="text-blue-500" />;
    if (name.includes("لفظي"))
      return <Icons.Pencil className="text-blue-400" />;
    if (name.includes("فيزياء"))
      return <Icons.Lightbulb className="text-purple-500" />;
    if (name.includes("كيمياء"))
      return <Icons.Flask className="text-green-500" />;
    if (name.includes("رياضيات"))
      return <Icons.Book className="text-blue-500" />;
    if (name.includes("أحياء"))
      return <Icons.Pencil className="text-red-500" />;
    return <Icons.DefaultSubCategory />;
  }; // عرض اسم الفئة — يختار العربي لو متاح وإلا fallback (معالجة Object Language)

  const displayCategoryName = (cat) => {
    if (!cat) return ""; // في حال كان الاسم يأتي ككائن { ar: 'الاسم', en: 'Name' } أو كنص
    const name =
      typeof cat.name === "object" ? cat.name?.ar || cat.name?.en : cat.name; // لو الاسم فيه أحرف عربية، اعرضه مباشرة

    if (name && /[\u0600-\u06FF]/.test(name)) return name; // لو meta_title موجود (ممكن يكون عربي)
    if (cat.meta_title && /[\u0600-\u06FF]/.test(cat.meta_title))
      return cat.meta_title; // لو name موجود حتى لو انجليزي، استخدمه (fallback)
    if (name) return name; // لو في slug كفالة اخيرة
    return cat.slug || "";
  };

  return (
    <nav
      dir="rtl"
      lang="ar"
      className="bg-white sticky top-0 z-50 p-3 shadow-md"
    >
      {" "}
      <div className="container mx-auto px-4">
        {" "}
        <div className="flex justify-between items-center py-1">
          {/* Right Side: Logo */}{" "}
          <NavLink to="/" className="flex items-center cursor-pointer">
            {" "}
            <Icons.GraduationCap className="text-gray-700 ml-4 text-4xl" />{" "}
            <div className="text-right">
              {" "}
              <div className="text-primary text-2xl font-extrabold ml-3">
                المئة{" "}
              </div>{" "}
              <div className="text-xs text-gray-500">التعليمية</div>{" "}
            </div>{" "}
          </NavLink>
          {/* Center: Desktop Navigation */}{" "}
          <ul className="hidden lg:flex flex-row-reverse items-center space-x-2 space-x-reverse font-semibold text-sm text-gray-700">
            {/* ثابتة */}{" "}
            {staticNavLinks.map((link) => (
              <li key={link.name} className="relative group">
                {" "}
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-md transition-colors text-center ${
                      isActive
                        ? " bg-primary text-white font-bold "
                        : "hover:bg-gray-100"
                    }`
                  }
                  end={link.path === "/"}
                >
                  {" "}
                  {link.icon && <span className="ml-1.5">{link.icon}</span>}
                  <span>{link.name}</span>{" "}
                </NavLink>{" "}
              </li>
            ))}
            {/* حالة اللودينج / خطأ */}{" "}
            {isCategoriesLoading && (
              <li className="text-sm text-gray-500 px-4">
                جاري تحميل الأقسام...{" "}
              </li>
            )}{" "}
            {isCategoriesError && (
              <li
                className="text-sm text-red-500 px-4"
                title={categoriesError?.message}
              >
                فشل تحميل الأقسام!{" "}
              </li>
            )}
            {/* ديناميكية */}{" "}
            {!isCategoriesLoading &&
              !isCategoriesError &&
              Array.isArray(navCategories) &&
              navCategories.map((category) => (
                <li key={category.id} className="relative group">
                  {" "}
                  {!category.children || category.children.length === 0 ? (
                    <NavLink
                      to={`/category/${category.id}`}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-2 rounded-md transition-colors text-center ${
                          isActive
                            ? " bg-primary text-white font-bold "
                            : "hover:bg-gray-100"
                        }`
                      }
                    >
                      {" "}
                      <span className="ml-1.5">
                        {" "}
                        {getIconForCategory(displayCategoryName(category))}{" "}
                      </span>{" "}
                      <span>{displayCategoryName(category)}</span>{" "}
                    </NavLink>
                  ) : (
                    <>
                      {" "}
                      <div className="flex items-center px-4 py-2 rounded-md transition-colors text-center hover:bg-gray-100 cursor-pointer">
                        {" "}
                        <span className="ml-1.5">
                          {" "}
                          {getIconForCategory(
                            displayCategoryName(category)
                          )}{" "}
                        </span>{" "}
                        <span>{displayCategoryName(category)}</span>
                        <Icons.CaretDown className="mr-1.5" />{" "}
                      </div>{" "}
                      <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 invisible group-hover:visible transform group-hover:translate-y-0 translate-y-2 z-50">
                        {" "}
                        <ul className="py-2">
                          {" "}
                          {(category.children || []).map((item) => (
                            <li key={item.id}>
                              {" "}
                              <NavLink
                                to={`/category/${item.id}`}
                                className="flex items-center px-4 py-3 text-right text-gray-800 hover:bg-indigo-50 transition-colors"
                              >
                                {" "}
                                <span className="ml-3">
                                  {" "}
                                  {getIconForSubCategory(
                                    displayCategoryName(item)
                                  )}{" "}
                                </span>{" "}
                                <span>{displayCategoryName(item)}</span>{" "}
                              </NavLink>{" "}
                            </li>
                          ))}{" "}
                        </ul>{" "}
                      </div>{" "}
                    </>
                  )}{" "}
                </li>
              ))}{" "}
          </ul>
          {/* Left Side: Desktop Login/Logout & Cart */}{" "}
          <div className="hidden lg:flex items-center space-x-4">
            {" "}
            <NavLink
              to="/cart"
              className="text-gray-500 hover:text-indigo-600 relative"
            >
              <Icons.ShoppingCart className="text-2xl" />{" "}
            </NavLink>{" "}
            {token ? (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-500 text-white font-semibold flex items-center px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:bg-red-600 disabled:opacity-50 disabled:cursor-wait"
              >
                {" "}
                {isLoggingOut ? (
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
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
                    ></circle>{" "}
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>{" "}
                  </svg>
                ) : (
                  <Icons.Logout className="ml-2 text-sm" />
                )}{" "}
                <span className="text-sm">
                  {" "}
                  {isLoggingOut ? "جاري الخروج..." : "تسجيل خروج"}{" "}
                </span>{" "}
              </button>
            ) : (
              <NavLink to="/login">
                {" "}
                <button className="bg-primary text-white font-semibold flex items-center px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105">
                  <Icons.User className="ml-2 text-sm" />
                  <span className="text-sm">تسجيل دخول</span>{" "}
                </button>{" "}
              </NavLink>
            )}{" "}
          </div>
          {/* Mobile Burger Button */}{" "}
          <div className="lg:hidden flex items-center">
            {" "}
            <NavLink
              to="/cart"
              className="text-gray-700 hover:text-indigo-600 relative ml-4"
            >
              <Icons.ShoppingCart className="text-2xl" />{" "}
            </NavLink>{" "}
            <button onClick={() => setIsMobileMenuOpen(true)} className="">
              <Icons.Bars className="text-gray-700 text-2xl" />{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>
      {/* --- Mobile Menu --- */}{" "}
      <div
        className={`fixed inset-0 bg-white z-[999] p-6 transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        dir="rtl"
      >
        {/* Mobile Menu Header */}{" "}
        <div className="flex justify-between items-center mb-6 shrink-0">
          {" "}
          <button onClick={closeMobileMenu}>
            <Icons.Times className="text-gray-700 text-2xl" />{" "}
          </button>{" "}
          <div className="flex items-center">
            {" "}
            <Icons.GraduationCap className="text-gray-700 ml-4 text-4xl" />{" "}
            <div className="text-right">
              {" "}
              <div className="text-primary text-2xl font-extrabold">المئة</div>
              <div className="text-xs text-gray-500">التعليمية</div>{" "}
            </div>{" "}
          </div>{" "}
        </div>
        {/* Mobile Menu Links */}{" "}
        <div className="grow overflow-y-auto">
          {" "}
          <ul className="flex flex-col space-y-2">
            {/* ثابتة */}{" "}
            {staticNavLinks.map((link) => (
              <li
                key={link.name}
                className="border-b border-gray-100 last:border-b-0"
              >
                {" "}
                <NavLink
                  to={link.path || "#"}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center w-full py-4 text-lg ${
                      isActive && link.path ? "font-bold text-primary" : ""
                    }`
                  }
                  end={link.path === "/"}
                >
                  {" "}
                  {link.icon && <span className="ml-3">{link.icon}</span>}
                  {link.name}{" "}
                </NavLink>{" "}
              </li>
            ))}
            {/* حالة اللودينج / خطأ */}{" "}
            {isCategoriesLoading && (
              <li className="text-lg text-gray-500 px-4 py-4 border-b border-gray-100">
                جاري تحميل الأقسام...{" "}
              </li>
            )}{" "}
            {isCategoriesError && (
              <li
                className="text-lg text-red-500 px-4 py-4 border-b border-gray-100"
                title={categoriesError?.message}
              >
                فشل تحميل الأقسام!{" "}
              </li>
            )}
            {/* ديناميكية */}{" "}
            {!isCategoriesLoading &&
              !isCategoriesError &&
              Array.isArray(navCategories) &&
              navCategories.map((category) => (
                <li
                  key={category.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {" "}
                  {!category.children || category.children.length === 0 ? (
                    <NavLink
                      to={`/category/${category.id}`}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `flex items-center w-full py-4 text-lg ${
                          isActive ? "font-bold text-primary" : ""
                        }`
                      }
                    >
                      {" "}
                      <span className="ml-3">
                        {" "}
                        {getIconForCategory(displayCategoryName(category))}{" "}
                      </span>
                      {displayCategoryName(category)}{" "}
                    </NavLink>
                  ) : (
                    <div>
                      {" "}
                      <div
                        className="flex justify-between items-center w-full py-4 text-lg cursor-pointer"
                        onClick={() =>
                          setOpenMobileDropdown(
                            openMobileDropdown === category.name
                              ? null
                              : category.name
                          )
                        }
                      >
                        {" "}
                        <div className="flex items-center">
                          {" "}
                          <span className="ml-3">
                            {" "}
                            {getIconForCategory(
                              displayCategoryName(category)
                            )}{" "}
                          </span>{" "}
                          <span>{displayCategoryName(category)}</span>{" "}
                        </div>{" "}
                        <Icons.CaretDown
                          className={`transition-transform ${
                            openMobileDropdown === category.name
                              ? "rotate-180"
                              : ""
                          }`}
                        />{" "}
                      </div>{" "}
                      {openMobileDropdown === category.name && (
                        <ul className="pr-8 pb-2">
                          {" "}
                          {(category.children || []).map((item) => (
                            <li key={item.id} className="py-2">
                              {" "}
                              <NavLink
                                to={`/category/${item.id}`}
                                onClick={closeMobileMenu}
                                className="flex items-center text-gray-700"
                              >
                                {" "}
                                <span className="ml-3">
                                  {" "}
                                  {getIconForSubCategory(
                                    displayCategoryName(item)
                                  )}{" "}
                                </span>{" "}
                                {displayCategoryName(item)}{" "}
                              </NavLink>{" "}
                            </li>
                          ))}{" "}
                        </ul>
                      )}{" "}
                    </div>
                  )}{" "}
                </li>
              ))}
            {/* Login/Logout Mobile */}{" "}
            <li className="mt-6">
              {" "}
              {token ? (
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full bg-red-500 text-white font-semibold flex items-center justify-center px-6 py-4 rounded-lg text-lg disabled:opacity-50 disabled:cursor-wait"
                >
                  {" "}
                  {isLoggingOut ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
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
                      ></circle>{" "}
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>{" "}
                    </svg>
                  ) : (
                    <Icons.Logout className="ml-2 text-base" />
                  )}{" "}
                  <span>{isLoggingOut ? "جاري الخروج..." : "تسجيل خروج"}</span>{" "}
                </button>
              ) : (
                <NavLink to="/login" onClick={closeMobileMenu}>
                  {" "}
                  <button className="w-full bg-primary text-white font-semibold flex items-center justify-center px-6 py-4 rounded-lg text-lg">
                    {" "}
                    <Icons.User className="ml-2 text-base" />{" "}
                    <span>تسجيل دخول</span>{" "}
                  </button>{" "}
                </NavLink>
              )}{" "}
            </li>{" "}
          </ul>{" "}
        </div>{" "}
      </div>{" "}
    </nav>
  );
};

export default Navbar;
