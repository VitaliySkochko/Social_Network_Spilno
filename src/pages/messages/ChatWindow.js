//Обраний чат

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { sendMessage, fetchChatMessages, markMessagesAsRead } from '../../services/firebaseMessages';
import { auth } from '../../services/firebase';
import UserCard from '../../components/UserCard';
import { fetchUserData } from '../../services/firebaseProfileService';
import { FaTrash } from 'react-icons/fa';
import '../../styles/ChatWindow.css';

const ChatWindow = ({ chatId: propChatId, }) => {
  const { chatId: paramChatId } = useParams();
  const chatId = propChatId || paramChatId;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      const unsubscribe = fetchChatMessages(chatId, (fetchedMessages) => {
        const sortedMessages = fetchedMessages.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(sortedMessages);
  
        // Оновлюємо статус повідомлень як прочитані після завантаження чату
        markMessagesAsRead(chatId, auth.currentUser.uid); // Оновлюємо статус прочитання
      });
  
      // Завантаження деталей чату
      const fetchChatDetails = async () => {
        try {
          const chatDoc = await getDoc(doc(db, 'messages', chatId));
          if (chatDoc.exists()) {
            const chatData = chatDoc.data();
  
            const userPromises = chatData.participants.map(async (uid) => {
              const userData = await fetchUserData(uid);
              return { uid, ...userData };
            });
  
            const users = await Promise.all(userPromises);
            const userMap = users.reduce((acc, user) => {
              acc[user.uid] = user;
              return acc;
            }, {});
  
            setParticipants(userMap);
          }
        } catch (error) {
          console.error('Помилка при завантаженні чату:', error);
        }
      };
  
      fetchChatDetails();
  
      return () => unsubscribe();
    }
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const receiverUid = Object.values(participants).find(user => user.uid !== auth.currentUser.uid)?.uid;
  
      if (receiverUid) {
        await sendMessage(chatId, newMessage, receiverUid);  // Тепер передаємо receiverUid
        setNewMessage('');
      } else {
        console.error('Receiver UID is not found.');
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Ви впевнені, що хочете видалити це повідомлення?')) {
      try {
        await deleteDoc(doc(db, `messages/${chatId}/chatMessages`, messageId));
        setMessages(messages.filter(msg => msg.id !== messageId));
      } catch (error) {
        console.error('Помилка при видаленні повідомлення:', error);
      }
    }
  };

  if (!chatId) {
    return <p>Оберіть чат для перегляду повідомлень</p>;
  }

  const otherParticipant = Object.values(participants).find(user => user.uid !== auth.currentUser.uid);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>{otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Завантаження...'}</h2>
      </div>

      <div className="messages-list">
        {messages.map((msg, index) => {
          const sender = participants[msg.sender] || {};
          const messageDate = msg.timestamp?.toDate().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
          const messageTime = msg.timestamp?.toDate().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', hour12: false });

          return (
            <div key={msg.id || index} className={`message ${msg.sender === auth.currentUser.uid ? 'sent' : 'received'}`}>
              <div className="post-author-date">
                <UserCard uid={sender.uid} profilePhoto={sender.profilePhoto} firstName={sender.firstName} lastName={sender.lastName} />
                <span className="message-timestamp">{messageDate} {messageTime}</span>
                {msg.sender === auth.currentUser.uid && (
                  <FaTrash className="delete" title='Видалити' onClick={() => handleDeleteMessage(msg.id)} />
                )}
              </div>
              <div className="message-content">
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input">
      <input
  className="title-input"
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} // Додаємо обробник
    placeholder="Напишіть повідомлення..."
/>
        <button onClick={handleSendMessage} className="button-approve">Надіслати</button>
      </div>
    </div>
  );
};

export default ChatWindow;
