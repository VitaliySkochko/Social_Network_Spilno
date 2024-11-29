import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ProfilePage from './pages/profile/ProfilePage';
import CommunityPage from './pages/comunities/CommunityPage';
import FeedPage from './pages/FeedPage';
import LoginPage from './pages/registration/LoginPage';
import SignupPage from './pages/registration/SignupPage';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import CreateCommunityPage from './pages/comunities/CreateCommunityPage';
import CommunitiesPage from './pages/comunities/CommunitiesPage';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/community/:id" element={<CommunityPage />} />
            <Route path="/create-community" element={<PrivateRoute><CreateCommunityPage /></PrivateRoute>} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;