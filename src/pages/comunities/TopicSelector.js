import React, { useState } from "react";
import "../../styles/TopicSelector.css"; 

const TopicSelector = ({ onTopicsChange }) => {
  const availableTopics = [
    "Спорт", "Футбол", "Баскетбол", "Теніс", "Бокс", "Хокей", "Формула-1", "ММА", "Йога", "Екстремальні види спорту", "Програмування",
    "Технології", "Мобільні технології","Штучний інтелект", "Кібербезпека","Веб-розробка", "Робототехніка","Веб-дизайн", 
    "Віртуальна реальність", "Ігрові технології", "Мистецтво", "Живопис", "Скульптура", "Фотографія", "Музика", "Поп-музика", "Класична музика",
    "Рок-музика", "Джаз", "Електронна музика","Подорожі", "Підводний світ","Сафарі", "Круїзи",
    "Кулінарія", "Рецепти", "Веганські страви", "Молекулярна кухня", "Національні кухні", "Здоров'я", "Фітнес", "Дієти та харчування", "Медитація",
    "Альтернативна медицина", "Кіно", "Комедії", "Драми", "Фантастика", "Документальне кіно", "Короткометражки", "Книги", "Фантастика",
    "Детективи", "Історичні романи", "Поезія", "Наука", "Космос", "Біотехнології", "Генетика", "Екологія", "Фізика", "Хімія", "Астрономія",
    "Політика", "Світова політика","Дипломатія", "Соціальна політика", "Бізнес", "Маркетинг", "Підприємництво", "Фінанси",
    "Інвестиції", "Стратегії росту", "Мода", "Тренди", "Взуття та аксесуари", "Етична мода", "Історія", "Антична історія", "Середньовіччя",
    "Друга світова війна", "Ренесанс", "Культура корінних народів", "Відеоігри", "Шутери", "Рольові ігри", "Стратегії", "Карткові ігри", "Меми",
    "Освіта", "Самоосвіта", "Онлайн-курси", "Викладання", "Дитячий розвиток","Криптовалюти", "Біткоїн", "Ефіріум", 
    "NFT", "Майнінг", "Крипто-новини", "Аналіз криптовалют","Ставки", "Спортивні ставки", "Казино", "Онлайн-ставки", "Покер", "Блекджек", 
    "Рулетка", "Ігри на гроші", "Тоталізатор", "Фінансові ставки","Блогінг", "SEO", "Контент-маркетинг", "СММ", "Написання статей", "Репортажі", 
    "YouTube", "Instagram", "TikTok","Платформи для блогів", "Монетизація блогів",
    "Підвищення трафіку", "Аналіз аудиторії", "Реклама в блозі", "Стратегії контенту","Написання книг", 
    "Мотивація для блогерів","Блогери", "Розвиток особистого бренду", "Копірайтинг","Інтерв'ю з блогерами",
    "Фриланс", "Дистанційна робота", "Кар'єра в блогінгу"
    
  ];

  const [selectedTopics, setSelectedTopics] = useState([]);

  const handleTopicToggle = (topic) => {
    const updatedTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter((t) => t !== topic) // Видаляємо тему, якщо вона вже вибрана
      : [...selectedTopics, topic]; // Додаємо нову тему

    setSelectedTopics(updatedTopics);
    onTopicsChange(updatedTopics); // Повідомляємо батьківський компонент про зміни
  };

  return (
    <div className="topic-selector">
      <h3>Оберіть теми</h3>
      <div className="topic-selector-description">
      <p className="community-type-description">
         Оберіть теми, щоб ваша спільнота була легше знайдена іншими користувачами за їх інтересами.
      </p>
      </div>
      <ul className="topics-list">
        {availableTopics.map((topic) => (
          <li key={topic} className="topic-item">
            <label>
              <input
                type="checkbox"
                checked={selectedTopics.includes(topic)}
                onChange={() => handleTopicToggle(topic)}
              />
              {topic}
            </label>
          </li>
        ))}
      </ul>
      <div className="selected-topics">
        <h4>Вибрані теми:</h4>
        {selectedTopics.length > 0 ? (
          <ul>
            {selectedTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        ) : (
          <p>Немає вибраних тем</p>
        )}
      </div>
    </div>
  );
};

export default TopicSelector;
