import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { FaHospital, FaUserMd, FaUser } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { hospitals, doctors, patients } = useData();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let user = null;
      let role = null;
      // Search all user types by email
      user = hospitals.find(h => h.email === formData.email);
      if (user) role = 'hospital_admin';
      if (!user) {
        user = doctors.find(d => d.email === formData.email);
        if (user) role = 'doctor';
      }
      if (!user) {
        user = patients.find(p => p.email === formData.email);
        if (user) role = 'patient';
      }
      if (!user) {
        throw new Error('User not found');
      }
      // In a real app, you would verify password here
      if (formData.password.length < 3) {
        throw new Error('Password must be at least 3 characters');
      }
      // Add role to user object
      const userWithRole = { ...user, role };
      login(userWithRole);
      // Redirect to appropriate dashboard
      switch (role) {
        case 'hospital_admin':
          navigate('/hospital-admin');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'patient':
          navigate('/patient');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card fade-in">
          <div className="card-body p-5">
            <h2 className="text-center mb-4">Login</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="text-center">
              <p className="mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-decoration-none">
                  Register here
                </Link>
              </p>
            </div>

            <div className="mt-4">
              <h6 className="text-muted">Demo Accounts:</h6>
              <small className="text-muted">
                <strong>Hospital Admin:</strong> admin@hospital.com / any password<br/>
                <strong>Doctor:</strong> doctor@example.com / any password<br/>
                <strong>Patient:</strong> patient@example.com / any password
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 