//Пошук користувачів

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import UserCard from '../../components/UserCard';
import '../../styles/UserList.css';
import CommunitySearch from '../comunities/CommunitySearch';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersData = querySnapshot.docs.map((doc) => doc.data());
                setUsers(usersData);
                setFilteredUsers(usersData); // Ініціалізуємо відфільтрованих користувачів
                setTotalUsers(usersData.length); // Встановлюємо загальну кількість
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (searchTerm) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = users.filter(
            (user) =>
                user.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
                (user.lastName && user.lastName.toLowerCase().includes(lowerCaseSearchTerm))
        );
        setFilteredUsers(filtered);
    };

    return (
        <div className="user-list-container">
            
            <h2>Користувачі</h2>
            <div className='user-list-count-search'>
            <div className="user-count">
               <p><strong>Загальна кількість користувачів:</strong> {totalUsers}</p>
            </div>
            <CommunitySearch onSearch={handleSearch} />
            </div>
            <div className="user-list">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <UserCard
                            key={user.uid}
                            uid={user.uid}
                            profilePhoto={user.profilePhoto || null}
                            firstName={user.firstName}
                            lastName={user.lastName}
                        />
                    ))
                ) : (
                    <p>Користувачів не знайдено</p>
                )}
            </div>
        </div>
    );
};

export default UserList;
