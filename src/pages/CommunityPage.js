// Спільноти

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../services/firebase';
import { doc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, arrayUnion, arrayRemove, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import CommunityInfo from './CommunityInfo';
import PostForm from './PostForm';
import PostItem from './PostItem';
import "../styles/CommunityPage.css";

const CommunityPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [user] = useAuthState(auth);
  const [isMember, setIsMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchCommunity = async () => {
      const communityDoc = await getDoc(doc(db, "communities", id));
      if (communityDoc.exists()) {
        const communityData = communityDoc.data();
        setCommunity(communityData);
        setIsMember(communityData.members && communityData.members.includes(user?.uid));

        if (communityData.members) {
          const q = query(collection(db, 'users'), where('uid', 'in', communityData.members));
          const querySnapshot = await getDocs(q);
          const membersList = querySnapshot.docs.map((doc) => {
            const memberData = doc.data();
            return {
              uid: memberData.uid,
              displayName: `${memberData.firstName} ${memberData.lastName}` || "Анонім",
            };
          });
          setMembers(membersList);
        }
      }
    };

    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, `communities/${id}/posts`));
      const postsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsList);
    };

    fetchCommunity();
    fetchPosts();
  }, [id, user]);

  const handleJoinCommunity = async () => {
    if (!user) {
      alert("Будь ласка, увійдіть в акаунт, щоб приєднатися до спільноти.");
      return;
    }
    try {
      await updateDoc(doc(db, 'communities', id), {
        members: arrayUnion(user.uid),
      });
      setIsMember(true);
    } catch (error) {
      console.error("Помилка приєднання до спільноти:", error.message);
    }
  };

  const handleLeaveCommunity = async () => {
    if (!user) {
      alert("Будь ласка, увійдіть в акаунт, щоб вийти зі спільноти.");
      return;
    }
    try {
      await updateDoc(doc(db, 'communities', id), {
        members: arrayRemove(user.uid),
      });
      setIsMember(false);
    } catch (error) {
      console.error("Помилка виходу зі спільноти:", error.message);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Будь ласка, увійдіть, щоб створити допис.");
      return;
    }
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : { firstName: "Анонім", lastName: "" };
  
      const newPostData = {
        content: newPost,
        createdAt: new Date(),
        author: `${userData.firstName} ${userData.lastName}`,
        authorId: user.uid,
      };
      const postRef = await addDoc(collection(db, `communities/${id}/posts`), newPostData);
      setPosts([{ id: postRef.id, ...newPostData }, ...posts]);
      setNewPost("");
    } catch (error) {
      console.error("Помилка при створенні допису:", error.message);
    }
  };

  const fetchComments = async (postId) => {
    const commentsSnapshot = await getDocs(collection(db, `communities/${id}/posts/${postId}/comments`));
    const commentsList = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: commentsList,
    }));
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim() || !user) return;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : { firstName: "Анонім", lastName: "" };
  
      const commentData = {
        content: newComment,
        author: `${userData.firstName} ${userData.lastName}`,
        createdAt: new Date(),
        authorId: user.uid,
      };
      await addDoc(collection(db, `communities/${id}/posts/${postId}/comments`), commentData);
      fetchComments(postId);
      setNewComment("");
    } catch (error) {
      console.error("Помилка додавання коментаря: ", error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, `communities/${id}/posts/${postId}`));
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Помилка видалення допису:", error.message);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteDoc(doc(db, `communities/${id}/posts/${postId}/comments/${commentId}`));
      fetchComments(postId);
    } catch (error) {
      console.error("Помилка видалення коментаря:", error.message);
    }
  };

  return (
    <div className="community-page-spilno">
      {community && (
        <CommunityInfo
          community={community}
          members={members}
          isMember={isMember}
          handleJoinCommunity={handleJoinCommunity}
          handleLeaveCommunity={handleLeaveCommunity}
        />
      )}
      {isMember && (
        <PostForm
          newPost={newPost}
          setNewPost={setNewPost}
          handlePostSubmit={handlePostSubmit}
        />
      )}
      <ul className="posts-list">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            user={user}
            handleDeletePost={handleDeletePost}
            comments={comments}
            fetchComments={fetchComments}
            handleAddComment={handleAddComment}
            newComment={newComment}
            setNewComment={setNewComment}
            handleDeleteComment={handleDeleteComment}
            isMember={isMember}
          />
        ))}
      </ul>
    </div>
  );
};

export default CommunityPage;


