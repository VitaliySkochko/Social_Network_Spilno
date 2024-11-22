// Спільноти

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../../services/firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  arrayUnion, 
  arrayRemove, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import CommunityInfo from './CommunityInfo';
import PostForm from './PostForm';
import PostItem from './PostItem';
import "../../styles/CommunityPage.css";

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
    //Завантажує дані про спільноту з Firestore. Оновлює стан community, isMember, members
    const fetchCommunityData = async () => { 
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

    //Завантажує всі пости з поточної спільноти. Оновлює стан posts. Завантажує коментарі для кожного посту (fetchComments).
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, `communities/${id}/posts`));
      const postsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsList);
  
      // Запит коментарів для кожного поста
      postsList.forEach((post) => {
        fetchComments(post.id);
      });
    };
  
    fetchCommunityData();
    fetchPosts();
  }, [id, user]);


  // Додає користувача до списку учасників спільноти (members).
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

  // Видаляє користувача зі списку учасників спільноти.
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

  //Додає новий пост до спільноти. Зберігає дані про пост у Firestore і оновлює локальний стан posts.
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

  //Завантажує коментарі для певного посту. Оновлює стан comments.
  const fetchComments = async (postId) => {
    const commentsSnapshot = await getDocs(
      query(
        collection(db, `communities/${id}/posts/${postId}/comments`),
        orderBy('createdAt', 'desc') // Сортування коментарів за спаданням
      )
    );
  
    const commentsList = commentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: commentsList,
    }));
  };


  //Додає новий коментар до певного посту. Зберігає коментар у Firestore і оновлює стан.
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

  //Видаляє пост із Firestore і оновлює стан posts.
  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, `communities/${id}/posts/${postId}`));
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Помилка видалення допису:", error.message);
    }
  };

  //Видаляє коментар із Firestore і оновлює стан comments.
  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteDoc(doc(db, `communities/${id}/posts/${postId}/comments/${commentId}`));
      fetchComments(postId);
    } catch (error) {
      console.error("Помилка видалення коментаря:", error.message);
    }
  };
  
  //Додає/змінює реакцію (лайк/дизлайк/серце) для посту.
  const handlePostReaction = async (postId, reactionType) => {
    if (!user) {
      alert("Будь ласка, увійдіть, щоб взаємодіяти з постами.");
      return;
    }
  
    try {
      const postRef = doc(db, `communities/${id}/posts`, postId);
      const postDoc = await getDoc(postRef);
  
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const userReactions = {
          likes: postData.likes || [],
          dislikes: postData.dislikes || [],
          hearts: postData.hearts || [],
        };
  
        // Перевірити, чи є поточна реакція
        const currentReaction = Object.keys(userReactions).find((key) =>
          userReactions[key].includes(user.uid)
        );
  
        // Оновлення Firestore
        const updates = {};
  
        // Якщо вже є реакція і вона така ж, видаляємо її
        if (currentReaction === reactionType) {
          updates[reactionType] = arrayRemove(user.uid);
        } else {
          // Видалити попередню реакцію, якщо вона є
          if (currentReaction) {
            updates[currentReaction] = arrayRemove(user.uid);
          }
          // Додати нову реакцію
          updates[reactionType] = arrayUnion(user.uid);
        }
  
        await updateDoc(postRef, updates);
  
        // Оптимістичне оновлення стану
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes:
                    reactionType === "likes" && currentReaction !== "likes"
                      ? [...(post.likes || []), user.uid]
                      : post.likes?.filter((uid) => uid !== user.uid),
                  dislikes:
                    reactionType === "dislikes" && currentReaction !== "dislikes"
                      ? [...(post.dislikes || []), user.uid]
                      : post.dislikes?.filter((uid) => uid !== user.uid),
                  hearts:
                    reactionType === "hearts" && currentReaction !== "hearts"
                      ? [...(post.hearts || []), user.uid]
                      : post.hearts?.filter((uid) => uid !== user.uid),
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Помилка взаємодії з постом:", error.message);
    }
  };

  const handleCommentReaction = async (postId, commentId, reactionType) => {
    if (!user) {
      alert("Будь ласка, увійдіть, щоб взаємодіяти з коментарями.");
      return;
    }
  
    try {
      const commentRef = doc(db, `communities/${id}/posts/${postId}/comments`, commentId);
      const commentDoc = await getDoc(commentRef);
  
      if (commentDoc.exists()) {
        const commentData = commentDoc.data();
        const userReactions = {
          likes: commentData.likes || [],
          dislikes: commentData.dislikes || [],
          hearts: commentData.hearts || [],
        };
  
        // Перевірити поточну реакцію користувача
        const currentReaction = Object.keys(userReactions).find((key) =>
          userReactions[key].includes(user.uid)
        );
  
        // Формуємо оновлення для Firestore
        const updates = {};
  
        // Видаляємо поточну реакцію, якщо вона збігається
        if (currentReaction === reactionType) {
          updates[reactionType] = arrayRemove(user.uid);
        } else {
          // Видаляємо попередню реакцію
          if (currentReaction) {
            updates[currentReaction] = arrayRemove(user.uid);
          }
          // Додаємо нову реакцію
          updates[reactionType] = arrayUnion(user.uid);
        }
  
        await updateDoc(commentRef, updates);
  
        // Оновлення стану для коментарів
        fetchComments(postId);
      }
    } catch (error) {
      console.error("Помилка взаємодії з коментарем:", error.message);
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
            handlePostReaction={handlePostReaction}
            handleCommentReaction={handleCommentReaction}
          />
        ))}
      </ul>
    </div>
  );
};

export default CommunityPage;



