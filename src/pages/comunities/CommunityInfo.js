//Цей компонент відповідатиме за показ детальної інформації про спільноту.
import React from "react";
import '../../styles/CommunityInfo.css'

const CommunityInfo = ({ admins, createdAt, communityType }) => {
    const formatDate = (timestamp) => {
        if (!timestamp) return "Дата не вказана";
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const getCommunityFeature = (type) => {
        switch (type) {
            case "public":
                return "Усі користувачі можуть переглядати та приєднуватися до спільноти.";
            case "private":
                return "До спільноти можна потрапити лише після схвалення заявки.";
            case "blog":
                return "Лише адміністратори можуть створювати пости.";
            default:
                return "Невідомий тип спільноти.";
        }
    };

    return (
        <div className="community-info">
            <h3>Інформація про спільноту</h3>
            <p><strong>Адміністратори:</strong></p>
            <ul>
                {admins && admins.length > 0 ? (
                    admins.map((admin) => (
                        <li key={admin.uid}>
                            {admin.firstName} {admin.lastName}
                        </li>
                    ))
                ) : (
                    <p>Адміністраторів немає</p>
                )}
            </ul>
            <p><strong>Дата створення:</strong> {formatDate(createdAt)}</p>
            <p><strong>Тип спільноти: </strong> 
                {communityType === "public" 
                    ? "Публічна" 
                    : communityType === "private" 
                    ? "Приватна" 
                    : communityType === "blog" 
                    ? "Блог" 
                    : "Невідомий"}
            </p>
            <p><strong>Особливість:</strong> {getCommunityFeature(communityType)}</p>
        </div>
    );
};

export default CommunityInfo;

