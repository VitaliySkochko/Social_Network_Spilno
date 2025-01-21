/*------СПІНЕР НА ЗАВАНТАЖЕННЯ-------*/
import React from "react";
import "../styles/Spinner.css"; // Підключаємо стилі для спінера

const Spinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;