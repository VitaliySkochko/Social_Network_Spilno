//Цей компонент відповідає за створення нових постів.

import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { createPost } from "../../services/firebasePostService";
import { auth, storage } from "../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fetchCommunityById } from "../../services/firebaseCommunityService";
import { FaPaperPlane, FaImage, FaVideo, FaTimes } from "react-icons/fa";

const CreatePost = ({ communityId, onPostCreated }) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!user || !communityId) return;
      try {
        const communityData = await fetchCommunityById(communityId);

        if (
          communityData.type === "public" ||
          (communityData.roles && communityData.roles[user.uid] === "admin")
        ) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Помилка перевірки ролі:", error);
      }
    };

    checkRole();
  }, [user, communityId]);

  const handleFileUpload = async (files, type) => {
    setLoading(true);
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
    setLoading(false);
  };

  const handleRemoveMedia = (type, index) => {
    if (type === "image") {
      setImages((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "video") {
      setVideos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && images.length === 0 && videos.length === 0) return;
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

  if (!isAdmin) {
    return <p className="restricted-message"></p>;
  }

  return (
    <div className="create-post-container">
      <textarea
        className="description-textarea"
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
      />
      <div className="post-media-add">
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files, "image")}
          style={{ display: "none" }}
        />
        <input
          id="video-upload"
          type="file"
          multiple
          accept="video/*"
          onChange={(e) => handleFileUpload(e.target.files, "video")}
          style={{ display: "none" }}
        />
      </div>

      {/* Прев'ю завантажених медіа */}
      <div className="preview-media-container">
        {images.map((url, index) => (
          <div key={index} className="preview-item">
            <img src={url} alt="Прев'ю зображення" className="preview-thumbnail" />
            <button
              className="remove-icon"
              onClick={() => handleRemoveMedia("image", index)}
            >
              <FaTimes />
            </button>
          </div>
        ))}
        {videos.map((url, index) => (
          <div key={index} className="preview-item">
            <video src={url} controls className="preview-thumbnail"></video>
            <button
              className="remove-icon"
              onClick={() => handleRemoveMedia("video", index)}
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>

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
