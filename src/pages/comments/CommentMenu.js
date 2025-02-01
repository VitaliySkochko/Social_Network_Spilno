import React, { useState } from "react";
import EditCommentModal from "./EditCommentModal"; // Імпортуємо EditCommentModal
import '../../styles/CommentMenu.css'



const CommentMenu = ({ commentId, onEdit, onDelete, existingContent, reloadComments, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleEdit = () => {
    setShowEditModal(true);
    toggleMenu();
  };

  const handleDelete = async () => {
    try {
      await onDelete(commentId);
      reloadComments();
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Помилка видалення коментаря:", error);
      alert("Не вдалося видалити коментар.");
    }
  };

  return (
    <div className="comment-menu-container">
      <button className="menu-icon" onClick={toggleMenu}>
        •••
      </button>
      {isOpen && (
        <ul className="comment-menu-dropdown">
          <li onClick={handleEdit}>Редагувати</li>
          <li onClick={() => setShowConfirmModal(true)}>Видалити</li>
        </ul>
      )}

      {/* Модальне вікно для редагування */}
      {showEditModal && (
        <EditCommentModal
          commentId={commentId}
          existingContent={existingContent}
          onEdit={onEdit}
          reloadComments={reloadComments}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Модальне вікно для підтвердження видалення */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Ви впевнені, що хочете видалити цей коментар?</p>
            <div className="modal-buttons">
              <button className="button-delete" onClick={handleDelete}> 
                Так
              </button>
              <button className="button-delete" onClick={() => setShowConfirmModal(false)}>
                Ні
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentMenu;
