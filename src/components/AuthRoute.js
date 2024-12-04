//Цей компонент перевіряє, чи є користувач аутентифікованим. Якщо ні, він перенаправляє на сторінку входу.

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';

const AuthRoute = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Завантаження...</p>;

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRoute;
