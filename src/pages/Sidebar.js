import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebase'; // Імпортуйте auth із вашої конфігурації Firebase
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [userUID, setUserUID] = useState(null);

  useEffect(() => {
    // Отримання UID авторизованого користувача
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserUID(user.uid);
      }
    });

    return () => unsubscribe(); // Очищення слухача
  }, []);

  return (
    <aside className="sidebar">
      <Link to="/" className="button-menu">Головна</Link>
      {userUID && (
        <>
          <Link to={`/profile/${userUID}`} className="button-menu">Профіль</Link>
          <Link to="/edit-profile" className="button-menu">Редагування профілю</Link>
          <Link to="/create-community" className="button-menu">Створити спільноту</Link>
          <Link to="/communities" className="button-menu">Спільноти</Link>
        </>
      )}
    </aside>
  );
};

export default Sidebar;

