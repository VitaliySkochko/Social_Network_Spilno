//Для відображення основної інформації про користувача

import React from 'react';
import { format } from 'date-fns';

const ProfileInfo = ({ userData, setIsEditing }) => { 
    return (
        <div className="profile-info">
            <div className="profile-group-name-surname">
                <p className="profile-name">{userData.firstName}</p>
                <p className="profile-name">{userData.lastName}</p>
            </div>
            <p><strong>Дата народження:</strong> {userData.birthDate ? format(new Date(userData.birthDate), 'dd/MM/yyyy') : ''}</p>
            <p><strong>Стать:</strong> {userData.gender}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            {userData.interests && <p><strong>Про себе:</strong> {userData.interests}</p>}
            {userData.country && userData.city && (
                <p><strong>Місце проживання:</strong> {userData.city} ({userData.country})</p>
            )}
            
        </div>
    );
};

export default ProfileInfo;
