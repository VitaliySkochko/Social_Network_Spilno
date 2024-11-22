// Компонент відповідає за відображення одного допису

import React, { useState } from 'react';
import { FaTrashAlt, FaCommentDots, FaThumbsUp, FaThumbsDown, FaHeart } from 'react-icons/fa';
import CommentSection from './CommentSection';
import "../../styles/CommunityPage.css";

const PostItem = ({ 
  post, 
  user, 
  handleDeletePost, 
  comments, 
  fetchComments, 
  handleAddComment, 
  newComment, 
  setNewComment, 
  handleDeleteComment, 
  isMember,
  handlePostReaction,
  handleCommentReaction 
}) => {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      fetchComments(post.id); // Завантаження коментарів при відкритті
    }
  };

  return (
    <li className="post-item">
      <div className="post-header">
        <small className="post-author">{post.author}</small>
        <small className="post-date">
          {post.createdAt instanceof Date
            ? post.createdAt.toLocaleString()
            : new Date(post.createdAt.seconds * 1000).toLocaleString()}
        </small>
        {user && user.uid === post.authorId && (
          <button 
            onClick={() => handleDeletePost(post.id)} 
            className="icon-button delete-post-button"
            title="Видалити допис"
          >
            <FaTrashAlt className="icon" />
          </button>
        )}
      </div>
      <p className="post-content">{post.content}</p>
      
      {/* Кнопка з іконкою для коментарів */}
      <button 
        onClick={toggleComments} 
        className="toggle-comments-button" 
        title={showComments ? "Сховати коментарі" : "Показати коментарі"}
      >
        <FaCommentDots className="icon" />
        <span>({comments[post.id]?.length || 0})</span>
      </button>

      <div className="post-actions">
  {/* Кнопка лайку */}
  <button
    className="like-button"
    onClick={() => handlePostReaction(post.id, 'likes')}
  >
    <FaThumbsUp className="icon" title="Подобається" />
    <span>{post.likes?.length || 0}</span> {/* Відображення кількості лайків */}
  </button>

  {/* Кнопка дизлайку */}
  <button
    className="dislike-button"
    onClick={() => handlePostReaction(post.id, 'dislikes')}
  >
    <FaThumbsDown className="icon" title="Не подобається" />
    <span>{post.dislikes?.length || 0}</span> {/* Відображення кількості дизлайків */}
  </button>

  {/* Кнопка сердечка */}
  <button
    className="heart-button"
    onClick={() => handlePostReaction(post.id, 'hearts')}
  >
    <FaHeart className="icon" title="Сердечко" />
    <span>{post.hearts?.length || 0}</span> {/* Відображення кількості сердечок */}
  </button>
</div>

      {showComments && (
        <CommentSection
          post={post}
          postId={post.id}
          comments={comments[post.id] || []}
          handleAddComment={handleAddComment}
          newComment={newComment}
          setNewComment={setNewComment}
          handleDeleteComment={handleDeleteComment}
          user={user}
          isMember={isMember}
          handleCommentReaction={handleCommentReaction}
        />
      )}
    </li>
  );
};

export default PostItem;







