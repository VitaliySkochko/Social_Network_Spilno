// Cторінка для створення спільнот

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadPhoto, createCommunity } from "../../services/firebaseCommunityService";
import CommunityPhotoUpload from "./CommunityPhotoUpload"; // Імпортуємо новий компонент
import "../../styles/CreateCommunityPage.css";

const CreateCommunityPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleCreateCommunity = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      alert("Будь ласка, заповніть всі обов’язкові поля.");
      return;
    }

    setUploading(true);

    try {
      let photoURL = "";
      if (photo) {
        photoURL = await uploadPhoto(photo); // Завантаження фото
      }

      // Отримуємо ID створеної спільноти
      const communityId = await createCommunity(name, description, photoURL);

      // Перенаправляємо на сторінку створеної спільноти
      navigate(`/communities/${communityId}`);
    } catch (error) {
      console.error("Помилка при створенні спільноти:", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="community-page-create">
      <h2>Створити спільноту</h2>
      <form className="community-form" onSubmit={handleCreateCommunity}>
        <input
          className="title-input"
          type="text"
          placeholder="Назва спільноти"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="description-textarea"
          placeholder="Опис спільноти"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {/* Використовуємо компонент CommunityPhotoUpload */}
        <CommunityPhotoUpload onPhotoSelect={(file) => setPhoto(file)} />
        <div className="button-main-conteiner">
          <button className="button-main" type="submit" disabled={uploading}>
            {uploading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              "Створити"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommunityPage;

