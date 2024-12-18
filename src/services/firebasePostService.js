
import { db } from './firebase'; // Firebase конфігурація
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

// Колекція постів
const postsCollection = 'communityPosts';

// Створення нового поста
export const createPost = async (communityId, userId, content, images = [], videos = []) => {
    try {
        const docRef = await addDoc(collection(db, postsCollection), {
            communityId,
            userId,
            content,
            images, // Масив зображень
            videos, // Масив відео URL
            createdAt: new Date(),
            likes: {
                like: [],
                dislike: [],
                love: [],
                laugh: [],
                surprised: [],
                angry: [],
            }, 
        });
        return docRef.id;
    } catch (error) {
        console.error('Помилка створення поста:', error);
        throw error;
    }
};

// Отримання постів для спільноти
export const fetchPostsByCommunity = async (communityId) => {
    try {
        const q = query(
            collection(db, postsCollection),
            where('communityId', '==', communityId)
        );
        const querySnapshot = await getDocs(q);
        
        // Сортування постів за createdAt: нові пости йдуть першими
        const sortedPosts = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

        return sortedPosts;
    } catch (error) {
        console.error('Помилка завантаження постів:', error);
        throw error;
    }
};

// Видалення поста
export const deletePost = async (postId) => {
    try {
        await deleteDoc(doc(db, postsCollection, postId));
    } catch (error) {
        console.error('Помилка видалення поста:', error);
        throw error;
    }
};


