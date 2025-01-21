// EditCommunityPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  uploadPhoto,
  fetchCommunityById,
  updateCommunity,
} from "../../services/firebaseCommunityService";
import CommunityPhotoUpload from "../comunities/CommunityPhotoUpload";
import '../../styles/CommunityPage.css';

const EditCommunityPage = () => {
  const { communityId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [communityType, setCommunityType] = useState("public"); // Тип спільноти
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        const community = await fetchCommunityById(communityId);
        setName(community.name);
        setDescription(community.description);
        setPhotoURL(community.photoURL);
        setCommunityType(community.type || "public"); // Завантаження типу спільноти
      } catch (error) {
        console.error("Помилка при завантаженні даних спільноти:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCommunityData();
  }, [communityId]);

  const handleUpdateCommunity = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let newPhotoURL = photoURL;

      if (photo) {
        newPhotoURL = await uploadPhoto(photo);
      }

      // Оновлення даних спільноти
      await updateCommunity(communityId, {
        name,
        description,
        photoURL: newPhotoURL,
        type: communityType, // Оновлення типу спільноти
      });

      alert("Спільноту оновлено успішно!");
      navigate(`/communities/${communityId}`);
    } catch (error) {
      console.error("Помилка при оновленні спільноти:", error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p>Завантаження даних...</p>;
  }

  return (
    <div className="community-page-edit"> 
      <h2>Редагувати спільноту</h2>
      <form className="community-form" onSubmit={handleUpdateCommunity}>
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
        <CommunityPhotoUpload
          onPhotoSelect={(file) => setPhoto(file)}
          existingPhotoURL={photoURL}
        />

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

       

        <div className="button-main-conteiner">
          <button className="button-main" type="submit" disabled={uploading}>
            {uploading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              "Оновити"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCommunityPage;
