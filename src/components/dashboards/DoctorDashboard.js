import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { FaUserMd, FaHospital, FaCalendarAlt, FaChartLine, FaPlus } from 'react-icons/fa';

// Dashboard Components
import DoctorOverview from './doctor/DoctorOverview';
import HospitalAssociations from './doctor/HospitalAssociations';
import AvailabilityManagement from './doctor/AvailabilityManagement';
import EarningsReports from './doctor/EarningsReports';
import DoctorAppointments from './doctor/DoctorAppointments';

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const { doctors, hospitals, appointments } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const doctor = doctors.find(d => d.id === currentUser.id);
  const doctorAppointments = appointments.filter(a => a.doctorId === currentUser.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaUserMd />, component: DoctorOverview },
    { id: 'hospitals', label: 'Hospitals', icon: <FaHospital />, component: HospitalAssociations },
    { id: 'availability', label: 'Availability', icon: <FaCalendarAlt />, component: AvailabilityManagement },
    { id: 'earnings', label: 'Earnings', icon: <FaChartLine />, component: EarningsReports },
    { id: 'appointments', label: 'Appointments', icon: <FaCalendarAlt />, component: DoctorAppointments },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/doctor/${tabId}`);
  };

  if (!doctor) {
    return (
      <div className="text-center py-5">
        <div className="spinner"></div>
        <p>Loading doctor data...</p>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="mb-2">
                <FaUserMd className="text-primary me-2" />
                Dr. {doctor.name}
              </h2>
              <p className="text-muted mb-0">
                <strong>Qualifications:</strong> {doctor.qualifications} | 
                <strong> Experience:</strong> {doctor.yearsOfExperience} years | 
                <strong> Total Earnings:</strong> ₹{doctor.totalEarnings.toLocaleString()}
              </p>
              <div className="mt-2">
                {doctor.specializations.map(spec => (
                  <span key={spec} className="badge bg-primary me-1">{spec}</span>
                ))}
              </div>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-flex justify-content-end gap-2">
                <span className="badge bg-success">Active</span>
                <span className="badge bg-primary">{doctor.hospitalAssociations.length} Hospitals</span>
                <span className="badge bg-info">{doctor.totalConsultations} Consultations</span>
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
            <Route path="/" element={<DoctorOverview />} />
            <Route path="/overview" element={<DoctorOverview />} />
            <Route path="/hospitals" element={<HospitalAssociations />} />
            <Route path="/availability" element={<AvailabilityManagement />} />
            <Route path="/earnings" element={<EarningsReports />} />
            <Route path="/appointments" element={<DoctorAppointments />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 