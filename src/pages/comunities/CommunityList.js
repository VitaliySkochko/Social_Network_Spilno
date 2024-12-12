// Сторінка для перегляду списку спільнот
import React, { useEffect, useState } from 'react';
import { fetchCommunities } from '../../services/firebaseCommunityService';
import { Link } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';
import CommunityCount from './CommunityCount';
import CommunitySearch from './CommunitySearch';
import '../../styles/CommunityList.css';

const CommunityList = () => {
    const [communities, setCommunities] = useState([]);
    const [filteredCommunities, setFilteredCommunities] = useState([]);

    useEffect(() => {
        const loadCommunities = async () => {
            try {
                const communitiesList = await fetchCommunities();
                setCommunities(communitiesList);
                setFilteredCommunities(communitiesList);
            } catch (error) {
                console.error('Помилка при завантаженні спільнот:', error);
            }
        };

        loadCommunities();
    }, []);

    const handleSearch = (searchTerm) => {
        const filtered = communities.filter((community) =>
            community.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCommunities(filtered);
    };

    return (
        <div className="community-list-page">
            <h2 className="communities-title">Спільноти</h2>
            <div className='community-list-count-search'>
            <CommunityCount count={filteredCommunities.length} />
            <CommunitySearch onSearch={handleSearch} />
            </div>
            <ul className="communities-list">
                {filteredCommunities.map((community) => (
                    <li key={community.id} className="communities-item">
                        <Link to={`/communities/${community.id}`} className="communities-link">
                            {community.photoURL ? (
                                <img
                                    src={community.photoURL}
                                    alt={community.name}
                                    className="communities-photo"
                                />
                            ) : (
                                <FaUsers className="user-icon-list" />
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

export default CommunityList;