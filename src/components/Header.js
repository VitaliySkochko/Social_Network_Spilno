import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { FaSignOutAlt } from 'react-icons/fa';
import logo from '../img/logo-title(white2).PNG'; 
import '../styles/Header.css';
import UserCard from '../components/UserCard';
import LogoutModal from '../pages/modal/LogoutModal'; // Імпорт модального вікна

const Header = () => {
    const [user] = useAuthState(auth);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Стан для відкриття/закриття модального вікна

    useEffect(() => {
        let unsubscribe;
        if (user) {
            setLoading(true);
            const userDocRef = doc(db, 'users', user.uid);
            unsubscribe = onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
                setLoading(false);
            });
        }
        return () => unsubscribe && unsubscribe();
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
        setIsLogoutModalOpen(false); // Закрити модальне вікно після виходу
    };

    return (
        <div className="header-container">
            <Link to="/">
                <img src={logo} alt="logo" className="header-logo" />
            </Link>
            <div className="header-user-info">
                {user ? (
                    loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="user-info">
                            <UserCard
                                uid={user.uid} 
                                profilePhoto={userData?.profilePhoto}
                                firstName={userData?.firstName}
                                lastName={userData?.lastName}
                            />
                            <div onClick={() => setIsLogoutModalOpen(true)} className="logout-icon-wrapper">
                                <FaSignOutAlt className="logout-icon" />
                            </div>
                        </div>
                    )
                ) : (
                    <div className="auth-links">
                        <Link to="/login" className="login-link">
                            Вхід
                        </Link>
                    </div>
                )}
            </div>
            {/* Модальне вікно */}
            {isLogoutModalOpen && (
                <LogoutModal 
                    onConfirm={handleLogout} 
                    onCancel={() => setIsLogoutModalOpen(false)} 
                    profilePhoto={userData?.profilePhoto}  // Передаємо аватар
                    firstName={userData?.firstName}       // Передаємо ім'я
                    lastName={userData?.lastName}         // Передаємо прізвище
                />
            )}
        </div>
    );
};

export default Header;




