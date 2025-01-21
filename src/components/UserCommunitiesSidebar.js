//Бокова панель відображання спільнот користувача

import React, { useEffect, useState } from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import { Link, useLocation } from 'react-router-dom';  // Імпортуємо useLocation

const UserCommunitiesSidebar = () => {
    const [user] = useAuthState(auth);
    const [communities, setCommunities] = useState([]);
    const location = useLocation();  // Отримуємо поточний шлях

    useEffect(() => {
        if (user) {
            const q = query(collection(db, 'communities'), where('members', 'array-contains', user.uid));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const userCommunities = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCommunities(userCommunities);
            }, (error) => {
                console.error("Error fetching communities:", error);  // Обробка помилок
            });

            return () => unsubscribe(); // Очищення підписки
        }
    }, [user, location]);  // Додаємо location в залежність, щоб оновлювати при зміні маршруту

    if (!user) return null;  // Якщо користувач не авторизований, повертаємо null

    return (
        <div className="user-communities"> 
            <h3>Мої спільноти</h3>
            {communities.length > 0 ? (
                <ul className="communities-list-sidebar">
                    {communities.map((community) => (
                        <li key={community.id}>
                            <Link to={`/communities/${community.id}`}>
                                {community.photoURL ? (
                                    <img
                                        src={community.photoURL}
                                        alt={community.name}
                                        className="community-thumbnail"
                                    />
                                ) : (
                                    <div className="community-placeholder">{community.name.charAt(0)}</div>
                                )}
                                <span>{community.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Ви ще не приєдналися до жодної спільноти</p>
            )}
        </div>
    );
};

export default UserCommunitiesSidebar;

