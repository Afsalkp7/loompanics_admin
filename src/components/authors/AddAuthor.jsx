import React, { useState, useEffect } from 'react';
import API from '../../utils/api'; // Adjust the path based on your project structure
import { useLocation, useNavigate } from 'react-router-dom';
import './addAuthor.css'; // Add relevant styling as needed
import { toast } from "react-toastify";

const AddAuthor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isEdit = Boolean(location.state?.author); // Check if editing
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    born: '',
    died: '',
    penName: '',
    occupation: '',
    notableWorks: '',
    awards: [{ awardTitle: '', awardYear: '' }],
    image: null,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const author = location.state.author;
      setFormData({
        firstName: author.firstName || '',
        lastName: author.lastName || '',
        born: author.born || '',
        died: author.died || '',
        penName: author.penName || '',
        occupation: author.occupation || '',
        notableWorks: author.notableWorks ? author.notableWorks.join(', ') : '',
        awards: author.awards || [{ awardTitle: '', awardYear: '' }],
        image: null,
      });
      setPreview(author.image || null);
    }
  }, [isEdit, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAwardChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAwards = [...formData.awards];
    updatedAwards[index][name] = value;
    setFormData((prev) => ({ ...prev, awards: updatedAwards }));
  };

  const addAward = () => {
    setFormData((prev) => ({
      ...prev,
      awards: [...prev.awards, { awardTitle: '', awardYear: '' }],
    }));
  };

  const removeAward = (index) => {
    const updatedAwards = formData.awards.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, awards: updatedAwards }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('born', formData.born);
    data.append('died', formData.died);
    data.append('penName', formData.penName);
    data.append('occupation', formData.occupation);
    data.append('notableWorks', formData.notableWorks.split(','));
    formData.awards.forEach((award, index) => {
      data.append(`awards[${index}][awardTitle]`, award.awardTitle);
      data.append(`awards[${index}][awardYear]`, award.awardYear);
    });
    if (formData.image) data.append('image', formData.image);

    try {
      if (isEdit) {
        // Update existing author
        await API.put(`/authors/${location.state.author._id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Author updated successfully');
      } else {
        // Add new author
        await API.post('/authors', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Author added successfully!');
      }
      navigate('/authors'); // Redirect to the desired route after submission
    } catch (error) {
      console.error('Error saving author:', error);
      alert(`Failed to ${isEdit ? 'update' : 'add'} author. Please try again.`);
    }
  };

  return (
    <div className="add-author-form-container">
      <h2>{isEdit ? 'Edit Author' : 'Add New Author'}</h2>
      <form onSubmit={handleSubmit} className="add-author-form">
        {/* Image Preview */}
        <div className="image-preview">
          {preview ? (
            <img src={preview} alt="Author Preview" className="image-preview-img" />
          ) : (
            <span className="image-preview-placeholder">No Image</span>
          )}
        </div>
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type="date"
          name="born"
          placeholder="Born"
          value={formData.born}
          onChange={handleChange}
        />
        <input
          type="date"
          name="died"
          placeholder="Died"
          value={formData.died}
          onChange={handleChange}
        />
        <input
          type="text"
          name="penName"
          placeholder="Pen Name"
          value={formData.penName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="occupation"
          placeholder="Occupation"
          value={formData.occupation}
          onChange={handleChange}
        />
        <textarea
          name="notableWorks"
          placeholder="Notable Works (comma separated)"
          value={formData.notableWorks}
          onChange={handleChange}
        />
        {formData.awards.map((award, index) => (
          <div key={index} className="award-inputs">
            <input
              type="text"
              name="awardTitle"
              placeholder="Award Title"
              value={award.awardTitle}
              onChange={(e) => handleAwardChange(index, e)}
            />
            <input
              type="number"
              name="awardYear"
              placeholder="Award Year"
              value={award.awardYear}
              onChange={(e) => handleAwardChange(index, e)}
            />
            <button type="button" onClick={() => removeAward(index)}>
              Remove Award
            </button>
          </div>
        ))}
        <button type="button" onClick={addAward}>
          Add Award
        </button>
        <button type="submit">
          {isEdit ? 'Save Changes' : 'Add Author'}
        </button>
      </form>
    </div>
  );
};

export default AddAuthor;
