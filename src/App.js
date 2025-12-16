import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Components
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard Components
import HospitalAdminDashboard from './components/dashboards/HospitalAdminDashboard';
import DoctorDashboard from './components/dashboards/DoctorDashboard';
import PatientDashboard from './components/dashboards/PatientDashboard';
import DoctorAppointments from './components/dashboards/doctor/DoctorAppointments';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

// Landing Page
import LandingPage from './components/LandingPage';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <div className="App">
            <Navbar />
            <main className="container mt-4">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Hospital Admin Routes */}
                <Route 
                  path="/hospital-admin/*" 
                  element={
                    <ProtectedRoute role="hospital_admin">
                      <HospitalAdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Doctor Routes */}
                <Route 
                  path="/doctor/*" 
                  element={
                    <ProtectedRoute role="doctor">
                      <DoctorDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Patient Routes */}
                <Route 
                  path="/patient/*" 
                  element={
                    <ProtectedRoute role="patient">
                      <PatientDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Appointments Route */}
                <Route path="/appointments" element={<DoctorAppointments />} />
                
                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App; 