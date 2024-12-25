import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from '../pages/Sidebar';
import Footer from './Footer';
import '../styles/MainLayout.css';

const MainLayout = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Стан для перевірки мобільного екрану
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  // Визначення, чи це мобільний пристрій
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Ширина <= 768px вважається мобільною
    };

    handleResize(); // Перевіряємо при завантаженні
    window.addEventListener('resize', handleResize); // Перевіряємо при зміні розміру

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Закриття Sidebar при зміні маршруту
  useEffect(() => {
    setSidebarVisible(false);
  }, [location]);

  return (
    <div className={`main-layout ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
      <Header />
      {isMobile && ( // Кнопка відображається тільки на мобільних пристроях
        <div className="toggle-sidebar-container">
          <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
            {isSidebarVisible ? 'Закрити меню' : 'Меню'}
          </button>
        </div>
      )}
      <div className="content-container">
        {isMobile && isSidebarVisible && <Sidebar />} {/* Показуємо Sidebar тільки на мобільних пристроях при його видимості */}
        {!isMobile && <Sidebar />} {/* Sidebar завжди видимий на десктопах */}
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

