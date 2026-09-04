import { Link } from 'react-router-dom';

const ServiceCard = ({ service, isOwnDashboard }) => {
  return (
    <div className="card h-100 border p-3 bg-white">
      <div className="card-body d-flex flex-column p-0">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="badge bg-light text-dark border px-2 py-1 fs-7">{service.category}</span>
          {service.isUpdatePending && (
            <span className="badge bg-warning text-dark px-2 py-1">Pending Audit</span>
          )}
        </div>
        <h4 className="card-title h5 fw-bold mb-2 text-dark">{service.title}</h4>
        <p className="card-text text-secondary small flex-grow-1 mb-3">
          {service.description?.substring(0, 120)}...
        </p>
        <div className="border-top pt-3 mt-auto d-flex justify-content-between align-items-center">
          <span className="small text-muted fw-medium">{service.yearsOfExperience} yrs experience</span>
          {isOwnDashboard && (
            <Link to={`/edit-service/${service._id}`} className="btn btn-outline-primary btn-sm px-3">
              Edit Listing
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;