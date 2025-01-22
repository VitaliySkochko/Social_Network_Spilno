import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from './firebase';

const storage = getStorage();

export const fetchUserData = async (uid) => {
  if (!uid) {
    console.error('UID не вказано або він некоректний:', uid);
    return null;
  }
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData;  // Повертає всі дані користувача, включаючи роль
    } else {
      console.warn(`Користувача з UID ${uid} не знайдено.`);
      return null;
    }
  } catch (error) {
    console.error('Помилка при завантаженні даних користувача:', error);
    return null;
  }
};
// Оновлення даних користувача
export const updateUserData = async (uid, data) => {
  try {
    await updateDoc(doc(db, 'users', uid), data);
  } catch (error) {
    console.error('Помилка при оновленні даних користувача:', error);
    throw error;
  }
};

// Завантаження фото профілю
export const uploadProfilePhoto = async (file) => {
  try {
    const uniqueId = `${auth.currentUser.uid}_${Date.now()}`;
    const storageRef = ref(storage, `profilePhotos/${uniqueId}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Помилка при завантаженні фото:', error);
    throw error;
  }
};
