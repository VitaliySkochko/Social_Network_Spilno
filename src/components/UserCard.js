import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const UserCard = ({ uid, profilePhoto, firstName, lastName }) => {
    return (
        <Link to={`/profile/${uid}`} className="profile-link">
            <div className="user-photo-container">
                {profilePhoto ? (
                    <img
                        src={profilePhoto} // Фото з Firestore
                        alt="User"
                        className="user-avatar"
                    />
                ) : (
                    <FaUser className="user-avatar-icon" />
                )}
            </div>
            <span className="user-name">
                {firstName} {lastName || ''}
            </span>
        </Link>
    );
};

export default UserCard;
