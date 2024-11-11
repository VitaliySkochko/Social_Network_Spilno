// Спільноти

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../services/firebase';
import { doc, getDoc, collection, addDoc, getDocs, updateDoc, arrayUnion, arrayRemove, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import "../styles/CommunityPage.css";

const CommunityPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [user] = useAuthState(auth);
  const [isMember, setIsMember] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchCommunity = async () => {
      const communityDoc = await getDoc(doc(db, "communities", id));
      if (communityDoc.exists()) {
        const communityData = communityDoc.data();
        setCommunity(communityData);
        setIsMember(communityData.members && communityData.members.includes(user?.uid));

        // Завантаження інформації про учасників
        if (communityData.members) {
          const q = query(collection(db, 'users'), where('uid', 'in', communityData.members));
          const querySnapshot = await getDocs(q);
          const membersList = querySnapshot.docs.map((doc) => {
            const memberData = doc.data();
            return {
              uid: memberData.uid,
              displayName: `${memberData.firstName} ${memberData.lastName}` || "Анонім", // Додаємо обробку імені та прізвища
            };
          });
          setMembers(membersList);
        }
      }
    };

    const fetchPosts = async () => {
      const querySnapshot = await getDocs(
        collection(db, `communities/${id}/posts`)
      );
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
    try {
      const newPostData = {
        content: newPost,
        createdAt: new Date(),
        author: user.displayName,
      };
      await addDoc(collection(db, `communities/${id}/posts`), newPostData);
      setPosts([newPostData, ...posts]);
      setNewPost("");
    } catch (error) {
      console.error("Помилка при створенні допису:", error.message);
    }
  };

  return (
    <div className="community-page">
      {community && (
        <div className="community-info">
          <h2 className="community-name">{community.name}</h2>
          <p className="community-description">{community.description}</p>
          <h3 className="members-title">Учасники спільноти:</h3>
          <ul className="members-list">
            {members.map((member) => (
              <li key={member.uid} className="member-item">
                {member.displayName}
              </li>
            ))}
          </ul>
          {!isMember ? (
            <button onClick={handleJoinCommunity} className="join-community-button">
              Приєднатися
            </button>
          ) : (
            <>
              <p className="community-member-message">Ви учасник цієї спільноти</p>
              <button onClick={handleLeaveCommunity} className="leave-community-button">
                Вийти зі спільноти
              </button>
            </>
          )}
        </div>
      )}
      {isMember && (
        <>
          <h3 className="post-form-title">Дописати</h3>
          <form className="post-form" onSubmit={handlePostSubmit}>
            <textarea
              className="post-textarea"
              placeholder="Ваш допис..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <button className="post-button" type="submit">
              Опублікувати
            </button>
          </form>
        </>
      )}
      <h3 className="posts-title">Дописів:</h3>
      <ul className="posts-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <p className="post-content">{post.content}</p>
            <small className="post-date">
              {post.createdAt instanceof Date
                ? post.createdAt.toLocaleString() 
                : new Date(post.createdAt.seconds * 1000).toLocaleString()} 
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityPage;


