// Сторінка профілю

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import EditProfile from './EditProfile';
import ProfilePhoto from './ProfilePhoto';
import ProfileInfo from './ProfileInfo';
import ContactInfo from './ContactInfo';
import Modal from '../../components/Modal.js'; // Імпортуємо компонент Modal
import '../../styles/Profile.css';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);  // Стан для відкриття/закриття модального вікна

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

    const openModal = () => setIsModalOpen(true);  // Відкриваємо модальне вікно
    const closeModal = () => setIsModalOpen(false);  // Закриваємо модальне вікно

    return (
        <div className="profile-container">
            {isEditing ? (
                <EditProfile userData={userData} setUserData={setUserData} setIsEditing={setIsEditing} />
            ) : (
                userData && (
                    <>
                        <ProfilePhoto 
                            profilePhoto={userData.profilePhoto} 
                            openModal={openModal}  // Передаємо функцію відкриття модального вікна
                        />
                        <ProfileInfo userData={userData} setIsEditing={setIsEditing} />
                        <ContactInfo userData={userData} />
                        <div className='button-main-conteiner'>
                            <button onClick={() => setIsEditing(true)} className="button-main">Редагувати</button>
                        </div>
                    </>
                )
            )}
            
            {/* Модальне вікно для перегляду фото */}
            {isModalOpen && (
                <Modal 
                    imageSrc={userData.profilePhoto}  // Фото профілю, яке потрібно відобразити в модальному вікні
                    onClose={closeModal}  // Функція для закриття модального вікна
                />
            )}
        </div>
    );
};

export default ProfilePage;
