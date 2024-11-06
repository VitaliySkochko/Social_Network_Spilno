// Сторінка профілю

import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import '../styles/ProfilePage.css'; 

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <div className="profile-container">
            <h2 className="profile-title">Профіль користувача</h2>
            {userData ? (
                <div className="profile-info">
                    <p><strong>Ім'я:</strong> {userData.firstName}</p>
                    <p><strong>Прізвище:</strong> {userData.lastName}</p>
                    <p><strong>Дата народження:</strong> {userData.birthDate}</p>
                    <p><strong>Стать:</strong> {userData.gender}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <button onClick={handleLogout} className="logout-button">Вийти</button>
                </div>
            ) : (
                <p className="loading-message">Завантаження...</p>
            )}
        </div>
    );
};

export default ProfilePage;
