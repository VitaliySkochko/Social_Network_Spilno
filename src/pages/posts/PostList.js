//Цей компонент завантажує та відображає список постів.

import React, { useState, useEffect, useCallback } from "react";
import { fetchPostsByCommunity } from "../../services/firebasePostService";
import PostImagesCarousel from "../../components/PostImagesCarousel"; // Імпортуйте карусель
import PostVideosCarousel from "../../components/PostVideosCarousel"; // Імпортуйте карусель для відео
import UserCard from "../../components/UserCard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import Reactions from "../../components/Reactions";

const PostList = ({ communityId }) => {
  const [posts, setPosts] = useState([]);

  const fetchUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Помилка завантаження профілю:", error);
      return null;
    }
  };

  const loadPosts = useCallback(async () => {
    try {
      const fetchedPosts = await fetchPostsByCommunity(communityId);
      const postsWithProfiles = await Promise.all(
        fetchedPosts.map(async (post) => {
          const authorProfile = await fetchUserProfile(post.userId);
          return { ...post, authorProfile };
        })
      );
      setPosts(postsWithProfiles);
    } catch (error) {
      console.error("Помилка завантаження постів:", error);
    }
  }, [communityId]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

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
        </div>
      ))}
    </div>
  );
};

export default PostList;
