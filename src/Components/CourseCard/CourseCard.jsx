import React from "react";
import { Link } from "react-router-dom";

// --- أيقونات للكارد ---
const Icons = {
  Rating: (props) => <span {...props}>⭐</span>,
  User: (props) => <span {...props}>👤</span>,
  Level: (props) => <span {...props}>📊</span>,
  Clock: (props) => <span {...props}>🕒</span>,
  Book: (props) => <span {...props}>📚</span>,
  StarOutline: (props) => <span {...props}>☆</span>, // نجمة فاضية
};
// --------------------

const API_STORAGE_URL = "https://api-ed.zynqor.org/storage";

// --- (دوال الأسعار والتاجات والنجوم زي ما هي) ---
const formatPrice = (price, discountedPrice) => {
  const finalPrice = discountedPrice ?? price;

  if (
    finalPrice === 0 ||
    finalPrice === null ||
    finalPrice === "0.00" ||
    finalPrice === "0"
  ) {
    return <span className="text-2xl font-bold text-green-600">مجاني</span>;
  }

  return (
    <div className="flex items-end gap-2">
      <span className="text-2xl font-bold text-purple-700">
        {parseFloat(finalPrice).toFixed(2)} ر.س
      </span>
      {discountedPrice && parseFloat(price) > parseFloat(discountedPrice) && (
        <span className="text-lg font-medium text-gray-400 line-through">
          {parseFloat(price).toFixed(2)} ر.س
        </span>
      )}
    </div>
  );
};

const renderSpecialTag = (course) => {
  const price = parseFloat(course.price);
  const discounted = parseFloat(course.discounted_price);

  if (price === 0 || discounted === 0) {
    return (
      <span className="absolute top-4 left-4 bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10">
        مجاني
      </span>
    );
  }
  if (course.difficulty_level === "advanced") {
    return (
      <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10">
        مكثف
      </span>
    );
  }
  if (course.difficulty_level === "beginner") {
    return (
      <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10">
        تأسيس
      </span>
    );
  }
  if (course.difficulty_level === "intermediate") {
    return (
      <span className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10">
        متوسط
      </span>
    );
  }
  return null;
};

const renderDiscountTag = (course) => {
  const price = parseFloat(course.price);
  const discounted = parseFloat(course.discounted_price);

  if (discounted < price && discounted > 0) {
    const discountPercent = Math.round(((price - discounted) / price) * 100);
    return (
      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
        وفر {discountPercent}%
      </span>
    );
  }
  if (price > 0 && discounted === 0) {
    return (
      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
        وفر 100%
      </span>
    );
  }
  return null;
};

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <div className="flex text-yellow-400 text-base">
      {[...Array(fullStars)].map((_, i) => (
        <Icons.Rating key={`full-${i}`} />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Icons.StarOutline key={`empty-${i}`} className="text-gray-300" />
      ))}
    </div>
  );
};
// ---------------------------------

const CourseCard = ({ course }) => {
  const isFree = (course.discounted_price ?? course.price) == 0;

  // <<< *** بداية التعديل ***
  // (تغيير موقع الصور الاحتياطية)
  const placeholderImage =
    "https://placehold.co/400x220/E9D5FF/8B5CF6?text=Almea";
  const placeholderAvatar = "https://placehold.co/40x40/E9D5FF/8B5CF6?text=I";
  // >>> *** نهاية التعديل ***

  const instructorAvatarUrl =
    course.instructor?.avatar_url || course.instructor?.avatar;
  const instructorAvatar = instructorAvatarUrl
    ? `${API_STORAGE_URL}/${instructorAvatarUrl}`
    : placeholderAvatar; // <-- استخدمنا المتغير الجديد

  const instructorName =
    course.instructor?.name ||
    (course.instructor?.first_name
      ? `${course.instructor.first_name} ${course.instructor.last_name || ""}`
      : null) ||
    "مدرب معتمد";

  const courseImage = course.thumbnail_url
    ? `${API_STORAGE_URL}/${course.thumbnail_url}`
    : placeholderImage; // <-- استخدمنا المتغير الجديد

  const getDifficultyText = (level) => {
    if (level === "beginner") return "تأسيس";
    if (level === "intermediate") return "متوسط";
    if (level === "advanced") return "متقدم";
    return level;
  };

  const courseTitle =
    typeof course.title === "object" && course.title !== null
      ? course.title?.ar || course.title?.en
      : course.title;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link to={`/course/${course.slug}`} className="block relative">
        <img
          src={courseImage}
          alt={courseTitle}
          className="w-full h-48 sm:h-52 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage; // (لو الصورة الحقيقية بايظة، هيستخدم اللينك الجديد)
          }}
        />

        {renderSpecialTag(course)}

        {course.average_rating > 0 && (
          <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg px-3 py-1.5 flex items-center gap-1 shadow-sm">
            <span className="font-bold text-gray-800 text-sm">
              {parseFloat(course.average_rating).toFixed(1)}
            </span>
            {renderStars(course.average_rating)}
            <span className="text-xs text-gray-600">
              ({course.reviews_count || 0})
            </span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/course/${course.slug}`} className="block">
          <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 hover:text-purple-700 transition-colors line-clamp-2 min-h-[56px] sm:min-h-[60px]">
            {courseTitle}
          </h3>
        </Link>

        {/* معلومات المدرس */}
        <div className="flex items-center gap-2 mt-3 mb-4">
          <img
            src={instructorAvatar} // <-- استخدمنا المتغير الجديد
            alt={instructorName}
            className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderAvatar; // (لو صورة المدرب بايظة)
            }}
          />
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {instructorName}
            </p>
          </div>
        </div>

        {/* معلومات إضافية (مستوى وصعوبة) */}
        <div className="flex items-center gap-4 text-sm text-gray-600 my-2 pt-4 border-t border-gray-100">
          <span className="flex items-center gap-1.5">
            <Icons.Level />
            {getDifficultyText(course.difficulty_level)}
          </span>
          <span className="flex items-center gap-1.5">
            <Icons.Clock />
            {course.duration_hours || 0} ساعات
          </span>
        </div>

        <div className="flex-grow"></div>

        {/* السعر وزرار الاشتراك */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {renderDiscountTag(course)}
          {formatPrice(course.price, course.discounted_price)}
        </div>

        {/* زرار الاشتراك (تحت السعر) */}
        <Link
          to={isFree ? `/course/${course.slug}` : `/checkout/${course.id}`}
          className="mt-4"
        >
          <button
            className={`w-full font-bold px-5 py-3 rounded-lg transition-all
            ${
              isFree
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {isFree ? "ابدأ مجاناً" : "اشترك الآن"}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
