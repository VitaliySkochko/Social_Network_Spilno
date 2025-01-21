//Модельне вікно редагування поста

import React, { useState } from "react";
import { updatePost } from "../../services/firebasePostService";
import { FaTimes } from "react-icons/fa"; // Іконка з Font Awesome
import "../../styles/EditPostModal.css"; // Підключення стилів

const EditPostModal = ({
  postId,
  existingContent,
  existingImages = [], // Очікуємо масив зображень
  reloadPosts,
  onClose,
}) => {
  const [content, setContent] = useState(existingContent);
  const [images, setImages] = useState(existingImages); // Масив зображень

  const handleSaveChanges = async () => {
    try {
      const updatedData = { content, images }; // Видалено поле video
      await updatePost(postId, updatedData);
      reloadPosts();
      onClose();
    } catch (error) {
      console.error("Помилка редагування поста:", error);
      alert("Не вдалося оновити пост.");
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Редагувати пост</h2>
        <textarea
          className="description-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Введіть новий текст поста"
        />
        <div className="images-preview">
          {images.map((image, index) => (
            <div key={index} className="image-item">
              <img src={image} alt={`Preview ${index + 1}`} />
              <FaTimes
                className="remove-image-icon"
                onClick={() => handleRemoveImage(index)}
              />
            </div>
          ))}
        </div>
        <div className="modal-buttons">
          <button className="button-approve" onClick={handleSaveChanges}>
            Зберегти
          </button>
          <button className="button-delete" onClick={onClose}> 
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;


