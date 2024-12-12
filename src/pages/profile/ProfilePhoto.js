//Для відображення фото профілю.

import React from 'react';
import { FaUser } from 'react-icons/fa';

const ProfilePhoto = ({ profilePhoto, openModal }) => {
    return (
        <div className="profile-photo-container">
            {profilePhoto ? (
                <img 
                    src={profilePhoto} 
                    alt="Фото профілю" 
                    className="profile-photo" 
                    onClick={openModal}  // При натисканні відкривається модальне вікно
                />
            ) : (
                <div className="default-photo-placeholder">
                    <FaUser className="user-icon" />
                </div>
            )}
        </div>
    );
};

export default ProfilePhoto;

