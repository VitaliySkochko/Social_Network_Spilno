// Спільнота

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCommunityById, fetchCommunityMembers, fetchUserDetails } from '../../services/firebaseCommunityService';
import { FaUsers } from 'react-icons/fa';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../services/firebase';
import JoinCommunityButton from './JoinCommunityButton';
import UserCard from '../../components/UserCard';
import MembersModal from '../../components/MembersModal';
import CommunityPosts from '../posts/CommunityPosts';
import CommunityInfo from './CommunityInfo';
import '../../styles/CommunityPage.css';

const CommunityPage = () => {
    const { id } = useParams();
    const [community, setCommunity] = useState(null);
    const [members, setMembers] = useState([]);
    const [admin, setAdmin] = useState(null);
    const [user] = useAuthState(auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showInfo, setShowInfo] = useState(false); // Стан для перемикання розділів

    // Завантаження даних про спільноту
    const loadCommunityData = useCallback(async () => {
        try {
            const communityData = await fetchCommunityById(id);
            setCommunity(communityData);

            const memberDetails = await fetchCommunityMembers(communityData.members);
            setMembers(memberDetails);

            // Завантаження адміністратора
            if (communityData.adminId) {
                const adminDetails = await fetchUserDetails(communityData.adminId);
                setAdmin(adminDetails);
            }
        } catch (error) {
            console.error('Помилка при завантаженні даних:', error);
        }
    }, [id]);

    useEffect(() => {
        loadCommunityData();
    }, [loadCommunityData]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    if (!community) return <p>Завантаження...</p>;

    return (
        <div className="community-page-conteiner">
            <div className="community-page">
                {community.photoURL ? (
                    <img src={community.photoURL} alt={community.name} className="communities-photo" />
                ) : (
                    <FaUsers className="user-icon-list" />
                )}
                <div className="community-details">
                    <h2 className="community-title">{community.name}</h2>
                    <p className="community-description">{community.description}</p>
                    <div className='community-button-group'>
                    {user && (
                        <JoinCommunityButton
                            communityId={id}
                            userId={user.uid}
                            isMember={community?.members?.includes(user?.uid)}
                            onUpdateMembers={loadCommunityData}
                        /> 
                    )}
                    <button className="button-main" onClick={() => setShowInfo(!showInfo)}>
                        {showInfo ? 'Повернутися до постів' : 'Інформація спільноти'}
                    </button>
                    </div>
                </div>

                <div className="community-members-group">
                    <h3>Учасники ({members.length})</h3>
                    {members.length > 0 ? (
                        members.slice(0, 3).map((member, index) => (
                            <UserCard
                                key={index}
                                uid={member.uid}
                                profilePhoto={member.profilePhoto}
                                firstName={member.firstName}
                                lastName={member.lastName}
                            />
                        ))
                    ) : (
                        <p>Немає учасників</p>
                    )}
                    <button className="button-modal" onClick={handleOpenModal}>
                        Показати всіх учасників
                    </button>
                </div>

                {isModalOpen && <MembersModal members={members} onClose={handleCloseModal} />}
            </div>

            <div className="community-content-section">
                {showInfo ? (
                    <CommunityInfo admin={admin} createdAt={community.createdAt} />
                ) : (
                    <CommunityPosts communityId={id} />
                )}
            </div>
        </div>
    );
};

export default CommunityPage;

