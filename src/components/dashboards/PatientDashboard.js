import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { FaUser, FaSearch, FaCalendarAlt, FaHistory } from 'react-icons/fa';

// Dashboard Components
import PatientOverview from './patient/PatientOverview';
import BookAppointment from './patient/BookAppointment';
import AppointmentHistory from './patient/AppointmentHistory';

const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const { patients, appointments } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const patient = patients.find(p => p.id === currentUser.id);
  const patientAppointments = appointments.filter(a => a.patientId === currentUser.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaUser />, component: PatientOverview },
    { id: 'book', label: 'Book Appointment', icon: <FaSearch />, component: BookAppointment },
    { id: 'history', label: 'History', icon: <FaHistory />, component: AppointmentHistory }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/patient/${tabId}`);
  };

  if (!patient) {
    return (
      <div className="text-center py-5">
        <div className="spinner"></div>
        <p>Loading patient data...</p>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      {/* Header */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="mb-2">
                <FaUser className="text-primary me-2" />
                {patient.name}
              </h2>
              <p className="text-muted mb-0">
                <strong>Gender:</strong> {patient.gender} | 
                <strong> Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()} | 
                <strong> Total Consultations:</strong> {patient.totalConsultations}
              </p>
              <div className="mt-2">
                <span className="badge bg-info">ID: {patient.uniqueId}</span>
                <span className="badge bg-success">Active Patient</span>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-flex justify-content-end gap-2">
                <span className="badge bg-primary">{patient.totalConsultations} Consultations</span>
                <span className="badge bg-warning">₹{patient.totalSpent.toLocaleString()} Spent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card mb-4">
        <div className="card-body p-0">
          <ul className="nav nav-tabs nav-fill">
            {tabs.map(tab => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.icon} {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content Area */}
      <div className="card">
        <div className="card-body">
          <Routes>
            <Route path="/" element={<PatientOverview />} />
            <Route path="/overview" element={<PatientOverview />} />
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/history" element={<AppointmentHistory />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard; 