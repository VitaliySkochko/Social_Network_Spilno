// Компонент відповідає за відображення одного допису

import React from 'react';
import CommentSection from './CommentSection';
import "../styles/CommunityPage.css";

const PostItem = ({ post, user, handleDeletePost, comments, fetchComments, handleAddComment, newComment, setNewComment, handleDeleteComment, isMember }) => (
  <li className="post-item">
    <p className="post-content">{post.content}</p>
    <small className="post-author">{post.author}</small>
    <small className="post-date">
      {post.createdAt instanceof Date
        ? post.createdAt.toLocaleString()
        : new Date(post.createdAt.seconds * 1000).toLocaleString()}
    </small>
    {user && user.uid === post.authorId && (
      <button onClick={() => handleDeletePost(post.id)} className="delete-post-button">
        Видалити допис
      </button>
    )}
    <CommentSection
      postId={post.id}
      comments={comments[post.id] || []}
      fetchComments={fetchComments}
      handleAddComment={handleAddComment}
      newComment={newComment}
      setNewComment={setNewComment}
      handleDeleteComment={handleDeleteComment}
      user={user}
      isMember={isMember}
    />
  </li>
);

export default PostItem;




