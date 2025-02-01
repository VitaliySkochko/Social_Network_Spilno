

import { db } from './firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Завантаження постів без підписок
export const fetchPosts = async ({ limitCount }) => {
  try {
    let q = query(collection(db, 'communityPosts'), orderBy('createdAt', 'desc')); // Сортування за часом

    if (limitCount) {
      q = query(q, limit(limitCount)); // Лімітуємо кількість постів
    }

    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return posts;
  } catch (error) {
    console.error('Помилка при завантаженні постів:', error.message);
    return [];
  }
};