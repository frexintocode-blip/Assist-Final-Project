import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', category: '', description: '', yearsOfExperience: '' });
  const [certFile, setCertFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get(`/services/${id}`)
      .then(res => {
        const item = res.data.data || res.data;
        setFormData({
          title: item.title,
          category: item.category,
          description: item.description,
          yearsOfExperience: item.yearsOfExperience
        });
      })
      .catch(() => {});
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('yearsOfExperience', formData.yearsOfExperience);
    if (certFile) data.append('certificationFile', certFile);

    try {
      await API.put(`/services/${id}/request-update`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Update changes sent to administrative log queue for verification.');
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch {
      setMessage('Error logging update pipeline modifications.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="card p-4 border mx-auto" style={{ maxWidth: '600px' }}>
          <h2 className="fw-bold mb-2">Modify Listing Details</h2>
          <p className="text-muted small mb-4">Edits undergo systemic checking before going public.</p>
          
          {message && <div className="alert alert-info py-2 small">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Service Title</label>
              <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Category</label>
              <input type="text" name="category" className="form-control" value={formData.category} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Years of Experience</label>
              <input type="number" name="yearsOfExperience" className="form-control" value={formData.yearsOfExperience} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Description</label>
              <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} required></textarea>
            </div>
            <div className="mb-4">
              <label className="form-label small fw-semibold">New Certification Proof (Optional)</label>
              <input type="file" className="form-control" onChange={e => setCertFile(e.target.files[0])} />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary px-4">Submit for Review</button>
              <button type="button" className="btn btn-light border px-4" onClick={() => navigate('/dashboard')}>Back</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditService;