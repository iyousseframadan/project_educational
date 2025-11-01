import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx"; // تأكد من المسار

export default function ProtectedRoute({ children }) {
  // 1. هات بيانات المستخدم من الكونتكست
  const { userData } = useContext(UserContext);

  // 2. افحص: هل المستخدم مسجل دخوله (userData فيه توكن)؟
  if (!userData) {
    // 3. لو لأ: رجعه لصفحة اللوجن
    // replace بتمنع المستخدم يرجع بالـ back button للصفحة اللي كان بيحاول يدخلها
    return <Navigate to="/login" replace />;
  }

  // 4. لو آه: اعرض الصفحة اللي هو كان عايز يروحها
  return children;
}
