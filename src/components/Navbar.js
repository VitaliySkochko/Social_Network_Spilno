//Проста навігація, щоб користувачі могли швидко перемикатися між сторінками входу, реєстрації та профілю

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';


const Navbar = () => {
    const[user] = useAuthState(auth);

    return (
        <nav>
            <Link to='/profile'>Головна</Link>
            <Link to="/communities">Спільноти</Link>
            {user ? (
                <>
                <Link to='/profile'>Профіль</Link>
                <Link to="/create-community">Створити спільноту</Link>
                </>
            ) : (
                <>
                <Link to='/login'>Вхід</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;