import React, { useState } from "react";
import { updateComment } from '../../services/firebaseComments';
import { FaTimes } from "react-icons/fa"; // Іконка з Font Awesome

const EditCommentModal = ({ commentId, existingContent, reloadComments, onClose }) => {
  const [content, setContent] = useState(existingContent);

  const handleSaveChanges = async () => {
    try {
      // Оновлення коментаря за допомогою функції updateComment
      await updateComment(commentId, content);  // Тепер ми передаємо лише текст
      reloadComments();  // Перезавантажуємо коментарі
      onClose();  // Закриваємо модальне вікно
    } catch (error) {
      console.error("Помилка редагування коментаря:", error);
      alert("Не вдалося оновити коментар.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Редагувати коментар</h2>
        <textarea
          className="description-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Введіть новий текст коментаря"
        />
        <div className="modal-buttons">
          <button className="save-button" onClick={handleSaveChanges}>
            Зберегти
          </button>
          <button className="button-exit" onClick={onClose}>
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCommentModal;
