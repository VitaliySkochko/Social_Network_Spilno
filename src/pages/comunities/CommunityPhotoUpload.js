// Завантаження фото для спільноти

import React, { useState } from "react";
import { FaImage } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import "../../styles/CreateCommunityPage.css";

const CommunityPhotoUpload = ({ onPhotoSelect }) => {
  const [photoPreview, setPhotoPreview] = useState(""); // Стан для попереднього перегляду фото
  const fileInputRef = React.useRef(null); // Реф для доступу до input[type="file"]

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file)); // Генеруємо попередній перегляд фото
      onPhotoSelect(file); // Передаємо вибране фото до батьківського компонента
    }
  };

  // Налаштування dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 1,
    noClick: true, // Запобігаємо відкриттю діалогу по кліку на зону завантаження
  });

  // Обробка натискання на іконку для вибору фото
  const handleIconClick = () => {
    fileInputRef.current.click(); // Імітуємо клік по input[type="file"]
  };

  return (
    <div className="community-photo-upload">
      {/* Вибір фото через іконку */}
      <div {...getRootProps()} className="photo-zone">
        <input {...getInputProps()} ref={fileInputRef} style={{ display: "none" }} />
        {photoPreview ? (
          <img src={photoPreview} alt="Прев'ю фото спільноти" className="photo-preview" />
        ) : (
          <p className="upload-instruction">Додати фото для спільноти</p>
        )}
      </div>

      {/* Іконка для додавання фото, по натисканню на неї відкривається діалог вибору файлів */}
      {!photoPreview && (
        <label className="photo-icon" title="Завантажити фото" onClick={handleIconClick}>
          <FaImage/>
        </label>
      )}
    </div>
  );
};

export default CommunityPhotoUpload;


