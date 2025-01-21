import React from 'react';
import '../../styles/LogoutModal.css';


const LogoutModal = ({ onConfirm, onCancel, profilePhoto, firstName, lastName }) => {
    return (
        <div className="modal-overlay-container">
            <div className="modal-content-logout">
                <p><strong>Вийти з вашого облікового запису?</strong></p>
                {profilePhoto && <img src={profilePhoto} alt="Profile" className="profile-photo" />} {/* Відображаємо аватар */}
                <p><strong>{firstName} {lastName}</strong></p> {/* Відображаємо ім'я та прізвище */}
                <div className="modal-logout-button">
                    <button onClick={onConfirm} className="button-main">Так</button>
                    <button onClick={onCancel} className="button-delete">Ні</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;