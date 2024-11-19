// Компонент відповідає за відображення одного допису

import React, { useState } from 'react';
import { FaTrashAlt, FaCommentDots, FaThumbsUp, FaThumbsDown, FaHeart } from 'react-icons/fa';
import CommentSection from './CommentSection';
import "../styles/CommunityPage.css";

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
  isMember 
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

      {/* Секція лайків для посту */}
      <div className="post-actions">
        <button className="like-button">
          <FaThumbsUp className="icon" title='Подобається'/>
        </button>
        <button className="dislike-button">
          <FaThumbsDown className="icon" title='Не подобається'/>
        </button>
        <button className="heart-button">
          <FaHeart className="icon" title='Сердечко'/>
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post.id}
          comments={comments[post.id] || []}
          handleAddComment={handleAddComment}
          newComment={newComment}
          setNewComment={setNewComment}
          handleDeleteComment={handleDeleteComment}
          user={user}
          isMember={isMember}
        />
      )}
    </li>
  );
};

export default PostItem;







