// Компонент додавання реакцій та лайків

import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../services/firebase";
import '../styles/Reactions.css'

const Reactions = ({ postId }) => {
    const [reactions, setReactions] = useState({
        like: 0,
        dislike: 0,
        love: 0,
        laugh: 0,
        surprised: 0,
        angry: 0,
    });
    const [selectedReaction, setSelectedReaction] = useState(null);
    const [user] = useAuthState(auth);

    const emojiMap = {
        like: "👍",
        dislike: "👎",
        love: "❤️",
        laugh: "😂",
        surprised: "😮",
        angry: "😡",
    };

    useEffect(() => {
        if (!postId) return;

        const fetchReactions = async () => {
            try {
                const postRef = doc(db, "communityPosts", postId);
                const postDoc = await getDoc(postRef);

                if (postDoc.exists()) {
                    const likes = postDoc.data().likes || {};
                    const counts = Object.keys(likes).reduce((acc, key) => {
                        acc[key] = likes[key]?.length || 0;
                        return acc;
                    }, {});
                    setReactions(counts);

                    // Перевіряємо, чи користувач вже залишив реакцію
                    Object.entries(likes).forEach(([reaction, users]) => {
                        if (users.includes(user?.uid)) {
                            setSelectedReaction(reaction);
                        }
                    });
                }
            } catch (error) {
                console.error("Помилка завантаження реакцій:", error);
            }
        };

        fetchReactions();
    }, [postId, user]);

    const handleReaction = async (reaction) => {
        if (!user) return;

        const postRef = doc(db, "communityPosts", postId);

        try {
            let newReactions = { ...reactions };

            if (selectedReaction === reaction) {
                // Видалити реакцію
                await updateDoc(postRef, {
                    [`likes.${reaction}`]: arrayRemove(user.uid),
                });
                newReactions[reaction] = Math.max(0, newReactions[reaction] - 1);
                setSelectedReaction(null);
            } else {
                // Видалити попередню реакцію, якщо є
                if (selectedReaction) {
                    await updateDoc(postRef, {
                        [`likes.${selectedReaction}`]: arrayRemove(user.uid),
                    });
                    newReactions[selectedReaction] = Math.max(0, newReactions[selectedReaction] - 1);
                }

                // Додати нову реакцію
                await updateDoc(postRef, {
                    [`likes.${reaction}`]: arrayUnion(user.uid),
                });
                newReactions[reaction] += 1;
                setSelectedReaction(reaction);
            }

            // Оновити локальний стан після успішного оновлення в Firebase
            setReactions(newReactions);
        } catch (error) {
            console.error("Помилка оновлення реакцій:", error);
        }
    };

    return (
        <div className="reactions-container">
            {Object.entries(emojiMap).map(([reaction, emoji]) => (
                <button
                    key={reaction}
                    onClick={() => handleReaction(reaction)}
                    className={`reaction-button ${selectedReaction === reaction ? "selected" : ""}`}
                >
                    {emoji} {reactions[reaction]}
                </button>
            ))}
        </div>
    );
};

export default Reactions;
