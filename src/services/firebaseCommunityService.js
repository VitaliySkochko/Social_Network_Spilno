// services/firebaseHelpers.js
import { db, storage } from './firebase';
import { collection, addDoc, query, orderBy, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Завантаження фото в Firebase Storage
export const uploadPhoto = async (photo) => {
    const storageRef = ref(storage, `community_photos/${photo.name}`);
    const uploadTask = await uploadBytesResumable(storageRef, photo);
    return await getDownloadURL(uploadTask.ref);
};

// Створення спільноти в Firestore та повернення ID документа
export const createCommunity = async (name, description, photoURL, adminId) => {
    const newCommunity = {
        name,
        description,
        photoURL: photoURL || '',
        createdAt: new Date(),
        adminId, // Зберігаємо ID адміністратора
        members: [adminId], // Додаємо адміністратора як першого учасника
    };
    const docRef = await addDoc(collection(db, 'communities'), newCommunity);
    return docRef.id; // Повертаємо ID документа
};

// Відповідає за отримання даних про спільноти з бази даних Firebase Firestore
export const fetchCommunities = async () => {
    const q = query(
        collection(db, 'communities'),
        orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

// Отримання спільноти за ID
export const fetchCommunityById = async (id) => {
    const docRef = doc(db, 'communities', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        throw new Error('Спільноту не знайдено');
    }
};

// виконують операції додавання користувача з колекції учасників певної спільноти в базі даних Firebase Firestore.
export const joinCommunity = async (communityId, userId) => {
    const communityRef = doc(db, 'communities', communityId);
    await updateDoc(communityRef, {
        members: arrayUnion(userId),
    });
};

// виконують операції видалення користувача з колекції учасників певної спільноти в базі даних Firebase Firestore.
export const leaveCommunity = async (communityId, userId) => {
    const communityRef = doc(db, 'communities', communityId);
    await updateDoc(communityRef, {
        members: arrayRemove(userId),
    });
};

// Отримання деталей користувача за userId
export const fetchUserDetails = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};

// Отримання учасників спільноти
export const fetchCommunityMembers = async (members) => {
    if (!members) return [];
    const memberDetails = await Promise.all(
        members.map(async (userId) => {
            return await fetchUserDetails(userId);
        })
    );
    return memberDetails.filter((member) => member !== null);
};


export const updateCommunity = async (id, updatedData) => {
    const communityRef = doc(db, "communities", id);
    await updateDoc(communityRef, updatedData);
  };
  