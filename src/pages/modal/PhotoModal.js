import React, { useState } from "react";

const PhotoModal = ({ imageSrc, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);  // Оновлюємо стан після завантаження зображення
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
        <img
          src={imageSrc}
          alt="Фото"
          className="modal-photo"
          onLoad={handleImageLoad}  // Додаємо обробник для завантаження зображення
        />
        <button className="close-modal" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
};

export default PhotoModal;
