// поля для редагування основної інформації

const MainInfoSection = ({ formData, setFormData }) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    return (
      <div className="edit-profile-container">
        <h3>Основна інформація</h3>
        <label>
        Ім'я
        <input
          className="title-input"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Прізвище
        <input
          className="title-input"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Дата народження
        <input
          className="title-input"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
        />
      </label>
      <label>
        Стать
        <select name="gender" value={formData.gender} onChange={handleChange} className="list-select">
          <option value="Чоловік">Чоловік</option>
          <option value="Жінка">Жінка</option>
          <option value="Інше">Інше</option>
        </select>
      </label>
      <label>
        Про себе
        <textarea
          className="description-textarea"
          name="interests"
          value={formData.interests}
          onChange={handleChange}
        />
      </label>
      <label>
        Країна
        <input
          className="title-input"
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </label>
      <label>
        Місто
        <input
          className="title-input"
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </label>

      </div>
    );
  };
  
  export default MainInfoSection;