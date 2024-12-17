// Загальна кількість спільнот

import React from 'react';

const CommunityCount = ({ count }) => {
    return (
        <div className="community-count">
            <p><strong>Загальна кількість спільнот:</strong> {count}</p>
        </div>
    );
};

export default CommunityCount;
