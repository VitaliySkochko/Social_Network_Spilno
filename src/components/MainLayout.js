import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "../pages/Sidebar";
import Footer from "./Footer";
import "../styles/MainLayout.css";

const MainLayout = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Стан для перевірки мобільного екрану
  const location = useLocation();
  const sidebarRef = useRef(null); // Реф для Sidebar

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  // Визначення, чи це мобільний пристрій
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Ширина <= 768px вважається мобільною
    };

    handleResize(); // Перевіряємо при завантаженні
    window.addEventListener("resize", handleResize); // Перевіряємо при зміні розміру

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Закриття Sidebar при зміні маршруту
  useEffect(() => {
    setSidebarVisible(false);
  }, [location]);

  // Закриття Sidebar при кліку поза його межами
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarVisible
      ) {
        setSidebarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarVisible]);

  return (
    <div className={`main-layout ${isSidebarVisible ? "sidebar-visible" : ""}`}>
      <Header />
      {isMobile && (
        <div className="toggle-sidebar-container">
          <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
            {isSidebarVisible ? "Закрити меню" : "Меню"}
          </button>
        </div>
      )}
      <div className="content-container">
        <aside
          className={`sidebar ${isSidebarVisible ? "visible" : "hidden"}`}
          ref={sidebarRef}
        >
          <Sidebar />
        </aside>
        <div className="scrollable-content">
          <main className="main-content">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
