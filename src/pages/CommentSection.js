// Компонент відповідає за відображення коментарів та форму для додавання нового коментаря

import React, { useEffect } from 'react';
import CommentItem from './CommentItem';
import "../styles/CommunityPage.css";

const CommentSection = ({ postId, comments, fetchComments, handleAddComment, newComment, setNewComment, handleDeleteComment, user, isMember }) => {
  useEffect(() => {
    fetchComments(postId);
  }, [postId, fetchComments]);

  return (
    <div className="comments-section">
      <h4>Коментарі:</h4>
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
    </div>
  );
};

export default CommentSection;


