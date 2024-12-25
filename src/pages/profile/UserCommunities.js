//Відображення спільнот в профілі користувача

import React, { useEffect, useState } from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase'; // Переконайтеся, що імпортуєте db
import { Link } from 'react-router-dom';

const UserCommunities = ({ uid }) => {
    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        if (uid) {
            // Підписка на зміни в колекції спільнот
            const q = query(collection(db, 'communities'), where('members', 'array-contains', uid));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const userCommunities = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCommunities(userCommunities); // Оновлюємо список спільнот
            });

            // Очищення підписки при відключенні компонента
            return () => unsubscribe();
        }
    }, [uid]);

    if (!uid) return <p>Користувач не знайдений</p>;

    return (
        <div className="user-communities">
            <h3>Спільноти користувача</h3>
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
                <p>Користувач ще не приєднався до жодної спільноти</p>
            )}
        </div>
    );
};

export default UserCommunities;
