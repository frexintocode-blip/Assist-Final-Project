import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const ProviderDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [editingServiceId, setEditingServiceId] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    yearsOfExperience: "",
    description: "",
  });

  const CATEGORIES = [
    "tutor",
    "dishworker",
    "electrician",
    "painter",
    "carpenter",
    "cleaner",
    "plumber",
    "mechanic",
  ];

  // 1. Fetch provider's active service listings
  const fetchServices = async () => {
    try {
      const res = await API.get("/services/my-services");
      const data = res.data.data || res.data;
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setErrorMsg("Could not load your service listings.");
    } finally {
      setLoading(false);
    }
  };

  // Safely trigger data fetching on initial mount
  useEffect(() => {
    const loadServices = async () => {
      await fetchServices();
    };
    loadServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Select service and populate the form for updating
  const handleEditClick = (service) => {
    setEditingServiceId(service._id || service.id);
    setFormData({
      title: service.title || "",
      category: service.category || "",
      yearsOfExperience: service.yearsOfExperience || "",
      description: service.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. Reset form back to creation mode
  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setFormData({
      title: "",
      category: "",
      yearsOfExperience: "",
      description: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 4. Handle unified submission (Creates new service or posts update request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append(
        "yearsOfExperience",
        Number(formData.yearsOfExperience) || 0,
      );
      payload.append("description", formData.description);

      // Append certification file if selected
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        payload.append("certificationFile", fileInputRef.current.files[0]);
      }

      if (editingServiceId) {
        // Request update for existing service
        const res = await API.put(
          `/services/${editingServiceId}/request-update`,
          payload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        alert(
          res.data?.message ||
            "Your service updates have been queued for administrative review.",
        );
      } else {
        // Create brand new service
        await API.post("/services", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Service published successfully!");
      }

      handleCancelEdit();
      fetchServices();
    } catch (err) {
      console.error("Submit Error:", err);
      const message =
        err.response?.data?.message || "Failed to submit form request.";
      setErrorMsg(message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row g-4">
          {/* Publish / Edit Form Section */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 fw-bold text-dark m-0">
                  {editingServiceId
                    ? "Request Service Update"
                    : "Publish a New Service"}
                </h2>
                {editingServiceId && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                    onClick={handleCancelEdit}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {errorMsg && (
                <div className="alert alert-danger py-2 mb-3 small rounded-3 border-0">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">
                    Service Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-control rounded-3"
                    placeholder="e.g. Aman Dish Installation"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">
                      Category
                    </label>
                    <select
                      name="category"
                      className="form-select rounded-3"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a Category</option>
                      {CATEGORIES.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      className="form-control rounded-3"
                      placeholder="1"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">
                    Description
                  </label>
                  <textarea
                    name="description"
                    className="form-control rounded-3"
                    rows="3"
                    placeholder="fast and reliable Dish installation"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary">
                    Certification Document (PDF/Image)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="form-control rounded-3"
                    accept="image/*,.pdf"
                  />
                </div>

                <button
                  type="submit"
                  className={`btn rounded-pill px-4 fw-medium ${editingServiceId ? "btn-warning text-dark" : "btn-primary"}`}
                >
                  {editingServiceId
                    ? "Submit Update Request"
                    : "Publish Service"}
                </button>
              </form>
            </div>
          </div>

          {/* Active Listings Display */}
          <div className="col-lg-6">
            <h2 className="h4 fw-bold mb-3 text-dark">Your Active Listings</h2>

            {loading ? (
              <div className="text-muted">Loading active listings...</div>
            ) : services.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center text-muted bg-white">
                No active service listings created yet.
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {services.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="card border-0 shadow-sm rounded-4 p-3 bg-white"
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h3 className="h5 fw-bold text-dark mb-1">
                          {item.title}
                        </h3>
                        <span className="badge bg-light text-primary border border-info-subtle mb-2">
                          {item.category}
                        </span>
                        <p className="small text-muted mb-1">
                          <strong>Experience:</strong> {item.yearsOfExperience}{" "}
                          yrs
                        </p>
                        <p className="small text-secondary mb-0">
                          {item.description}
                        </p>
                      </div>
                      <span
                        className={`badge rounded-pill ${item.status === "approved" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning-emphasis"}`}
                      >
                        {item.status || "pending"}
                      </span>
                    </div>

                    {item.isUpdatePending && (
                      <div className="alert alert-info py-1 px-3 mb-2 small rounded-3">
                        ⏳ Update request pending admin review.
                      </div>
                    )}

                    <div className="pt-2 border-top d-flex justify-content-end">
                      <button
                        className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-medium"
                        onClick={() => handleEditClick(item)}
                      >
                        Request Service Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderDashboard;
