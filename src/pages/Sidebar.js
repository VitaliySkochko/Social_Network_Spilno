import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import UserCommunitiesSidebar from '../components/UserCommunitiesSidebar';
import '../styles/Sidebar.css';
import '../styles/UserCommunitiesSidebar.css';

const Sidebar = () => {
  const [userUID, setUserUID] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Контроль меню
  const [friendRequestsCount, setFriendRequestsCount] = useState(0); // Кількість заявок

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserUID(user.uid);
        fetchFriendRequestsCount(user.uid); // Оновлюємо кількість заявок після входу
        listenForRequestChanges(user.uid); // Підписка на зміни заявок
      }
    });

    return () => unsubscribe();
  }, []);

  // Функція для отримання кількості заявок
  const fetchFriendRequestsCount = async (userId) => {
    try {
      const requestsRef = collection(db, 'friendRequests', userId, 'receivedRequests');
      const snapshot = await getDocs(requestsRef);
      setFriendRequestsCount(snapshot.size); // Оновлюємо стан кількості заявок
    } catch (error) {
      console.error('Помилка завантаження заявок:', error);
    }
  };

  // Підписка на зміни в колекції заявок
  const listenForRequestChanges = (userId) => {
    const requestsRef = collection(db, 'friendRequests', userId, 'receivedRequests');
    onSnapshot(requestsRef, (snapshot) => {
      setFriendRequestsCount(snapshot.size); // Оновлюємо кількість заявок в реальному часі
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Перемикач меню
  };

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
            Друзі {friendRequestsCount > 0 && `(${friendRequestsCount})`} {/* Відображення кількості заявок */}
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
