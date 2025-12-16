import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useData } from '../../../contexts/DataContext';
import { FaCalendarAlt, FaUserMd, FaHospital, FaChartLine } from 'react-icons/fa';

const PatientOverview = () => {
  const { currentUser } = useAuth();
  const { patients, appointments, doctors, hospitals } = useData();

  const patient = patients.find(p => p.id === currentUser.id);
  const patientAppointments = appointments.filter(a => a.patientId === currentUser.id);
  const recentAppointments = patientAppointments.slice(-5).reverse();

  const getAppointmentStats = () => {
    const now = new Date();
    const upcoming = patientAppointments.filter(a => 
      new Date(a.timeSlot.startTime) > now && a.status === 'confirmed'
    ).length;
    const past = patientAppointments.filter(a => 
      new Date(a.timeSlot.startTime) < now && a.status === 'confirmed'
    ).length;
    const cancelled = patientAppointments.filter(a => a.status === 'cancelled').length;

    return { upcoming, past, cancelled };
  };

  const getDoctorStats = () => {
    const uniqueDoctors = [...new Set(patientAppointments.map(a => a.doctorId))];
    return uniqueDoctors.length;
  };

  const getHospitalStats = () => {
    const uniqueHospitals = [...new Set(patientAppointments.map(a => a.hospitalId))];
    return uniqueHospitals.length;
  };

  const stats = getAppointmentStats();
  const uniqueDoctors = getDoctorStats();
  const uniqueHospitals = getHospitalStats();

  const metrics = [
    {
      title: 'Upcoming Appointments',
      value: stats.upcoming,
      icon: <FaCalendarAlt className="text-primary" />,
      color: 'primary'
    },
    {
      title: 'Completed Consultations',
      value: stats.past,
      icon: <FaUserMd className="text-success" />,
      color: 'success'
    },
    {
      title: 'Total Spent',
      value: `₹${patient.totalSpent.toLocaleString()}`,
      icon: <FaChartLine className="text-warning" />,
      color: 'warning'
    },
    {
      title: 'Hospitals Visited',
      value: uniqueHospitals,
      icon: <FaHospital className="text-info" />,
      color: 'info'
    }
  ];

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (appointment) => {
    const now = new Date();
    const appointmentDate = new Date(appointment.timeSlot.startTime);
    
    if (appointment.status === 'cancelled') {
      return <span className="badge bg-danger">Cancelled</span>;
    }
    
    if (appointmentDate < now) {
      return <span className="badge bg-secondary">Completed</span>;
    }
    
    return <span className="badge bg-success">Upcoming</span>;
  };

  return (
    <div className="patient-overview">
      <h3 className="mb-4">Patient Overview</h3>

      {/* Key Metrics */}
      <div className="row g-4 mb-4">
        {metrics.map((metric, index) => (
          <div key={index} className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="mb-3">
                  {metric.icon}
                </div>
                <h4 className="fw-bold text-${metric.color}">{metric.value}</h4>
                <p className="text-muted mb-0">{metric.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Appointments */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">Recent Appointments</h5>
            </div>
            <div className="card-body">
              {recentAppointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Doctor</th>
                        <th>Hospital</th>
                        <th>Fee</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAppointments.map(appointment => {
                        const doctor = doctors.find(d => d.id === appointment.doctorId);
                        const hospital = hospitals.find(h => h.id === appointment.hospitalId);
                        
                        return (
                          <tr key={appointment.id}>
                            <td>
                              <div>
                                <strong>{formatDate(appointment.timeSlot.startTime)}</strong>
                                <br />
                                <small className="text-muted">
                                  {formatTime(appointment.timeSlot.startTime)} - {formatTime(appointment.timeSlot.endTime)}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <h6 className="mb-1">Dr. {doctor?.name}</h6>
                                <small className="text-muted">
                                  {doctor?.qualifications}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <h6 className="mb-1">{hospital?.name}</h6>
                                <small className="text-muted">
                                  {hospital?.location}
                                </small>
                              </div>
                            </td>
                            <td>
                              <strong>₹{appointment.consultationFee}</strong>
                            </td>
                            <td>
                              {getStatusBadge(appointment)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <FaCalendarAlt className="text-muted mb-3" size={50} />
                  <h5>No Appointments Yet</h5>
                  <p className="text-muted">
                    You haven't booked any appointments yet. Start by booking your first consultation.
                  </p>
                  <a href="/patient/book" className="btn btn-primary">
                    Book Appointment
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">Patient Information</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6>Personal Details</h6>
                <ul className="list-unstyled">
                  <li><strong>Name:</strong> {patient.name}</li>
                  <li><strong>Email:</strong> {patient.email}</li>
                  <li><strong>Gender:</strong> {patient.gender}</li>
                  <li><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</li>
                  <li><strong>Unique ID:</strong> {patient.uniqueId}</li>
                </ul>
              </div>
              
              <div className="mb-3">
                <h6>Health Summary</h6>
                <ul className="list-unstyled">
                  <li><strong>Total Consultations:</strong> {patient.totalConsultations}</li>
                  <li><strong>Doctors Consulted:</strong> {uniqueDoctors}</li>
                  <li><strong>Hospitals Visited:</strong> {uniqueHospitals}</li>
                  <li><strong>Total Spent:</strong> ₹{patient.totalSpent.toLocaleString()}</li>
                </ul>
              </div>

              <div className="mb-3">
                <h6>Quick Actions</h6>
                <div className="d-grid gap-2">
                  <a href="/patient/book" className="btn btn-primary btn-sm">
                    <FaCalendarAlt className="me-2" />
                    Book New Appointment
                  </a>
                  <a href="/patient/history" className="btn btn-outline-primary btn-sm">
                    <FaCalendarAlt className="me-2" />
                    View History
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Health Tips</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="text-center">
                <FaCalendarAlt className="text-primary mb-2" size={30} />
                <h6>Regular Check-ups</h6>
                <small className="text-muted">
                  Schedule regular health check-ups to maintain good health and catch issues early.
                </small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <FaUserMd className="text-success mb-2" size={30} />
                <h6>Follow Doctor's Advice</h6>
                <small className="text-muted">
                  Always follow your doctor's recommendations and complete prescribed treatments.
                </small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <FaHospital className="text-info mb-2" size={30} />
                <h6>Emergency Preparedness</h6>
                <small className="text-muted">
                  Keep emergency contact numbers handy and know the nearest hospital locations.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientOverview;