//Для відображення контактних даних і соцмереж.

import React from 'react';

const ContactInfo = ({ userData }) => {
    return (
        <div className='profile-info'>
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
            {userData.phone && <p><strong>Телефон:</strong> {userData.phone}</p>}
            {userData.additionalEmail && <p><strong>Додатковий email:</strong> {userData.additionalEmail}</p>}
        </div>
    );
};

export default ContactInfo;
