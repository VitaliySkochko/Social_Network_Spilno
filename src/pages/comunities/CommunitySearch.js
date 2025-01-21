//Кнопка пошуку спільноти

import React, { useState } from 'react';

const CommunitySearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <div className="community-search">
            <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                    type="text"
                    placeholder="Пошук спільнот..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="title-input-search"
                />
                <button type="submit" className="search-button">
                    <span className="search-icon">🔍</span>
                </button>
            </form>
        </div>
    );
};

export default CommunitySearch;

