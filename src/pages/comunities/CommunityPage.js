// src/pages/CommunityPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCommunityById } from '../../services/firebaseCommunityService';
import { FaUsers } from 'react-icons/fa';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../services/firebase';
import JoinCommunityButton from './JoinCommunityButton';
import UserCard from '../../components/UserCard';
import MembersModal from '../../components/MembersModal'; // Імпортуємо модальне вікно
import { doc, getDoc } from 'firebase/firestore';
import '../../styles/CommunityPage.css'

const CommunityPage = () => {
    const { id } = useParams();
    const [community, setCommunity] = useState(null);
    const [members, setMembers] = useState([]);
    const [user] = useAuthState(auth);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadCommunity = async () => {
            try {
                const communityData = await fetchCommunityById(id);
                setCommunity(communityData);

                if (communityData.members) {
                    const memberDetails = await Promise.all(
                        communityData.members.map(async (userId) => {
                            const userRef = doc(db, 'users', userId);
                            const userSnap = await getDoc(userRef);
                            return userSnap.exists() ? userSnap.data() : null;
                        })
                    );
                    setMembers(memberDetails.filter((member) => member !== null));
                }
            } catch (error) {
                console.error('Помилка при завантаженні спільноти:', error);
            }
        };

        loadCommunity();
    }, [id]);

    const updateMembers = async () => {
        const communityData = await fetchCommunityById(id);
        if (communityData.members) {
            const memberDetails = await Promise.all(
                communityData.members.map(async (userId) => {
                    const userRef = doc(db, 'users', userId);
                    const userSnap = await getDoc(userRef);
                    return userSnap.exists() ? userSnap.data() : null;
                })
            );
            setMembers(memberDetails.filter((member) => member !== null));
        }
    };

    if (!community) {
        return <p>Завантаження...</p>;
    }

    const isMember = community.members?.includes(user?.uid);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="community-page">
            {community.photoURL ? (
                <img
                    src={community.photoURL}
                    alt={community.name}
                    className="communities-photo"
                />
            ) : (
                <FaUsers className="user-icon-list" />
            )}
            <div className="community-details">
                <h2 className="community-title">{community.name}</h2>
                <div className="community-info">
                    <p className="community-description">{community.description}</p>
                </div>
                {user && (
                    <JoinCommunityButton
                        communityId={id}
                        userId={user.uid}
                        isMember={isMember}
                        onUpdateMembers={updateMembers}
                    />
                )}
            </div>
            <div className="community-members-group">
                <h3>
                    Учасники ({members.length}) {/* Відображаємо кількість учасників */}
                </h3>
                {members.length > 0 ? (
                    members.slice(0, 3).map((member, index) => (
                        <UserCard
                            key={index}
                            profilePhoto={member.profilePhoto}
                            firstName={member.firstName}
                            lastName={member.lastName}
                        />
                    ))
                ) : (
                    <p>Немає учасників</p>
                )}
                <button className='button-modal' onClick={handleOpenModal}>Показати всіх учасників</button>
            </div>

            {isModalOpen && (
                <MembersModal members={members} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default CommunityPage;
