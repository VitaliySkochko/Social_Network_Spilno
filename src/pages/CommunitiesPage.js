// Сторінка для перегляду списку спільнот
import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../styles/CommunitiesPage.css'

const CommunitiesPage = () => {
    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        const fetchCommunities = async () => {
            const querySnapshot = await getDocs(collection(db, 'communities'));
            const communitiesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCommunities(communitiesList);
        };
        fetchCommunities();
    }, []);

    return (
        <div className="communities-page">
            <h2 className="communities-title">Спільноти</h2>
            <ul className="communities-list">
                {communities.map((community) => (
                    <li key={community.id} className="community-item">
                        <Link to={`/community/${community.id}`} className="community-link">
                            {community.name}
                        </Link>
                        <p className="community-description">{community.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommunitiesPage;
