//Цей компонент завантажує та відображає список постів.

import React, { useState, useEffect, useCallback } from "react";
import { fetchPostsByCommunity } from "../../services/firebasePostService";
import PostImagesCarousel from "../../components/PostImagesCarousel"; // Імпортуйте карусель
import PostVideosCarousel from "../../components/PostVideosCarousel"; // Імпортуйте карусель для відео
import UserCard from "../../components/UserCard";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import Reactions from "../../components/Reactions";
import CommentSection from "../comments/CommentSection"; // Імпортуйте компонент для коментарів
import { FaCommentAlt } from "react-icons/fa"; // Імпортуйте іконку

const PostList = ({ communityId }) => {
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null); // Додаємо стан для розгорнутого посту

  const fetchUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Помилка завантаження профілю:", error);
      return null;
    }
  };

  const fetchCommentsCount = async (postId) => {
    try {
      // Пошук коментарів у колекції comments, що мають постId, який відповідає посту
      const commentsRef = collection(db, "comments");
      const q = query(commentsRef, where("postId", "==", postId));
      const commentsSnapshot = await getDocs(q);
      return commentsSnapshot.size; // Повертаємо кількість коментарів
    } catch (error) {
      console.error("Помилка завантаження коментарів:", error);
      return 0;
    }
  };

  const loadPosts = useCallback(async () => {
    try {
      const fetchedPosts = await fetchPostsByCommunity(communityId);
      const postsWithDetails = await Promise.all(
        fetchedPosts.map(async (post) => {
          const authorProfile = await fetchUserProfile(post.userId);
          const commentsCount = await fetchCommentsCount(post.id);
          return { ...post, authorProfile, commentsCount }; // Додаємо кількість коментарів до кожного поста
        })
      );
      setPosts(postsWithDetails);
    } catch (error) {
      console.error("Помилка завантаження постів:", error);
    }
  }, [communityId]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const toggleComments = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <div className="posts-list-container">
      {posts.map((post) => (
        <div key={post.id} className="post">
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
          </div>
          <p>{post.content}</p>

          {/* Відображення зображень через карусель */}
          {post.images && post.images.length > 0 && (
            <PostImagesCarousel images={post.images} />
          )}

          {/* Відображення відео через карусель */}
          {post.videos && post.videos.length > 0 && (
            <PostVideosCarousel videos={post.videos} />
          )}

          <Reactions postId={post.id} />

          {/* Іконка коментарів */}
          <div className="button-icon-group">
            <div className="comments-icon" onClick={() => toggleComments(post.id)}>
              <FaCommentAlt title="Переглянути коментарі" />
              <span> {post.commentsCount} </span>
            </div>
          </div>

          {/* Секція коментарів */}
          {expandedPost === post.id && <CommentSection postId={post.id} />}
        </div>
      ))}
    </div>
  );
};

export default PostList;
