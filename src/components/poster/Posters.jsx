import { useEffect, useState } from "react";
import "./posters.css";
import API from "../../utils/api";
import CustomTable from "../modules/Table";

function Posters() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posterTitle, setPosterTitle] = useState("");
  const [posterImage, setPosterImage] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posters from the API
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

  // Initial fetch
  useEffect(() => {
    fetchPosters();
  }, []);

  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", posterTitle);
    formData.append("posterImage", posterImage);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);

    try {
      await API.post("/posters", formData);

    //   if (response.status !== 200 || response.status !== 201) {
    //     throw new Error("Failed to add poster");
    //   }

      // Close the modal
      setIsModalOpen(false);

      // Reset form fields
      setPosterTitle("");
      setPosterImage(null);
      setStartDate("");
      setEndDate("");

      // Re-fetch the posters
      fetchPosters();
    } catch (err) {
      console.error("Error adding poster:", err);
      setError("Failed to add poster");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (_id) => <span>{_id.slice(-4)}</span>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="Poster"
          style={{ width: "80px", height: "auto", borderRadius: "8px" }}
        />
      ),
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => <span>{date.split("T")[0]}</span>,
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => <span>{date.split("T")[0]}</span>,
    },
    {
      title: "End date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => <span>{date.split("T")[0]}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => alert(`Action clicked for ${record.name}`)}
          className="text-blue-500"
        >
          View Details
        </button>
      ),
    },
  ];

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
        <CustomTable columns={columns} data={posters.posters} />
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
