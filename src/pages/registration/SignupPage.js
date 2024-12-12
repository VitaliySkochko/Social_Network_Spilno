//Реєстрація користувачів

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/firebaseAuthService";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("чоловіча");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (!firstName || !lastName || !birthDate) {
      setError("Будь ласка, заповніть всі обов'язкові поля.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Введіть дійсну електронну пошту.");
      return false;
    }
    if (password.length < 7) {
      setError("Пароль повинен містити не менше 7 символів.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Паролі не співпадають.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await signup({ firstName, lastName, birthDate, gender, email, password });
      navigate("/profile");
    } catch (error) {
      console.error("Помилка реєстрації:", error.message);
      setError("Не вдалося зареєструватися: " + error.message);
    }
  };

  return (
    <div className="login-conteiner">
      <div className="login-spilno">
        <h1 className="login-title">Створити обліковий запис</h1>
        <form className="login-form" onSubmit={handleSignup}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <input
              type="text"
              placeholder="Ім'я"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Прізвище"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <div className="form-group">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="login-input"
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
              className="login-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Підтвердження пароля"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <div className="button-main-conteiner">
            <button type="submit" className="button-main">Зареєструватися</button>
            <button type="button" onClick={() => navigate("/login")} className="button-main">Назад</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;


