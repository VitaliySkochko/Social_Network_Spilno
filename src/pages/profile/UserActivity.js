import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import UserCommunities from './UserCommunities';
import { db } from '../../services/firebase';

const UserActivity = ({ uid }) => {
    const [userActivity, setUserActivity] = useState({
        registrationDate: null,
        lastLogin: null,
        totalPosts: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserActivity = async () => {
            try {
                // Отримуємо дані користувача
                const userDoc = await getDoc(doc(db, 'users', uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserActivity((prev) => ({
                        ...prev,
                        registrationDate: userData.createdAt?.toDate().toLocaleDateString(), // Дата реєстрації
                        lastLogin: userData.lastLogin?.toDate().toLocaleString(), // Час останнього входу
                    }));

                    // Підраховуємо кількість постів користувача
                    const postsRef = collection(db, 'communityPosts');
                    const q = query(postsRef, where('userId', '==', uid));
                    const querySnapshot = await getDocs(q);
                    setUserActivity((prev) => ({
                        ...prev,
                        totalPosts: querySnapshot.size, // Кількість постів
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

            {/* Додаємо компонент UserCommunities */}
            <UserCommunities uid={uid} />
        </div>
    );
};

export default UserActivity;
