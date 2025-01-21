//Цей компонент завантажує та відображає список постів.

import React, { useState, useEffect, useCallback } from "react";
import { fetchPostsByCommunity, updatePost, deletePost } from "../../services/firebasePostService";
import PostImagesCarousel from "../../components/PostImagesCarousel";
import PostVideosCarousel from "../../components/PostVideosCarousel";
import UserCard from "../../components/UserCard";
import PostMenu from "./PostMenu";
import { fetchUserData } from "../../services/firebaseProfileService";
import { fetchComments } from "../../services/firebaseComments";
import Reactions from "../../components/Reactions";
import CommentSection from "../comments/CommentSection";
import { FaCommentAlt } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebase";
//import "../../styles/PostList.css"; 

const PostList = ({ communityId, isAdmin }) => {
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [user] = useAuthState(auth); // Отримуємо поточного користувача

  const loadPosts = useCallback(async () => {
    try {
      const fetchedPosts = await fetchPostsByCommunity(communityId);
      const postsWithDetails = await Promise.all(
        fetchedPosts.map(async (post) => {
          const authorProfile = await fetchUserData(post.userId);
          const comments = await fetchComments(post.id);
          return { ...post, authorProfile, commentsCount: comments.length };
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

              {/* Передача пропсу isAdmin */}
              {(post.userId === user?.uid || isAdmin) && (
                <PostMenu
                  postId={post.id}
                  onEdit={updatePost}
                  onDelete={deletePost}
                  reloadPosts={loadPosts} // Для оновлення списку
                  existingContent={post.content}
                  existingImages={post.images || []}
                  existingVideo={post.video || ""}
                  isAdmin={isAdmin} // Передача пропсу
                  userId={post.userId} // Додано userId
                  currentUser={user} // Додано currentUser
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

          {expandedPost === post.id && <CommentSection postId={post.id} isAdmin={isAdmin}/>}
        </div>
      ))}
    </div>
  );
};

export default PostList;
