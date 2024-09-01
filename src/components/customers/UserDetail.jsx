import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import API from '../../utils/api.js'; // Adjust the import path to your API instance
import './userDetail.css';

const UserDetail = () => {
  const { _id } = useParams(); // Extract the id parameter from the URL
  const navigate = useNavigate(); // Initialize the navigate function
  const [user, setUser] = useState(null); // State to hold the fetched user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Generate a random color for the avatar background
  const getRandomColor = () => {
    const colors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    // Function to fetch user details from the API
    const fetchUserDetails = async () => {
      try {
        const response = await API.get(`/users/${_id}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to fetch user details');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [_id]);

  return (
    <div className="user-detail-container">
      {loading && <p className="loading-message">Loading user details...</p>}
      {error && <p className="error-message">{error}</p>}
      {user && (
        <div className="user-detail-content">
          <div className="user-hero">
            <div className="name-logo" style={{ backgroundColor: getRandomColor() }}>
              {user.username.split('').slice(0, 2).join('')}
            </div>
            <h1 className="user-name">{user.username}</h1>
            <p className="user-email">{user.email}</p>
          </div>

          <div className="user-main">
            <div className="user-info">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
              <p><strong>Is Verified:</strong> {user.isVerified ? 'Yes' : 'No'}</p>
              <p><strong>Is Member:</strong> {user.isMember ? 'Yes' : 'No'}</p>

              {/* Back Button */}
              <button
                className="back-button"
                onClick={() => navigate(-1)} // Navigate back to the previous page
              >
                ← Back
              </button>
                
              {/* Button to send a message to the user */}
              <a
                href={`mailto:${user.email}`}
                className="message-button"
              >
                Message to {user.username}
              </a>
            </div>

            <div className="user-accordion">
              {/* Accordion for Cart */}
              <div className="accordion-item">
                <button className="accordion-title">
                  <span>📦 Cart</span>
                </button>
                <div className="accordion-content">
                  {user.cart?.length > 0 ? (
                    user.cart.map((item, index) => <p key={index}>{item}</p>)
                  ) : (
                    <p>No items in cart</p>
                  )}
                </div>
              </div>

              {/* Accordion for Addresses */}
              <div className="accordion-item">
                <button className="accordion-title">
                  <span>🏠 Addresses</span>
                </button>
                <div className="accordion-content">
                  {user.address?.length > 0 ? (
                    user.address.map((address, index) => <p key={index}>{address}</p>)
                  ) : (
                    <p>No addresses available</p>
                  )}
                </div>
              </div>

              {/* Accordion for Borrowed Books */}
              <div className="accordion-item">
                <button className="accordion-title">
                  <span>📚 Borrowed Books</span>
                </button>
                <div className="accordion-content">
                  {user.borrowedBooks?.length > 0 ? (
                    user.borrowedBooks.map((book, index) => <p key={index}>{book}</p>)
                  ) : (
                    <p>No borrowed books</p>
                  )}
                </div>
              </div>

              {/* Accordion for Orders */}
              <div className="accordion-item">
                <button className="accordion-title">
                  <span>🛒 Orders</span>
                </button>
                <div className="accordion-content">
                  {user.orders?.length > 0 ? (
                    user.orders.map((order, index) => <p key={index}>{order}</p>)
                  ) : (
                    <p>No orders placed</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
