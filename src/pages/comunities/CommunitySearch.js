import React, { useState } from 'react';

const CommunitySearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="community-search">
            <input
                type="text"
                placeholder="Пошук спільнот..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="title-input"
            />
        </div>
    );
};

export default CommunitySearch;