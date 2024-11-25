// Кнопка "Редагувати профіль", яка буде відображати модальне вікно з формою для редагування даних профілю, включаючи завантаження фото

import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../../styles/EditProfile.css";
import { useDropzone } from "react-dropzone";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid"; // Імпортуємо uuid

const storage = getStorage();

const EditProfile = ({ userData, setUserData, setIsEditing }) => {
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    birthDate: userData.birthDate,
    gender: userData.gender,
    interests: userData.interests || "",
    country: userData.country || "",
    city: userData.city || "",
    facebook: userData.facebook || "",
    instagram: userData.instagram || "",
    telegram: userData.telegram || "",
    linkedIn: userData.linkedIn || "",
    phone: userData.phone || "",
    additionalEmail: userData.additionalEmail || "",
    profilePhoto: userData.profilePhoto || "",
  });
  const [message, setMessage] = useState(null); // Стан для повідомлення
  const [messageType, setMessageType] = useState(""); // Тип повідомлення: 'success' або 'error'
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png, image/gif",  // Можна вказати тільки певні типи файлів
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        await uploadProfilePhoto(file);
      }
    },
  });

  const uploadProfilePhoto = async (file) => {
    try {
      setIsUploading(true);

      // Генеруємо унікальний ID для фото
      const uniqueId = uuidv4();
      const storageRef = ref(storage, `profilePhotos/${uniqueId}`); // Унікальне ім'я файлу

      // Завантажуємо фото у Firebase Storage
      await uploadBytes(storageRef, file);

      // Отримуємо URL завантаженого файлу
      const downloadURL = await getDownloadURL(storageRef);

      // Оновлюємо state та Firestore
      setFormData((prev) => ({ ...prev, profilePhoto: downloadURL }));

      // Додаємо інформацію у Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        profilePhoto: downloadURL,
        photoId: uniqueId, // Зберігаємо ID фото (необов'язково)
      });

      setMessage("Фото успішно завантажено!");
      setMessageType("success");
    } catch (error) {
      console.error("Помилка при завантаженні фото:", error);
      setMessage("Не вдалося завантажити фото.");
      setMessageType("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, formData);
      setUserData((prevData) => ({ ...prevData, ...formData }));
      setMessage("Профіль успішно збережено!");
      setMessageType("success");
      setTimeout(() => setMessage(null), 3000); // Прибираємо повідомлення через 3 секунди
      setIsEditing(false); // Повертаємося до профілю після збереження
    } catch (error) {
      console.error("Помилка при оновленні профілю:", error);
      setMessage("Не вдалося зберегти зміни. Спробуйте ще раз.");
      setMessageType("error");
    }
  };

  const handleDeletePhoto = async () => {
    try {
      // Видаляємо фото з локального стану
      setFormData((prevData) => ({
        ...prevData,
        profilePhoto: "",
      }));

      // Оновлюємо дані в Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, { profilePhoto: "" });
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Редагування профілю</h2>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <div className="profile-photo-edit">
        {formData.profilePhoto ? (
          <img
            src={formData.profilePhoto}
            alt="Фото профілю"
            className="profile-photo-preview"
          />
        ) : (
          <div className="default-photo-placeholder">
            <FaUser className="user-icon" />
          </div>
        )}

        <div className="photo-actions">
          {isUploading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <label className="icon-button" title="Завантажити фото">
                <FaEdit />
                <input
                  type="file"
                  {...getInputProps()}
                  style={{ display: "none" }}
                />
              </label>
              <button
                className="icon-button delete"
                onClick={handleDeletePhoto}
                title="Видалити фото"
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </div>

      <h3>Основна інформація</h3>
      <label>
        Ім'я
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Прізвище
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Дата народження
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
        />
      </label>
      <label>
        Стать
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="Чоловік">Чоловік</option>
          <option value="Жінка">Жінка</option>
          <option value="Інше">Інше</option>
        </select>
      </label>
      <label>
        Про себе
        <textarea
          name="interests"
          value={formData.interests}
          onChange={handleChange}
        />
      </label>
      <label>
        Країна
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </label>
      <label>
        Місто
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </label>
      <h3>Соціальні мережі та контакти</h3>
      <label>
        Facebook
        <input
          type="text"
          name="facebook"
          value={formData.facebook}
          onChange={handleChange}
        />
      </label>
      <label>
        Instagram
        <input
          type="text"
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
        />
      </label>
      <label>
        Telegram
        <input
          type="text"
          name="telegram"
          value={formData.telegram}
          onChange={handleChange}
        />
      </label>
      <label>
        LinkedIn
        <input
          type="text"
          name="linkedIn"
          value={formData.linkedIn}
          onChange={handleChange}
        />
      </label>
      <label>
        Телефон
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </label>
      <label>
        Додаткова електронна пошта
        <input
          type="email"
          name="additionalEmail"
          value={formData.additionalEmail}
          onChange={handleChange}
        />
      </label>
      <div className="buttons">
        <button className="save-button" onClick={handleSave}>
          Зберегти
        </button>
        <button className="cancel-button" onClick={() => setIsEditing(false)}>
          Скасувати
        </button>
      </div>
    </div>
  );
};

export default EditProfile;

