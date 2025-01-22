// Сторінка профілю

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import ProfilePhoto from './ProfilePhoto';
import ProfileInfo from './ProfileInfo';
import ContactInfo from './ContactInfo';
import Modal from '../modal/PhotoModal.js';
import { useNavigate } from 'react-router-dom';
import UserActivity from './UserActivity'; 
import '../../styles/Profile.css';

const ProfilePage = () => {
    const { uid } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', uid));
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

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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
        <h2 className="edit-profile-title">Профіль користувача</h2>
            {userData && (
                <>
                <div className='profile-user-container'>
                    <ProfilePhoto 
                        profilePhoto={userData.profilePhoto} 
                        openModal={openModal} 
                    />
                    <ProfileInfo userData={userData} />
                    </div>
                    <div className='profile-user-info-container'>
                    <ContactInfo userData={userData} />
                    </div>
                    <div className='profile-user-activity-container'>
                    <UserActivity uid={uid} />
                    </div>
                </>
            )}

            {isModalOpen && (
                <Modal 
                    imageSrc={userData?.profilePhoto || ''} 
                    onClose={closeModal} 
                />
            )}
        </div>
    );
};

export default ProfilePage;