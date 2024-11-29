// Компонент відповідає за відображення інформації про спільноту та учасників

import React from 'react';
import { FaUsers } from "react-icons/fa"; // Іконка для заміни фото
import "../../styles/CommunityPage.css";

const CommunityInfo = ({ community, members, isMember, handleJoinCommunity, handleLeaveCommunity }) => (
  <div className="community-info">
    {/* Відображення фото або іконки */}
    <div className="community-photo-container">
      {community.photoURL ? (
        <img
          src={community.photoURL}
          alt={community.name}
          className="communities-photo"
        />
      ) : (
        <FaUsers className="communities-icon" />
      )}
    </div>
    <h2 className="community-name">{community.name}</h2>
    <p className="community-description">{community.description}</p>
    <h3 className="members-title">Учасники спільноти:</h3>
    <ul className="members-list">
      {members.map((member) => (
        <li key={member.uid} className="member-item">
          {member.displayName}
        </li>
      ))}
    </ul>
    {!isMember ? (
      <button onClick={handleJoinCommunity} className="join-community-button">
        Приєднатися
      </button>
    ) : (
      <>
        <p className="community-member-message">Ви учасник цієї спільноти</p>
        <button onClick={handleLeaveCommunity} className="leave-community-button">
          Вийти зі спільноти
        </button>
      </>
    )}
  </div>
);

export default CommunityInfo;



