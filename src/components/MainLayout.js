import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from '../pages/Sidebar';
import Footer from './Footer';
import '../styles/MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      {/* Верхній заголовок */}
      <Header />
      {/* Основний контейнер з боковою панеллю та вмістом */}
      <div className="content-container">
        <Sidebar />
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

