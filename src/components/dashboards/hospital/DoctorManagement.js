import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useData } from '../../../contexts/DataContext';
import { FaUserMd, FaCalendarAlt, FaChartLine, FaEye } from 'react-icons/fa';

const DoctorManagement = () => {
  const { currentUser } = useAuth();
  const { hospitals, doctors, appointments } = useData();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const hospital = hospitals.find(h => h.id === currentUser.id);
  const associatedDoctors = doctors.filter(d => 
    d.hospitalAssociations.some(assoc => assoc.hospitalId === currentUser.id)
  );

  const getDoctorStats = (doctor) => {
    const association = doctor.hospitalAssociations.find(a => a.hospitalId === currentUser.id);
    const doctorAppointments = appointments.filter(a => 
      a.doctorId === doctor.id && a.hospitalId === currentUser.id
    );
    
    return {
      consultations: association?.consultations || 0,
      earnings: association?.earnings || 0,
      availability: association?.availability?.length || 0,
      totalAppointments: doctorAppointments.length
    };
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetails(true);
  };

  return (
    <div className="doctor-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Doctor Management</h3>
        <div className="d-flex gap-2">
          <span className="badge bg-primary">
            {associatedDoctors.length} Associated Doctors
          </span>
        </div>
      </div>

      {/* Doctor Statistics */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaUserMd className="text-primary mb-2" size={30} />
              <h4 className="fw-bold text-primary">{associatedDoctors.length}</h4>
              <p className="text-muted mb-0">Total Doctors</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaCalendarAlt className="text-success mb-2" size={30} />
              <h4 className="fw-bold text-success">
                {associatedDoctors.reduce((sum, d) => sum + getDoctorStats(d).consultations, 0)}
              </h4>
              <p className="text-muted mb-0">Total Consultations</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaChartLine className="text-warning mb-2" size={30} />
              <h4 className="fw-bold text-warning">
                ₹{associatedDoctors.reduce((sum, d) => sum + getDoctorStats(d).earnings, 0).toLocaleString()}
              </h4>
              <p className="text-muted mb-0">Doctor Earnings</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaCalendarAlt className="text-info mb-2" size={30} />
              <h4 className="fw-bold text-info">
                {associatedDoctors.reduce((sum, d) => sum + getDoctorStats(d).availability, 0)}
              </h4>
              <p className="text-muted mb-0">Available Slots</p>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Associated Doctors</h5>
        </div>
        <div className="card-body">
          {associatedDoctors.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specializations</th>
                    <th>Consultations</th>
                    <th>Earnings</th>
                    <th>Available Slots</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {associatedDoctors.map(doctor => {
                    const stats = getDoctorStats(doctor);
                    const association = doctor.hospitalAssociations.find(a => a.hospitalId === currentUser.id);
                    return (
                      <tr key={doctor.id}>
                        <td>
                          <div>
                            <h6 className="mb-1">{doctor.name}</h6>
                            <small className="text-muted">
                              {doctor.qualifications} • {doctor.yearsOfExperience} years exp.
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
                          <span className="badge bg-success">{stats.consultations}</span>
                        </td>
                        <td>
                          <strong>₹{stats.earnings.toLocaleString()}</strong>
                        </td>
                        <td>
                          <span className="badge bg-info">{stats.availability}</span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewDetails(doctor)}
                          >
                            <FaEye className="me-1" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <FaUserMd className="text-muted mb-3" size={50} />
              <h5>No Doctors Associated</h5>
              <p className="text-muted">
                Doctors will appear here once they associate with your hospital.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Doctor Details Modal */}
      {showDetails && selectedDoctor && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Doctor Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetails(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Personal Information</h6>
                    <p><strong>Name:</strong> {selectedDoctor.name}</p>
                    <p><strong>Email:</strong> {selectedDoctor.email}</p>
                    <p><strong>Qualifications:</strong> {selectedDoctor.qualifications}</p>
                    <p><strong>Experience:</strong> {selectedDoctor.yearsOfExperience} years</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Hospital Association</h6>
                    {selectedDoctor.hospitalAssociations
                      .filter(assoc => assoc.hospitalId === currentUser.id)
                      .map(assoc => (
                        <div key={assoc.hospitalId}>
                          <p><strong>Hospital:</strong> {assoc.hospitalName}</p>
                          <p><strong>Consultation Fee:</strong> ₹{assoc.consultationFee}</p>
                          <p><strong>Specializations:</strong></p>
                          <div className="d-flex flex-wrap gap-1 mb-2">
                            {assoc.specializations.map(spec => (
                              <span key={spec} className="badge bg-primary">{spec}</span>
                            ))}
                          </div>
                          <p><strong>Total Consultations:</strong> {assoc.consultations}</p>
                          <p><strong>Total Earnings:</strong> ₹{assoc.earnings.toLocaleString()}</p>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h6>Availability Schedule</h6>
                  {selectedDoctor.hospitalAssociations
                    .find(assoc => assoc.hospitalId === currentUser.id)
                    ?.availability.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedDoctor.hospitalAssociations
                            .find(assoc => assoc.hospitalId === currentUser.id)
                            ?.availability.map(slot => (
                              <tr key={slot.id}>
                                <td>{new Date(slot.startTime).toLocaleDateString()}</td>
                                <td>{new Date(slot.startTime).toLocaleTimeString()}</td>
                                <td>{new Date(slot.endTime).toLocaleTimeString()}</td>
                                <td>
                                  <span className={`badge ${slot.isBooked ? 'bg-danger' : 'bg-success'}`}>
                                    {slot.isBooked ? 'Booked' : 'Available'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted">No availability slots set</p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for modal */}
      {showDetails && (
        <div 
          className="modal-backdrop fade show" 
          onClick={() => setShowDetails(false)}
        ></div>
      )}
    </div>
  );
};

export default DoctorManagement; 