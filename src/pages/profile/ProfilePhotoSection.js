// обробка завантаження, видалення та відображення фото

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaUser, FaImage, FaTrash } from "react-icons/fa";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../services/firebase";
import { v4 as uuidv4 } from "uuid";
import Modal from "../../components/Modal.js"; // Імпортуємо компонент Modal

const ProfilePhotoSection = ({
  formData,
  setFormData,
  isUploading,
  setIsUploading,
  setMessage,
  setMessageType,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Стан для відкриття/закриття модального вікна

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png, image/gif",
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

      const uniqueId = uuidv4();
      const storageRef = ref(storage, `profilePhotos/${uniqueId}`);

      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      setFormData((prev) => ({ ...prev, profilePhoto: downloadURL }));

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

  const handleDeletePhoto = () => {
    setFormData((prevData) => ({
      ...prevData,
      profilePhoto: "",
    }));
  };

  const openModal = () => setIsModalOpen(true); // Функція для відкриття модального вікна
  const closeModal = () => setIsModalOpen(false); // Функція для закриття модального вікна

  return (
    <div className="profile-photo-edit">
      {formData.profilePhoto ? (
        <img
          src={formData.profilePhoto}
          alt="Фото профілю"
          className="profile-photo"
          onClick={openModal} // Клік по фото відкриває модальне вікно
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
            <label className="photo-icon" title="Завантажити фото">
              <FaImage/>
              <input
                type="file"
                {...getInputProps()}
                style={{ display: "none" }}
              />
            </label>
            <button
              className="delete-icon"
              onClick={handleDeletePhoto}
              title="Видалити фото"
            >
              <FaTrash />
            </button>
          </>
        )}
      </div>

      {/* Використовуємо компонент Modal для перегляду фото */}
      {isModalOpen && (
        <Modal
          imageSrc={formData.profilePhoto}
          onClose={closeModal} // Передаємо функцію для закриття модального вікна
        />
      )}
    </div>
  );
};

export default ProfilePhotoSection;
