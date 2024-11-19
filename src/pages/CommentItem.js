// Компонент відповідає за відображення одного коментаря

import React from 'react';
import { FaTrashAlt, FaThumbsUp, FaThumbsDown, FaHeart } from 'react-icons/fa';
import "../styles/CommunityPage.css";

const CommentItem = ({ comment, handleDeleteComment, user }) => (
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
  </li>
);

export default CommentItem;





