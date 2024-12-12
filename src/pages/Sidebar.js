import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css'


const Sibedar = () => {
    return (
        <aside className="sidebar">
          <Link to="/" className='button-menu'>Головна</Link>
          <Link to="/profile" className='button-menu'>Профіль</Link>
          <Link to="/create-community" className='button-menu'>Створити спільноту</Link>
          <Link to="/communities" className='button-menu'>Спільноти</Link>         
        </aside>
      );
};

export default Sibedar;