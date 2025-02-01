import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/profile/ProfilePage';
import EditProfile from './pages/profile/EditProfile';
import CommunityPage from './pages/comunities/CommunityPage';
import CreateCommunityPage from './pages/comunities/CreateCommunityPage';
import CommunityList from './pages/comunities/CommunityList';
import LoginPage from './pages/registration/LoginPage';
import SignupPage from './pages/registration/SignupPage';
import AuthRoute from './components/AuthRoute';
import MainLayout from './components/MainLayout';
import AdminPanel from './pages/admin/AdminPanel';
import EditCommunityPage from './pages/admin/EditCommunityPage';
import SettingsPanel from './pages/admin/SettingsPanel'; 
import JoinRequests from './pages/admin/JoinRequests';
import UserList from './pages/users/UserList';
import FriendsList from './pages/users/FriendsList';
import MessagesPage from './pages/messages/MessagesPage';
import ChatWindow from './pages/messages/ChatWindow'; // Імпортуємо ChatWindow

function App() {
  return (
    <Router>
      <Routes>
        {/* Маршрути для анонімних користувачів */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Маршрути для зареєстрованих користувачів */}
        <Route element={<AuthRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<FeedPage />} />
            <Route path="/profile/:uid" element={<ProfilePage />} />       
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/communities/:id" element={<CommunityPage />} />
            <Route path="/create-community" element={<CreateCommunityPage />} />
            <Route path="/communities" element={<CommunityList />} />
            <Route path="/community/:id/admin" element={<AdminPanel />} />
            <Route path="/edit-community/:communityId" element={<EditCommunityPage />} />
            <Route path="/community/:id/settings" element={<SettingsPanel />} />
            <Route path="/community/:communityId/join-requests" element={<JoinRequests />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/friends" element={<FriendsList />} />
            <Route path="/messages" element={<MessagesPage />} /> {/* Сторінка зі списком чатів */}
            <Route path="/chat/:chatId" element={<ChatWindow />} /> {/* Маршрут для чату */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
