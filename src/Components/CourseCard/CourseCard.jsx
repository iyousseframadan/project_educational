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

// --- دالة لتقريب السعر وعرض "مجاني" ---
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
// ---------------------------------

// <<< *** بداية التعديل ***

// --- 1. دالة جديدة لعرض التاج الرئيسي (اللي فوق الصورة) ---
const renderSpecialTag = (course) => {
  const price = parseFloat(course.price);
  const discounted = parseFloat(course.discounted_price);

  // الأولوية 1: لو مجاني
  if (price === 0 || discounted === 0) {
    return (
      <span className="absolute top-4 left-4 bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10">
        مجاني
      </span>
    );
  }

  // الأولوية 2: لو عليه خصم كبير (زي "الأكثر مبيعاً" أو "أفضل تقييم" - دي داتا ناقصة)
  // (هنفترض مؤقتاً إن "المتقدم" هو "مكثف")
  if (course.difficulty_level === "advanced") {
    return (
      <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10">
        مكثف
      </span>
    );
  }

  // الأولوية 3: لو "تأسيس"
  if (course.difficulty_level === "beginner") {
    return (
      <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10">
        تأسيس
      </span>
    );
  }

  // الأولوية 4: لو "متوسط"
  if (course.difficulty_level === "intermediate") {
    return (
      <span className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10">
        متوسط
      </span>
    );
  }

  // (لو الـ API بعت "جديد" أو "محدود" هنضيفهم هنا)

  return null; // لو مفيش حاجة مميزة
};

// --- 2. دالة جديدة لعرض تاج الخصم (اللي جنب السعر) ---
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

  // لو مجاني 100%
  if (price > 0 && discounted === 0) {
    return (
      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
        وفر 100%
      </span>
    );
  }

  return null; // مفيش خصم
};
// >>> *** نهاية التعديل ***

// --- دالة لعرض النجوم (من 1 لـ 5) ---
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5; // (لسه مش مستخدمة، بس جاهزة)
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex text-yellow-400 text-base">
      {[...Array(fullStars)].map((_, i) => (
        <Icons.Rating key={`full-${i}`} />
      ))}
      {/* (لو عايزين ندعم نص النجمة، محتاجين أيقونة مختلفة) */}
      {[...Array(emptyStars)].map((_, i) => (
        <Icons.StarOutline key={`empty-${i}`} className="text-gray-300" />
      ))}
    </div>
  );
};
// ---------------------------------

const CourseCard = ({ course }) => {
  const isFree = (course.discounted_price ?? course.price) == 0;

  const placeholderImage =
    "https://via.placeholder.com/400x220/E9D5FF/8B5CF6?text=Almea";
  const imageUrl = course.thumbnail_url
    ? `${API_STORAGE_URL}/${course.thumbnail_url}`
    : placeholderImage;

  const getDifficultyText = (level) => {
    if (level === "beginner") return "تأسيس";
    if (level === "intermediate") return "متوسط";
    if (level === "advanced") return "متقدم";
    return level;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* <<< *** بداية التعديل *** */}
      <Link to={`/course/${course.slug}`} className="block relative">
        {/* 1. الصورة الرئيسية للكورس */}
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-48 sm:h-52 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage;
          }}
        />

        {/* 2. التاج الرئيسي الملون (فوق الصورة) */}
        {renderSpecialTag(course)}

        {/* 3. التقييم بالنجوم (فوق الصورة) */}
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
        {/* (شيلنا التاجات القديمة من هنا) */}

        {/* 4. عنوان الدورة */}
        <Link to={`/course/${course.slug}`} className="block">
          <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 hover:text-purple-700 transition-colors line-clamp-2 min-h-[56px] sm:min-h-[60px]">
            {course.title}
          </h3>
        </Link>

        {/* 5. معلومات المدرس */}
        <div className="flex items-center gap-2 mt-3 mb-4">
          <img
            src={
              course.instructor?.avatar
                ? `${API_STORAGE_URL}/${course.instructor.avatar}`
                : "https://via.placeholder.com/40/E9D5FF/8B5CF6?text=I"
            }
            alt={course.instructor?.name || "مدرب"}
            className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {course.instructor?.name || "مدرب معتمد"}
            </p>
            {/* (شيلنا التخصص عشان التصميم أنضف) */}
          </div>
        </div>

        {/* 6. معلومات إضافية (مستوى وصعوبة) */}
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

        {/* 7. السعر وزرار الاشتراك */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {/* تاج الخصم (جنب السعر) */}
          {renderDiscountTag(course)}

          {/* السعر */}
          {formatPrice(course.price, course.discounted_price)}
        </div>

        {/* 8. زرار الاشتراك (تحت السعر) */}
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
      {/* >>> *** نهاية التعديل *** */}
    </div>
  );
};

export default CourseCard;
