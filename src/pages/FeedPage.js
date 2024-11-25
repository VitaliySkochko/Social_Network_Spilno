import React from 'react';
import CommunitiesPage from './comunities/CommunitiesPage';
import Header from './Header';
import Sibedar from './Sibedar'
import Footer from './Footer'

const FeedPage = () => {
    return (
        <div className='feed-page'>
            <Header/>
            <div className='content'>
                <Sibedar/>
                <CommunitiesPage/>
            </div>
            <Footer/>
        </div>
    );
};

export default FeedPage;