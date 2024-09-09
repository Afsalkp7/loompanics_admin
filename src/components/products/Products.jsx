import React, { useEffect, useState } from 'react'
import API from '../../utils/api.js';
import './products.css';
import { FaEye, FaPlus } from 'react-icons/fa'; // Import the plus icon
import { useNavigate } from 'react-router-dom';


const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [itemsPerPage] = useState(10); // Items per page
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await API.get('/products');
          setProducts(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching customers:', err);
          setError('Failed to fetch customer data');
          setLoading(false);
        }
      };
  
      fetchProducts();
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
      navigate(`/products/${id}`);
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
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    const handleAddBook = () => {
      navigate('/add-product');
    };
  
    return (
      <div className="customers-container">
        <h1 className="customers-title">Books</h1>
        <button className="add-author-button" onClick={handleAddBook}>
          <FaPlus /> Add Book
        </button>
        {loading && <p className="loading-message">Loading books...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <div className="table-container">
            <table className="customers-table">
              <thead>
                <tr>
                  <th></th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Publisher</th>
                  <th>Description</th>
                  <th>Acrions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  !product.isDeleted ? (<tr key={product._id}>
                      <td>
                        <div
                          className="avatar"
                          style={{ backgroundColor: getRandomColor() }}
                        >
                          {product.primaryImageUrl ? (
                            <img className="productImage" src={product.primaryImageUrl} alt="book" />
                          ) : (
                            product.title.split('').slice(0, 2).join('')
                          )}
                        </div>
                      </td>
                      <td>{product._id.split('').slice(20).join('')}</td>
                      <td>{product.title }</td>
                      <td>{product.authorId.firstName + product.authorId.lastName}</td>
                      <td>{product.categoryId.categoryName}</td>
                      <td>{product.publisherId.publisherName}</td>
                      <td className='truncate'>{product.description}</td>
                      <td>
                        <button
                          className="action-button view"
                          onClick={() => handleView(product._id)}
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
}

export default Products