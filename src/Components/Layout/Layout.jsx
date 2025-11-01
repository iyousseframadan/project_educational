import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";

export default function Layout() {

  

  return (
    // ده بيضمن إن الفوتر يفضل تحت حتى لو الصفحة فاضية
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* الـ Outlet هو المكان اللي هيتعرض فيه باقي الصفحات (زي الهوم واللوجن) */}
      <main className="grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
