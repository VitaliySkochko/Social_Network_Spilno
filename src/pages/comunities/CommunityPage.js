// Спільнота

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import {
    fetchCommunityById,
    fetchCommunityMembers,
    fetchUserDetails
} from '../../services/firebaseCommunityService';
import { FaUsers } from 'react-icons/fa';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../services/firebase';
import JoinCommunityButton from './JoinCommunityButton';
import MembersModal from '../../components/MembersModal';
import CommunityPosts from '../posts/CommunityPosts';
import CommunityInfo from './CommunityInfo';
import Spinner from '../../components/Spinner';
import '../../styles/CommunityPage.css';
import '../../styles/MembersModal.css'

const CommunityPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [community, setCommunity] = useState(null);
    const [members, setMembers] = useState([]);
    const [admins, setAdmins] = useState([]); // Зберігання списку адміністраторів
    const [user] = useAuthState(auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMember, setIsMember] = useState(false);

    // Завантаження даних про спільноту
    const loadCommunityData = useCallback(async () => {
        try {
            const communityData = await fetchCommunityById(id);
            setCommunity(communityData);
    
            const memberDetails = await fetchCommunityMembers(communityData.members);
            setMembers(memberDetails);
    
            // Перевірка, чи є користувач учасником спільноти
            if (user && communityData.members.includes(user.uid)) {
                setIsMember(true);
            } else {
                setIsMember(false);
            }
    
            // Завантаження даних адміністраторів
            if (communityData.roles) {
                const adminIds = Object.keys(communityData.roles).filter(
                    (uid) => communityData.roles[uid] === 'admin'
                );
                const adminDetails = await Promise.all(adminIds.map(fetchUserDetails));
                setAdmins(adminDetails);
    
                // Перевірка, чи є поточний користувач адміністратором
                if (adminIds.includes(user?.uid)) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            }
        } catch (error) {
            console.error('Помилка при завантаженні даних:', error);
        }
    }, [id, user]);

    useEffect(() => {
        loadCommunityData();
    }, [loadCommunityData]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const goToAdminPanel = () => {
        navigate(`/community/${id}/admin`);
    };

    if (!community) return <Spinner />;

    return (
        <div className="community-page-container"> 
            <div className="community-page">
                <div className='community-page-details-photo'>
                    {community.photoURL ? (
                        <img src={community.photoURL} alt={community.name} className="communities-photo" />
                    ) : (
                        <FaUsers className="user-icon-list" />
                    )}
                    <div className="community-details">
                        <h2 className="community-title">{community.name}</h2>
                        <p
                            className={`community-type ${
                                community.type === 'public'
                                    ? 'type-public'
                                    : community.type === 'private'
                                    ? 'type-private'
                                    : 'type-blog'
                            }`}
                        >
                            {community.type === 'public' ? 'Публічна' : community.type === 'private' ? 'Приватна' : 'Блог'}
                        </p>
                        <p className="community-description">{community.description}</p> 
                    </div> 
                    <div className="community-button-group">
                        {user && (
                            <JoinCommunityButton
                                communityId={id}
                                userId={user.uid}
                                isAdmin={isAdmin}
                                isMember={isMember}
                                communityType={community?.type}
                                onUpdateMembers={loadCommunityData}
                            />
                        )}
                        <button className="menu-button-comynity" onClick={() => setShowInfo(!showInfo)}>
                            {showInfo ? 'Повернутися до постів' : 'Інформація спільноти'}
                        </button>
                        {isAdmin && (
                            <button className="menu-button-comynity admin-button" onClick={goToAdminPanel}>
                                Панель адміністратора
                            </button>
                        )}
                        <button className="menu-button-comynity" onClick={handleOpenModal}>
                            Показати всіх учасників
                        </button>
                        {isModalOpen && <MembersModal members={members} onClose={handleCloseModal} />}
                    </div>
                </div>
            </div>
            
            <div className="community-content-section">
                {showInfo ? (
                    <CommunityInfo
                        admins={admins}
                        createdAt={community.createdAt}
                        communityType={community.type}
                    />
                ) : community.type === 'public' || isMember || community.type === 'blog' ? (
                    <CommunityPosts 
                    communityId={id} 
                    isMember={isMember} 
                    isAdmin={isAdmin} 
                    communityType={community.type} 
                    />
                ) : (
                    <p className="community-type-description"> 
                        <strong>Повідомлення для Вас:</strong> Це приватна спільнота, і лише її учасники можуть переглядати пости.
                        Подайте заявку на вступ до спільноти, після чого адміністратор розгляне її та прийме рішення.
                    </p>
                )}
            </div>
        </div>
    );
};

export default CommunityPage;
