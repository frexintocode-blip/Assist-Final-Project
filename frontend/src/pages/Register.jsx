import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'provider', businessLocation: ''
  });
  const [licenseFile, setLicenseFile] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setLicenseFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('phone', formData.phone);
    data.append('role', formData.role);

    if (formData.role === 'provider') {
      data.append('businessLocation', formData.businessLocation);
      if (licenseFile) {
        data.append('businessLicenseFile', licenseFile);
      }
    }

    try {
      // Do not manually set Content-Type header; Axios auto-detects FormData and sets the correct multipart boundary
      await API.post('/auth/register', data);
      alert('Account created successfully! Please Login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container d-flex justify-content-center py-5">
        <div className="card p-4 border" style={{ width: '100%', maxWidth: '500px' }}>
          <h2 className="fw-bold mb-4 text-center">Create account</h2>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Full Name</label>
              <input type="text" name="name" className="form-control" onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email</label>
              <input type="email" name="email" className="form-control" onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Password</label>
              <input type="password" name="password" className="form-control" onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Phone Number</label>
              <input type="text" name="phone" className="form-control" onChange={handleChange} required />
            </div>

            {formData.role === 'provider' && (
              <div className="border p-3 bg-light rounded-3 mb-3">
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Business Location</label>
                  <input type="text" name="businessLocation" className="form-control" placeholder="e.g. Addis Ababa" onChange={handleChange} required />
                </div>
                <div className="mb-0">
                  <label className="form-label small fw-semibold">Business License File</label>
                  <input type="file" className="form-control" onChange={handleFileChange} />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100 py-2 mt-2">Sign up</button>
          </form>
          <p className="text-center small text-muted mt-4 mb-0">
            Already registered? <Link to="/login" className="text-primary text-decoration-none">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;