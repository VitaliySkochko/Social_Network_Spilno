// Кнопка "Редагувати профіль", яка буде відображати модальне вікно з формою для редагування даних профілю, включаючи завантаження фото

import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import '../styles/EditProfile.css';

const EditProfile = ({ userData, setUserData, setIsEditing }) => {
    const [formData, setFormData] = useState({
        firstName: userData.firstName,
        lastName: userData.lastName,
        birthDate: userData.birthDate,
        gender: userData.gender,
        interests: userData.interests || '',
        country: userData.country || '',
        city: userData.city || '',   
        facebook: userData.facebook || '',
        instagram: userData.instagram ||'',  
        telegram: userData.telegram || '',
        linkedIn: userData.linkedIn || '',
        phone: userData.phone || '',
        additionalEmail: userData.additionalEmail || '', 
    });
    const [message, setMessage] = useState(null); // Стан для повідомлення
    const [messageType, setMessageType] = useState(''); // Тип повідомлення: 'success' або 'error'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userDocRef, formData);
            setUserData((prevData) => ({ ...prevData, ...formData }));
            setMessage('Профіль успішно збережено!');
            setMessageType('success');
            setTimeout(() => setMessage(null), 3000); // Прибираємо повідомлення через 3 секунди
            setIsEditing(false); // Повертаємося до профілю після збереження
        } catch (error) {
            console.error('Помилка при оновленні профілю:', error);
            setMessage('Не вдалося зберегти зміни. Спробуйте ще раз.');
            setMessageType('error');
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Редагування профілю</h2>
            <h3>Основна інформація</h3>
            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}
            <label>
                Ім'я:
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            </label>
            <label>
                Прізвище:
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </label>
            <label>
                Дата народження:
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
            </label>
            <label>
                Стать:
                <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="Чоловік">Чоловік</option>
                    <option value="Жінка">Жінка</option>
                    <option value="Інше">Інше</option>
                </select>
            </label>
            <label>
                Інтереси та хоббі
                <textarea name="interests" value={formData.interests} onChange={handleChange} />
            </label>
            <label>Країна
                <input type='text' name='country' value={formData.country} onChange={handleChange}/>
            </label>
            <label>Місто
                <input type='text' name='city' value={formData.city} onChange={handleChange}/>
            </label>
            <h3>Соціальні мережі та контакти</h3>
            <label>Facebook
                <input type='text' name='facebook' value={formData.facebook} onChange={handleChange}/>
            </label>
            <label>Instagram
                <input type='text' name='instagram' value={formData.instagram} onChange={handleChange}/>
            </label>
            <label>Telegram
                <input type='text' name='telegram' value={formData.telegram} onChange={handleChange}/>
            </label>
            <label>LinkedIn
                <input type='text' name='linkedIn' value={formData.linkedIn} onChange={handleChange}/>
            </label>
            <label>Телефон
                <input type='text' name='phone' value={formData.phone} onChange={handleChange}/>
            </label>
            <label>Додатковий email
                <input type='email' name='additionalEmail' value={formData.additionalEmail} onChange={handleChange}/>
            </label>
            <button onClick={handleSave} className="save-button">Зберегти</button>
            <button onClick={() => setIsEditing(false)} className="back-button">Назад</button>
        </div>
    );
};

export default EditProfile;
