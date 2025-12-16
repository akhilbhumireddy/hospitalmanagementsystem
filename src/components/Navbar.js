import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaHospital, FaUserMd, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const getRoleIcon = () => {
    switch (currentUser?.role) {
      case 'hospital_admin':
        return <FaHospital className="me-2" />;
      case 'doctor':
        return <FaUserMd className="me-2" />;
      case 'patient':
        return <FaUser className="me-2" />;
      default:
        return null;
    }
  };

  const getRoleName = () => {
    switch (currentUser?.role) {
      case 'hospital_admin':
        return 'Hospital Admin';
      case 'doctor':
        return 'Doctor';
      case 'patient':
        return 'Patient';
      default:
        return '';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        <Link className="navbar-brand" to={currentUser ? `/${currentUser.role === 'hospital_admin' ? 'hospital-admin' : currentUser.role}` : "/"}>
          <FaHospital className="me-2" />
          HMS
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!currentUser ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item d-flex align-items-center gap-2">
                {getRoleIcon()}
                <span style={{ fontWeight: 600 }}>{currentUser.name}</span>
                <span className="badge bg-primary ms-2">{getRoleName()}</span>
                <Link className="btn btn-outline-primary btn-sm ms-3" to={`/${currentUser.role === 'hospital_admin' ? 'hospital-admin' : currentUser.role}`}>
                  Dashboard
                </Link>
                <button className="btn btn-outline-danger btn-sm ms-2" onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 