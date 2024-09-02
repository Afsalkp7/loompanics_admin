import React, { useEffect, useState } from 'react';
import API from '../../utils/api.js';
import './authors.css';
import { FaEye, FaPlus } from 'react-icons/fa'; // Import the plus icon
import { useNavigate } from 'react-router-dom';

const Authors = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage] = useState(10); // Items per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await API.get('/authors');
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
    navigate(`/authors/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddAuthor = () => {
    navigate('/add-author');
  };

  return (
    <div className="customers-container">
      <h1 className="customers-title">Authors</h1>
      <button className="add-author-button" onClick={handleAddAuthor}>
        <FaPlus /> Add Author
      </button>
      {loading && <p className="loading-message">Loading customers...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Full name</th>
                <th>Pen name</th>
                <th>Occupation</th>
                <th>Born</th>
                <th>Died</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((customer) => (
                !customer.isDeleted ? (<tr key={customer._id}>
                    <td>
                      <div
                        className="avatar"
                        style={{ backgroundColor: getRandomColor() }}
                      >
                        {customer.image ? (
                          <img className="authorImage" src={customer.image} alt="Author" />
                        ) : (
                          customer.firstName.split('').slice(0, 2).join('')
                        )}
                      </div>
                    </td>
                    <td>{customer._id.split('').slice(20).join('')}</td>
                    <td>{customer.firstName + ' ' + customer.lastName}</td>
                    <td>{customer.penName}</td>
                    <td>{customer.occupation}</td>
                    <td>{formatDate(customer.born)}</td>
                    <td>{formatDate(customer.died)}</td>
                    <td>
                      <button
                        className="action-button view"
                        onClick={() => handleView(customer._id)}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>) : ''
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
    </div>
  );
};

export default Authors;
