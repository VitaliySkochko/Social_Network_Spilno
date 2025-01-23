//Заявка у друзі

import React from 'react';
import UserCard from '../../components/UserCard';
import '../../styles/JoinRequests.css'

const FriendRequests = ({ requests, users, onApprove, onReject }) => {
    return (
        <div className="join-requests">
            <h2>Заявки у друзі</h2>
            {requests.length > 0 ? (
                requests.map((request) => (
                    <div key={request.userId} className="join-request">
                        {users[request.userId] && (
                            <UserCard
                                uid={request.userId}
                                firstName={users[request.userId].firstName}
                                lastName={users[request.userId].lastName}
                                profilePhoto={users[request.userId].profilePhoto}
                            />
                        )}
                        <div className="button-group-join-request">
                            <button onClick={() => onApprove(request.userId)} className="button-approve">
                                Підтвердити
                            </button>
                            <button onClick={() => onReject(request.userId)} className="button-delete">
                                Відхилити
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Немає заявок</p>
            )}
        </div>
    );
};

export default FriendRequests;
