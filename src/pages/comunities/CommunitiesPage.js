// Сторінка для перегляду списку спільнот
import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa'; // Імпорт іконки
import '../../styles/CommunitiesPage.css';

const CommunitiesPage = () => {
    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                // Створюємо запит із сортуванням за полем createdAt
                const q = query(
                    collection(db, 'communities'),
                    orderBy('createdAt', 'desc') // Сортування за спаданням
                );
                const querySnapshot = await getDocs(q);
                const communitiesList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCommunities(communitiesList);
            } catch (error) {
                console.error('Помилка при завантаженні спільнот:', error);
            }
        };

        fetchCommunities();
    }, []);

    return (
        <div className="communities-page">
            <h2 className="communities-title">Спільноти</h2>
            <ul className="communities-list">
                {communities.map((community) => (
                    <li key={community.id} className="communities-item">
                        <Link to={`/community/${community.id}`} className="communities-link">
                            {/* Відображення фото або іконки */}
                            {community.photoURL ? (
                                <img
                                    src={community.photoURL}
                                    alt={community.name}
                                    className="communities-photo"
                                />
                            ) : (
                                <FaUsers className="communities-icon" /> // Іконка, якщо фото немає
                            )}
                            <div className="communities-info">
                                <h3 className="communities-name">{community.name}</h3>
                                <p className="communities-description">{community.description}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommunitiesPage;