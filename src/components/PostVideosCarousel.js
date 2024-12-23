//// Компонент для перегляду відео в постах більше одного(карусель відео) 

import React, { useState } from "react";
import '../styles/PostCarousel.css';

const PostVideosCarousel = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
    );
  };

  return (
    <div className="video-carousel">
      {videos.length > 1 && (
        <>
          <button onClick={prevVideo} className="carousel-button prev-button">
            &#8592;
          </button>
        </>
      )}
      
      <div className="video-container">
        <video
          key={currentIndex}
          src={videos[currentIndex]}
          controls
          className="carousel-video"
        ></video>
      </div>
      
      {videos.length > 1 && (
        <>
          <button onClick={nextVideo} className="carousel-button next-button">
            &#8594;
          </button>
        </>
      )}
    </div>
  );
};

export default PostVideosCarousel;
