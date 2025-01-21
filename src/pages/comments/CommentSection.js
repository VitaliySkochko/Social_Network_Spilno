import React, { useState, useEffect } from 'react';
import { addComment, fetchComments, deleteComment, updateComment } from '../../services/firebaseComments';
import UserCard from '../../components/UserCard';
import CommentMenu from './CommentMenu'; // Імпортуємо CommentMenu
import { useAuthState } from 'react-firebase-hooks/auth'; // Імпортуємо хук для отримання користувача
import { auth } from '../../services/firebase'; // Перевірити коректний шлях до auth
import '../../styles/CommentSection.css';

const CommentSection = ({ postId, isAdmin }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [user] = useAuthState(auth); // Отримуємо поточного користувача

    useEffect(() => {
        const loadComments = async () => {
            const fetchedComments = await fetchComments(postId);
            setComments(fetchedComments);
        };
        loadComments();
    }, [postId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        await addComment(postId, newComment);
        setNewComment('');
        const updatedComments = await fetchComments(postId);
        setComments(updatedComments);
    };

    const handleDeleteComment = async (commentId) => {
        await deleteComment(commentId);
        const updatedComments = await fetchComments(postId);
        setComments(updatedComments);
    };

    const handleEditComment = async (commentId, newContent) => {
        await updateComment(commentId, { text: newContent });
        const updatedComments = await fetchComments(postId);
        setComments(updatedComments);
    };

    return (
        <div className="comment-section">
            <div className="comment-list">
                {comments.map((comment) => (
                    <div key={comment.id} className="comment-item-group">
                        <div className="comment-item">
                            <UserCard
                                uid={comment.authorId}
                                profilePhoto={comment.author?.profilePhoto || ''}
                                firstName={comment.author?.firstName || 'Невідомо'}
                                lastName={comment.author?.lastName || ''}
                            />
                            <span className="comment-date">
                                {comment.timestamp?.toDate
                                    ? new Date(comment.timestamp.toDate()).toLocaleDateString("uk-UA", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    }) + " " + new Date(comment.timestamp.toDate()).toLocaleTimeString("uk-UA", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })
                                    : 'Невідома дата'}
                            </span>
                            {(comment.authorId === user?.uid || isAdmin) && (
                                <CommentMenu
                                    commentId={comment.id}
                                    onEdit={handleEditComment}
                                    onDelete={handleDeleteComment}
                                    existingContent={comment.text}
                                    reloadComments={() => fetchComments(postId).then(setComments)}
                                    isAdmin={isAdmin} // Передаємо isAdmin
                                />
                            )}
                        </div>
                        <p>{comment.text}</p>
                    </div>
                ))}
            </div>
            <div className="comment-input">
                <input
                    className="title-input"
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Напишіть коментар..."
                />
                <button onClick={handleAddComment}>Додати</button>
            </div>
        </div>
    );
};



export default CommentSection;
