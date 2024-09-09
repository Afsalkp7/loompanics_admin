import React, { useEffect, useState } from 'react';
import './categories.css'; // Optional: For custom styling
import API from '../../utils/api';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage] = useState(10); // Items per page
  const navigate = useNavigate();

  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sending the data to the backend API
      const response = await API.post('/categories', {
        name: categoryName,
        description: categoryDescription,
      });

      // Add the new category to the state
      setCategories((prevCategories) => [
        ...prevCategories,
        response.data.category, // Assume response.data.category contains the newly added category
      ]);

      setSuccess(response.data.message);
      // Close the modal after submitting
      setIsModalOpen(false);
      // Reset the form fields
      setCategoryName('');
      setCategoryDescription('');
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category');
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('/categories');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch category data');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleView = (id) => {
    navigate(`/categories/${id}`);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="customers-container">
      <div className="header">
        <h1 className="customers-title">Categories</h1>
        {/* Add Category Button */}
        <button className="add-category-button" onClick={() => setIsModalOpen(true)}>
          Add Category
        </button>
      </div>

      {loading && <p className="loading-message">Loading Categories...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Created at</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.map((category) => (
                <tr key={category._id}>
                  <td>
                    <div
                      className="avatar"
                      style={{ backgroundColor: getRandomColor() }}
                    >
                      {category.categoryName.split('').slice(0, 2).join('')}
                    </div>
                  </td>
                  <td>{category._id.split('').slice(20).join('')}</td>
                  <td>{category.categoryName}</td>
                  <td className="truncate">{category.description}</td>
                  <td>{category.createdAt.split("T")[0]}</td> 
                  <td>
                    <button
                      className="action-button view"
                      onClick={() => handleView(category._id)}
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`pagination-button ${
                  currentPage === index + 1 ? 'active' : ''
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Adding Categories */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Category</h3>
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
                <label htmlFor="categoryDescription">Category Description</label>
                <textarea
                  id="categoryDescription"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
