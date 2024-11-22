// Cторінка для створення спільнот

import React, { useState } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../../styles/CreateCommunityPage.css'

const CreateCommunityPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleCreateCommunity = async (e) => {
        e.preventDefault();
        try {
            const newCommunity = {
                name,
                description,
                createdAt: new Date(),
            };
            await addDoc(collection(db, 'communities'), newCommunity);
            navigate('/');
        } catch (error) {
            console.error("Помилка при створенні спільноти", error.message);
        }
    };

    return (
        <div className="community-page">
            <h2 className="community-title">Створити спільноту</h2>
            <form className="community-form" onSubmit={handleCreateCommunity}>
                <input
                    className="community-input"
                    type="text"
                    placeholder="Назва спільноти"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    className="community-textarea"
                    placeholder="Опис спільноти"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button className="community-button" type="submit">Створити</button>
            </form>
        </div>
    );
};

export default CreateCommunityPage;
