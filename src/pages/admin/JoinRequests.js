import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchJoinRequests, approveJoinRequest, rejectJoinRequest } from "../../services/firebaseCommunityService";
import { fetchUserData } from "../../services/firebaseProfileService"; // Для отримання даних користувача
import UserCard from "../../components/UserCard";
import '../../styles/JoinRequests.css'

const JoinRequests = () => {
    const { communityId } = useParams(); // Отримуємо communityId з URL
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState({}); // Стан для зберігання даних про користувачів

    useEffect(() => {
        const loadRequests = async () => {
            if (!communityId) return; // Захист від undefined

            const fetchedRequests = await fetchJoinRequests(communityId);
            setRequests(fetchedRequests);

            // Завантажуємо дані про користувачів для кожної заявки
            const usersData = {};
            for (const request of fetchedRequests) {
                const userDetails = await fetchUserData(request.userId); // Отримуємо дані користувача
                if (userDetails) {
                    usersData[request.userId] = userDetails; // Зберігаємо дані
                }
            }
            setUsers(usersData); // Оновлюємо стан з даними користувачів
        };

        loadRequests();
    }, [communityId]);

    const handleApprove = async (userId) => {
        await approveJoinRequest(communityId, userId);
        setRequests((prev) => prev.filter((request) => request.userId !== userId));
    };

    const handleReject = async (userId) => {
        await rejectJoinRequest(communityId, userId);
        setRequests((prev) => prev.filter((request) => request.userId !== userId));
    };

    return (
        <div className="join-requests">
            <h3>Заявки на участь</h3>
            {requests.length > 0 ? (
                requests.map((request, index) => (
                    <div key={index} className="join-request">
                        {users[request.userId] && (
                            <UserCard
                                uid={request.userId}
                                profilePhoto={users[request.userId].profilePhoto} 
                                firstName={users[request.userId].firstName} 
                                lastName={users[request.userId].lastName} 
                            />
                        )}
                        <div className="button-group-join-request">
                        <button onClick={() => handleApprove(request.userId)} className="button-approve">Підтвердити</button>
                        <button onClick={() => handleReject(request.userId)} className="button-delete">Відхилити</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Немає заявок</p>
            )}
        </div>
    );
};

export default JoinRequests; 

