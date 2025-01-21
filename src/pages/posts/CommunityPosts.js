// Створення поста

import React, { useState } from 'react'; 
import CreatePost from './CreatePost';
import PostList from './PostList';
import '../../styles/CommunityPosts.css';

const CommunityPosts = ({ communityId, isMember, isAdmin, communityType }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshPosts = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    return (
        <div className="community-posts-conteiner">
            {(communityType === 'blog' || isMember || isAdmin) ? (
                <CreatePost communityId={communityId} onPostCreated={refreshPosts} />
            ) : (
                <p className="community-type-description">
                    <strong>Повідомлення для Вас:</strong> Тільки учасники можуть створювати пости в цій спільноті.
                </p>
            )}
            <PostList communityId={communityId} key={refreshKey} isAdmin={isAdmin} />
        </div>
    );
};

export default CommunityPosts;

