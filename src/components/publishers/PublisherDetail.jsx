// CategoryDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/api.js'; // Adjust the import path to your API instance
import './publisherDetail.css';
import { FaPenSquare, FaTrash } from 'react-icons/fa';

const EditPublisherModal = ({ isOpen, onClose, publisher, onSave }) => {
  const [publisherName, setPublisherName] = useState(publisher?.publisherName || '');
  const [publisherAddress, setPublisherAddress] = useState(publisher?.publisherAddress || '');
  const [publisherUrl, setPublisherUrl] = useState(publisher?.publisherUrl || '');
  const [publisherLogo, setPublisherLogo] = useState(null);

  useEffect(() => {
    if (publisher) {
      setPublisherName(publisher.publisherName);
      setPublisherAddress(publisher.publisherAddress);
      setPublisherUrl(publisher.publisherUrl);
      setPublisherLogo(null); // Reset logo state if necessary
    }
  }, [publisher]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('publisherName', publisherName);
    formData.append('publisherAddress', publisherAddress);
    formData.append('publisherUrl', publisherUrl);
    if (publisherLogo) {
      formData.append('publisherLogo', publisherLogo);
    }

    try {
      await API.put(`/publishers/${publisher._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSave(); // Refresh the details
      onClose(); // Close the modal
    } catch (err) {
      console.error('Error updating publisher:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Publisher</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="publisherName">Publisher Name</label>
            <input
              type="text"
              id="publisherName"
              value={publisherName}
              onChange={(e) => setPublisherName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="publisherAddress">Publisher Address</label>
            <textarea
              id="publisherAddress"
              value={publisherAddress}
              onChange={(e) => setPublisherAddress(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="publisherUrl">Publisher URL</label>
            <input
              type="text"
              id="publisherUrl"
              value={publisherUrl}
              onChange={(e) => setPublisherUrl(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="publisherLogo">Publisher Logo</label>
            <input
              type="file"
              id="publisherLogo"
              onChange={(e) => setPublisherLogo(e.target.files[0])}
              accept="image/*"
            />
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
        <p>Are you sure you want to delete this Publisher? This action cannot be undone.</p>
        <div className="form-actions">
          <button onClick={onClose} className="cancel-button">Cancel</button>
          <button onClick={onConfirm} className="delete-button">Delete</button>
        </div>
      </div>
    </div>
  );
};

const PublisherDetail = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [publisher, setPublisher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getRandomColor = () => {
    const colors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const fetchPublisherDetails = async () => {
      try {
        const response = await API.get(`/publishers/${_id}`);
        setPublisher(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category details:', err);
        setError('Failed to fetch category details');
        setLoading(false);
      }
    };

    fetchPublisherDetails();
  }, [_id]);

  // Function to refresh the category details after updating
  const refreshPublisher = async () => {
    try {
      const response = await API.get(`/publishers/${_id}`);
      setPublisher(response.data);
    } catch (err) {
      console.error('Error refreshing category:', err);
    }
  };

  // Function to handle category deletion
  const handleDeletePublisher = async () => {
    
    try {
      await API.delete(`/publishers/${_id}`);
      setIsDeleteModalOpen(false);
      navigate(-1); // Navigate back after deletion
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  return (
    <div className="user-detail-container">
      {loading && <p className="loading-message">Loading publisher details...</p>}
      {error && <p className="error-message">{error}</p>}
      {publisher && (
        <div className="user-detail-content">
          <div className="user-hero">
            <div className="name-logo" style={{ backgroundColor: getRandomColor() }}>
              {publisher.publisherLogo ? (<img src={publisher.publisherLogo} />) : publisher.publisherName.split('').slice(0, 2).join('')}
            </div>
            <h1 className="user-name">{publisher.publisherName}</h1>
          </div>

          <div className="user-main">
            <div className="user-info">
              <p><strong>Publisher name:</strong> {publisher.publisherName}</p>
              <p><strong>Publisher address:</strong> {publisher.publisherAddress}</p>
              <p><strong>Publisher Url:</strong> {publisher.publisherUrl}</p>
              <p><strong>Created at:</strong> {publisher.createdAt}</p>

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
                  {publisher.books?.length > 0 ? (
                    publisher.books.map((item, index) => <p key={index}>{item}</p>)
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
      <EditPublisherModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        publisher={publisher}
        onSave={refreshPublisher}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePublisher} // Confirm deletion handler
      />
    </div>
  );
};

export default PublisherDetail;
