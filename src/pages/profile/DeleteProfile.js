import React, { useState } from "react";
import { auth, db } from "../../services/firebase";
import { doc, deleteDoc } from "firebase/firestore";

const DeleteProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  const handleDeleteProfile = async () => {
    try {
      const userId = auth.currentUser.uid;

      // Видалення документа користувача з Firestore
      const userDocRef = doc(db, "users", userId);
      await deleteDoc(userDocRef);

      // Видалення облікового запису користувача з Firebase Authentication
      await auth.currentUser.delete();

      setMessage("Ваш профіль успішно видалено.");
      setMessageType("success");
      setTimeout(() => {
        window.location.reload(); // Перезавантаження сторінки
      }, 3000);
    } catch (error) {
      console.error("Помилка при видаленні профілю:", error);
      setMessage("Не вдалося видалити профіль. Спробуйте ще раз.");
      setMessageType("error");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="button-main-conteiner">
      <button
        className="button-delete"
        onClick={() => setShowModal(true)}
        >Видалити профіль</button>
      {showModal && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <p><strong>Ви впевнені, що хочете видалити свій профіль?</strong></p>
            <div className="button-delete-container">
            <button className="button-delete" onClick={handleDeleteProfile}>
              Так, видалити
            </button>
            <button
              className="button-main"
              onClick={() => setShowModal(false)}
            >
              Скасувати
            </button>
            </div>
          </div>
        </div>
      )}
      {message && <div className={`message ${messageType}`}>{message}</div>}
    </div>
  );
};

export default DeleteProfile;
