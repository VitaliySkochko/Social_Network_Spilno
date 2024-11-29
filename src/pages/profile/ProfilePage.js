// Сторінка профілю


import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../services/firebase';
import EditProfile from './EditProfile';
import {format} from 'date-fns'
import '../../styles/ProfilePage.css';
import { FaUser} from "react-icons/fa";

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Новий стан для редагування
    

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

   
    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="profile-container">
        {isEditing ? (
            <EditProfile userData={userData} setUserData={setUserData} setIsEditing={setIsEditing} />
        ) : (
            <>
                {userData ? (
                    <div className="profile-info">
                        {/* Відображення фото профілю */}
                        <div className="profile-photo-container">
                            {userData.profilePhoto ? (
                                <img
                                    src={userData.profilePhoto}
                                    alt="Фото профілю"
                                    className="profile-photo"
                                />
                            ) : (
                                <div className="default-photo-placeholder">
                                    <FaUser className="user-icon" />
                                </div>
                            )}
                        </div>

                        {/* Відображення інших даних профілю */}
                        <div className="profile-group-name-surname">
                            <p className="profile-name">{userData.firstName}</p>
                            <p className="profile-name">{userData.lastName}</p>
                        </div>
                        <p><strong>Дата народження:</strong> {userData.birthDate ? format(new Date(userData.birthDate), 'dd/MM/yyyy') : ''}</p>
                        <p><strong>Стать:</strong> {userData.gender}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        {userData.interests && (
                            <p><strong>Про себе:</strong> {userData.interests}</p>
                        )}
                        {userData.country && userData.city && (
                            <p><strong>Місце проживання:</strong> {userData.city} ({userData.country}) </p>
                        )}
                        <h3>Контактні дані та соціальні мережі</h3>
                        {userData.facebook && (
                            <p><strong>Facebook:</strong> <a href={userData.facebook} target='_blank' rel="noopener noreferrer"> {userData.facebook}</a></p>
                        )}
                        {userData.instagram && (
                            <p><strong>Instagram:</strong> <a href={userData.instagram} target='_blank' rel="noopener noreferrer"> {userData.instagram}</a></p>
                        )}
                        {userData.telegram && (
                            <p><strong>Telegram:</strong> <a href={userData.telegram} target='_blank' rel="noopener noreferrer"> {userData.telegram}</a></p>
                        )}
                        {userData.linkedIn && (
                            <p><strong>LinkedIn:</strong> <a href={userData.linkedIn} target="_blank" rel="noopener noreferrer">{userData.linkedIn}</a></p>
                        )}
                        {userData.phone && (
                            <p><strong>Телефон:</strong> {userData.phone}</p>
                        )}
                        {userData.additionalEmail && (
                            <p><strong>Додатковий email:</strong> {userData.additionalEmail}</p>
                        )}
                        <button onClick={() => setIsEditing(true)} className="edit-button">Редагувати</button>
                    </div>
                ) : (
                    <p className="loading-message">Не вдалося завантажити дані користувача.</p>
                )}
            </>
        )}
    </div>
    );
}; 

export default ProfilePage;
