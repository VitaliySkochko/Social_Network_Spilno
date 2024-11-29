import React from 'react';
import '../styles/FeedNews.css'

const FeedNews = () => {

    const news = [
        { id:1, title:'Перша новина', content:'Це зміст першої новини'},
        { id:2, title:'Друга новина', content:'Це зміст Другої новини'},
    ]
    return (
        <div className='feednews-conteiner'>
            {news.map((item) => (
                <div key={item} className='news-item'>
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                </div>
            ))}
            
        </div>
    );
};

export default FeedNews;