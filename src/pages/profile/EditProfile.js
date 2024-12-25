// Кнопка "Редагувати профіль", яка буде відображати модальне вікно з формою для редагування даних профілю, включаючи завантаження фото

import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import ProfilePhotoSection from './ProfilePhotoSection';
import MainInfoSection from './MainInfoSection';
import SocialMediaSection from './SocialMediaSection';
import { useNavigate } from 'react-router-dom';
import '../../styles/Profile.css';

const EditProfile = () => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const [isUploading, setIsUploading] = useState(false); // Додано для відслідковування стану завантаження фото
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                    if (userDoc.exists()) {
                        setFormData(userDoc.data());
                    } else {
                        setMessage('Не знайдено даних користувача.');
                        setMessageType('error');
                    }
                } catch (error) {
                    console.error('Помилка завантаження даних:', error);
                    setMessage('Помилка при завантаженні даних користувача.');
                    setMessageType('error');
                }
            }
            setLoading(false);
        };
        fetchUserData();
    }, []);

    const handleSave = async () => {
        try {
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userDocRef, formData);

            setMessage('Профіль успішно збережено!');
            setMessageType('success');
            setTimeout(() => {
                setMessage(null);
                navigate(`/profile/${auth.currentUser.uid}`);
            }, 3000);
        } catch (error) {
            console.error('Помилка при оновленні профілю:', error);
            setMessage('Не вдалося зберегти зміни. Спробуйте ще раз.');
            setMessageType('error');
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!formData) {
        return <div className="error-message">Дані профілю відсутні.</div>;
    }

    return (
        <div className="edit-profile-container">
            <h2 className="edit-profile-title">Редагування профілю</h2>
            {message && <div className={`message ${messageType}`}>{message}</div>}

            <ProfilePhotoSection 
                formData={formData} 
                setFormData={setFormData} 
                isUploading={isUploading} // Передаємо стан завантаження
                setIsUploading={setIsUploading} // Функція для зміни стану завантаження
                setMessage={setMessage} 
                setMessageType={setMessageType} 
            />
            <MainInfoSection formData={formData} setFormData={setFormData} />
            <SocialMediaSection formData={formData} setFormData={setFormData} />

            <div className="button-main-conteiner">
                <button className="button-main" onClick={handleSave}> 
                    Зберегти
                </button>
                <button className="button-main" onClick={() => navigate('/profile/:uid')}>
                    Скасувати
                </button>
            </div>
        </div>
    );
};

export default EditProfile;
