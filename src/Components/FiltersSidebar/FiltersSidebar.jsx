import React from "react";

// --- أيقونات للسايدبار ---
const Icons = {
  Level: (props) => <span {...props}>📊</span>,
  Price: (props) => <span {...props}>💰</span>,
  Rating: (props) => <span {...props}>⭐</span>,
  Clear: (props) => <span {...props}>❌</span>,
};
// ----------------------

// --- 1. تعريف اختيارات الفلاتر ---

// المستويات (مطابقة للـ API والتصميم)
const levelFilters = [
  { label: "تأسيس (مبتدئ)", value: "beginner" },
  { label: "متوسط", value: "intermediate" },
  { label: "متقدم", value: "advanced" },
  // { label: "مراجعة نهائية", value: "review" }, // <-- API لا يدعم هذا المستوى حالياً
];

// الأسعار (مطابقة للتصميم ومترجمة للـ API)
const priceFilters = [
  { key: "free", label: "مجاني", min: 0, max: 0 },
  { key: "under100", label: "حتى 100 ر.س", min: null, max: 100 },
  { key: "100to300", label: "100 - 300 ر.س", min: 100, max: 300 },
  { key: "over300", label: "أكثر من 300 ر.س", min: 300, max: null },
];
// ---------------------------------

const FiltersSidebar = ({ currentFilters, onFilterChange }) => {
  // --- 2. دوال لتغيير الفلاتر ---

  // لما يختار مستوى
  const handleLevelChange = (e) => {
    onFilterChange({
      level: e.target.value === currentFilters.level ? null : e.target.value, // لو داس عليه تاني، يلغي الفلتر
    });
  };

  // لما يختار سعر
  const handlePriceChange = (priceOption) => {
    // لو داس عليه تاني، يلغي الفلتر
    if (priceOption.key === currentFilters.price_key) {
      onFilterChange({
        price_key: null,
        price_min: null,
        price_max: null,
      });
    } else {
      onFilterChange({
        price_key: priceOption.key,
        price_min: priceOption.min,
        price_max: priceOption.max,
      });
    }
  };

  // لما يمسح كل الفلاتر
  const handleClearAll = () => {
    onFilterChange({
      level: null,
      price_key: null,
      price_min: null,
      price_max: null,
      // (ممكن نضيف فلاتر التقييم هنا لو اتدعمت)
    });
  };
  // -----------------------------

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-28">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h3 className="text-xl font-bold">تصنيف النتائج</h3>
        <button
          onClick={handleClearAll}
          className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
        >
          <Icons.Clear />
          مسح الكل
        </button>
      </div>

      {/* --- 3. فلتر المستوى --- */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icons.Level />
          المستوى
        </h4>
        <div className="space-y-3">
          {levelFilters.map((level) => (
            <label
              key={level.value}
              className="flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="difficulty_level"
                value={level.value}
                checked={currentFilters.level === level.value}
                onChange={handleLevelChange}
                className="ml-2 w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-700">{level.label}</span>
            </label>
          ))}
          <label className="flex items-center cursor-not-allowed">
            <input
              type="radio"
              name="difficulty_level"
              disabled
              className="ml-2 w-4 h-4"
            />
            <span
              className="text-gray-400 line-through"
              title="الـ API لا يدعم هذا المستوى بعد"
            >
              مراجعة نهائية
            </span>
          </label>
        </div>
      </div>

      {/* --- 4. فلتر السعر --- */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icons.Price />
          السعر
        </h4>
        <div className="space-y-3">
          {priceFilters.map((price) => (
            <label key={price.key} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={currentFilters.price_key === price.key}
                onChange={() => handlePriceChange(price)}
                className="ml-2 w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-700">{price.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* --- 5. فلتر التقييم (غير مدعوم حالياً) --- */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icons.Rating />
          التقييم
        </h4>
        <div className="space-y-3 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-sm text-gray-500">
            فلتر التقييم غير مدعوم من الـ API حالياً.
            <br />
            (يمكن فقط <strong className="text-gray-700">الترتيب</strong> حسب
            التقييم من الشريط العلوي).
          </p>
        </div>
      </div>
    </div>
  );
};

export default FiltersSidebar;
