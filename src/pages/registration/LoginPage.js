// Авторизація користувачів

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import "../../styles/LoginPage.css";
import logo from '../../img/logo-title.PNG';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // Стан для збереження повідомлень про помилки
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Очищення попередніх повідомлень про помилки
    setError("");

    // Перевірка на коректність email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.match(emailRegex)) {
      setError("Будь ласка, введіть правильну електронну адресу.");
      return;
    }

    // Перевірка на мінімальну довжину пароля
    if (password.length < 7) {
      setError("Пароль повинен містити не менше 7 символів.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile"); // перенаправлення на сторінку профілю після входу
    } catch (error) {
      console.error("Помилка входу:", error.message);
      // Обробка специфічних помилок
      if (error.code === "auth/wrong-password") {
        setError("Неправильний пароль. Спробуйте ще раз.");
      } else if (error.code === "auth/user-not-found") {
        setError("Користувача з такою електронною адресою не знайдено.");
      } else {
        setError("Не вдалося увійти. Перевірте введені дані.");
      }
    }
  };

  // Функція для переходу на сторінку реєстрації
  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="login-container">
      <img src={logo} alt="logo" className="login-logo" />

      <h2 className="login-title">Вхід</h2>
      <form className="login-form" onSubmit={handleLogin}>
        {error && <div className="error-message">{error}</div>} {/* Показуємо повідомлення про помилку */}

        <div className="input-group">
          <input
            type="email"
            placeholder="Електронна адреса"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
        </div>
        <div className="login-button-group">
          <button type="submit" className="login-button">Увійти</button>
          <button type="button" onClick={handleSignupRedirect} className="registred-button">Зареєструватись</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;


