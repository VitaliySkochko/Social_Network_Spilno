//Реєстрація користувачів

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupPage.css';

const SignupPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('чоловіча');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        if (!firstName) {
            setError("Ім'я не може бути порожнім");
            return false;
        }
        if (!lastName) {
            setError("Прізвище не може бути порожнім");
            return false;
        }
        if (!birthDate) {
            setError("Дата народження є обов'язковою");
            return false;
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError("Введіть дійсну електронну пошту");
            return false;
        }
        if (password.length < 7) {
            setError("Пароль повинен містити не менше 7 символів");
            return false;
        }
        if (password !== confirmPassword) {
            setError("Паролі не співпадають");
            return false;
        }
        setError('');
        return true;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), { 
                uid: user.uid,
                firstName,
                lastName,
                birthDate,
                gender,
                email,
            });
            navigate('/profile'); // Перенаправлення на профіль після реєстрації
        } catch (error) {
            console.error('Помилка реєстрації', error.message);
            setError('Помилка реєстрації: ' + error.message);
        }
    };

    const handleBack = () => {
        navigate('/login'); // Перехід на сторінку входу
    };

    return (
        <div className="signup-container">
            <h1 className="signup-title">Створити обліковий запис</h1>
            <form className="signup-form" onSubmit={handleSignup}>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Ім'я"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="signup-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Прізвище"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="signup-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="date"
                        placeholder="Дата народження"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="signup-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="signup-input"
                        required
                    >
                        <option value="чоловіча">Чоловіча</option>
                        <option value="жіноча">Жіноча</option>
                        <option value="інше">Інше</option>
                    </select>
                </div>

                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Електронна пошта"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="signup-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Новий пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="signup-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Підтвердження пароля"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="signup-input"
                        required
                    />
                </div>

                <button type="submit" className="signup-button">Зареєструватися</button>
                <button type="button" onClick={handleBack} className="back-button">Назад</button>
            </form>
        </div>
    );
};

export default SignupPage;

