// поля для редагування соціальних мереж і контактів

const SocialMediaSection = ({ formData, setFormData }) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    return (
      <div className="edit-profile-container">
        <h3>Соціальні мережі</h3>
        
        <label>
        Facebook
        <input
          className="title-input"
          type="text"
          name="facebook"
          value={formData.facebook}
          onChange={handleChange}
        />
      </label>
      <label>
        Instagram
        <input 
          className="title-input"
          type="text"
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
        />
      </label>
      <label>
        Telegram
        <input
          className="title-input"
          type="text"
          name="telegram"
          value={formData.telegram}
          onChange={handleChange}
        />
      </label>
      <label>
        LinkedIn
        <input
          className="title-input"
          type="text"
          name="linkedIn"
          value={formData.linkedIn}
          onChange={handleChange}
        />
      </label>
      <label>
        Телефон
        <input
          className="title-input"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </label>
      <label>
        Додаткова електронна пошта
        <input
          className="title-input"
          type="email"
          name="additionalEmail"
          value={formData.additionalEmail}
          onChange={handleChange}
        />
      </label>

        </div>
      
    );
  };
  
  export default SocialMediaSection;
  