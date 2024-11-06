// Щоб зробити сторінку профілю доступною лише для зареєстрованих користувачів
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';

const PrivateRoute = ({children}) => {
    const [user] = useAuthState(auth);
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;