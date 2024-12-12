// src/components/MembersModal.js
import React from 'react';
import UserCard from './UserCard'; // Імпортуємо компонент UserCard

const MembersModal = ({ members, onClose }) => {
    return (
        <div className="modal-overlay-group">
            <div className="modal">
                <div className='community-members-group'>
                <h3>Всі учасники</h3>
                {members.length > 0 ? (
                    members.map((member, index) => (
                        <UserCard
                            key={index}
                            profilePhoto={member.profilePhoto}
                            firstName={member.firstName}
                            lastName={member.lastName}
                        />
                    ))
                ) : (
                    <p>Немає учасників</p>
                )}
                <button className='button-exit' onClick={onClose}>Закрити</button>
                </div>
            </div>
        </div>
    );
};

export default MembersModal;