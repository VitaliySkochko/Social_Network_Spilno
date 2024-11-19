// Компонент відповідає за відображення коментарів та форму для додавання нового коментаря

import React from 'react';
import CommentItem from './CommentItem';
import "../styles/CommunityPage.css";

const CommentSection = ({ 
  postId, 
  comments, 
  handleAddComment, 
  newComment, 
  setNewComment, 
  handleDeleteComment, 
  user, 
  isMember 
}) => {
  return (
    <div className="comments-section">
      {isMember && (
        <div className="add-comment-section">
          <textarea
            className="comment-textarea"
            placeholder="Ваш коментар..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={() => handleAddComment(postId)} className="add-comment-button">
            Додати коментар
          </button>
        </div>
      )}
      <ul className="comments-list">
        {comments.map((comment) => (
          <CommentItem 
            key={comment.id}
            comment={comment}
            handleDeleteComment={() => handleDeleteComment(postId, comment.id)}
            user={user}
          />
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;



