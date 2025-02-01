// Сторінка профілю

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import ProfilePhoto from './ProfilePhoto';
import ProfileInfo from './ProfileInfo';
import ContactInfo from './ContactInfo';
import Modal from '../modal/PhotoModal.js';
import { useNavigate } from 'react-router-dom';
import UserActivity from './UserActivity';
import FriendButton from './FriendButton.js';
import '../../styles/Profile.css';

const ProfilePage = () => {
  const { uid } = useParams(); // UID профілю
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setError('Не знайдено даних користувача.');
          }
        } catch (error) {
          setError('Помилка при завантаженні даних користувача.');
          console.error(error);
        }
      } else {
        setError('Користувач не авторизований.');
      }
      setLoading(false);
    };
    fetchUserData();
  }, [uid]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Функція для створення чату
  const handleSendMessage = async () => {
    if (!auth.currentUser) {
      alert('Ви повинні бути авторизовані для надсилання повідомлень.');
      return;
    }
  
    try {
      const currentUser = auth.currentUser;
  
      // Перевіряємо, чи існує чат між поточним користувачем та іншими
      const chatRef = collection(db, 'messages');
      const q = query(
        chatRef,
        where('participants', 'array-contains', currentUser.uid)
      );
  
      const querySnapshot = await getDocs(q);
      let existingChat = null;
      querySnapshot.forEach(doc => {
        const chatData = doc.data();
        if (chatData.participants.includes(uid)) {
          existingChat = doc.id; // Якщо чат вже існує, зберігаємо ID
        }
      });
  
      if (existingChat) {
        // Якщо чат знайдено, перенаправляємо до нього
        console.log('Чат вже існує:', existingChat);
        navigate(`/chat/${existingChat}`); // Перенаправляємо до чату
        return;
      }
  
      // Якщо чат не знайдено, створюємо новий
      console.log('Створення нового чату...');
      const newChatRef = await addDoc(chatRef, {
        participants: [currentUser.uid, uid], // UID відправника та отримувача
        messages: [], // Порожній масив для повідомлень
        createdAt: serverTimestamp(),
      });
      console.log('Новый чат создан:', newChatRef.id);
  
      navigate(`/chat/${newChatRef.id}`); // Перенаправляємо до нового чату
    } catch (error) {
      console.error('Помилка при створенні чату:', error);
      alert('Помилка при створенні чату. Перевірте консоль для деталей.');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Перевіряємо, чи це профіль поточного користувача
  const isCurrentUserProfile = auth.currentUser && auth.currentUser.uid === uid;

  return (
    <div className="profile-container">
      <h2 className="edit-profile-title">Профіль користувача</h2>
      {userData && (
        <>
          <div className="profile-user-container">
            <ProfilePhoto profilePhoto={userData.profilePhoto} openModal={openModal} />
            <div className="button-profile-container-group">
              <div className='button-profile-group'>
              <FriendButton uid={uid} />
              {/* Кнопка для надсилання повідомлення (приховуємо для поточного користувача) */}
              {!isCurrentUserProfile && (
                <button className="button-approve" onClick={handleSendMessage}>
                  Написати повідомлення
                </button>
              )}
              </div>
              <ProfileInfo userData={userData} />
            </div>
          </div>
          <div className="profile-user-info-container">
            <ContactInfo userData={userData} />
          </div>
          <div className="profile-user-activity-container">
            <UserActivity uid={uid} />
          </div>
        </>
      )}

      {isModalOpen && (
        <Modal imageSrc={userData?.profilePhoto || ''} onClose={closeModal} />
      )}
    </div>
  );
};

export default ProfilePage;
