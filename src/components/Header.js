import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import logo from '../img/logo-title.PNG';
import '../styles/Header.css';
import UserCard from '../components/UserCard';

const Header = () => {
    const [user] = useAuthState(auth);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

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
                            <button onClick={handleLogout} className="button-exit">
                                Вийти
                            </button>
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
        </div>
    );
};

export default Header;



