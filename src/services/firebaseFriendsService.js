import { db, auth } from './firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc, arrayUnion, setDoc } from 'firebase/firestore';

// Отримання списку друзів
export const fetchFriendsList = async () => {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    throw new Error('Користувач не залогінений.');
  }

  try {
    // Отримуємо друзів для поточного користувача
    const userRef = doc(db, 'users', currentUserId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('Користувач не знайдений.');
    }

    const userData = userDoc.data();
    const friendIds = userData?.friends || [];

    // Завантажуємо інформацію про кожного друга
    const friendsData = [];
    for (const friendId of friendIds) {
      const friendRef = doc(db, 'users', friendId);
      const friendDoc = await getDoc(friendRef);
      if (friendDoc.exists()) {
        friendsData.push({ ...friendDoc.data(), userId: friendId });
      }
    }

    return friendsData;
  } catch (error) {
    console.error('Помилка завантаження списку друзів:', error);
    throw new Error('Не вдалося завантажити список друзів.');
  }
};
  

// Отримання заявок у друзі
export const fetchFriendRequests = async () => {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    throw new Error('Користувач не залогінений.');
  }

  const requestsRef = collection(db, 'friendRequests', currentUserId, 'receivedRequests');
  const snapshot = await getDocs(requestsRef);

  return snapshot.docs.map((doc) => ({ ...doc.data(), userId: doc.id }));
};


// Підтвердження заявки
export const approveFriendRequest = async (userId) => {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    throw new Error('Користувач не залогінений.');
  }

  try {
    // Видаляємо заявку
    const requestRef = doc(db, 'friendRequests', currentUserId, 'receivedRequests', userId);
    await deleteDoc(requestRef);

    // Оновлюємо список друзів для поточного користувача в колекції 'users'
    const currentUserRef = doc(db, 'users', currentUserId);
    await updateDoc(currentUserRef, {
      friends: arrayUnion(userId), // Додаємо нового друга
    });

    // Оновлюємо список друзів для користувача, який подав заявку
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      friends: arrayUnion(currentUserId), // Додаємо поточного користувача до списку друзів заявника
    });

  } catch (error) {
    console.error('Помилка підтвердження заявки:', error);
    throw new Error(`Помилка підтвердження заявки для користувача ${userId}: ${error.message}`);
  }
};


// Відхилення заявки
export const rejectFriendRequest = async (userId) => {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    throw new Error('Користувач не залогінений.');
  }

  try {
    const requestRef = doc(db, 'friendRequests', currentUserId, 'receivedRequests', userId);
    await deleteDoc(requestRef);
  } catch (error) {
    console.error('Помилка відхилення заявки:', error);
    throw new Error(`Помилка відхилення заявки для користувача ${userId}: ${error.message}`);
  }
};

