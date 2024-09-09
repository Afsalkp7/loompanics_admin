import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/api.js';
import { FaPenSquare } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import './productDetail.css';

const ProductDetail = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getRandomColor = () => {
    const colors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await API.get(`/products/${_id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [_id]);

  const handleEdit = () => {
    navigate('/add-product', { state: { product } });
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/products/${_id}`);
      navigate('/products'); // Redirect to the list of products after successful deletion
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete the product.');
    }
  };

  return (
    <div className="product-detail-container">
      {loading && <p className="loading-message">Loading product details...</p>}
      {error && <p className="error-message">{error}</p>}
      {product && (
        <div className="product-detail-content">
          <div className="product-hero">
            <div className="name-logo" style={{ backgroundColor: getRandomColor() }}>
              {product.primaryImageUrl ? (
                <img className="productImage" src={product.primaryImageUrl} alt="Product" />
              ) : (
                product.title.split('').slice(0, 2).join('')
              )}
            </div>
            <h1 className="product-name">{product.title}</h1>
            <p className="product-category">{product.categoryId?.categoryName || 'N/A'}</p> {/* Safely access categoryName */}
            <div className="product-images">
              <div className="primaryImage">
                <img src={product.primaryImageUrl} alt="Primary Product" />
              </div>
              {product.secondaryImageUrl && (
                <div className="secondaryImage">
                  <img src={product.secondaryImageUrl} alt="Secondary Product" />
                </div>
              )}
              {product.thirdImageUrl && (
                <div className="thirdImage">
                  <img src={product.thirdImageUrl} alt="Third Product" />
                </div>
              )}
            </div>
          </div>

          <div className="product-main">
            <div className="product-info">
              <p>
                <strong>Title:</strong> {product.title}
              </p>
              <p>
                <strong>Category:</strong> {product.categoryId?.categoryName || 'N/A'}
              </p>
              <p>
                <strong>Author:</strong> {`${product.authorId?.firstName || ''} ${product.authorId?.lastName || ''}`}
              </p>
              <p>
                <strong>Publisher:</strong> {product.publisherId?.publisherName || 'N/A'}
              </p>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <p>
                <strong>Edition:</strong> {product.edition}
              </p>
              <p>
                <strong>Publishing Date:</strong> {product.publicationDate?.split('T')[0] || 'N/A'}
              </p>
              <p>
                <strong>Genres:</strong> {product.genres || 'N/A'}
              </p>
              <p>
                <strong>Original Price:</strong> {product.originalPrice}
              </p>
              <p>
                <strong>Discount:</strong> {product.discount}
              </p>
              <p>
                <strong>Language:</strong> {product.language}
              </p>
              <p>
                <strong>Copy Type:</strong> {product.copyType}
              </p>

              <button className="back-button" onClick={() => navigate(-1)}>
                ←
              </button>
              <button className="edit-button" onClick={handleEdit}>
                <FaPenSquare />
              </button>
              <button className="delete-button" onClick={() => setShowDeleteModal(true)}>
                <FaTrash />
              </button>
            </div>

            <div className="product-accordion">
              {/* Accordion for Awards */}
              <div className="accordion-item">
                <button className="accordion-title">
                  <span>🥇 Awards</span>
                </button>
                <div className="accordion-content">
                  {product.awards?.length > 0 ? (
                    product.awards.map((item, index) => <p key={index}>{item.awardTitle}</p>)
                  ) : (
                    <p>No Awards</p>
                  )}
                </div>
              </div>

              {/* Accordion for Reviews */}
              <div className="accordion-item">
                <button className="accordion-title">
                  <span>🌟 Reviews</span>
                </button>
                <div className="accordion-content">
                  {product.reviews?.length > 0 ? (
                    product.reviews.map((review, index) => <p key={index}>{review}</p>)
                  ) : (
                    <p>No Reviews</p>
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
                <p>Are you sure you want to delete this product?</p>
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
};

export default ProductDetail;
