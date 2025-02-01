//Кнопка пошуку спільноти

import React, { useState } from 'react';

const CommunitySearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Оновлюємо стан при зміні тексту
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() === '') {
            alert('Введіть назву для пошуку'); // Якщо поле пусте
            return;
        }
        onSearch(searchTerm.trim()); // Викликаємо пошук
        setSearchTerm(''); // Очищуємо поле після пошуку
    };

    return (
        <div className="community-search">
            <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                    type="text"
                    placeholder="Пошук..."
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
