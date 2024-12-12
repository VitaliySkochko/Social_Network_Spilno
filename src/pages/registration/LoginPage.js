// Авторизація користувачів

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../img/logo-title.PNG";
import { login } from "../../services/firebaseAuthService";
import '../../styles/LoginPage.css'

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.match(emailRegex)) {
      setError("Будь ласка, введіть правильну електронну адресу.");
      return;
    }

    if (password.length < 7) {
      setError("Пароль повинен містити не менше 7 символів.");
      return;
    }

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Помилка входу:", error.message);
      if (error.code === "auth/wrong-password") {
        setError("Неправильний пароль. Спробуйте ще раз.");
      } else if (error.code === "auth/user-not-found") {
        setError("Користувача з такою електронною адресою не знайдено.");
      } else {
        setError("Не вдалося увійти. Перевірте введені дані.");
      }
    }
  };

  return (
    <div className="login-conteiner">
      <div className="login-spilno">
        <img src={logo} alt="logo" className="login-logo" />
        <h2 className="login-title">Вхід</h2>
        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}
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
          <div className="button-main-conteiner">
            <button type="submit" className="button-main">Увійти</button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="button-main"
            >
              Зареєструватись
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;



