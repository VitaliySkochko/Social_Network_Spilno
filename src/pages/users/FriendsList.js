// Друзі користувача

import React, { useEffect, useState } from 'react';
import { 
    approveFriendRequest, 
    rejectFriendRequest, 
    fetchFriendRequests, 
    fetchFriendsList 
} from '../../services/firebaseFriendsService';
import { fetchUserData } from '../../services/firebaseProfileService';
import { auth, db } from '../../services/firebase';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import UserCard from '../../components/UserCard';
import FriendRequests from './FriendRequests';
import '../../styles/FriendsList.css';
import Spinner from '../../components/Spinner';

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadFriendsAndRequests = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [friendsData, requestsData] = await Promise.all([
                fetchFriendsList(),
                fetchFriendRequests()
            ]);
            setFriends(friendsData);
            setRequests(requestsData);

            const usersData = {};
            for (const request of requestsData) {
                const userDetails = await fetchUserData(request.userId);
                if (userDetails) {
                    usersData[request.userId] = userDetails;
                }
            }
            setUsers(usersData);
        } catch (err) {
            setError('Не вдалося завантажити дані.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFriendsAndRequests();
    }, []);

    const handleApprove = async (userId) => {
        try {
            await approveFriendRequest(userId);
            setFriends((prevFriends) => [...prevFriends, users[userId]]);
            setRequests((prevRequests) => prevRequests.filter((request) => request.userId !== userId));
            await updateUserFriends(userId);
        } catch (err) {
            console.error('Помилка підтвердження заявки:', err);
        }
    };

    const handleReject = async (userId) => {
        try {
            await rejectFriendRequest(userId);
            await loadFriendsAndRequests();
        } catch (err) {
            console.error('Помилка відхилення заявки:', err);
        }
    };

    const updateUserFriends = async (userId) => {
        try {
            const currentUserId = auth.currentUser?.uid;
            if (!currentUserId) throw new Error('Користувач не залогінений');

            await updateDoc(doc(db, 'users', currentUserId), {
                friends: arrayUnion(userId),
            });

            await updateDoc(doc(db, 'users', userId), {
                friends: arrayUnion(currentUserId),
            });
        } catch (err) {
            console.error('Помилка оновлення друзів:', err);
        }
    };

    if (isLoading) {
        return <Spinner/>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="friends-list">
            {requests.length > 0 && (
                <FriendRequests 
                    requests={requests} 
                    users={users} 
                    onApprove={handleApprove} 
                    onReject={handleReject} 
                />
            )}
            <h2>Ваші друзі: {friends.length}</h2> {/* Додаємо кількість друзів */}
            <div className="friends-section">
                {friends.length > 0 ? (
                    friends.map((friend) => (
                        <UserCard
                            key={friend.userId}
                            uid={friend.userId}
                            firstName={friend.firstName}
                            lastName={friend.lastName}
                            profilePhoto={friend.profilePhoto}
                        />
                    ))
                ) : (
                    <p>У вас немає друзів</p>
                )}
            </div>
        </div>
    );
};

export default FriendsList;
