import React, { useState } from 'react';
import CreatePost from './CreatePost';
import PostList from './PostList';
import '../../styles/CommunityPosts.css';

const CommunityPosts = ({ communityId }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshPosts = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    return (
        <div className="community-posts-conteiner">
            <CreatePost communityId={communityId} onPostCreated={refreshPosts} />
            <PostList communityId={communityId} key={refreshKey} />
        </div>
    );
};

export default CommunityPosts;
