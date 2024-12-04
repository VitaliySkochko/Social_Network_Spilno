import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css'

const Sibedar = () => {
    return (
        <aside className="sidebar">
          <Link to="/">Головна</Link>
          <Link to="/profile">Профіль</Link>
          <Link to="/create-community">Створити спільноту</Link>
          <Link to="/communities">Спільноти</Link>         
        </aside>
      );
};

export default Sibedar;