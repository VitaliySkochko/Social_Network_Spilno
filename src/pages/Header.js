import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../img/logo-title.PNG';
import '../styles/Header.css';
import { FaUser} from "react-icons/fa";

const Header = () => {
    const [user] = useAuthState(auth); // Стан авторизації користувача
    const [userData, setUserData] = useState(null); // Дані з Firestore
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                setLoading(true);
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid)); // Зчитуємо дані з Firestore
                    if (userDoc.exists()) {
                        setUserData(userDoc.data()); // Зберігаємо дані у стан
                    }
                } catch (error) {
                    console.error('Помилка при отриманні даних користувача:', error);
                }
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    // Логіка виходу з аккаунта
    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <div className="header-container">
            <Link to="/">
                <img src={logo} alt="logo" className="header-logo" />
            </Link>
            <div className="header-user-info">
                {user ? (
                    loading ? (
                        <p>Завантаження...</p>
                    ) : (
                        <div className="user-info">
                        <Link to="/profile" className="profile-link">
                            <div className="header-photo-container">
                                {userData?.profilePhoto ? (
                                    <img
                                        src={userData.profilePhoto} // Фото з Firestore
                                        alt="User"
                                        className="user-avatar"
                                    />
                                ) : (
                                    <FaUser className="user-avatar-icon" /> 
                                )}
                            </div>
                            <span className="user-name">
                                {userData?.firstName} {userData?.lastName || ''}
                            </span>
                        </Link>
                        <button onClick={handleLogout} className="logout-button">Вийти</button>
                    </div>
                    )
                ) : (
                    <div className="auth-links">
                        <Link to="/login" className="login-link">Вхід</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;

