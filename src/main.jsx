import React from "react";
import ReactDOM from "react-dom/client";
// <<< تم إضافة امتداد الملف .jsx
import App from "./App.jsx";
import './index.css'; // علّقنا هذا السطر سابقاً

// --- Imports Needed ---
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// تأكد من أن المسار صحيح بناءً على هيكل المجلدات لديك
// يفترض أن الملف موجود في: src/Context/UserContext.jsx
import UserContextProvider from "../src/context/UserContext.jsx";
//----------------------

// --- Query Client Initialization ---
const queryClient = new QueryClient();
//-----------------------------------

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* --- Providers Wrapping App --- */}
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </QueryClientProvider>
    {/* ----------------------------- */}
  </React.StrictMode>
);
