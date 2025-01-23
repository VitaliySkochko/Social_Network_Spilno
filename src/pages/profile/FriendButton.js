import React, { useEffect, useState } from 'react';
import { auth, db } from '../../services/firebase';
import { doc, getDoc, deleteDoc, updateDoc, arrayRemove, setDoc } from 'firebase/firestore';

const FriendButton = ({ uid }) => {
  const [friendStatus, setFriendStatus] = useState(''); // 'none', 'requested', 'friends'
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const checkFriendStatus = async () => {
      const currentUserId = auth.currentUser?.uid;

      // Перевірка, чи це профіль поточного користувача
      if (currentUserId === uid) {
        setIsCurrentUser(true);
        return;
      }

      // Перевірка, чи є цей користувач в списку друзів поточного користувача
      const userDoc = await getDoc(doc(db, 'users', currentUserId));
      const userData = userDoc.data();
      if (userData?.friends && userData.friends.includes(uid)) {
        setFriendStatus('friends');
        return;
      }

      // Перевірка, чи є запит на дружбу в обох напрямках
      const sentRequestDoc = await getDoc(doc(db, 'friendRequests', currentUserId, 'sentRequests', uid));
      const receivedRequestDoc = await getDoc(doc(db, 'friendRequests', uid, 'receivedRequests', currentUserId));

      if (sentRequestDoc.exists() || receivedRequestDoc.exists()) {
        setFriendStatus('requested');
        return;
      }

      setFriendStatus('none');
    };

    checkFriendStatus();
  }, [uid]);

  const handleAddFriend = async () => {
    const currentUserId = auth.currentUser?.uid;

    // Надсилаємо запит на дружбу
    await setDoc(doc(db, 'friendRequests', uid, 'receivedRequests', currentUserId), {
      from: currentUserId,
      to: uid,
      status: 'pending',
    });

    setFriendStatus('requested');
  };

  const handleCancelRequest = async () => {
    const currentUserId = auth.currentUser?.uid;

    // Видаляємо запит на дружбу
    await deleteDoc(doc(db, 'friendRequests', uid, 'receivedRequests', currentUserId));
    setFriendStatus('none');
  };

  const handleRemoveFriend = async () => {
    const currentUserId = auth.currentUser?.uid;

    // Видалення користувача зі списку друзів
    await updateDoc(doc(db, 'users', currentUserId), {
      friends: arrayRemove(uid), // Видаляємо друга з поточного користувача
    });

    await updateDoc(doc(db, 'users', uid), {
      friends: arrayRemove(currentUserId), // Видаляємо поточного користувача з друга
    });

    setFriendStatus('none');
  };

  // Не показуємо кнопку для поточного користувача
  if (isCurrentUser) return null;

  return (
    <div className="friend-button">
      {friendStatus === 'none' && (
        <button onClick={handleAddFriend} className="button-approve">
          Додати в друзі
        </button>
      )}
      {friendStatus === 'requested' && (
        <button onClick={handleCancelRequest} className="button-modal">
          Відмінити заявку
        </button>
      )}
      {friendStatus === 'friends' && (
        <button onClick={handleRemoveFriend} className="button-delete">
          Видалити з друзів
        </button>
      )}
    </div>
  );
};

export default FriendButton;

