//Компонент відповідає за форму для створення допису

import React from 'react';
import "../styles/CommunityPage.css";

const PostForm = ({ newPost, setNewPost, handlePostSubmit }) => (
  <form className="post-form" onSubmit={handlePostSubmit}>
    <textarea
      className="post-textarea"
      placeholder="Ваш допис..."
      rows={4}
      value={newPost}
      onChange={(e) => setNewPost(e.target.value)}
      required
    />
    <button className="post-button" type="submit">
      Опублікувати
    </button>
  </form>
);

export default PostForm;
