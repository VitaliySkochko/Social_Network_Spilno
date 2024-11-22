// Компонент відповідає за відображення одного коментаря

import React from 'react';
import { FaTrashAlt, FaThumbsUp, FaThumbsDown, FaHeart } from 'react-icons/fa';
import "../../styles/CommunityPage.css";

const CommentItem = ({ comment, handleDeleteComment, user, handleCommentReaction, postId }) => (
  <li className="comment-item">
    <div className="comment-header">
      <small className="comment-author">
        {comment.author} | {new Date(comment.createdAt.seconds * 1000).toLocaleString()}
      </small>
      {user && user.uid === comment.authorId && (
        <button onClick={handleDeleteComment} className="delete-comment-button" title="Видалити коментар">
          <FaTrashAlt className="icon" />
        </button>
      )}
    </div>
    <p className="comment-content">{comment.content}</p>

    {/* Секція лайків для коментарів */}
    <div className="comment-actions">
      <button 
      onClick={() => handleCommentReaction(postId, comment.id, "likes")}
      className="like-button">
        <FaThumbsUp className="icon" title='Подобається'/>
        <span>{comment.likes?.length || 0}</span> {/* Відображення кількості лайків */}
      </button>
      <button 
      onClick={() => handleCommentReaction(postId, comment.id, "dislikes")}
      className="dislike-button">
        <FaThumbsDown className="icon" title='Не подобається'/>
        <span>{comment.dislikes?.length || 0}</span> {/* Відображення кількості дизлайків */}
      </button>
      <button 
      onClick={() => handleCommentReaction(postId, comment.id, "hearts")}
      className="heart-button">
        <FaHeart className="icon" title='Сердечко'/> 
        <span>{comment.hearts?.length || 0}</span> {/* Відображення кількості сердечок */}
      </button>
    </div>
  </li>
);

export default CommentItem; 





