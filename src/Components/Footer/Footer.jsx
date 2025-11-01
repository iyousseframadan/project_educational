import React from "react";
// تم حذف الاستيراد من "react-icons" لحل مشكلة الـ compile
// import {
//   FaPhone,
//   FaUserPlus,
// ...
//   FaFlag,
// } from "react-icons/fa";

// تعريف بسيط للأيقونات كـ Emojis
const Icons = {
  Phone: (props) => <span {...props}>📞</span>,
  UserPlus: (props) => <span {...props}>➕👤</span>,
  GraduationCap: (props) => <span {...props}>🎓</span>,
  Whatsapp: (props) => <span {...props}>💬</span>,
  Youtube: (props) => <span {...props}>📺</span>,
  Twitter: (props) => <span {...props}>🐦</span>,
  Discord: (props) => <span {...props}>👾</span>,
  ChevronLeft: (props) => <span {...props}>❮</span>,
  Envelope: (props) => <span {...props}>✉️</span>,
  MapMarkerAlt: (props) => <span {...props}>📍</span>,
  ArrowUp: (props) => <span {...props}>⬆️</span>,
};

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer className="text-white">
        <div className="bg-linear-to-r from-purple-500 to-indigo-600">
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-5xl font-extrabold mb-6">
              ابدأ رحلتك نحو التميز الآن!
            </h2>
            <p className="text-lg text-white/80 mb-8">
              انضم لآلاف الطلاب الناجحين واحصل على أفضل تدريب في القدرات
              والتحصيلي.
            </p>
            <div className="flex justify-center space-x-4 ">
              {/* تم تصحيح كلمة transition-all */}
              <button className="bg-white text-purple-700 font-bold px-8 py-3 rounded-lg hover:bg-gray-200 flex items-center gap-2 hover:scale-105 transition-all duration-200">
                <Icons.UserPlus />
                <span>سجل الآن مجاناً</span>
              </button>

              {/* تم تصحيح كلمة transition-all */}
              <button className="bg-red-900 text-white font-bold px-12 py-5 rounded-lg hover:bg-red-700  flex items-center gap-2 hover:scale-105 transition-all duration-200">
                <Icons.Phone />
                <span>تواصل معنا</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900">
          <div className="container mx-auto px-16 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
              <div>
                <div className="flex items-center justify-start mb-4">
                  <Icons.GraduationCap className="text-white mr-3 text-4xl" />
                  <div className="text-right">
                    <div className="text-primary  text-white px-3 py-1  text-3xl font-extrabold">
                      المئة
                    </div>
                    <div className="text-sm text-gray-400 text-center">
                      التعليمية
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  منصة تعليمية متكاملة للقدرات والتحصيلي، نقدم أفضل المحتوى
                  التعليمي مع نخبة من المعلمين المتميزين.
                </p>
                {/* أيقونات السوشيال ميديا */}
                <div className="flex justify-start gap-3 mt-6">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500 transition-transform hover:scale-105"
                  >
                    <Icons.Whatsapp />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-red-600 transition-transform hover:scale-105"
                  >
                    <Icons.Youtube />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-400 transition-transform hover:scale-105"
                  >
                    <Icons.Twitter />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500 transition-transform hover:scale-105"
                  >
                    <Icons.Discord />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-2xl mb-6 text-primary">
                  روابط سريعة
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="flex justify-end items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <span>الرئيسية</span> <Icons.ChevronLeft />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex justify-end items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <span>الأقسام</span> <Icons.ChevronLeft />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex justify-end items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <span>الباقات</span> <Icons.ChevronLeft />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex justify-end items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <span>آراء الطلاب</span> <Icons.ChevronLeft />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex justify-end items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <span>من نحن</span> <Icons.ChevronLeft />
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-xl mb-4 text-primary ">
                  تواصل معنا
                </h3>
                <ul className="space-y-4 text-gray-400 ">
                  <li className="flex justify-end items-start gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        البريد الإلكتروني
                      </p>
                      <p>info@alssalem.com</p>
                    </div>
                    <div className="w-6 flex justify-center">
                      <Icons.Envelope className="text-purple-400 mt-1 text-2xl" />
                    </div>
                  </li>

                  <li className="flex justify-end items-start gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-white">الهاتف</p>
                      <p>+966 56 754 966</p>
                    </div>

                    <div className="w-6 flex justify-center">
                      <Icons.Phone className="text-purple-400 mt-1 text-2xl" />
                    </div>
                  </li>

                  <li className="flex justify-end items-start gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-white">الموقع</p>
                      <p>المملكة العربية السعودية</p>
                    </div>

                    <div className="w-6 flex justify-center">
                      <Icons.MapMarkerAlt className="text-purple-400 mt-1 text-2xl" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row-reverse justify-between items-center text-center md:text-right">
              <div className="flex gap-6 mb-4 md:mb-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  سياسة الخصوصية
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  الشروط والاحكام
                </a>
              </div>
              <p className="text-gray-500 text-sm">
                جميع الحقوق محفوظة © 2025 منصة المئة التعليمية
              </p>
            </div>
          </div>
        </div>
      </footer>

      <button
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg
                 transition-all duration-300 hover:scale-110 hover:bg-purple-700"
      >
        <Icons.ArrowUp />
      </button>
    </>
  );
};

export default Footer;
