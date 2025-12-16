import React from 'react';
import { Link } from 'react-router-dom';
import { FaHospital, FaUserMd, FaUser, FaCalendarAlt, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const LandingPage = () => {
  const features = [
    {
      icon: <FaHospital className="text-primary" size={40} />,
      title: 'Hospital Management',
      description: 'Comprehensive hospital registration and department management system.'
    },
    {
      icon: <FaUserMd className="text-success" size={40} />,
      title: 'Doctor Portal',
      description: 'Doctor registration, specialization management, and availability scheduling.'
    },
    {
      icon: <FaUser className="text-info" size={40} />,
      title: 'Patient Portal',
      description: 'Easy patient registration and appointment booking system.'
    },
    {
      icon: <FaCalendarAlt className="text-warning" size={40} />,
      title: 'Appointment Booking',
      description: 'Seamless appointment scheduling with real-time availability.'
    },
    {
      icon: <FaChartLine className="text-danger" size={40} />,
      title: 'Revenue Tracking',
      description: 'Automated revenue sharing and financial reporting system.'
    },
    {
      icon: <FaShieldAlt className="text-secondary" size={40} />,
      title: 'Secure & Reliable',
      description: 'Role-based access control and secure data management.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section text-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4 text-white">
                Hospital & Appointment Management System
              </h1>
              <p className="lead mb-4 text-white-50">
                Streamline your healthcare operations with our comprehensive management platform. 
                Connect hospitals, doctors, and patients seamlessly.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/register" className="btn btn-light btn-lg px-4">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">Key Features</h2>
              <p className="lead text-muted">
                Everything you need to manage your healthcare facility efficiently
              </p>
            </div>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      {feature.icon}
                    </div>
                    <h5 className="card-title fw-bold">{feature.title}</h5>
                    <p className="card-text text-muted">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">How It Works</h2>
              <p className="lead text-muted">
                Simple steps to get started with our platform
              </p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="step-card">
                <div className="step-number mb-3">1</div>
                <h5 className="fw-bold">Register</h5>
                <p className="text-muted">
                  Create your account as a Hospital Admin, Doctor, or Patient
                </p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="step-card">
                <div className="step-number mb-3">2</div>
                <h5 className="fw-bold">Configure</h5>
                <p className="text-muted">
                  Set up departments, specializations, and availability schedules
                </p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="step-card">
                <div className="step-number mb-3">3</div>
                <h5 className="fw-bold">Manage</h5>
                <p className="text-muted">
                  Book appointments, track revenue, and manage operations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold mb-4">
                Ready to Transform Your Healthcare Management?
              </h2>
              <p className="lead mb-4">
                Join thousands of healthcare professionals who trust our platform
              </p>
              <Link to="/register" className="btn btn-light btn-lg px-5">
                Start Your Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-dark text-white">
        <div className="container text-center">
          <p className="mb-0">
            © 2024 Hospital Management System. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 60vh;
          display: flex;
          align-items: center;
        }
        
        .step-card {
          padding: 2rem;
        }
        
        .step-number {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 