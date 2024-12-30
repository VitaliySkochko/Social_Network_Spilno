import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

// Додаємо імпорт для UserCommunities
import UserCommunities from './UserCommunities';

const UserActivity = ({ uid }) => {
    const [userActivity, setUserActivity] = useState({
        registrationDate: null,
        lastLogin: null,
        totalPosts: 0,
        totalCommunities: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserActivity = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserActivity((prev) => ({
                        ...prev,
                        registrationDate: userData.createdAt?.toDate().toLocaleDateString(),
                        lastLogin: userData.lastLogin?.toDate().toLocaleString(),
                    }));

                    const postsRef = collection(db, 'communityPosts');
                    const q = query(postsRef, where('userId', '==', uid));
                    const querySnapshot = await getDocs(q);
                    setUserActivity((prev) => ({
                        ...prev,
                        totalPosts: querySnapshot.size,
                    }));

                    const communitiesRef = collection(db, 'communities');
                    const communitiesQuery = query(communitiesRef, where('members', 'array-contains', uid));
                    const communitiesSnapshot = await getDocs(communitiesQuery);
                    setUserActivity((prev) => ({
                        ...prev,
                        totalCommunities: communitiesSnapshot.size,
                    }));
                } else {
                    setError('Не знайдено даних користувача.');
                }
            } catch (err) {
                setError('Помилка при завантаженні активності користувача');
                console.error(err);
            }
            setLoading(false);
        };

        fetchUserActivity();
    }, [uid]);

    if (loading) {
        return <div>Завантаження активності...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="profile-info">
            <h3>Активність користувача</h3>
            {userActivity.registrationDate && (
                <p><strong>Дата реєстрації:</strong> {userActivity.registrationDate}</p>
            )}
            {userActivity.lastLogin && (
                <p><strong>Час останнього входу:</strong> {userActivity.lastLogin}</p>
            )}
            <p><strong>Кількість постів:</strong> {userActivity.totalPosts}</p>
            <p><strong>Кількість спільнот:</strong> {userActivity.totalCommunities}</p>

            {/* Додаємо компонент UserCommunities */}
            <UserCommunities uid={uid} />
        </div>
    );
};

export default UserActivity;

