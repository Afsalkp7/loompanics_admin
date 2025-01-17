import { useEffect, useState } from 'react';
import API from '../../utils/api.js';
import { Table, Button } from 'antd';
import { FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch product data');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddBook = () => {
    navigate('/add-product');
  };

  const handleView = (id) => {
    navigate(`/products/${id}`);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'primaryImageUrl',
      key: 'primaryImageUrl',
      render: (primaryImageUrl, product) =>
        primaryImageUrl ? (
          <img className="productImage" src={primaryImageUrl} alt="book" />
        ) : (
          <div className="avatar" style={{ backgroundColor: '#ccc' }}>
            {product.title?.slice(0, 2)}
          </div>
        ),
    },
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => id.slice(-4), // Show last 4 characters
    },
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Author',
      dataIndex: 'authorId',
      key: 'authorId',
      render: (authorId) =>
        `${authorId.firstName} ${authorId.lastName}`,
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId) => categoryId.categoryName,
    },
    {
      title: 'Publisher',
      dataIndex: 'publisherId',
      key: 'publisherId',
      render: (publisherId) => publisherId.publisherName,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) =>
        description.length > 50
          ? `${description.slice(0, 50)}...`
          : description,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, product) => (
        <Button
          type="link"
          icon={<FaEye />}
          onClick={() => handleView(product._id)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="customers-container">
      <h1 className="customers-title">Books</h1>
      <Button
       className="add-author-button"
        type="primary"
        icon={<FaPlus />}
        onClick={handleAddBook}
        style={{ marginBottom: '16px' }}
      >
        Add Book
      </Button>
      {loading && <p className="loading-message">Loading books...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <Table
          dataSource={products}
          columns={columns}
          rowKey="_id" 
          pagination={{
            pageSize: 10, 
          }}
        />
      )}
    </div>
  );
};

export default Products;
