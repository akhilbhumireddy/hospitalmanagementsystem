import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { FaHospital, FaUserMd, FaUser } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    // Patient specific fields
    gender: '',
    dateOfBirth: '',
    uniqueId: '',
    // Doctor specific fields
    qualifications: '',
    specializations: [],
    yearsOfExperience: '',
    // Hospital specific fields
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addHospital, addDoctor, addPatient, departments } = useData();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'select-multiple') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({
        ...formData,
        [name]: selectedOptions
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      let userData = null;

      switch (formData.role) {
        case 'hospital_admin':
          if (!formData.name || !formData.location) {
            throw new Error('Hospital name and location are required');
          }
          userData = addHospital({
            name: formData.name,
            email: formData.email,
            location: formData.location
          });
          break;

        case 'doctor':
          if (!formData.name || !formData.qualifications || formData.specializations.length === 0) {
            throw new Error('Name, qualifications, and at least one specialization are required');
          }
          userData = addDoctor({
            name: formData.name,
            email: formData.email,
            qualifications: formData.qualifications,
            specializations: formData.specializations,
            yearsOfExperience: parseInt(formData.yearsOfExperience) || 0
          });
          break;

        case 'patient':
          if (!formData.name || !formData.gender || !formData.dateOfBirth || !formData.uniqueId) {
            throw new Error('All patient fields are required');
          }
          userData = addPatient({
            name: formData.name,
            email: formData.email,
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            uniqueId: formData.uniqueId
          });
          break;

        default:
          throw new Error('Invalid role');
      }

      // Add role to user data and register
      const userWithRole = { ...userData, role: formData.role };
      register(userWithRole);

      // Redirect to appropriate dashboard
      switch (formData.role) {
        case 'hospital_admin':
          navigate('/hospital-admin/departments');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'patient':
          navigate('/patient');
          break;
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'hospital_admin':
        return (
          <div className="mb-3">
            <label className="form-label">Hospital Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter hospital location"
              required
            />
          </div>
        );

      case 'doctor':
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Qualifications</label>
              <input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., MBBS, MD, PhD"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Specializations</label>
              <select
                name="specializations"
                value={formData.specializations}
                onChange={handleChange}
                className="form-select"
                multiple
                required
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <small className="text-muted">Hold Ctrl/Cmd to select multiple</small>
            </div>
            <div className="mb-3">
              <label className="form-label">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter years of experience"
                min="0"
                required
              />
            </div>
          </>
        );

      case 'patient':
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Unique ID (Aadhar/Passport)</label>
              <input
                type="text"
                name="uniqueId"
                value={formData.uniqueId}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your unique ID"
                required
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card fade-in">
          <div className="card-body p-5">
            <h2 className="text-center mb-4">Register</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="hospital_admin">Hospital Admin</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  {formData.role === 'hospital_admin' ? 'Hospital Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={
                    formData.role === 'hospital_admin' 
                      ? 'Enter hospital name' 
                      : 'Enter your full name'
                  }
                  required
                />
              </div>

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

              {renderRoleSpecificFields()}

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter password (min 6 characters)"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <div className="text-center">
              <p className="mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 