import React, { useState, useEffect } from 'react';
import { submitJoinRequest, joinCommunity, leaveCommunity, rejectJoinRequest, fetchJoinRequestStatus } from '../../services/firebaseCommunityService';

const JoinCommunityButton = ({ communityId, userId, isMember, communityType, isAdmin, joinRequestStatus, onUpdateMembers }) => {
    const [isJoined, setIsJoined] = useState(isMember || isAdmin);
    const [isRequestSubmitted, setIsRequestSubmitted] = useState(joinRequestStatus === 'pending');
    const [requestStatus, setRequestStatus] = useState(null); // для збереження статусу заявки

    // Викликається при завантаженні компонента
    useEffect(() => {
        setIsJoined(isMember || isAdmin);
        fetchRequestStatus(); // Оновлення статусу заявки при завантаженні сторінки
    }, [isMember, isAdmin, joinRequestStatus]);

    // Функція для отримання статусу заявки з Firestore
    const fetchRequestStatus = async () => {
        try {
            const status = await fetchJoinRequestStatus(communityId, userId);
            setRequestStatus(status); // Оновлення локального стану статусу заявки
            setIsRequestSubmitted(status === 'pending');
        } catch (error) {
            console.error('Помилка при перевірці статусу заявки:', error);
        }
    };

    const handleJoin = async () => {
        try {
            if (isJoined) {
                if (isAdmin) {
                    console.warn('Адміністратор не може вийти зі створеної спільнотою');
                    return;
                }

                await leaveCommunity(communityId, userId);
                setIsJoined(false);
                setRequestStatus('none'); // Якщо користувач покидає спільноту, скидаємо статус заявки
                setIsRequestSubmitted(false); // Скидаємо статус поданої заявки
            } else {
                if (communityType === 'private') {
                    await submitJoinRequest(communityId, userId, 'UserName');
                    setIsRequestSubmitted(true); 
                    setRequestStatus('pending'); // Заявка подана
                } else {
                    await joinCommunity(communityId, userId);
                    setIsJoined(true);
                    setRequestStatus('none'); // Якщо користувач приєднується, статус заявки скидається
                }
            }

            onUpdateMembers();
        } catch (error) {
            console.error('Помилка при зміні статусу:', error);
        }
    };

    const handleCancelRequest = async () => {
        try {
            await rejectJoinRequest(communityId, userId); // Видалити заявку з Firestore
            setIsRequestSubmitted(false); // Скинути статус заявки
            setRequestStatus('none'); // Оновити статус заявки в локальному стані
            onUpdateMembers(); // Оновити список учасників
        } catch (error) {
            console.error('Помилка при скасуванні заявки:', error);
        }
    };

    const handleResubmitRequest = async () => {
        try {
            await submitJoinRequest(communityId, userId, 'UserName'); // Повторно подати заявку
            setIsRequestSubmitted(true); // Знову встановити статус заявки
            setRequestStatus('pending');
            onUpdateMembers();
        } catch (error) {
            console.error('Помилка при подачі заявки:', error);
        }
    };

    return (
        <div className="button-main-container">
            <button
                onClick={handleJoin}
                className={`menu-button-comynity ${isJoined ? 'leave' : 'join'}`}
                disabled={isAdmin && isJoined}
            >
                {isAdmin && isJoined
                    ? 'Ви адміністратор цієї спільноти'
                    : isJoined
                    ? 'Вийти зі спільноти'
                    : isRequestSubmitted
                    ? 'Заявка подана'
                    : communityType === 'private' && !isJoined
                    ? 'Подати заявку на участь у спільноті'
                    : 'Приєднатися до спільноти'}
            </button>

            {/* Якщо заявка подана, відображаємо кнопку для її скасування */}
            {requestStatus === 'pending' && !isJoined && (
                <div>

                    <button onClick={handleCancelRequest} className="menu-button-comynity">
                        Скасувати заявку
                    </button>
                </div>
            )}

            {/* Якщо заявка була відхилена, даємо можливість подати її знову */}
            
        </div>
    );
};

export default JoinCommunityButton;
