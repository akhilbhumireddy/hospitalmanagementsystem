import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { FaHospital, FaUserMd, FaChartLine, FaPlus, FaCog } from 'react-icons/fa';

// Dashboard Components
import HospitalOverview from './hospital/HospitalOverview';
import DepartmentManagement from './hospital/DepartmentManagement';
import DoctorManagement from './hospital/DoctorManagement';
import RevenueReports from './hospital/RevenueReports';

const HospitalAdminDashboard = () => {
  const { currentUser } = useAuth();
  const { hospitals, doctors, appointments } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const hospital = hospitals.find(h => h.id === currentUser.id);
  const associatedDoctors = doctors.filter(d => 
    d.hospitalAssociations.some(assoc => assoc.hospitalId === currentUser.id)
  );
  const hospitalAppointments = appointments.filter(a => a.hospitalId === currentUser.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaHospital />, component: HospitalOverview },
    { id: 'departments', label: 'Departments', icon: <FaCog />, component: DepartmentManagement },
    { id: 'doctors', label: 'Doctors', icon: <FaUserMd />, component: DoctorManagement },
    { id: 'revenue', label: 'Revenue', icon: <FaChartLine />, component: RevenueReports }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/hospital-admin/${tabId}`);
  };

  if (!hospital) {
    return (
      <div className="text-center py-5">
        <div className="spinner"></div>
        <p>Loading hospital data...</p>
      </div>
    );
  }

  return (
    <div className="hospital-admin-dashboard">
      {/* Header */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="mb-2">
                <FaHospital className="text-primary me-2" />
                {hospital.name}
              </h2>
              <p className="text-muted mb-0">
                <strong>Location:</strong> {hospital.location} | 
                <strong> Total Revenue:</strong> ₹{hospital.totalRevenue.toLocaleString()} | 
                <strong> Consultations:</strong> {hospital.totalConsultations}
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-flex justify-content-end gap-2">
                <span className="badge bg-success">Active</span>
                <span className="badge bg-primary">{associatedDoctors.length} Doctors</span>
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
            <Route path="/" element={<HospitalOverview />} />
            <Route path="/overview" element={<HospitalOverview />} />
            <Route path="/departments" element={<DepartmentManagement />} />
            <Route path="/doctors" element={<DoctorManagement />} />
            <Route path="/revenue" element={<RevenueReports />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default HospitalAdminDashboard; 