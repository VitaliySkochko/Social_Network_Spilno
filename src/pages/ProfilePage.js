// Сторінка профілю

import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import '../styles/ProfilePage.css'; 

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    } else {
                        setError('Не знайдено даних користувача.');
                    }
                } catch (error) {
                    setError('Помилка при завантаженні даних користувача.');
                    console.error(error);
                }
            } else {
                setError('Користувач не авторизований.');
            }
            setLoading(false);
        };
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
    };

    if (loading) {
        return <div className="loading-message">Завантаження...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="profile-container">
            <h2 className="profile-title">Профіль користувача</h2>
            {userData ? (
                <div className="profile-info">
                    <p className="profile-name">{userData.firstName}</p>
                    <p className="profile-surname">{userData.lastName}</p>
                    <p><strong>Дата народження:</strong> {userData.birthDate}</p>
                    <p><strong>Стать:</strong> {userData.gender}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <button onClick={handleLogout} className="logout-button">Вийти</button>
                </div>
            ) : (
                <p className="loading-message">Не вдалося завантажити дані користувача.</p>
            )}
        </div>
    );
};

export default ProfilePage;


