import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/api.js';
import { FaPenSquare } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import './productDetail.css'
const ProductDetail = () => {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [product, setproduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control modal visibility
  
    const getRandomColor = () => {
      const colors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
      return colors[Math.floor(Math.random() * colors.length)];
    };
  
    useEffect(() => {
      const fetchProductDetails = async () => {
        try {
          const response = await API.get(`/products/${_id}`);
          setproduct(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching user details:', err);
          setError('Failed to fetch user details');
          setLoading(false);
        }
      };
  
      fetchProductDetails();
    }, [_id]);
  
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
    };
  
    const handleEdit = () => {
      navigate('/add-product', { state: { product } });
    };
  
    const handleDelete = async () => {
      try {
        await API.delete(`/products/${_id}`);
        navigate('/products'); // Redirect to the list of authors after successful deletion
      } catch (err) {
        console.error('Error deleting author:', err);
        setError('Failed to delete the author.');
      }
    };
  
    return (
      <div className="product-detail-container">
        {loading && <p className="loading-message">Loading user details...</p>}
        {error && <p className="error-message">{error}</p>}
        {product && (
          <div className="user-detail-content">
            <div className="user-hero">
              <div className="name-logo" style={{ backgroundColor: getRandomColor() }}>
                {product.primaryImageUrl ? (
                  <img className="productImage" src={product.primaryImageUrl} alt="Product" />
                ) : (
                  product.title.split('').slice(0, 2).join('')
                )}
              </div>
              <h1 className="product-name">{product.title}</h1>
              <p className="product-category">{product.categoryId}</p>
            </div>
  
            <div className="product-main">
              <div className="product-info">
                <p>
                  <strong>Title:</strong> {product.title}
                </p>
                <p>
                  <strong>Category:</strong> {product.catgoryId}
                </p>
                <p>
                  <strong>Author:</strong> {product.authorId}
                </p>
               
                <button className="back-button" onClick={() => navigate(-1)}>
                  ←
                </button>
                <button className="edit-button" onClick={handleEdit}>
                  <FaPenSquare />
                </button>
                <button
                  className="delete-button"
                  onClick={() => setShowDeleteModal(true)} // Show modal on click
                >
                  <FaTrash />
                </button>
              </div>
  
              <div className="user-accordion">
                {/* Accordion for Notable Works */}
                <div className="accordion-item">
                  <button className="accordion-title">
                    <span>✒ Notable works</span>
                  </button>
                  <div className="accordion-content">
                    {product.notableWorks?.length > 0 ? (
                      product.notableWorks.map((item, index) => <p key={index}>{item}</p>)
                    ) : (
                      <p>No notable works</p>
                    )}
                  </div>
                </div>
  
                {/* Accordion for Awards */}
                <div className="accordion-item">
                  <button className="accordion-title">
                    <span>🥇 Bagged awards</span>
                  </button>
                  <div className="accordion-content">
                    {product.awards?.length > 0 ? (
                      product.awards.map((award, index) => (
                        <p key={index}>
                          {award.awardTitle + ' ' + formatDate(award.awardYear).split('/')[2]}
                        </p>
                      ))
                    ) : (
                      <p>No awards bagged</p>
                    )}
                  </div>
                </div>
  
                {/* Accordion for Books */}
                <div className="accordion-item">
                  <button className="accordion-title">
                    <span>📚 Books</span>
                  </button>
                  <div className="accordion-content">
                    {product.books?.length > 0 ? (
                      product.books.map((book, index) => <p key={index}>{book}</p>)
                    ) : (
                      <p>No books are available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
  
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>Confirm Delete</h2>
                  <p>Are you sure you want to delete this author?</p>
                  <div className="modal-actions">
                    <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>
                      Cancel
                    </button>
                    <button className="confirm-delete-button" onClick={handleDelete}>
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
}

export default ProductDetail