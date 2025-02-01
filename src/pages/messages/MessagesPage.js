//список чатів

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUserChats, createNewChat, deleteChat } from "../../services/firebaseMessages"; // Імпорт deleteChat
import { fetchUserData } from "../../services/firebaseProfileService";
import { auth } from "../../services/firebase";
import UserCard from "../../components/UserCard";
import DeleteChatModal from "./DeleteChatModal"; // Імпортуємо модальне вікно
import "../../styles/MessagesPage.css";

const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const location = useLocation();
  const receiverUid = location.state?.receiverUid || null;
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = fetchUserChats(auth.currentUser.uid, async (fetchedChats) => {
        setChats(fetchedChats);

        const userDataPromises = fetchedChats.map((chat) => {
          const otherParticipantId = chat.participants.find(
            (id) => id !== auth.currentUser.uid
          );
          return fetchUserData(otherParticipantId).then((data) => ({
            uid: otherParticipantId,
            ...data,
          }));
        });

        const userData = await Promise.all(userDataPromises);
        const userMap = userData.reduce((acc, user) => {
          acc[user.uid] = user;
          return acc;
        }, {});

        setUserDetails(userMap);

        if (receiverUid) {
          const existingChat = fetchedChats.find((chat) =>
            chat.participants.includes(receiverUid)
          );

          if (existingChat) {
            navigate(`/chat/${existingChat.id}`);
          } else {
            handleCreateNewChat(receiverUid);
          }
        }
      });

      return () => unsubscribe();
    }
  }, [receiverUid, navigate]);

  const handleCreateNewChat = async (uid) => {
    try {
      const { chatId } = await createNewChat(uid);
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleOpenDeleteModal = (chatId) => {
    setCurrentChatId(chatId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCurrentChatId(null);
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
      handleCloseDeleteModal(); // Закриваємо модальне вікно після видалення
    } catch (error) {
      console.error("Помилка при видаленні чату:", error);
    }
  };

  return (
    <div className="messages-page">
      <h2>Повідомлення</h2>
      <div className="chats-list">
        <h3>Ваші чати</h3>
        {chats.map((chat) => {
          const otherParticipantId = chat.participants.find(
            (id) => id !== auth.currentUser.uid
          );

          const user = userDetails[otherParticipantId];

          return (
            <div key={chat.id} className="chat-item">
              <div onClick={() => navigate(`/chat/${chat.id}`)}>
                {user ? (
                  <UserCard
                    uid={user.uid}
                    profilePhoto={user.profilePhoto}
                    firstName={user.firstName}
                    lastName={user.lastName}
                  />
                ) : (
                  <span>Завантаження...</span>
                )}
              </div>
              <button
                className="button-delete"
                onClick={() => handleOpenDeleteModal(chat.id)}
              >
                Видалити чат
              </button>
            </div>
          );
        })}
      </div>

      {/* Модальне вікно для видалення чату */}
      <DeleteChatModal
        show={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteChat}
        chatId={currentChatId}
      />
    </div>
  );
};

export default MessagesPage;
