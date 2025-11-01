import React from "react";
import { NavLink } from "react-router-dom";
// (مفيش API calls هنا)

// --- كومبوننتس الأقسام (معدلة لتقبل البيانات أو تعتمد على الافتراضي) ---

// 1. قسم الـ Hero
const HeroSection = ({ sectionData }) => {
  // بيانات ثابتة افتراضية
  const defaultFeatureCards = [
    { icon: "📈", title: "اختبارات تفاعلية", subtitle: "أكثر من 5000 سؤال" },
    { icon: "🎓", title: "معلمون خبراء", subtitle: "خبرة أكثر من 10 سنوات" },
    { icon: "👨‍🏫", title: "تدريب مكثف", subtitle: "متابعة يومية مستمرة" },
  ];
  const defaultStatsData = [
    { number: "150+", text: "دورة تدريبية" },
    { number: "98%", text: "نسبة النجاح" },
    { number: "10K+", text: "طالب شغوف" },
  ];

  const title = sectionData?.title || "أهلاً بكم في منصة المئة التعليمية";
  const subtitle = sectionData?.subtitle || "✨ الأفضل في المملكة";
  const description =
    sectionData?.description?.trim() ||
    "انضم لأكثر من 10,000 طالب حققوا أحلامهم معنا. نقدم لك أفضل المحتوى التعليمي والاختبارات التدريبية مع نخبة من أفضل المعلمين";
  const featureCards =
    sectionData?.items && sectionData.items.featureCards
      ? sectionData.items.featureCards
      : defaultFeatureCards;
  const statsData =
    sectionData?.items && sectionData.items.statsData
      ? sectionData.items.statsData
      : defaultStatsData;

  return (
    <div className="bg-gradient-to-tl from-purple-300 to-purple-600 text-white pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 ">
          {/* Right Side */}
          <div className="w-full lg:w-6/12 text-center lg:text-right">
            <span className=" bg-primary text-white border border-white/20 font-bold px-6 py-3 rounded-full text-sm inline-block mb-4">
              {subtitle}
            </span>
            <h1 className="text-4xl md:text-6xl font-black my-6 leading-tight ">
              {title.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </h1>
            <span className="text-yellow-300 text-3xl font-bold mb-4 inline-block">
              تأسيس من البداية وتدريب حتى الإتقان.
            </span>
            <p className="text-lg text-white/80 mb-8 whitespace-pre-line">
              {description}
            </p>
            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <NavLink to="/register" className="w-full">
                <button className="bg-gradient-to-l from-purple-600 to-purple-500 text-white font-bold px-6 py-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-xl hover:from-purple-700 hover:to-purple-600 hover:scale-105 transition-all duration-300 w-full">
                  <span>👤</span> <span>التسجيل بالموقع</span>
                </button>
              </NavLink>
              <button className="bg-yellow-400 text-gray-900 font-bold px-6 py-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-xl hover:bg-yellow-500 hover:scale-105 transition-all duration-300">
                <span>🎁</span> <span>العروض الخاصة</span>
              </button>
              <button className="bg-white/20 bg-opacity-20 border-2 border-white/40 text-white font-bold px-6 py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-300 hover:bg-opacity-30">
                <span>📋</span> <span>أنشئ خطتك</span>
              </button>
              <button className="bg-gradient-to-l from-purple-500 to-purple-400 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-all duration-300 ">
                <span>🎯</span> <span>حدد مستواك</span>
              </button>
            </div>
            {/* Stats */}
            <div className="mt-20 flex justify-around items-center text-center divv relative">
              {statsData.map((stat, index) => (
                <div key={index}>
                  <p className="text-5xl font-bold text-yellow-300">
                    {stat.number}
                  </p>
                  <p className="text-white/80 mt-2">{stat.text}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Left Side: Feature Cards */}
          <div className="w-full lg:w-5/12 grid grid-cols-1 gap-5">
            {featureCards.map((card, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl px-10 py-7 flex items-center gap-5 hover:border-white/40 transition-all hover:scale-105 duration-300 justify-between"
              >
                <div>
                  <h3 className="font-bold text-2xl">{card.title}</h3>
                  <p className="text-white/80 mt-2 font-semibold">
                    {card.subtitle}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-4 rounded-lg text-white shadow-lg ">
                  <span className="text-2xl">{card.icon}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Categories Section
const CategoriesSection = ({ sectionData }) => {
  // بيانات افتراضية
  const defaultCategories = [
    { name: "قدرات", icon: "📖" },
    { name: "تحصيلي", icon: "📗" },
    { name: "موهبة", icon: "🎨" },
    { name: "قدرات إنجليزي", icon: "🇬🇧" }, // تعديل الأيقونة
    { name: "البرامج التقنية", icon: "💻" },
  ];

  const title = sectionData?.title || "الأقسام";
  const description =
    sectionData?.description?.trim() || "اختر المسار المناسب لك";
  const categories =
    sectionData?.items && sectionData.items.length > 0
      ? sectionData.items
      : defaultCategories;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4">{title}</h2>
        <p className="text-lg text-gray-500 mb-12">{description}</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer border border-gray-100 duration-300 "
            >
              <div className="flex justify-center mb-5 h-12 items-center">
                <span className="text-4xl font-extrabold text-gray-700">
                  {cat.icon || "📚"}
                </span>
              </div>
              <h3 className="font-semibold text-xl text-gray-700">
                {cat.name || cat.title} {/* لدعم الاسمين */}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 3. Features Section
const FeaturesSection = ({ sectionData }) => {
  // بيانات افتراضية
  const defaultFeatures = [
    { icon: "📚", title: "تأسيس", description: "من البداية" }, // استخدام description بدلاً من subtitle
    { icon: "🎯", title: "تدريب", description: "حتى الاحتراف" },
    { icon: "🎥", title: "فيديوهات", description: "بجودة عالية" },
    { icon: "✅", title: "إختبارات", description: "محاكاة باستمرار" },
    { icon: "📖", title: "مواد علمية", description: "مميزة" },
    { icon: "📅", title: "جدول زمني", description: "يناسب مستواك" },
  ];

  const title = sectionData?.title || "مميزات المنصة";
  const description =
    sectionData?.description?.trim() || "مميزات تضمن لك التفوق";
  const features =
    sectionData?.items && sectionData.items.length > 0
      ? sectionData.items
      : defaultFeatures;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4">{title}</h2>
        <p className="text-lg text-gray-500 mb-12">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-purple-600 text-white p-10 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer "
            >
              <div className="mb-5 text-yellow-500">
                <span className="text-5xl">{feature.icon || "⭐"}</span>
              </div>
              <h3 className="font-bold text-2xl mb-1">{feature.title}</h3>
              <p className="text-white/80 text-base">
                {feature.description || feature.subtitle} {/* لدعم الاسمين */}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 4. Packages Section
const PackagesSection = ({ sectionData }) => {
  // بيانات افتراضية
  const defaultPackages = [
    {
      title: "باقة القدرات",
      description: "قدرات وتدريب 2026 (كمي ولفظي)",
      icon: "📦",
      button_text: "اشترك الآن",
    },
    {
      title: "باقة التحصيلي",
      description: "تأسيس وتدريب 2026 (جميع المواد)",
      icon: "📦",
      button_text: "اشترك الآن",
    },
    {
      title: "باقة القدرات والتحصيلي",
      description: "تأسيس وتدريب 2026 (كمي ولفظي)",
      icon: "📦",
      button_text: "اشترك الآن",
    },
  ];

  const title = sectionData?.title || "الباقات الخاصة";
  const description = sectionData?.description?.trim() || "";
  const packages =
    sectionData?.items && sectionData.items.length > 0
      ? sectionData.items
      : defaultPackages;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        {description && ( // عرض الوصف فقط لو موجود
          <p className="text-lg text-gray-500 mb-12">{description}</p>
        )}
        <div className="mb-12">
          <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg flex items-center gap-2 mx-auto mb-10">
            <span>🎁</span> <span className="text-3xl">{title}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-3xl shadow-xl text-center flex flex-col items-center transition-all duration-300 hover:scale-105"
            >
              <div className="text-amber-600 mb-6">
                <span className="text-6xl">{pkg.icon || "📦"}</span>
              </div>
              <h3 className="font-bold text-2xl mb-3 text-gray-800">
                {pkg.title}
              </h3>
              <p className="text-gray-500 mb-8">{pkg.description}</p>
              <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 rounded-lg mt-auto flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:brightness-110 hover:scale-105 ">
                <span>⚡️</span> <span>{pkg.button_text || "اشترك الآن"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. Testimonials Section
const TestimonialsSection = ({ sectionData }) => {
  // بيانات افتراضية
  const defaultTestimonials = [
    {
      name: "طالب مميز",
      course: "دورة القدرات 2024",
      rating: 5,
      comment:
        "“الصراحة شكراً يا أستاذ على الدورة ممتازة والله جداً ومختصرة بالقدرات ارتفعت تقريباً 8 درجات...”",
    },
    {
      name: "طالبة متفوقة",
      course: "التحصيلي 2024",
      rating: 5,
      comment:
        "“السلام عليكم ابشركم يا أستاذ 100% اللهم لك الحمد والله يا أستاذ أفضل جودة تعليمية لقيتها في حياتي كانت منك.”",
    },
    {
      name: "طالب ناجح",
      course: "قدرات 2024",
      rating: 5,
      comment:
        "“أبشرك بدرس الآن في طب الحرس، شكراً من القلب، ارتفعت درجتي 14% بمعظم المناهج.”",
    },
  ];

  const title = sectionData?.title || "آراء الطلاب";
  const description =
    sectionData?.description?.trim() || "ماذا يقول طلابنا عنا؟";
  const testimonials =
    sectionData?.items && sectionData.items.length > 0
      ? sectionData.items
      : defaultTestimonials;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4">{title}</h2>
        <p className="text-lg text-gray-500 mb-12">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer "
            >
              <div className="flex justify-center text-yellow-500 mb-8">
                <span className="text-3xl">
                  {"⭐".repeat(testimonial.rating || 5)}
                </span>
              </div>
              <p className="text-gray-600 text-center mb-6 text-base leading-relaxed font-semibold ">
                {testimonial.comment}
              </p>
              <div className="flex items-center mt-6">
                <div className="bg-purple-600 p-3 rounded-full shadow-md text-gray-700">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">👤</span>
                  )}
                </div>
                <div className="mr-3">
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <span className="text-sm text-gray-500 px-3 py-1 rounded-md font-medium">
                    {testimonial.course}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 6. Partners Section
const PartnersSection = ({ sectionData }) => {
  const title = sectionData?.title || "شركاء النجاح";
  const description =
    sectionData?.description?.trim() ||
    "نفخر بثقة عملائنا وشركائنا في مسيرة النجاح";
  const partners = sectionData?.items || [];

  // بيانات افتراضية
  const defaultPartnersData = [
    { id: 4, icon: "🏢", bgColor: "white", logo_url: null },
    { id: 3, icon: "🏛️", bgColor: "purple", logo_url: null },
    { id: 2, icon: "🎓", bgColor: "white", logo_url: null },
    { id: 1, icon: "🤝", bgColor: "purple", logo_url: null },
  ];
  const partnersToDisplay =
    partners.length > 0 ? partners : defaultPartnersData;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4">{title}</h2>
        <p className="text-lg text-gray-500 mb-12">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {partnersToDisplay.map((partner) => (
            <div
              key={partner.id || partner.icon}
              className={`p-12 rounded-3xl shadow-lg flex justify-center items-center
                                     transition-all duration-300 hover:scale-105 cursor-pointer
                                     ${
                                       partner.bgColor === "purple"
                                         ? "bg-purple-600"
                                         : "bg-white"
                                     }`}
            >
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt="Partner Logo"
                  className="h-16 object-contain"
                />
              ) : (
                <span className="text-6xl">{partner.icon || "🤝"}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
// -------------------------------------------------------------------

// --- الكومبوننت الأساسي لصفحة الهوم (نسخة ثابتة) ---
export default function Home() {
  // (هذا الملف لا يحتوي على API calls، لذلك لا يحتاج تعديل)
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <PackagesSection />
      <TestimonialsSection />
      <PartnersSection />
    </>
  );
}
