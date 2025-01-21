import { db } from './firebase'; // Firebase конфігурація
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// Завантаження підписок користувача
export const fetchUserSubscriptions = async (userId) => {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        const { subscriptions = [] } = userDoc.data() || {};
        return subscriptions; // Повертає список підписок (ID спільнот або користувачів)
    } catch (error) {
        console.error('Помилка при завантаженні підписок:', error.message);
        return [];
    }
};

// Завантаження постів для стрічки новин
export const fetchPostsByCriteria = async ({ subscriptions, interests, limitCount, minLikes }) => {
    try {
        let q = query(
            collection(db, 'communityPosts'),
            orderBy('createdAt', 'desc') // Сортування за часом
        );

        // Фільтрація постів за підписками
        if (subscriptions && subscriptions.length > 0) {
            q = query(q, where('communityId', 'in', subscriptions));
        }

        // Фільтрація за інтересами (якщо є)
        if (interests && interests.length > 0) {
            q = query(q, where('tags', 'array-contains-any', interests));
        }

        // Фільтрація за мінімальною кількістю лайків
        if (minLikes) {
            q = query(q, where('likes.like', 'array-contains', minLikes));
        }

        // Обмеження кількості постів
        if (limitCount) {
            q = query(q, limit(limitCount));
        }

        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        return posts; // Повертаємо пости
    } catch (error) {
        console.error('Помилка при завантаженні постів:', error.message);
        return [];
    }
};
