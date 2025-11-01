import React from "react";

// --- أيقونات للـ Pagination ---
const Icons = {
  Next: (props) => <span {...props}>التالي &larr;</span>,
  Prev: (props) => <span {...props}>&rarr; السابق</span>,
};
// ----------------------------

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  // 1. لو مفيش غير صفحة واحدة، منظهرش أي حاجة
  if (lastPage <= 1) {
    return null;
  }

  // 2. لوجيك بسيط لعرض أرقام الصفحات (عشان نتجنب 50 زرار)
  const pagesToShow = [];

  // دايماً نعرض أول صفحة
  pagesToShow.push(1);

  // ... لو إحنا بعد صفحة 3
  if (currentPage > 3) {
    pagesToShow.push("...");
  }

  // الصفحة اللي قبل الحالية
  if (currentPage > 2) {
    pagesToShow.push(currentPage - 1);
  }

  // الصفحة الحالية (لو هي مش الأولى ولا الأخيرة)
  if (currentPage !== 1 && currentPage !== lastPage) {
    pagesToShow.push(currentPage);
  }

  // الصفحة اللي بعد الحالية
  if (currentPage < lastPage - 1) {
    pagesToShow.push(currentPage + 1);
  }

  // ... لو لسه بدري على آخر صفحة
  if (currentPage < lastPage - 2) {
    pagesToShow.push("...");
  }

  // دايماً نعرض آخر صفحة
  pagesToShow.push(lastPage);

  // إزالة التكرار (مثلاً لو كانت الصفحات 1, 2, 3)
  const uniquePages = [...new Set(pagesToShow)];

  // 3. تعريف شكل الزرار (العادي، الحالي، ...)
  const PageButton = ({ page, current, onClick, disabled }) => {
    // لو '...'
    if (page === "...") {
      return <span className="text-gray-500 px-4 py-2 rounded-lg">...</span>;
    }

    // لو رقم صفحة
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors
          ${
            current
              ? "bg-purple-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-purple-100"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {page}
      </button>
    );
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12" dir="rtl">
      {/* --- زرار السابق --- */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-5 py-2.5 rounded-lg font-semibold transition-colors bg-white text-gray-700 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icons.Prev />
      </button>

      {/* --- أرقام الصفحات --- */}
      <div className="flex items-center gap-2">
        {uniquePages.map((page, index) => (
          <PageButton
            key={index}
            page={page}
            current={page === currentPage}
            onClick={() => onPageChange(page)}
            disabled={page === "..."}
          />
        ))}
      </div>

      {/* --- زرار التالي --- */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="px-5 py-2.5 rounded-lg font-semibold transition-colors bg-white text-gray-700 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icons.Next />
      </button>
    </div>
  );
};

export default Pagination;
