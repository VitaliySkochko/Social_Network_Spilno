// EditCommunityPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  uploadPhoto,
  fetchCommunityById,
  updateCommunity,
} from "../../services/firebaseCommunityService";
import CommunityPhotoUpload from "../comunities/CommunityPhotoUpload"; // Компонент для завантаження фото


const EditCommunityPage = () => {
  const { communityId } = useParams(); // Отримуємо ID спільноти з URL
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Завантаження даних спільноти
    const loadCommunityData = async () => {
      try {
        const community = await fetchCommunityById(communityId);
        setName(community.name);
        setDescription(community.description);
        setPhotoURL(community.photoURL);
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
        // Завантаження нового фото
        newPhotoURL = await uploadPhoto(photo);
      }

      // Оновлення даних спільноти
      await updateCommunity(communityId, {
        name,
        description,
        photoURL: newPhotoURL,
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
