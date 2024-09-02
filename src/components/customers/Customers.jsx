import React, { useEffect, useState } from 'react';
import API from '../../utils/api.js';
import './customer.css';
import { FaBan, FaEye, FaUnlock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage] = useState(10); // Items per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await API.get('/users');
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to fetch customer data');
        setLoading(false);
      }
    };

    fetchCustomers();
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
    navigate(`/users/${id}`);
  };

  const openBlockModal = (customer, type) => {
    setSelectedCustomer(customer);
    setActionType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleToggleBlock = async () => {
    if (!selectedCustomer) return;
    try {
      await API.put(`/users/${selectedCustomer._id}`);
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer._id === selectedCustomer._id
            ? { ...customer, isBlocked: !customer.isBlocked }
            : customer
        )
      );
      closeModal();
    } catch (err) {
      console.error('Error toggling block status:', err);
      alert('Failed to change the block status of the user.');
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="customers-container">
      <h1 className="customers-title">Customers</h1>
      {loading && <p className="loading-message">Loading customers...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Is Member</th>
                <th>Is Verified</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((customer) => (
                <tr key={customer._id}>
                  <td>
                    <div
                      className="avatar"
                      style={{ backgroundColor: getRandomColor() }}
                    >
                      {customer.username.split('').slice(0, 2).join('')}
                    </div>
                  </td>
                  <td>{customer._id.split('').slice(20).join('')}</td>
                  <td>{customer.username}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phoneNumber}</td>
                  <td>{customer.isMember ? 'Yes' : 'No'}</td>
                  <td>{customer.isVerified ? 'Yes' : 'No'}</td>
                  <td>
                    <button
                      className="action-button view"
                      onClick={() => handleView(customer._id)}
                    >
                      <FaEye />
                    </button>
                    {customer.isBlocked ? (
                      <button
                        className="action-button unblock"
                        onClick={() => openBlockModal(customer, 'unblock')}
                      >
                        <FaUnlock />
                      </button>
                    ) : (
                      <button
                        className="action-button block"
                        onClick={() => openBlockModal(customer, 'block')}
                      >
                        <FaBan />
                      </button>
                    )}
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

      {/* Block/Unblock Confirmation Modal */}
      {isModalOpen && selectedCustomer && (
        <div className="modal">
          <div className="modal-content">
            <h3>{actionType === 'block' ? 'Block User' : 'Unblock User'}</h3>
            <p>
              Are you sure you want to {actionType} {selectedCustomer.username}?
            </p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={handleToggleBlock}>
                {actionType === 'block' ? 'Block User' : 'Unblock User'}
              </button>
              <button className="cancel-button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
