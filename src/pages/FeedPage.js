import React from 'react';
import Header from './Header';
import Sibedar from './Sidebar';
import FeedNews from './FeedNews';
import Footer from './Footer';
import '../styles/FeedPage.css'

const FeedPage = () => {
    return (
        <div className='feed-page'>
            <Header/>
            <div className='content'>
                <Sibedar/>
                <FeedNews/>
            </div>
            <Footer/>
        </div>
    );
};

export default FeedPage;