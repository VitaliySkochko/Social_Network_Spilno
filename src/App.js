import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './Media.css';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/profile/ProfilePage';
import CommunityPage from './pages/comunities/CommunityPage';
import CreateCommunityPage from './pages/comunities/CreateCommunityPage';
import CommunityList from './pages/comunities/CommunityList';
import LoginPage from './pages/registration/LoginPage';
import SignupPage from './pages/registration/SignupPage';
import AuthRoute from './components/AuthRoute';
import MainLayout from './components/MainLayout';

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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/communities/:id" element={<CommunityPage />} />
            <Route path="/create-community" element={<CreateCommunityPage />} />
            <Route path="/communities" element={<CommunityList/>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
