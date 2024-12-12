// Кнопка "Редагувати профіль", яка буде відображати модальне вікно з формою для редагування даних профілю, включаючи завантаження фото

import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import ProfilePhotoSection from "./ProfilePhotoSection";
import MainInfoSection from "./MainInfoSection";
import SocialMediaSection from "./SocialMediaSection";
import DeleteProfile from "./DeleteProfile";


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
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, formData); // Оновлюємо Firestore
  
      // Оновлюємо глобальний стан userData
      setUserData((prevData) => ({ ...prevData, ...formData }));
      setMessage("Профіль успішно збережено!");
      setMessageType("success");
      setTimeout(() => setMessage(null), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error("Помилка при оновленні профілю:", error);
      setMessage("Не вдалося зберегти зміни. Спробуйте ще раз.");
      setMessageType("error");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2 className="communities-title">Редагування профілю</h2>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <ProfilePhotoSection
        formData={formData}
        setFormData={setFormData}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        setMessage={setMessage}
        setMessageType={setMessageType}
      />
      <MainInfoSection formData={formData} setFormData={setFormData} />
      <SocialMediaSection formData={formData} setFormData={setFormData} />
      <div className="button-main-conteiner">
        <button className="button-main" onClick={handleSave}>
          Зберегти
        </button>
        <button className="button-main" onClick={() => setIsEditing(false)}>
          Скасувати
        </button>
      </div>
      <DeleteProfile />
    </div>
  );
};

export default EditProfile;
