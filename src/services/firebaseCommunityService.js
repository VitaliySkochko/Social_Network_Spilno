// services/firebaseHelpers.js
import { db, storage } from './firebase';
import { collection, addDoc, query, orderBy, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, where, deleteDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Завантаження фото в Firebase Storage
export const uploadPhoto = async (photo) => {
    const storageRef = ref(storage, `community_photos/${photo.name}`);
    const uploadTask = await uploadBytesResumable(storageRef, photo);
    return await getDownloadURL(uploadTask.ref);
};

export const createCommunity = async (name, description, photoURL, adminId, communityType, selectedTopics) => {
    const newCommunity = {
      name,
      description,
      photoURL: photoURL || '',
      createdAt: new Date(),
      adminId, // ID адміністратора
      members: [adminId], // Додаємо адміністратора як учасника
      roles: { [adminId]: 'admin' }, // Призначаємо роль адміністратору
      type: communityType || 'public', // Тип спільноти: 'public', 'private' або 'blog'
      postingPolicy: communityType === 'blog' ? 'adminsOnly' : 'allMembers', // Політика публікацій
      topics: selectedTopics || [], // Додаємо вибрані теми
    };
  
    const docRef = await addDoc(collection(db, 'communities'), newCommunity);
    return docRef.id; // Повертаємо ID документа
  };
  

  export const searchCommunitiesByTopic = async (topic) => {
    const q = query(collection(db, 'communities'), where('topics', 'array-contains', topic));
    const querySnapshot = await getDocs(q);
    const communitiesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
    return communitiesList;
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

// Функція для видалення всіх постів, пов'язаних зі спільнотою
export const deletePostsByCommunity = async (communityId) => {
    try {
      const postsRef = collection(db, "communityPosts"); // Таблиця з постами
      const q = query(postsRef, where("communityId", "==", communityId)); // Фільтруємо пости за communityId
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) return; // Якщо постів немає, виходимо
  
      const batch = writeBatch(db); // Використовуємо writeBatch для ефективності
      querySnapshot.docs.forEach((docSnapshot) => {
        batch.delete(doc(db, "communityPosts", docSnapshot.id));
      });
  
      await batch.commit(); // Виконуємо всі операції одночасно
    } catch (error) {
      console.error("Помилка при видаленні постів:", error);
      throw new Error("Помилка при видаленні постів.");
    }
  };
  
  // Функція для видалення спільноти разом з її постами
  export const deleteCommunityAndPosts = async (communityId) => {
    try {
      // Видаляємо всі пости, пов'язані з цією спільнотою
      await deletePostsByCommunity(communityId);
  
      // Видаляємо спільноту
      const communityDocRef = doc(db, "communities", communityId);
      await deleteDoc(communityDocRef);
  
      return true;
    } catch (error) {
      console.error("Помилка при видаленні спільноти та постів:", error);
      return false;
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
  
// Додамо можливість призначати ролі у спільноті
export const addRoleToMember = async (communityId, userId, role) => {
    const communityRef = doc(db, 'communities', communityId);
    const communitySnap = await getDoc(communityRef);
    
    if (communitySnap.exists()) {
        const communityData = communitySnap.data();
        const updatedRoles = { ...communityData.roles, [userId]: role };
        await updateDoc(communityRef, { roles: updatedRoles });
    } else {
        throw new Error('Спільноту не знайдено');
    }
};

//Перевірка ролі користувача перед виконанням операцій
export const checkUserRole = async (communityId, userId) => {
    const communityRef = doc(db, 'communities', communityId);
    const communitySnap = await getDoc(communityRef);
    
    if (communitySnap.exists()) {
        const communityData = communitySnap.data();
        const userRole = communityData.roles[userId];
        return userRole || 'guest'; // Якщо роль не знайдена, за замовчуванням 'guest'
    } else {
        throw new Error('Спільноту не знайдено');
    }
};

//Логіка для доступу до функцій
export const canEditCommunity = async (communityId, userId) => {
    const role = await checkUserRole(communityId, userId);
    if (role === 'admin' || role === 'moderator') {
        return true;
    } else {
        return false;
    }
};

export const canBanUser = async (communityId, userId) => {
    const role = await checkUserRole(communityId, userId);
    if (role === 'admin') {
        return true;
    } else {
        return false;
    }
};

//Для блокування користувача 
export const blockUser = async (communityId, userId) => {
    await addRoleToMember(communityId, userId, 'blocked');
};

export const fetchCommunityAdmins = async (communityId, currentUser) => {
    const communityRef = doc(db, 'communities', communityId);
    const communitySnap = await getDoc(communityRef);
    
    if (communitySnap.exists()) {
        const communityData = communitySnap.data();
        const admins = Object.keys(communityData.roles).filter(
            (userId) => communityData.roles[userId] === 'admin'
        );

        // Додавання перевірки, чи поточний користувач є адміністратором
        const isAdmin = admins.includes(currentUser.uid);

        return { admins, isAdmin };
    } else {
        throw new Error('Спільноту не знайдено');
    }
};

//Видаляємо користувача з членів спільноти в базі даних
export const removeMemberFromCommunity = async (communityId, userId) => {
    try {
        const communityRef = doc(db, "communities", communityId);
        await updateDoc(communityRef, {
            members: arrayRemove(userId),
        });
    } catch (error) {
        throw new Error("Помилка видалення учасника зі спільноти: " + error.message);
    }
};

//Видалення ролі
export const removeRoleFromMember = async (communityId, userId) => {
    const communityRef = doc(db, 'communities', communityId);
    const communitySnap = await getDoc(communityRef);

    if (communitySnap.exists()) {
        const communityData = communitySnap.data();
        const updatedRoles = { ...communityData.roles };
        delete updatedRoles[userId];
        await updateDoc(communityRef, { roles: updatedRoles });
    } else {
        throw new Error('Спільноту не знайдено');
    }
};

// Функція для подачі заявки на участь у спільноті
// Подати заявку на участь у спільноті
export const submitJoinRequest = async (communityId, userId, userName) => {
    const communityRef = doc(db, 'communities', communityId);
    const communitySnapshot = await getDoc(communityRef);

    if (communitySnapshot.exists()) {
        const communityData = communitySnapshot.data();

        if (
            !communityData.joinRequests ||
            !communityData.joinRequests.some((request) => request.userId === userId)
        ) {
            await updateDoc(communityRef, {
                joinRequests: arrayUnion({ userId, userName }),
            });
        } else {
            console.log('Заявка вже була подана.');
        }
    }
};

// Отримати список заявок
export const fetchJoinRequests = async (communityId) => {
    const communityRef = doc(db, 'communities', communityId);
    const communitySnapshot = await getDoc(communityRef);

    if (communitySnapshot.exists()) {
        return communitySnapshot.data().joinRequests || [];
    }
    return [];
};

// Підтвердити заявку
export const approveJoinRequest = async (communityId, userId) => {
    const communityRef = doc(db, 'communities', communityId);
    const communitySnapshot = await getDoc(communityRef);

    if (communitySnapshot.exists()) {
        const communityData = communitySnapshot.data();

        // Перевіряємо, чи є заявка користувача
        if (communityData.joinRequests?.some(request => request.userId === userId)) {
            // Видаляємо заявку з joinRequests
            const updatedJoinRequests = communityData.joinRequests.filter(request => request.userId !== userId);

            // Додаємо користувача до members
            await updateDoc(communityRef, {
                members: arrayUnion(userId),
                joinRequests: updatedJoinRequests
            });
        } else {
            console.log('Заявка не знайдена.');
        }
    } else {
        console.log('Спільнота не знайдена.');
    }
};

// Відхилити заявку
export const rejectJoinRequest = async (communityId, userId) => {
    const communityRef = doc(db, 'communities', communityId);
    const communitySnapshot = await getDoc(communityRef);

    if (communitySnapshot.exists()) {
        const communityData = communitySnapshot.data();

        // Видаляємо заявку з колекції joinRequests
        const updatedJoinRequests = communityData.joinRequests.filter(request => request.userId !== userId);

        // Оновлюємо спільноту в Firestore
        await updateDoc(communityRef, {
            joinRequests: updatedJoinRequests
        });
    }
};
// Функція для перевірки статусу заявки на участь у спільноті
export const fetchJoinRequestStatus = async (communityId, userId) => {
    const communityRef = doc(db, 'communities', communityId);
    const communitySnapshot = await getDoc(communityRef);

    if (communitySnapshot.exists()) {
        const communityData = communitySnapshot.data();
        
        // Перевірка чи є заявки
        const joinRequest = communityData.joinRequests?.find(request => request.userId === userId);
        
        if (joinRequest) {
            return 'pending'; // Заявка на очікуванні
        }
        
        // Якщо заявка не знайдена
        return 'none'; // Заявка не подана
    }

    return 'none'; // Якщо спільнота не знайдена
};

