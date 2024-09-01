import React, { useEffect, useState } from 'react';
import API from '../../utils/api.js'; // Adjust the import path to your API instance
import './customer.css'; // Import the CSS file for styling
import { FaBan, FaEye } from 'react-icons/fa';

const Customers = () => {
  const [customers, setCustomers] = useState([]); // State to hold the list of customers
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Function to fetch customer data from the API
    const fetchCustomers = async () => {
      try {
        // Using the configured API instance for the request
        const response = await API.get('/users'); // Endpoint relative to the baseURL set in the API instance
        setCustomers(response.data); // Update state with fetched data
        setLoading(false); // Set loading to false after data is loaded
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to fetch customer data'); // Set error message
        setLoading(false); // Stop loading when error occurs
      }
    };

    fetchCustomers(); // Call the fetch function on component mount
  }, []); // Empty dependency array ensures this runs only on component mount

   // Function to generate a random color
   const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Handlers for action items
  const handleView = (id) => {
    // Implement view functionality
    console.log('View customer with ID:', id);
  };

  const handleBlock = (id) => {
    // Implement block functionality
    console.log('Block customer with ID:', id);
  };

  // Render loading, error, or customer list based on state
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
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>
                    <div
                      className="avatar"
                      style={{ backgroundColor: getRandomColor() }}
                    >
                      {customer.username.split('').slice(0, 2).join('')}
                    </div>
                  </td>
                  <td>{customer._id.split("").slice(20).join('')}</td>
                  <td>{customer.username}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phoneNumber}</td>
                  <td>{customer.isMember ? 'Yes' : 'No'}</td>
                  <td>{customer.isVerified ? 'Yes' : 'No'}</td>
                  <td> <button
                      className="action-button view"
                      onClick={() => handleView(customer._id)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="action-button block"
                      onClick={() => handleBlock(customer._id)}
                    >
                      <FaBan />
                    </button></td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;
