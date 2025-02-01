import React from "react";

const DeleteChatModal = ({ show, onClose, onDelete, chatId }) => {
  if (!show) return null;

  return (
    <div className="delete-modal">
      <div className="delete-modal-content">
        <p><strong>Ви впевнені, що хочете видалити цей чат?</strong></p>
        <div className="button-delete-container">
          <button className="button-delete" onClick={() => onDelete(chatId)}>
            Так, видалити
          </button>
          <button className="button-main" onClick={onClose}>
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatModal;
