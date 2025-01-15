import { useEffect, useState } from "react";
import "./posters.css";
import API from "../../utils/api";

function Posters() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posterTitle, setPosterTitle] = useState("");
  const [posterImage, setPosterImage] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", posterTitle);
    formData.append("posterImage", posterImage);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);

    try {
      const response = await API.post("/posters", formData);

      if (!response.ok) {
        throw new Error("Failed to add poster");
      }

      const result = await response.json();
      console.log("Poster added successfully:", result);
      setIsModalOpen(false);
      setPosters([...posters, result]); // Update the poster list
    } catch (err) {
      console.error("Error adding poster:", err);
      setError("Failed to add poster");
    }
  };

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const response = await API.get("/posters");
        setPosters(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posters:", err);
        setError("Failed to fetch poster data");
        setLoading(false);
      }
    };

    fetchPosters();
  }, []);



  return (
    <div className="posters-container">
      <div className="header">
        <h1 className="posters-title">Posters</h1>
        {/* Add Poster Button */}
        <button
          className="add-poster-button"
          onClick={() => setIsModalOpen(true)}
        >
          Add Poster
        </button>
      </div>

      {loading && <p className="loading-message">Loading Posters...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <h1>hello</h1>
      )}

      {/* Modal for Adding Posters */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Poster</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="title">Poster Title</label>
                <input
                  type="text"
                  id="title"
                  value={posterTitle}
                  onChange={(e) => setPosterTitle(e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="posterImage">Poster Image</label>
                <input
                  type="file"
                  id="posterImage"
                  accept="image/*"
                  onChange={(e) => setPosterImage(e.target.files[0])}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="input-field"
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
                  Add Poster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Posters;
