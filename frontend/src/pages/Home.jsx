import { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import heroIllustration from '../assets/hero-illustration.png';

// --- CATEGORIES DATA (6 ITEMS) ---
const CATEGORIES = [
  { title: 'Tutor', icon: '📚', desc: 'Academic Support & Skills', gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)' },
  { title: 'Dishworker', icon: '📡', desc: 'Dish Antenna & TV Setup', gradient: 'linear-gradient(135deg, #0d9488, #14b8a6)' },
  { title: 'Electrician', icon: '⚡', desc: 'Wiring, Installs & Repairs', gradient: 'linear-gradient(135deg, #d97706, #f59e0b)' },
  { title: 'Painter', icon: '🎨', desc: 'Interior & Exterior Painting', gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)' },
  { title: 'Cleaner', icon: '🧹', desc: 'Home & Office Cleaning', gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)' },
  { title: 'Plumber', icon: '🔧', desc: 'Pipes, Leaks & Fixtures', gradient: 'linear-gradient(135deg, #e11d48, #f43f5e)' }
];

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [adminContact, setAdminContact] = useState({ phone: '', email: '' });

  useEffect(() => {
    API.get('/services')
      .then(res => {
        const servicesData = res.data.data || res.data;
        setServices(Array.isArray(servicesData) ? servicesData : []);
        if (res.data.adminContact) {
          setAdminContact(res.data.adminContact);
        }
      })
      .catch(err => console.error("Error fetching services:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredServices = services.filter(s => 
    selectedCategory === 'All' || s.category?.toLowerCase() === selectedCategory.toLowerCase()
  );

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8fafc', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* --- FIXED NAVBAR WRAPPER --- */}
      <div className="sticky-top shadow-sm" style={{ zIndex: 1030 }}>
        <Navbar />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="text-white pt-4 pb-4 px-3 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1d3557 0%, #2b4c7e 50%, #1d3557 100%)' }}>
        <div className="container text-center">
          <h1 className="fw-extrabold text-uppercase tracking-wider mb-1 text-white" style={{ letterSpacing: '1.5px', fontSize: '1.8rem' }}>
            FIND TRUSTED HELP FOR YOUR NEED.
          </h1>
          <p className="small text-light opacity-90 mb-3 max-w-2xl mx-auto">
            Connecting clients directly with top-rated local professionals for home and specialized services.
          </p>

          <div 
            className="my-3 overflow-hidden rounded-4 shadow-lg border border-white border-opacity-10 mx-auto" 
            style={{ maxWidth: '1150px', height: '260px' }}
          >
            <img 
              src={heroIllustration} 
              alt="Service Marketplace Illustration" 
              className="w-100 h-100 d-block"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>

          <div id="category-cards" className="row g-2 justify-content-center mt-2">
            {CATEGORIES.map((cat, idx) => (
              <div key={idx} className="col-6 col-sm-4 col-md-2">
                <div 
                  onClick={() => {
                    setSelectedCategory(selectedCategory === cat.title ? 'All' : cat.title);
                    scrollToSection('services-section');
                  }}
                  className="card border-0 rounded-4 p-2 text-start text-white shadow-sm h-100"
                  style={{ 
                    background: cat.gradient, 
                    cursor: 'pointer',
                    transform: selectedCategory === cat.title ? 'scale(1.05)' : 'scale(1)',
                    outline: selectedCategory === cat.title ? '3px solid #ffffff' : 'none',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <div className="fs-3 mb-1">{cat.icon}</div>
                  <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>{cat.title}</h6>
                  <p className="small mb-0 text-white-50 text-truncate" style={{ fontSize: '0.7rem' }}>{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICES GRID SECTION --- */}
      <main id="services-section" className="container my-5 flex-grow-1" style={{ scrollMarginTop: '80px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark m-0">
            {selectedCategory === 'All' ? 'Available Services' : `${selectedCategory} Services`}
          </h2>
          {selectedCategory !== 'All' && (
            <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={() => setSelectedCategory('All')}>
              Show All Services
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-muted">Loading available professionals...</p>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border">
            <p className="text-muted fs-5 mb-0">No services found for this category.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredServices.map(service => (
              <div key={service._id || service.id} className="col-12 col-md-6 col-lg-4">
                <div 
                  onClick={() => setSelectedService(service)}
                  className="card h-100 rounded-4 bg-white border-0 p-4"
                  style={{ 
                    cursor: "pointer", 
                    transition: "all 0.25s ease-in-out",
                    /* --- DARKER BLUE ELEVATION SHADOW --- */
                    boxShadow: "0 14px 30px -4px rgba(15, 23, 42, 0.12), 0 8px 20px -2px rgba(29, 78, 216, 0.35)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px -4px rgba(15, 23, 42, 0.18), 0 12px 28px -2px rgba(29, 78, 216, 0.50)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 14px 30px -4px rgba(15, 23, 42, 0.12), 0 8px 20px -2px rgba(29, 78, 216, 0.35)";
                  }}
                >
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle w-auto align-self-start mb-2 px-3 py-2 rounded-pill">
                    {service.category}
                  </span>
                  <h3 className="h5 fw-bold text-dark mb-2">{service.title}</h3>
                  <p className="text-secondary small mb-3 text-truncate-2">{service.description}</p>
                  <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center text-muted small">
                    <span>{service.yearsOfExperience || 0} yrs experience</span>
                    <span className="text-warning fw-bold">★ {service.provider?.adminRatingScore ?? service.rating ?? 'Unrated'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- SERVICE MODAL --- */}
      {selectedService && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)" }} 
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="modal-dialog modal-dialog-centered" 
            style={{ maxWidth: "560px", width: "92%" }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 border-0 shadow-lg p-3">
              <div className="modal-header border-0 pb-1 pt-2 px-3">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
                  {selectedService.category}
                </span>
                <button type="button" className="btn-close" onClick={() => setSelectedService(null)}></button>
              </div>

              <div className="modal-body px-3 py-2">
                <h4 className="fw-bold text-dark mb-2">{selectedService.title}</h4>
                <p className="text-secondary small mb-3 lh-base">{selectedService.description}</p>

                {/* --- BUSINESS LOCATION --- */}
                {(selectedService.provider?.businessLocation || selectedService.businessLocation) && (
                  <div className="d-flex align-items-center gap-2 mb-3 text-dark small fw-semibold bg-light p-2 rounded-3 border border-light-subtle">
                    <span>📍</span>
                    <span>Location: {selectedService.provider?.businessLocation || selectedService.businessLocation}</span>
                  </div>
                )}

                
                <div className="row g-2 mb-3">
                  {(selectedService.provider?.businessLicenseFile || selectedService.businessLicenseFile) && (
                    <div className={selectedService.provider?.certificationFile || selectedService.certificationFile ? "col-6" : "col-12"}>
                      <div className="p-3 bg-light rounded-3 text-center border h-100 d-flex flex-column justify-content-center align-items-center">
                        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.85rem' }}>Business License</h6>
                        <a 
                          href={`${import.meta.env.VITE_API_URL}${selectedService.provider?.businessLicenseFile || selectedService.businessLicenseFile}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-outline-primary btn-sm rounded-pill w-100 py-1"
                          style={{ fontSize: '0.8rem' }}
                        >
                          📄 View License
                        </a>
                      </div>
                    </div>
                  )}

                  {(selectedService.provider?.certificationFile || selectedService.certificationFile) && (
                    <div className={selectedService.provider?.businessLicenseFile || selectedService.businessLicenseFile ? "col-6" : "col-12"}>
                      <div className="p-3 bg-light rounded-3 text-center border h-100 d-flex flex-column justify-content-center align-items-center">
                        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.85rem' }}>Certifications</h6>
                        <a 
                          href={`${import.meta.env.VITE_API_URL}${selectedService.provider?.certificationFile || selectedService.certificationFile}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-outline-primary btn-sm rounded-pill w-100 py-1"
                          style={{ fontSize: '0.8rem' }}
                        >
                          📄 View Certificate
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/*  Admin Contact Info */}
                <div className="p-3 bg-primary-subtle bg-opacity-50 rounded-3 border border-primary-subtle">
                  <h6 className="fw-bold text-primary mb-1" style={{ fontSize: '0.95rem' }}>Book via Dispatch Admin</h6>
                  <p className="small text-secondary mb-2" style={{ fontSize: '0.8rem' }}>To request this provider, contact our dispatch team:</p>
                  <div className="fw-bold text-dark small d-flex flex-column gap-1">
                    <div>📞 Phone: <span className="text-primary">{adminContact.phone || "Loading..."}</span></div>
                    <div>✉️ Email: <span className="text-primary">{adminContact.email || "Loading..."}</span></div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 pt-2 pb-1 px-3">
                <button className="btn btn-secondary rounded-pill px-4" onClick={() => setSelectedService(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER SECTION --- */}
      <footer className="mt-auto text-white py-5" style={{ backgroundColor: '#1e293b' }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-md-5">
              <h4 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">🛠️ ASSIST</h4>
              <p className="text-white-50 small mb-3">
                ASSIST is an open local service marketplace designed to instantly connect clients with verified, skilled professionals across daily essential needs.
              </p>
              <div className="small text-light bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-10">
                <div className="fw-bold text-white mb-1">Central Admin Contact:</div>
                <div>📞 {adminContact.phone || 'Loading...'}</div>
                <div>✉️ {adminContact.email || 'Loading...'}</div>
              </div>
            </div>

            <div className="col-6 col-md-3 offset-md-1">
              <h6 className="fw-bold text-uppercase text-light mb-3">Services</h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 text-white-50 mb-0">
                <li>
                  <a href="#services-section" onClick={(e) => { e.preventDefault(); setSelectedCategory('All'); scrollToSection('services-section'); }} className="text-white-50 text-decoration-none">
                    All Services
                  </a>
                </li>
                <li>
                  <a href="#category-cards" onClick={(e) => { e.preventDefault(); scrollToSection('category-cards'); }} className="text-white-50 text-decoration-none">
                    Categories
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-6 col-md-3">
              <h6 className="fw-bold text-uppercase text-light mb-3">Support</h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 text-white-50 mb-0">
                <li>
                  <a href={`mailto:${adminContact.email}`} className="text-white-50 text-decoration-none">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="my-4 opacity-25" />
          <div className="text-center small text-white-50">
            © 2026 ASSIST Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;