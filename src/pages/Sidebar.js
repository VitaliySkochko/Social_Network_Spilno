import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { auth } from '../services/firebase';
import { fetchUnreadChatsCount, listenForUnreadChatsChanges, markMessagesAsRead } from '../services/firebaseMessages';  
import { db } from '../services/firebase';  
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import UserCommunitiesSidebar from '../components/UserCommunitiesSidebar';
import '../styles/Sidebar.css';
import '../styles/UserCommunitiesSidebar.css';

const Sidebar = () => {
  const [userUID, setUserUID] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);
  const [unreadChatsCount, setUnreadChatsCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserUID(user.uid);
        fetchFriendRequestsCount(user.uid);
        listenForRequestChanges(user.uid);
        fetchUnreadChatsCount(user.uid, setUnreadChatsCount);
        listenForUnreadChatsChanges(user.uid, setUnreadChatsCount);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchFriendRequestsCount = async (userId) => {
    try {
      const requestsRef = collection(db, 'friendRequests', userId, 'receivedRequests');
      const snapshot = await getDocs(requestsRef);
      setFriendRequestsCount(snapshot.size);
    } catch (error) {
      console.error('Помилка завантаження заявок:', error);
    }
  };

  const listenForRequestChanges = (userId) => {
    const requestsRef = collection(db, 'friendRequests', userId, 'receivedRequests');
    onSnapshot(requestsRef, (snapshot) => {
      setFriendRequestsCount(snapshot.size);
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Оновлення лічильника непрочитаних повідомлень при переході на чат
  useEffect(() => {
    if (location.pathname.includes('/messages')) {
      const chatId = location.pathname.split('/').pop();  // Отримуємо ID чату з URL
      if (chatId) {
        // Оновлюємо статус непрочитаних повідомлень як прочитані для цього чату
        markMessagesAsRead(chatId, auth.currentUser.uid);

        // Оновлюємо лічильник непрочитаних повідомлень
        fetchUnreadChatsCount(auth.currentUser.uid, setUnreadChatsCount);
      }
    }
  }, [location]);

  const isInChat = location.pathname.includes('/messages'); 

  return (
    <aside className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
      <h3>Основне меню</h3>
      <Link to="/" className="button-menu" onClick={toggleMenu}>
        Головна
      </Link>
      {userUID && (
        <>
          <Link to={`/profile/${userUID}`} className="button-menu" onClick={toggleMenu}>
            Профіль
          </Link>
          <Link to="/edit-profile" className="button-menu" onClick={toggleMenu}>
            Редагування профілю
          </Link>
          <Link to="/friends" className="button-menu" onClick={toggleMenu}>
            Друзі {friendRequestsCount > 0 && `(${friendRequestsCount})`}
          </Link>
          
          <Link to="/messages" className="button-menu" onClick={toggleMenu}>
            Повідомлення {(!isInChat && unreadChatsCount > 0) ? `(${unreadChatsCount})` : ''}
          </Link>
          
          <Link to="/users" className="button-menu" onClick={toggleMenu}>
            Пошук користувачів
          </Link>
          <Link to="/create-community" className="button-menu" onClick={toggleMenu}>
            Створити спільноту
          </Link>
          <Link to="/communities" className="button-menu" onClick={toggleMenu}>
            Спільноти
          </Link>
          <UserCommunitiesSidebar />
        </>
      )}
    </aside>
  );
};

export default Sidebar;
