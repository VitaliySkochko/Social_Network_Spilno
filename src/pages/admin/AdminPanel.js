// Панель адміністратора
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // Додаємо useNavigate
import { doc, getDoc } from "firebase/firestore"; 
import { deleteCommunityAndPosts } from "../../services/firebaseCommunityService"; // Імпортуємо нашу функцію
import '../../styles/AdminPanel.css';
import { db } from "../../services/firebase"; // Імпортуємо ваш конфіг Firebase

const AdminPanel = () => {
  const { id: communityId } = useParams(); // Отримуємо ID спільноти
  const [joinRequestCount, setJoinRequestCount] = useState(0); // Стан для кількості заявок
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Стан для модального вікна
  const [message, setMessage] = useState(null); // Стан для повідомлень
  const navigate = useNavigate(); // Хук для переходу на інші сторінки
  const [isDeleting, setIsDeleting] = useState(false); 

  useEffect(() => {
    // Функція для отримання кількості заявок
    const fetchJoinRequests = async () => {
      try {
        const communityRef = doc(db, 'communities', communityId);
        const communitySnapshot = await getDoc(communityRef);

        if (communitySnapshot.exists()) {
          const joinRequests = communitySnapshot.data().joinRequests || [];
          setJoinRequestCount(joinRequests.length);
        }
      } catch (error) {
        console.error("Помилка отримання заявок:", error);
        setMessage("Не вдалося завантажити дані. Спробуйте ще раз пізніше.");
      }
    };

    fetchJoinRequests();
  }, [communityId]); // Виконується при зміні ID спільноти

  const handleDeleteCommunity = async () => {
    setIsDeleting(true); // Починаємо процес видалення
    try {
      const success = await deleteCommunityAndPosts(communityId);
  
      if (success) {
        setMessage("Спільноту успішно видалено.");
        setTimeout(() => {
          navigate("/communities"); // Переходимо до списку спільнот
        }, 3000);
      } else {
        setMessage("Не вдалося видалити спільноту. Спробуйте ще раз.");
      }
    } catch (error) {
      console.error("Помилка при видаленні спільноти:", error);
      setMessage("Не вдалося видалити спільноту. Спробуйте ще раз.");
    } finally {
      setIsDeleting(false); // Завершуємо процес видалення
      setShowDeleteModal(false);
    }
  };

  const handleCloseModal = (event) => {
    // Закриваємо модальне вікно при кліку поза його межами
    if (event.target.className === "delete-modal") {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Панель адміністратора</h2>
      <p>Тут ви можете керувати спільнотою, публікаціями та учасниками.</p>

      <div className="admin-panel-group">
        <Link to={`/edit-community/${communityId}`} className="menu-button-admin">
          Редагувати спільноту
        </Link>

        <Link to={`/community/${communityId}/settings`} className="menu-button-admin">
          Налаштування
        </Link>
      
        <Link to={`/community/${communityId}/join-requests`} className="menu-button-admin">
          Переглянути заявки ({joinRequestCount})
        </Link>

        {/* Кнопка для видалення спільноти */}
        <button className="menu-button-admin" onClick={() => setShowDeleteModal(true)}>
          Видалити спільноту
        </button>
      </div>

      {showDeleteModal && (
        <div className="delete-modal" onClick={handleCloseModal}>
          <div className="delete-modal-content">
            <p><strong>Ви впевнені, що хочете видалити спільноту?</strong></p>
            <div className="button-delete-container">
              <button
                className="button-delete"
                onClick={handleDeleteCommunity}
                disabled={isDeleting} // Блокуємо кнопку під час видалення
              >
                {isDeleting ? "Видаляється..." : "Так, видалити"}
              </button>
              <button
                className="button-main"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting} // Блокуємо кнопку "Скасувати" під час видалення
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default AdminPanel;
