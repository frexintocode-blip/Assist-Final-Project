import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [pendingServices, setPendingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [ratings, setRatings] = useState({});

  const fetchAudits = async (showLoadingSpinner = false) => {
    if (showLoadingSpinner) setLoading(true);
    try {
      let res;
      try {
        res = await API.get("/admin/pending-updates");
      } catch {
        res = await API.get("/admin/dashboard");
      }

      const data = res.data.data || res.data;
      setPendingServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Failed to fetch pending audits:",
        err.response?.data || err.message,
      );
      setErrorMsg(
        "Could not fetch pending updates. Make sure backend route exists and server is active.",
      );
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setErrorMsg("");
      if (isMounted) {
        await fetchAudits(true);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleModerateService = async (serviceId, status) => {
    setErrorMsg("");
    try {
      await API.patch(`/admin/service/${serviceId}`, { status });
      // Background re-fetch keeps scroll position static
      await fetchAudits(false);
    } catch (err) {
      console.error("Moderate Service Error:", err.response?.data);
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to moderate service status.";
      setErrorMsg(`Error (${err.response?.status || 400}): ${serverMessage}`);
    }
  };

  const handleAuditUpdate = async (serviceId, actionType) => {
    setErrorMsg("");
    try {
      const payload = {
        action: actionType,
        status: actionType === "approve" ? "approved" : "rejected",
      };

      await API.patch(`/admin/service/${serviceId}/approve-update`, payload);
      // Background re-fetch keeps scroll position static
      await fetchAudits(false);
    } catch (err) {
      console.error("Audit Error Details:", err.response?.data);
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update service status.";
      setErrorMsg(`Error (${err.response?.status || 400}): ${serverMessage}`);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this service listing?",
      )
    )
      return;

    setErrorMsg("");
    try {
      await API.delete(`/admin/service/${serviceId}`);
      await fetchAudits(false);
    } catch (err) {
      console.error("Delete Service Error:", err.response?.data);
      setErrorMsg(
        `Delete Failed: ${err.response?.data?.message || "Server error"}`,
      );
    }
  };

  const handleDeleteProvider = async (providerId) => {
    if (!providerId) {
      alert("No provider ID attached to this listing.");
      return;
    }
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this provider account?",
      )
    )
      return;

    setErrorMsg("");
    try {
      await API.delete(`/admin/provider/${providerId}`);
      await fetchAudits(false);
    } catch (err) {
      console.error("Delete Provider Error:", err.response?.data);
      setErrorMsg(
        `Delete Provider Failed: ${err.response?.data?.message || "Server error"}`,
      );
    }
  };

  const handleUpdateRating = async (providerId, itemId) => {
    const ratingValue = ratings[providerId] || ratings[itemId];

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert("Please enter a valid rating between 1 and 5.");
      return;
    }

    const numRating = Number(ratingValue);

    try {
      if (providerId) {
        await API.patch(`/admin/provider/${providerId}/rating`, {
          adminRatingScore: numRating,
          rating: numRating,
        });
      }

      setPendingServices((prevServices) =>
        prevServices.map((service) => {
          const currentServiceId = service._id || service.id;
          const currentProviderId =
            typeof service.provider === "object"
              ? service.provider?._id
              : service.provider;

          if (currentServiceId === itemId || currentProviderId === providerId) {
            return {
              ...service,
              rating: numRating,
              provider:
                typeof service.provider === "object"
                  ? { ...service.provider, adminRatingScore: numRating }
                  : service.provider,
            };
          }
          return service;
        }),
      );

      alert("Rating updated successfully!");
    } catch (err) {
      console.error("Rating Error Details:", err.response?.data);
      alert(
        `Rating Update Failed: ${err.response?.data?.message || "Server error"}`,
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-1 text-primary">Admin Control Desk</h1>
            <p className="text-secondary m-0">
              Audit, rate, moderate, and manage provider services and accounts.
            </p>
          </div>
          <button
            className="btn btn-outline-primary btn-sm rounded-pill px-3"
            onClick={() => {
              setErrorMsg("");
              fetchAudits(true);
            }}
          >
            Refresh Queue
          </button>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 mb-4 small rounded-3 border-0 shadow-sm">
            {errorMsg}
          </div>
        )}

        <h2 className="fw-bold h5 text-dark mb-4">Pending Audit Queue</h2>

        {loading ? (
          <div className="text-center py-5 text-muted">
            Loading verification queue...
          </div>
        ) : pendingServices.length === 0 ? (
          <div className="border-0 rounded-4 p-5 bg-white shadow-sm text-center text-muted">
            No listing updates or pending services waiting inside the queue.
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {pendingServices.map((item) => {
              const itemId = item._id || item.id;
              const pending = item.pendingUpdates || {};
              const hasPendingUpdates =
                item.isUpdatePending || Object.keys(pending).length > 0;
              const providerObj =
                typeof item.provider === "object" ? item.provider : null;
              const providerId =
                providerObj?._id || item.provider || item.providerId;

              const activeRating =
                providerObj?.adminRatingScore ?? item.rating;

              return (
                <div
                  key={itemId}
                  className="card border-0 rounded-4 bg-white shadow-sm overflow-hidden"
                >
                  <div className="card-body p-4">
                    <div className="row g-4">
                      <div className="col-md-6 border-end-md">
                        <div className="p-3 bg-light-subtle rounded-3 h-100 border border-primary-subtle d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1 rounded">
                                Original Profile
                              </span>
                              <span className="badge bg-warning-subtle text-warning-emphasis fw-bold fs-6 border border-warning-subtle px-2 py-1">
                                ★{" "}
                                {activeRating
                                  ? Number(activeRating).toFixed(1)
                                  : "N/A"}{" "}
                                / 5
                              </span>
                            </div>

                            <h3 className="h5 fw-bold text-dark mb-2">
                              {item.title}
                            </h3>
                            <p className="small text-muted mb-2">
                              <strong className="text-secondary">
                                Status:
                              </strong>{" "}
                              <span
                                className={`badge rounded-pill ${item.status === "approved" ? "bg-success-subtle text-success" : item.status === "rejected" ? "bg-danger-subtle text-danger" : "bg-info-subtle text-info-emphasis"}`}
                              >
                                {item.status || "pending"}
                              </span>
                            </p>
                            <p className="small text-muted mb-1">
                              <strong className="text-secondary">
                                Category:
                              </strong>{" "}
                              {item.category}
                            </p>
                            <p className="small text-muted mb-1">
                              <strong className="text-secondary">
                                Experience:
                              </strong>{" "}
                              {item.yearsOfExperience} yrs
                            </p>
                            <p className="small text-muted mb-3">
                              <strong className="text-secondary">
                                Description:
                              </strong>{" "}
                              {item.description}
                            </p>

                            {providerObj && (
                              <div className="p-3 bg-white rounded-3 border border-light-subtle small mb-3 shadow-sm">
                                <p className="mb-1 fw-bold text-primary">
                                  Provider Info
                                </p>
                                <p className="mb-1 text-secondary">
                                  <strong>Name:</strong> {providerObj.name || "N/A"}
                                </p>
                                <p className="mb-1 text-secondary">
                                  <strong>Email:</strong> {providerObj.email || "N/A"}
                                </p>
                                <p className="mb-1 text-secondary">
                                  <strong>Phone:</strong> {providerObj.phone || "N/A"}
                                </p>
                                <p className="mb-0 text-secondary">
                                  <strong>Assigned Rating:</strong> ★{" "}
                                  {providerObj.adminRatingScore ||
                                    item.rating ||
                                    "Unrated"}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="p-3 bg-white rounded-3 border border-light-subtle shadow-sm mt-3">
                            <p className="small fw-bold text-secondary mb-2">
                              Moderate Initial Listing:
                            </p>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-primary btn-sm flex-fill rounded-pill fw-medium"
                                onClick={() =>
                                  handleModerateService(itemId, "approved")
                                }
                              >
                                Approve Service
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm flex-fill rounded-pill"
                                onClick={() =>
                                  handleModerateService(itemId, "rejected")
                                }
                              >
                                Reject Service
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 bg-light-subtle rounded-3 h-100 border border-primary-subtle d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="badge bg-info-subtle text-info-emphasis fw-semibold px-2 py-1 rounded">
                                Proposed Updates
                              </span>
                            </div>

                            {hasPendingUpdates ? (
                              <div className="mb-3">
                                <h3 className="h5 fw-bold text-dark mb-2">
                                  {pending.title || item.title}
                                </h3>
                                <p className="small text-muted mb-1">
                                  <strong className="text-secondary">
                                    Category:
                                  </strong>{" "}
                                  {pending.category || item.category}
                                </p>
                                <p className="small text-muted mb-1">
                                  <strong className="text-secondary">
                                    Experience:
                                  </strong>{" "}
                                  {pending.yearsOfExperience ||
                                    item.yearsOfExperience}{" "}
                                  yrs
                                </p>
                                <p className="small text-muted mb-3">
                                  <strong className="text-secondary">
                                    Description:
                                  </strong>{" "}
                                  {pending.description || item.description}
                                </p>

                                <div className="d-flex gap-2 pt-2 border-top mb-3">
                                  <button
                                    className="btn btn-success btn-sm px-3 fw-medium rounded-pill flex-fill"
                                    onClick={() =>
                                      handleAuditUpdate(itemId, "approve")
                                    }
                                  >
                                    Approve Modifications
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm px-3 rounded-pill flex-fill"
                                    onClick={() =>
                                      handleAuditUpdate(itemId, "reject")
                                    }
                                  >
                                    Reject Modifications
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="small text-muted fst-italic mb-3 p-3 bg-white rounded-3 border border-light-subtle text-center shadow-sm">
                                No pending modification updates for this listing.
                              </p>
                            )}

                            <div className="p-3 bg-white rounded-3 border border-light-subtle mb-3 shadow-sm">
                              <label className="form-label small fw-bold text-secondary mb-2">
                                Update Provider Rating (1 to 5)
                              </label>
                              <div className="input-group input-group-sm">
                                <input
                                  type="number"
                                  min="1"
                                  max="5"
                                  step="0.1"
                                  className="form-control border-primary-subtle"
                                  placeholder="e.g. 4.5"
                                  value={
                                    ratings[providerId] || ratings[itemId] || ""
                                  }
                                  onChange={(e) =>
                                    setRatings({
                                      ...ratings,
                                      [providerId || itemId]: e.target.value,
                                    })
                                  }
                                />
                                <button
                                  className="btn btn-primary px-3 fw-medium"
                                  type="button"
                                  onClick={() =>
                                    handleUpdateRating(providerId, itemId)
                                  }
                                >
                                  Set Rating
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="d-flex gap-2 pt-2 border-top mt-3">
                            <button
                              className="btn btn-outline-danger btn-sm rounded-pill flex-fill"
                              onClick={() => handleDeleteService(itemId)}
                            >
                              Delete Service
                            </button>
                            <button
                              className="btn btn-danger btn-sm rounded-pill flex-fill"
                              onClick={() => handleDeleteProvider(providerId)}
                            >
                              Delete Provider
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;