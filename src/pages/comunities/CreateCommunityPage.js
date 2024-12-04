// Cторінка для створення спільнот

import React, { useState } from 'react';
import { db, storage } from '../../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import '../../styles/CreateCommunityPage.css';

const CreateCommunityPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    // Обробка завантаження файлу
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file)); // Попередній перегляд фото
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        maxFiles: 1,
    });

    const handleCreateCommunity = async (e) => {
        e.preventDefault();
    
        if (!name || !description) {
            alert('Будь ласка, заповніть всі обов’язкові поля.');
            return;
        }
    
        setUploading(true);
    
        try {
            let photoURL = ''; // Початкове значення URL фото
    
            // Якщо фото завантажено, завантажуємо його у Firebase Storage
            if (photo) {
                const storageRef = ref(storage, `community_photos/${photo.name}`);
                const uploadTask = await uploadBytesResumable(storageRef, photo);
                photoURL = await getDownloadURL(uploadTask.ref); // Отримання URL завантаженого фото
            }
    
            // Додавання даних спільноти у Firestore
            const newCommunity = {
                name,
                description,
                photoURL, // URL фото або порожній рядок
                createdAt: new Date(),
            };
            await addDoc(collection(db, 'communities'), newCommunity);
    
            navigate('/'); // Повернення на головну сторінку
        } catch (error) {
            console.error('Помилка при створенні спільноти:', error.message);
        } finally {
            setUploading(false);
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
                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    {photoPreview ? (
                        <img src={photoPreview} alt="Прев'ю" className="photo-preview" />
                    ) : (
                        <p>Додати фото для спільноти</p>
                    )}
                </div>
                <button className="community-button" type="submit" disabled={uploading}>
                    {uploading ? 'Завантаження...' : 'Створити'}
                </button>
            </form>
        </div>
    );
};

export default CreateCommunityPage;

