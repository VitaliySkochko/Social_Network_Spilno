// Cторінка для створення спільнот

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadPhoto, createCommunity } from "../../services/firebaseCommunityService";
import CommunityPhotoUpload from "./CommunityPhotoUpload";
import TopicSelector from "./TopicSelector";
import "../../styles/CreateCommunityPage.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebase";

const MAX_NAME_LENGTH = 40;

const CreateCommunityPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [communityType, setCommunityType] = useState("public");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [error, setError] = useState(""); // Для повідомлення про помилки
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleCreateCommunity = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      setError("Будь ласка, заповніть всі обов’язкові поля.");
      return;
    }

    if (name.length > MAX_NAME_LENGTH) {
      setError(`Назва спільноти не повинна перевищувати ${MAX_NAME_LENGTH} символів.`);
      return;
    }

    setUploading(true);
    setError("");

    try {
      let photoURL = "";
      if (photo) {
        photoURL = await uploadPhoto(photo);
      }

      const communityId = await createCommunity(
        name,
        description,
        photoURL,
        user.uid,
        communityType,
        selectedTopics
      );

      navigate(`/communities/${communityId}`);
    } catch (error) {
      console.error("Помилка при створенні спільноти:", error.message);
      setError("Виникла помилка при створенні спільноти. Спробуйте ще раз.");
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
          placeholder="Назва спільноти (до 40 символів)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {name.length > MAX_NAME_LENGTH && (
          <p className="error-message">
            Назва не може бути довшою за {MAX_NAME_LENGTH} символів.
          </p>
        )}
        <textarea
          className="description-textarea"
          placeholder="Опис спільноти"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <CommunityPhotoUpload onPhotoSelect={(file) => setPhoto(file)} />

        <div className="community-type-selector">
          <label>
            <input
              type="radio"
              value="public"
              checked={communityType === "public"}
              onChange={() => setCommunityType("public")}
            />
            Публічна
          </label>
          <label>
            <input
              type="radio"
              value="private"
              checked={communityType === "private"}
              onChange={() => setCommunityType("private")}
            />
            Приватна
          </label>
          <label>
            <input
              type="radio"
              value="blog"
              checked={communityType === "blog"}
              onChange={() => setCommunityType("blog")}
            />
            Блог
          </label>
        </div>

        <div className="community-type-description">
          {communityType === "public" && <p>Публічна спільнота доступна для всіх.</p>}
          {communityType === "private" && <p>Приватна спільнота доступна лише для запрошених учасників.</p>}
          {communityType === "blog" && <p>У блозі лише адміністратор може публікувати пости.</p>}
        </div>

        <TopicSelector onTopicsChange={(topics) => setSelectedTopics(topics)} />

        {error && <p className="error-message">{error}</p>}

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
