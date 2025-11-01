import React, { createContext, useEffect, useState } from "react";

// 1. إنشاء الكونتكست
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  const [userData, setUserData] = useState(null);

  // 2. عند فتح التطبيق، نتأكد إذا كان اليوزر مسجل دخول من قبل
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setUserData(token);
    }
  }, []);

  return (
    // 3. توفير البيانات (userData) وطريقة تعديلها (setUserData) لكل التطبيق
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}
