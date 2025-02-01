// FeedNews.js
import React, { useEffect, useState } from "react";
import { fetchPosts } from "../services/firebaseFeedService"; 
import { fetchUserData } from "../services/firebaseProfileService";
import { fetchComments } from "../services/firebaseComments";
import { fetchCommunityById } from "../services/firebaseCommunityService"; 
import { Link } from "react-router-dom";
import PostImagesCarousel from "../components/PostImagesCarousel";
import UserCard from "../components/UserCard";
import PostMenu from "../pages/posts/PostMenu";
import Reactions from "../components/Reactions";
import { FaCommentAlt } from "react-icons/fa";
import CommentSection from "./comments/CommentSection";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import Spinner from "../components/Spinner";
import PhotoModal from "../pages/modal/PhotoModal"; // Імпортуємо компонент для модального вікна для зображень
import "../styles/FeedNews.css";

const FeedNews = ({ userId }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null);
  const [user] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false); // Стан для модального вікна
  const [modalImage, setModalImage] = useState(null); // Стан для зображення в модальному вікні

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const popularPosts = await fetchPosts({
          limitCount: 10,
        });

        const postsWithDetails = await Promise.all(
          popularPosts.map(async (post) => {
            const authorProfile = await fetchUserData(post.userId);
            const comments = await fetchComments(post.id);

            let communityName = null;
            let communityType = null;
            if (post.communityId) {
              const communityData = await fetchCommunityById(post.communityId);
              communityType = communityData?.type;

              if (communityType !== "private") {
                communityName = communityData?.name || "Невідома спільнота";
              }
            }

            return {
              ...post,
              authorProfile,
              commentsCount: comments.length,
              communityName,
              communityId: post.communityId,
            };
          })
        );

        const sortedPosts = postsWithDetails
          .filter((post) => post.userId !== user?.uid && post.communityName !== null)
          .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

        setNews(sortedPosts);
      } catch (error) {
        console.error("Помилка при завантаженні стрічки новин:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [userId, user]);

  const toggleComments = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const openModal = (image) => {
    setModalImage(image); // Встановлюємо зображення для модального вікна
    setIsModalOpen(true); // Відкриваємо модальне вікно
  };

  const closeModal = () => {
    setIsModalOpen(false); // Закриваємо модальне вікно
    setModalImage(null); // Очищаємо зображення
  };

  if (loading) {
    return (
      <div className="feednews-container">
        <Spinner /> {/* Показуємо спінер під час завантаження */}
      </div>
    );
  }

  return (
    <div className="feednews-container">
      <h2>Стрічка новин</h2>
      {news.map((post) => (
        <div key={post.id} className="post">
          <div className="post-header-cont">
            <div className="post-author-date-news">
              {post.authorProfile ? (
                <UserCard
                  uid={post.userId}
                  profilePhoto={post.authorProfile.profilePhoto}
                  firstName={post.authorProfile.firstName}
                  lastName={post.authorProfile.lastName}
                />
              ) : (
                <p>Автор: Невідомий</p>
              )}
              <p className="post-date">
                {post.createdAt?.toDate().toLocaleDateString("uk-UA", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                {post.createdAt?.toDate().toLocaleTimeString("uk-UA", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </p>
              {post.communityName && (
                <p>
                  <strong>Спільнота:{" "}</strong>
                  <Link to={`/communities/${post.communityId}`} className="community-link-news">
                    {post.communityName}
                  </Link>
                </p>
              )}
              {(post.userId === user?.uid || user?.isAdmin) && (
                <PostMenu
                  postId={post.id}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  reloadPosts={() => {}}
                  existingContent={post.content}
                  existingImages={post.images || []}
                  existingVideo={post.video || ""}
                  isAdmin={user?.isAdmin}
                  userId={post.userId}
                  currentUser={user}
                />
              )}
            </div>
          </div>

          <p>{post.content}</p>

          {post.images && post.images.length > 0 && (
            <PostImagesCarousel images={post.images} openModal={openModal} />
          )}
          
          <Reactions postId={post.id} />

          <div className="button-icon-group">
            <div className="comments-icon" onClick={() => toggleComments(post.id)}>
              <FaCommentAlt title="Переглянути коментарі" />
              <span> {post.commentsCount} </span>
            </div>
          </div>

          {expandedPost === post.id && <CommentSection postId={post.id} isAdmin={user?.isAdmin} />}
        </div>
      ))}

      {/* Модальне вікно для зображень */}
      {isModalOpen && modalImage && (
        <PhotoModal imageSrc={modalImage} onClose={closeModal} />
      )}
    </div>
  );
};

export default FeedNews;
