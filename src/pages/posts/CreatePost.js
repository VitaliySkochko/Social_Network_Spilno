//Цей компонент відповідає за створення нових постів.

import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { createPost } from "../../services/firebasePostService";
import { auth, storage } from "../../services/firebase";
import { FaPaperPlane, FaImage, FaVideo } from "react-icons/fa";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CreatePost = ({ communityId, onPostCreated }) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false); // Додано для відображення спінера
  const [user] = useAuthState(auth);

  const handleFileUpload = async (files, type) => {
    setLoading(true); // Почати завантаження
    const uploadedFiles = [];
    for (let file of files) {
      const filePath =
        type === "image"
          ? `posts/images/${Date.now()}_${file.name}`
          : `posts/videos/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      uploadedFiles.push(downloadURL);
    }
    if (type === "image") setImages((prev) => [...prev, ...uploadedFiles]);
    else setVideos((prev) => [...prev, ...uploadedFiles]);
    setLoading(false); // Завершити завантаження
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && images.length === 0 && videos.length === 0) return; // Перевірка на порожній пост
    try {
      await createPost(communityId, user.uid, newPostContent, images, videos);
      setNewPostContent("");
      setImages([]);
      setVideos([]);
      onPostCreated();
    } catch (error) {
      console.error("Помилка додавання поста:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="create-post-container">
      <textarea
        className="description-textarea"
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
      />
      <div className="post-media-add">
        {/* Завантаження зображень */}
        <div className="post-media-container">
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files, "image")}
            style={{ display: "none" }}
          />
          {/* Завантаження відео */}
          <input
            id="video-upload"
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => handleFileUpload(e.target.files, "video")}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Прев'ю завантажених медіа */}
      <div className="preview-media-container">
        {images.map((url, index) => (
          <img key={index} src={url} alt="Прев'ю зображення" className="preview-thumbnail" />
        ))}
        {videos.map((url, index) => (
          <video key={index} src={url} controls className="preview-thumbnail"></video>
        ))}
      </div>

      {/* Спінер завантаження */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      <div className="button-icon-group">
        <label htmlFor="image-upload" className="photo-icon">
          <FaImage size={24} title="Додати зображення" />
        </label>

        <label htmlFor="video-upload" className="video-icon">
          <FaVideo size={24} title="Додати відео" />
        </label>

        <button
          className="add-icon"
          onClick={handleCreatePost}
          title="Додати пост"
        >
          <FaPaperPlane size={24} />
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
