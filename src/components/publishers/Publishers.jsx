import React, { useEffect, useState } from 'react';
import './publishers.css'; // Retaining existing styles
import API from '../../utils/api';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Publishers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publisherName, setPublisherName] = useState('');
  const [publisherAddress, setPublisherAddress] = useState('');
  const [publisherUrl, setPublisherUrl] = useState('');
  const [publisherLogo, setPublisherLogo] = useState(null); // State for the uploaded logo file
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  // Handles the form submission for adding a new publisher
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
      const response = await API.post('/publishers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the list of publishers with the new one
      setPublishers((prevPublishers) => [
        ...prevPublishers,
        response.data.publisher,
      ]);

      setSuccess(response.data.message);
      toast.success('Publisher added successfully!');
      setIsModalOpen(false);
      setPublisherName('');
      setPublisherAddress('');
      setPublisherUrl('');
      setPublisherLogo(null);
    } catch (err) {
      console.error('Error adding publisher:', err.response ? err.response.data : err);
      setError('Failed to add publisher');
      toast.error('Failed to add publisher');
    }
  };

  // Fetches the list of publishers when the component mounts
  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await API.get('/publishers');
        setPublishers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching publishers:', err.response ? err.response.data : err);
        setError('Failed to fetch publisher data');
        toast.error('Failed to fetch publisher data');
        setLoading(false);
      }
    };

    fetchPublishers();
  }, []);

  // Generates a random color for the publisher avatar
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Handles viewing a specific publisher
  const handleView = (id) => {
    navigate(`/publishers/${id}`);
  };

  // Pagination logic to determine the items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPublishers = publishers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(publishers.length / itemsPerPage);

  // Handles page change for pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="customers-container">
      <div className="header">
        <h1 className="customers-title">Publishers</h1>
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
                      style={!publisher.publisherLogo?{ backgroundColor: getRandomColor() }:{backgroundColor:'white'}}
                    >
                      {publisher.publisherLogo? (<img src={publisher.publisherLogo}/>) : publisher.publisherName.split('').slice(0, 2).join('')}
                    </div>
                  </td>
                  <td>{publisher._id.slice(-4)}</td> {/* Display last 4 characters of ID */}
                  <td>{publisher.publisherName}</td>
                  <td className="truncate">{publisher.publisherAddress}</td>
                  <td>{publisher.publisherUrl}</td>
                  <td>{new Date(publisher.createdAt).toLocaleDateString()}</td>
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

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Publisher</h3>
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
                <label htmlFor="publisherUrl">Publisher Url</label>
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
                  name="publisherLogo"
                  onChange={(e) => setPublisherLogo(e.target.files[0])}
                  accept="image/*"
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
