import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import "./authorDetail.css";
import { FaPenSquare, FaStar } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";

const AuthorDetail = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control modal visibility

  const getRandomColor = () => {
    const colors = [
      "#FFADAD",
      "#FFD6A5",
      "#FDFFB6",
      "#CAFFBF",
      "#9BF6FF",
      "#A0C4FF",
      "#BDB2FF",
      "#FFC6FF",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await API.get(`/authors/${_id}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to fetch user details");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [_id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const handleEdit = () => {
    navigate("/add-author", { state: { author: user } });
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/authors/${_id}`);
      navigate("/authors"); // Redirect to the list of authors after successful deletion
    } catch (err) {
      console.error("Error deleting author:", err);
      setError("Failed to delete the author.");
    }
  };

  return (
    <div className="user-detail-container">
      {loading && <p className="loading-message">Loading user details...</p>}
      {error && <p className="error-message">{error}</p>}
      {user && (
        <div className="user-detail-content">
          <div className="user-hero">
            <div
              className="name-logo"
              style={{ backgroundColor: getRandomColor() }}
            >
              {user.image ? (
                <img className="authorImage" src={user.image} alt="Author" />
              ) : (
                user.firstName.split("").slice(0, 2).join("")
              )}
            </div>
            <h1 className="user-name">
              {user.firstName + " " + user.lastName}
            </h1>
            <p className="user-email">{user.penName}</p>
          </div>

          <div className="user-main">
            <div className="user-info">
              <p>
                <strong>Full name:</strong>{" "}
                {user.firstName + " " + user.lastName}
              </p>
              <p>
                <strong>Pen name:</strong> {user.penName}
              </p>
              <p>
                <strong>Occupation:</strong> {user.occupation}
              </p>
              <p>
                <strong>Born on:</strong> {formatDate(user.born)}
              </p>
              <p>
                <strong>Died on:</strong>{" "}
                {user.died ? formatDate(user.died) : "-"}
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
                  {user.notableWorks?.length > 0 ? (
                    user.notableWorks[0].split(",").map((item, index) => (
                      <div key={index} className="notable-work-item">
                        <p>👉 {item}</p>
                      </div>
                    ))
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
                  {user.awards?.length > 0 ? (
                    user.awards.map((award, index) => (
                      <p key={index}>
                        👉 {award.awardTitle +
                          " " +
                          formatDate(award.awardYear).split("/")[2]}
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
                  {user.books?.length > 0 ? (
                    user.books.map((book, index) => 
                      (
                        <div key={index} className='booksShow' style={{ cursor: 'pointer' }}>
                            <img src={book.primaryImageUrl} className='bookImage'/>
                            <span className='bookTitle'>{book.title}</span>           
                        </div>
                    ))
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
                  <button
                    className="cancel-button"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="confirm-delete-button"
                    onClick={handleDelete}
                  >
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

export default AuthorDetail;
