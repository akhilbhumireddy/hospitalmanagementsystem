import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useData } from '../../../contexts/DataContext';
import { FaCalendarAlt, FaUserMd, FaHospital, FaClock, FaTimes, FaCheck } from 'react-icons/fa';

const AppointmentHistory = () => {
  const { currentUser } = useAuth();
  const { appointments, doctors, hospitals, cancelAppointment } = useData();
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  const patientAppointments = appointments.filter(a => a.patientId === currentUser.id);

  const getFilteredAppointments = () => {
    const now = new Date();
    
    switch (filter) {
      case 'upcoming':
        return patientAppointments.filter(a => 
          new Date(a.timeSlot.startTime) > now && a.status === 'confirmed'
        );
      case 'past':
        return patientAppointments.filter(a => 
          new Date(a.timeSlot.startTime) < now && a.status === 'confirmed'
        );
      case 'cancelled':
        return patientAppointments.filter(a => a.status === 'cancelled');
      default:
        return patientAppointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment(appointmentId);
    }
  };

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

  const getAppointmentStats = () => {
    const now = new Date();
    const upcoming = patientAppointments.filter(a => 
      new Date(a.timeSlot.startTime) > now && a.status === 'confirmed'
    ).length;
    const past = patientAppointments.filter(a => 
      new Date(a.timeSlot.startTime) < now && a.status === 'confirmed'
    ).length;
    const cancelled = patientAppointments.filter(a => a.status === 'cancelled').length;
    const total = patientAppointments.length;

    return { upcoming, past, cancelled, total };
  };

  const stats = getAppointmentStats();

  return (
    <div className="appointment-history">
      <h3 className="mb-4">Appointment History</h3>

      {/* Statistics */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaCalendarAlt className="text-primary mb-2" size={30} />
              <h4 className="fw-bold text-primary">{stats.total}</h4>
              <p className="text-muted mb-0">Total Appointments</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaCheck className="text-success mb-2" size={30} />
              <h4 className="fw-bold text-success">{stats.upcoming}</h4>
              <p className="text-muted mb-0">Upcoming</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaCalendarAlt className="text-secondary mb-2" size={30} />
              <h4 className="fw-bold text-secondary">{stats.past}</h4>
              <p className="text-muted mb-0">Completed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaTimes className="text-danger mb-2" size={30} />
              <h4 className="fw-bold text-danger">{stats.cancelled}</h4>
              <p className="text-muted mb-0">Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <ul className="nav nav-tabs nav-fill">
            <li className="nav-item">
              <button
                className={`nav-link ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({stats.total})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${filter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setFilter('upcoming')}
              >
                Upcoming ({stats.upcoming})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${filter === 'past' ? 'active' : ''}`}
                onClick={() => setFilter('past')}
              >
                Completed ({stats.past})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${filter === 'cancelled' ? 'active' : ''}`}
                onClick={() => setFilter('cancelled')}
              >
                Cancelled ({stats.cancelled})
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Appointments List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">
            <FaCalendarAlt className="me-2" />
            Appointments ({filteredAppointments.length})
          </h5>
        </div>
        <div className="card-body">
          {filteredAppointments.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Doctor</th>
                    <th>Hospital</th>
                    <th>Specialization</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(appointment => {
                    const doctor = doctors.find(d => d.id === appointment.doctorId);
                    const hospital = hospitals.find(h => h.id === appointment.hospitalId);
                    const association = doctor?.hospitalAssociations.find(a => a.hospitalId === appointment.hospitalId);
                    
                    return (
                      <tr key={appointment.id}>
                        <td>
                          <div>
                            <strong>{formatDate(appointment.timeSlot.startTime)}</strong>
                            <br />
                            <small className="text-muted">
                              <FaClock className="me-1" />
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
                          <div className="d-flex flex-wrap gap-1">
                            {association?.specializations.map(spec => (
                              <span key={spec} className="badge bg-primary">{spec}</span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <strong>₹{appointment.consultationFee}</strong>
                        </td>
                        <td>
                          {getStatusBadge(appointment)}
                        </td>
                        <td>
                          {appointment.status === 'confirmed' && 
                           new Date(appointment.timeSlot.startTime) > new Date() && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleCancelAppointment(appointment.id)}
                              title="Cancel Appointment"
                            >
                              <FaTimes />
                            </button>
                          )}
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
              <h5>No Appointments Found</h5>
              <p className="text-muted">
                {filter === 'all' && 'You haven\'t booked any appointments yet.'}
                {filter === 'upcoming' && 'You have no upcoming appointments.'}
                {filter === 'past' && 'You have no completed appointments.'}
                {filter === 'cancelled' && 'You have no cancelled appointments.'}
              </p>
              {filter === 'all' && (
                <a href="/patient/book" className="btn btn-primary">
                  Book Your First Appointment
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal (if needed) */}
      {filteredAppointments.length > 0 && (
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-header bg-transparent">
            <h5 className="mb-0">Quick Summary</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Recent Activity</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <small className="text-muted">
                      Last appointment: {filteredAppointments.length > 0 && 
                        formatDate(filteredAppointments[0].timeSlot.startTime)}
                    </small>
                  </li>
                  <li className="mb-2">
                    <small className="text-muted">
                      Total spent: ₹{patientAppointments.reduce((sum, app) => sum + app.consultationFee, 0).toLocaleString()}
                    </small>
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <h6>Appointment Tips</h6>
                <ul className="list-unstyled">
                  <li className="mb-1">
                    <small className="text-muted">• Arrive 10 minutes before your appointment</small>
                  </li>
                  <li className="mb-1">
                    <small className="text-muted">• Bring your ID and previous medical records</small>
                  </li>
                  <li className="mb-1">
                    <small className="text-muted">• You can cancel appointments up to 24 hours before</small>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory; 