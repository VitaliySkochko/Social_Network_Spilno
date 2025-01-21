import React, { useEffect, useState } from "react";
import { fetchUserSubscriptions, fetchPostsByCriteria } from "../services/firebaseFeedService";
import { fetchUserData } from "../services/firebaseProfileService";
import { fetchComments } from "../services/firebaseComments";
import { fetchCommunityById } from "../services/firebaseCommunityService"; // Додано
import { Link } from "react-router-dom"; // Додано
import PostImagesCarousel from "../components/PostImagesCarousel";
import PostVideosCarousel from "../components/PostVideosCarousel";
import UserCard from "../components/UserCard";
import PostMenu from "../pages/posts/PostMenu";
import Reactions from "../components/Reactions";
import { FaCommentAlt } from "react-icons/fa";
import CommentSection from "./comments/CommentSection";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import Spinner from "../components/Spinner";
import "../styles/FeedNews.css";

const FeedNews = ({ userId }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const subscriptions = await fetchUserSubscriptions(userId);
        const subscriptionPosts = await fetchPostsByCriteria({
          subscriptions,
          limitCount: 10,
        });

        const popularPosts = await fetchPostsByCriteria({
          subscriptions: [],
          limitCount: 10,
          minLikes: 50,
        });

        const allPosts = [...subscriptionPosts, ...popularPosts];

        const postsWithDetails = await Promise.all(
          allPosts.map(async (post) => {
            const authorProfile = await fetchUserData(post.userId);
            const comments = await fetchComments(post.id);

            // Отримання інформації про спільноту
            let communityName = null;
            if (post.communityId) {
              const communityData = await fetchCommunityById(post.communityId);
              communityName = communityData?.name || "Невідома спільнота";
            }

            return {
              ...post,
              authorProfile,
              commentsCount: comments.length,
              communityName, // Додано
              communityId: post.communityId, // Зберігаємо communityId
            };
          })
        );

        const sortedPosts = postsWithDetails
          .filter((post) => post.userId !== user?.uid) // Виключення постів поточного користувача
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
          <div className="post-header">
            <div className="post-author-date">
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
          {post.images && post.images.length > 0 && <PostImagesCarousel images={post.images} />}
          {post.videos && post.videos.length > 0 && <PostVideosCarousel videos={post.videos} />}

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
    </div>
  );
};

export default FeedNews;

