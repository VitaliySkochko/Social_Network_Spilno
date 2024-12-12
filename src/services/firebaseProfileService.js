import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from './firebase';

const storage = getStorage();

// Отримання даних користувача
export const fetchUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('Не знайдено даних користувача.');
    }
  } catch (error) {
    console.error('Помилка при завантаженні даних користувача:', error);
    throw error;
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