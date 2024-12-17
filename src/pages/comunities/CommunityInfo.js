//Цей компонент відповідатиме за показ детальної інформації про спільноту.
import React from "react";

const CommunityInfo = ({ admin, createdAt }) => {
    const formatDate = (timestamp) => {
        if (!timestamp) return "Дата не вказана";
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="community-info">
            <h3>Інформація про спільноту</h3>
            <p><strong>Адміністратор:</strong> {admin?.firstName} {admin?.lastName}</p>
            <p><strong>Дата створення:</strong> {formatDate(createdAt)}</p>
        </div>
    );
};

export default CommunityInfo;

