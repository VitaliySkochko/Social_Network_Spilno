import { collection, query, where, onSnapshot, addDoc, doc, serverTimestamp, getDoc, updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';



// Отримання чатів поточного користувача
export const fetchUserChats = (currentUserUid, callback) => {
  const chatsRef = collection(db, 'messages');
  const q = query(chatsRef, where('participants', 'array-contains', currentUserUid));

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(chats);
  });
};

// Отримання повідомлень для вибраного чату
export const fetchChatMessages = (chatId, callback) => {
  const messagesRef = collection(db, 'messages', chatId, 'messages');
  return onSnapshot(messagesRef, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

//створення нового чату
export const createNewChat = async (receiverUid) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Користувач не знайдений');
    }

    // Перевіряємо, чи вже існує чат між поточним користувачем і отримувачем
    const chatsRef = collection(db, 'messages');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', currentUser.uid),
      where('participants', 'array-contains', receiverUid)
    );
    const querySnapshot = await getDocs(q);

    // Якщо чат існує, повертаємо його ID
    if (!querySnapshot.empty) {
      return { chatId: querySnapshot.docs[0].id };
    }

    // Якщо чат не знайдено, створюємо новий
    const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const receiverDoc = await getDoc(doc(db, 'users', receiverUid));

    if (!receiverDoc.exists() || !currentUserDoc.exists()) {
      throw new Error('Користувача не знайдено.');
    }

    const newChatRef = collection(db, 'messages');
    const newChat = await addDoc(newChatRef, {
      participants: [currentUser.uid, receiverUid],
      createdAt: serverTimestamp(),
      participantDetails: {
        [currentUser.uid]: {
          name: currentUserDoc.data().name || 'Ваше ім’я',
          profilePhoto: currentUserDoc.data().profilePhoto || null,
        },
        [receiverUid]: {
          name: receiverDoc.data().name || 'Невідомий користувач',
          profilePhoto: receiverDoc.data().profilePhoto || null,
        },
      },
    });

    return { chatId: newChat.id };

  } catch (error) {
    console.error('Помилка при створенні чату:', error);
    throw error;
  }
};
// Відправка повідомлення
export const sendMessage = async (chatId, messageText, receiverUid) => {
  if (!messageText.trim()) return;

  const messagesRef = collection(db, 'messages', chatId, 'messages');
  await addDoc(messagesRef, {
    text: messageText,
    sender: auth.currentUser.uid,
    receiverId: receiverUid,  // Додаємо отримувача
    timestamp: serverTimestamp(),
    isRead: false, // Додаємо поле, яке вказує, що повідомлення непрочитане
  });
};

//Видалення чату
export const deleteChat = async (chatId) => {
  try {
    // Отримуємо чат із бази
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      throw new Error("Чат не знайдений");
    }

    const chatData = chatDoc.data();
    const participants = chatData.participants;

    // Якщо поточний користувач є учасником чату
    if (participants.includes(auth.currentUser.uid)) {
      // Оновлюємо список учасників, видаляючи поточного користувача
      const updatedParticipants = participants.filter(
        (uid) => uid !== auth.currentUser.uid
      );

      // Оновлюємо чат у базі
      await updateDoc(chatRef, {
        participants: updatedParticipants,
      });

      // Якщо в чаті більше немає учасників, можна видалити чат
      if (updatedParticipants.length === 0) {
        await deleteDoc(chatRef);
      }

      // Видаляємо всі повідомлення в чаті
      const messagesRef = collection(db, "messages", chatId, "messages");
      const messagesSnapshot = await getDocs(messagesRef);
      messagesSnapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(db, "messages", chatId, "messages", docSnap.id));
      });

      console.log("Чат успішно видалено!");
    }
  } catch (error) {
    console.error("Помилка при видаленні чату:", error);
  }
};

export const markMessagesAsRead = async (chatId, currentUserId) => {
  try {
    const messagesRef = collection(db, `messages/${chatId}/messages`);
    
    // Фільтруємо повідомлення для поточного користувача, які непрочитані
    const q = query(messagesRef, where('receiverId', '==', currentUserId), where('isRead', '==', false));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const updatePromises = [];

      snapshot.forEach((messageDoc) => {
        const updatePromise = updateDoc(
          doc(db, `messages/${chatId}/messages`, messageDoc.id),
          { isRead: true }
        );
        updatePromises.push(updatePromise);
      });

      // Оновлюємо всі непрочитані повідомлення як прочитані
      await Promise.all(updatePromises);
      console.log('Повідомлення оновлені як прочитані');
    } else {
      console.log('Немає непрочитаних повідомлень');
    }
  } catch (error) {
    console.error('Помилка при оновленні статусу повідомлень:', error);
  }
};



// Функція для отримання кількості непрочитаних повідомлень
export const fetchUnreadChatsCount = async (userId, setUnreadChatsCount) => {
  try {
    const chatsRef = collection(db, 'messages');
    const chatsSnapshot = await getDocs(chatsRef);

    let unreadMessagesCount = 0; // Лічильник для непрочитаних повідомлень

    // Перевірка кожного чату
    for (const chatDoc of chatsSnapshot.docs) {
      const chatId = chatDoc.id;
      const messagesRef = collection(db, 'messages', chatId, 'messages');
      const q = query(messagesRef, where('receiverId', '==', userId), where('isRead', '==', false)); // Непрочитані повідомлення поточного користувача
      const messagesSnapshot = await getDocs(q);

      unreadMessagesCount += messagesSnapshot.size; // Додаємо кількість непрочитаних повідомлень в цьому чаті
    }

    setUnreadChatsCount(unreadMessagesCount); // Встановлюємо загальну кількість непрочитаних повідомлень
  } catch (error) {
    console.error('Помилка отримання непрочитаних повідомлень:', error);
    setUnreadChatsCount(0); // Якщо сталася помилка, кількість повідомлень = 0
  }
};

// Підписка на зміни в непрочитаних повідомленнях
export const listenForUnreadChatsChanges = (userId, setUnreadChatsCount) => {
  const chatsRef = collection(db, 'messages');

  return onSnapshot(chatsRef, async (snapshot) => {
    let unreadMessagesCount = 0; // Лічильник для непрочитаних повідомлень

    // Перевірка кожного чату на наявність непрочитаних повідомлень
    for (const chatDoc of snapshot.docs) {
      const chatId = chatDoc.id;
      const messagesRef = collection(db, 'messages', chatId, 'messages');
      const q = query(messagesRef, where('receiverId', '==', userId), where('isRead', '==', false)); // Непрочитані повідомлення поточного користувача

      const messagesSnapshot = await getDocs(q);
      unreadMessagesCount += messagesSnapshot.size; // Додаємо кількість непрочитаних повідомлень
    }

    setUnreadChatsCount(unreadMessagesCount); // Оновлюємо кількість непрочитаних повідомлень
  });
};