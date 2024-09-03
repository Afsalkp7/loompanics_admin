import React, { useEffect, useState } from 'react';
import './publishers.css'; // Optional: For custom styling
import API from '../../utils/api';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Publishers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publisherName, setPublisherName] = useState('');
  const [publisherAddress, setPublisherAddress] = useState('');
  const [publisherUrl, setPublisherUrl] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage] = useState(10); // Items per page
  const navigate = useNavigate();

  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sending the data to the backend API
      const response = await API.post('/publishers', {
        publisherName,
        publisherAddress,
        publisherUrl
      });

      // Add the new category to the state
      setPublishers((prevPublishers) => [
        ...prevPublishers,
        response.data.publisher, // Assume response.data.category contains the newly added category
      ]);

      setSuccess(response.data.message);
      // Close the modal after submitting
      setIsModalOpen(false);
      // Reset the form fields
      setPublisherName('');
      setPublisherAddress('');
      setPublisherUrl('');
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category');
    }
  };

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await API.get('/publishers');
        setPublishers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch category data');
        setLoading(false);
      }
    };

    fetchPublishers();
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
    navigate(`/publishers/${id}`);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPublishers = publishers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(publishers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="customers-container">
      <div className="header">
        <h1 className="customers-title">Publishers</h1>
        {/* Add Category Button */}
        <button className="add-category-button" onClick={() => setIsModalOpen(true)}>
          Add Publisher
        </button>
      </div>

      {loading && <p className="loading-message">Loading Publishers...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Publisher Name</th>
                <th>Publisher Address</th>
                <th>Publisher Url</th>
                <th>Created at</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPublishers.map((publisher) => (
                <tr key={publisher._id}>
                  <td>
                    <div
                      className="avatar"
                      style={{ backgroundColor: getRandomColor() }}
                    >
                      {publisher.publisherName.split('').slice(0, 2).join('')}
                    </div>
                  </td>
                  <td>{publisher._id.split('').slice(20).join('')}</td>
                  <td>{publisher.publisherName}</td>
                  <td>{publisher.publisherAddress}</td>
                  <td>{publisher.publisherUrl}</td>
                  <td>{publisher.createdAt}</td> {/* Fixed typo from 'ceatesAt' to 'createdAt' */}
                  <td>
                    <button
                      className="action-button view"
                      onClick={() => handleView(publisher._id)}
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
            <h3>Add Publisher</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="categoryName">Publisher Name</label>
                <input
                  type="text"
                  id="categoryName"
                  value={publisherName}
                  onChange={(e) => setPublisherName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoryDescription">Publisher Address</label>
                <textarea
                  id="categoryDescription"
                  value={publisherAddress}
                  onChange={(e) => setPublisherAddress(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="categoryName">Publisher Url</label>
                <input
                  type="text"
                  id="categoryName"
                  value={publisherUrl}
                  onChange={(e) => setPublisherUrl(e.target.value)}
                  required
                />
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
                  Add Publisher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publishers;
