// Компонент відповідає за відображення одного коментаря

import React from 'react';
import "../styles/CommunityPage.css";

const CommentItem = ({ comment, handleDeleteComment, user }) => (
  <li className="comment-item">
    <p className="comment-content">{comment.content}</p>
    <small className="comment-author">{comment.author}</small>
    {user && user.uid === comment.authorId && (
      <button onClick={handleDeleteComment} className="delete-comment-button">
        Видалити коментар
      </button>
    )}
  </li>
);

export default CommentItem;



