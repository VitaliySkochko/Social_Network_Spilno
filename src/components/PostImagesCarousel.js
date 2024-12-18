// Компонент для перегляду зоюражень в постах більше одного(карусель зображень) 

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Основні стилі Swiper
import "swiper/css/navigation"; // Стилі для навігації
import "swiper/css/pagination"; // Стилі для пагінації
import { Navigation, Pagination } from "swiper/modules";

const PostImagesCarousel = ({ images }) => {
  return (
    <div className="post-images">
      {images.length === 1 ? (
        // Відображає одне зображення без каруселі
        <img src={images[0]} alt="Зображення" className="post-thumbnail" />
      ) : (
        // Використовує Swiper для кількох зображень
        <Swiper
          modules={[Navigation, Pagination]} // Підключення модулів
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="post-carousel"
        >
          {images.map((url, index) => (
            <SwiperSlide key={index}>
              <img src={url} alt={`Зображення ${index + 1}`} className="post-thumbnail" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default PostImagesCarousel;