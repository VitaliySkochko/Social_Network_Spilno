//Реєстрація користувачів

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/firebaseAuthService";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "чоловіча",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "Введіть ім'я.";
    if (!formData.lastName) newErrors.lastName = "Введіть прізвище.";
    if (!formData.birthDate) newErrors.birthDate = "Оберіть дату народження.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Введіть дійсну електронну пошту.";
    if (formData.password.length < 7) newErrors.password = "Пароль повинен містити не менше 7 символів.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Паролі не співпадають.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Очистити помилку для відповідного поля
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const user = await signup(formData);
      console.log("Токен користувача:", user.token);
      navigate(`/profile/${user.uid}`);
    } catch (error) {
      console.error("Помилка реєстрації:", error.message);
      setErrors({ global: "Не вдалося зареєструватися: " + error.message });
    }
  };

  return (
    <div className="login-conteiner">
      <div className="login-spilno">
        <h1 className="login-title">Створити обліковий запис</h1>
        <form className="login-form" onSubmit={handleSignup}>
          {errors.global && <p className="error-message">{errors.global}</p>}

          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="Ім'я"
              value={formData.firstName}
              onChange={handleChange}
              className="login-input"
            />
            {errors.firstName && <p className="error-message">{errors.firstName}</p>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="lastName"
              placeholder="Прізвище"
              value={formData.lastName}
              onChange={handleChange}
              className="login-input"
            />
            {errors.lastName && <p className="error-message">{errors.lastName}</p>}
          </div>

          <div className="form-group">
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="login-input"
            />
            {errors.birthDate && <p className="error-message">{errors.birthDate}</p>}
          </div>

          <div className="form-group">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="login-input"
            >
              <option value="чоловіча">Чоловіча</option>
              <option value="жіноча">Жіноча</option>
              <option value="інше">Інше</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Електронна пошта"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Підтвердження пароля"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="login-input"
            />
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          </div>

          <div className="button-registration-conteiner">
            <button type="submit" className="button-registration">Зареєструватися</button>
            <button type="button" onClick={() => navigate("/login")} className="button-registration">Назад</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;

