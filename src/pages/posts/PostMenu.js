// Меню кожного поста

import React, { useState } from "react";
import EditPostModal from "./EditPostModal"; // Імпортуємо EditPostModal
import "../../styles/PostMenu.css";

const PostMenu = ({ 
  postId, 
  onEdit, 
  onDelete, 
  reloadPosts, 
  existingContent, 
  existingImages, 
  existingVideo, 
  isAdmin,
  userId, // Додано userId
  currentUser, // Додано currentUser
}) => {
  // Викликаємо хуки поза умовами
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Якщо користувач не є адміністратором, повертаємо порожній div
  if (!isAdmin && userId !== currentUser?.uid) {
    return null;
  }

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleEdit = () => {
    setShowEditModal(true);
    toggleMenu();
  };

  const handleDelete = async () => {
    try {
      await onDelete(postId);
      reloadPosts();
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Помилка видалення поста:", error);
      alert("Не вдалося видалити пост.");
    }
  };

  return (
    <div className="post-menu-container">
      <button className="menu-icon" onClick={toggleMenu}>
        •••
      </button>
      {isOpen && (
        <ul className="post-menu-dropdown">
          <li onClick={handleEdit}>Редагувати</li>
          <li onClick={() => setShowConfirmModal(true)}>Видалити</li>
        </ul>
      )}

      {/* Модальне вікно для редагування */}
      {showEditModal && (
        <EditPostModal
          postId={postId}
          existingContent={existingContent}
          existingImages={existingImages}
          existingVideo={existingVideo}
          onEdit={onEdit}
          reloadPosts={reloadPosts}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Модальне вікно для підтвердження видалення */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Ви впевнені, що хочете видалити цей пост?</p>
            <div className="modal-buttons">
              <button className="save-button" onClick={handleDelete}>
                Так
              </button>
              <button
                className="button-exit"
                onClick={() => setShowConfirmModal(false)}
              >
                Ні
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostMenu;
