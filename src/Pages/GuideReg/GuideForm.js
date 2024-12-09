import React, { useState } from 'react';

const GuideForm = () => {
  const [guide, setGuide] = useState({
    name: '',
    email: '',
    nic: '',
    campingPlace: '',
    phone: '',
    experience: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuide({ ...guide, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setGuide({ ...guide, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Guide Info Submitted:', guide);
    setGuide({
      name: '',
      email: '',
      nic: '',
      campingPlace: '',
      phone: '',
      experience: '',
      image: '',
    });
  };

  return (
    <div>
      <form className="guide-form" onSubmit={handleSubmit}>
        <h2>Register Guide</h2>
        <input
          type="text"
          name="name"
          placeholder="Guide Name"
          value={guide.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={guide.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nic"
          placeholder="NIC"
          value={guide.nic}
          onChange={handleChange}
          required
        />
        <select
          name="campingPlace"
          value={guide.campingPlace}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Camping Place
          </option>
          <option value="Kandy">Kandy</option>
          <option value="Ella">Ella</option>
          <option value="Nuwara Eliya">Nuwara Eliya</option>
        </select>
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={guide.phone}
          onChange={handleChange}
          required
        />
        <textarea
          name="experience"
          placeholder="Registration Experiences"
          value={guide.experience}
          onChange={handleChange}
        ></textarea>
        <input type="file" onChange={handleImageUpload} />
        <button type="submit">Add Guide</button>
      </form>
    </div>
  );
};

export default GuideForm;
