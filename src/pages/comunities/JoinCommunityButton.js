import React, { useState } from 'react';
import { joinCommunity, leaveCommunity } from '../../services/firebaseCommunityService';

const JoinCommunityButton = ({ communityId, userId, isMember, onUpdateMembers }) => {
    const [isJoined, setIsJoined] = useState(isMember);

    const handleJoin = async () => {
        try {
            if (isJoined) {
                await leaveCommunity(communityId, userId);
            } else {
                await joinCommunity(communityId, userId);
            }
            setIsJoined(!isJoined);

            // Оновлення учасників після зміни статусу
            onUpdateMembers();
        } catch (error) {
            console.error('Помилка при зміні статусу:', error);
        }
    };

    return (
        <div className='button-main-conteiner'>
        <button onClick={handleJoin} className={`button-main ${isJoined ? 'leave' : 'join'}`}>
            {isJoined ? 'Вийти зі спільноти' : 'Приєднатися до спільноти'}
        </button>
        </div>
    );
};

export default JoinCommunityButton;
