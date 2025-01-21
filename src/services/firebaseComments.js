import { db, auth } from './firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { fetchUserData } from './firebaseProfileService';

// Додавання коментаря
export const addComment = async (postId, text) => {
    try {
        if (!auth.currentUser) {
            return;
        }
        const userId = auth.currentUser.uid;
        const commentsRef = collection(db, 'comments');
        await addDoc(commentsRef, {
            postId,
            text,
            authorId: userId,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error('Помилка додавання коментаря:', error);
    }
};

// Отримання коментарів для поста
export const fetchComments = async (postId) => {
    try {
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, where('postId', '==', postId));
        const querySnapshot = await getDocs(q);

        const comments = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
                const commentData = doc.data();
                const userData = await fetchUserData(commentData.authorId);
                return {
                    id: doc.id,
                    ...commentData,
                    author: userData || {}, // Якщо userData == null, повернути порожній об'єкт
                };
            })
        );

        // Сортуємо коментарі за часом у зворотному порядку (новіші коментарі будуть на початку)
        return comments.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
    } catch (error) {
        console.error('Помилка завантаження коментарів:', error);
        return [];
    }
};

// Видалення коментаря
export const deleteComment = async (commentId) => {
    try {
        const commentRef = doc(db, 'comments', commentId);
        await deleteDoc(commentRef);
        console.log('Коментар успішно видалено');
    } catch (error) {
        console.error('Помилка видалення коментаря:', error);
    }
};

// Оновлення коментаря
export const updateComment = async (commentId, newContent) => {
    try {
        const commentRef = doc(db, 'comments', commentId);
        await updateDoc(commentRef, {
            text: newContent,
            timestamp: serverTimestamp(),  // Оновлюємо час
        });
        console.log('Коментар успішно оновлено');
    } catch (error) {
        console.error('Помилка оновлення коментаря:', error);
    }
};
