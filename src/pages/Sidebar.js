import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import UserCommunitiesSidebar from '../components/UserCommunitiesSidebar';
import '../styles/Sidebar.css';
import '../styles/UserCommunitiesSidebar.css';

const Sidebar = () => {
  const [userUID, setUserUID] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Контроль меню

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserUID(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Перемикач меню
  };

  return (
    <>
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
    </>
  );
};

export default Sidebar;

