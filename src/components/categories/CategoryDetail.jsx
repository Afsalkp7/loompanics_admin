// CategoryDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/api.js'; // Adjust the import path to your API instance
import './categoryDetail.css';
import { FaPenSquare, FaTrash } from 'react-icons/fa';

// Reusable Edit Modal Component
const EditCategoryModal = ({ isOpen, onClose, category, onSave }) => {
  const [categoryName, setCategoryName] = useState(category?.categoryName || '');
  const [description, setDescription] = useState(category?.description || '');

  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName);
      setDescription(category.description);
    }
  }, [category]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Update the category details
    try {
      await API.put(`/categories/${category._id}`, {
        categoryName,
        description,
      });
      onSave(); // Call onSave to refresh the category details
      onClose(); // Close the modal
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Category</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="categoryName">Category Name</label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this category? This action cannot be undone.</p>
        <div className="form-actions">
          <button onClick={onClose} className="cancel-button">Cancel</button>
          <button onClick={onConfirm} className="delete-button">Delete</button>
        </div>
      </div>
    </div>
  );
};

const CategoryDetail = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getRandomColor = () => {
    const colors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await API.get(`/categories/${_id}`);
        setCategory(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category details:', err);
        setError('Failed to fetch category details');
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [_id]);

  // Function to refresh the category details after updating
  const refreshCategory = async () => {
    try {
      const response = await API.get(`/categories/${_id}`);
      setCategory(response.data);
    } catch (err) {
      console.error('Error refreshing category:', err);
    }
  };

  // Function to handle category deletion
  const handleDeleteCategory = async () => {
    
    try {
      await API.delete(`/categories/${_id}`);
      setIsDeleteModalOpen(false);
      navigate(-1); // Navigate back after deletion
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  return (
    <div className="user-detail-container">
      {loading && <p className="loading-message">Loading category details...</p>}
      {error && <p className="error-message">{error}</p>}
      {category && (
        <div className="user-detail-content">
          <div className="user-hero">
            <div className="name-logo" style={{ backgroundColor: getRandomColor() }}>
              {category.categoryName.split('').slice(0, 2).join('')}
            </div>
            <h1 className="user-name">{category.categoryName}</h1>
          </div>

          <div className="user-main">
            <div className="user-info">
              <p><strong>Category name:</strong> {category.categoryName}</p>
              <p><strong>Description:</strong> {category.description}</p>
              <p><strong>Created at:</strong> {category.createdAt}</p>

              <button className="back-button" onClick={() => navigate(-1)}>
                ←
              </button>
              <button className="edit-button" onClick={() => setIsEditModalOpen(true)}>
                <FaPenSquare />
              </button>
              <button
                className="delete-button"
                onClick={() => setIsDeleteModalOpen(true)} // Open the delete modal
              >
                <FaTrash />
              </button>
            </div>

            <div className="user-accordion">
              <div className="accordion-item">
                <button className="accordion-title">
                  <span>📚 Books</span>
                </button>
                <div className="accordion-content">
                  {category.books?.length > 0 ? (
                    category.books.map((item, index) => <p key={index}>{item}</p>)
                  ) : (
                    <p>No items in cart</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={category}
        onSave={refreshCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCategory} // Confirm deletion handler
      />
    </div>
  );
};

export default CategoryDetail;
