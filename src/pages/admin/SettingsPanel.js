import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchCommunityById,
  fetchCommunityMembers,
  addRoleToMember,
  removeRoleFromMember,
  removeMemberFromCommunity,
} from "../../services/firebaseCommunityService";
import UserCard from "../../components/UserCard"; // Імпортуємо компонент UserCard
import "../../styles/SettingsPanel.css";

const SettingsPanel = () => {
  const { id: communityId } = useParams(); // Отримуємо ID спільноти
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false); // Стан для модального вікна адміністраторів

  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        const communityData = await fetchCommunityById(communityId);
        setCommunity(communityData);

        // Завантаження учасників
        const membersData = await fetchCommunityMembers(communityData.members);
        setMembers(membersData);
      } catch (error) {
        console.error("Помилка завантаження даних спільноти:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCommunityData();
  }, [communityId]);

  const handleMakeAdmin = async (userId) => {
    try {
      await addRoleToMember(communityId, userId, "admin");
      setCommunity((prev) => ({
        ...prev,
        roles: { ...prev.roles, [userId]: "admin" },
      }));
    } catch (error) {
      console.error("Помилка при призначенні адміністратора:", error.message);
    }
  };

  const handleRemoveAdmin = async (userId) => {
    try {
      await removeRoleFromMember(communityId, userId);
      setCommunity((prev) => {
        const updatedRoles = { ...prev.roles };
        delete updatedRoles[userId];
        return { ...prev, roles: updatedRoles };
      });
    } catch (error) {
      console.error("Помилка при знятті адміністратора:", error.message);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeMemberFromCommunity(communityId, userId);
      setMembers((prevMembers) => prevMembers.filter((member) => member.uid !== userId));
    } catch (error) {
      console.error("Помилка видалення учасника:", error.message);
    }
  };

  const handleOpenAdminModal = () => setShowAdminModal(true);
  const handleCloseAdminModal = () => setShowAdminModal(false);

  if (loading) {
    return <p>Завантаження...</p>;
  }

  return (
    <div className="settings-panel">
      <h3>Налаштування</h3>
      <div className="admin-settings-group">
        <button className="menu-button-admin" onClick={handleOpenAdminModal}>
          Налаштування учасників спільноти
        </button>
      </div>

      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Список учасників</h4>
            <ul className="members-list">
              {members.map((member) => (
                <li key={member.uid} className="member-item">
                  <UserCard
                    uid={member.uid}
                    profilePhoto={member.profilePhoto}
                    firstName={member.firstName}
                    lastName={member.lastName}
                  />
                  {community.roles?.[member.uid] === "admin" && (
                    <span className="admin-label">Адміністратор</span>
                  )}
                  <button
                    className="button-approve "
                    onClick={() =>
                      community.roles?.[member.uid] === "admin"
                        ? handleRemoveAdmin(member.uid)
                        : handleMakeAdmin(member.uid)
                    }
                  >
                    {community.roles?.[member.uid] === "admin"
                      ? "Зняти адміністратора"
                      : "Зробити адміністратором"}
                  </button>
                  <button
                    className="button-delete button-danger"
                    onClick={() => handleRemoveMember(member.uid)}
                  >
                    Видалити зі спільноти
                  </button>
                </li>
              ))}
            </ul>
            <button className="button-delete" onClick={handleCloseAdminModal}>
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
