import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useData } from '../../../contexts/DataContext';
import { FaSearch, FaCalendarAlt, FaUserMd, FaHospital, FaClock } from 'react-icons/fa';

const BookAppointment = () => {
  const { currentUser } = useAuth();
  const { hospitals, doctors, bookAppointment } = useData();
  const [searchFilters, setSearchFilters] = useState({
    hospital: '',
    specialization: '',
    date: ''
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Get all specializations from doctors
  const allSpecializations = [...new Set(
    doctors.flatMap(d => d.specializations)
  )];

  // Filter doctors based on search criteria
  useEffect(() => {
    let filtered = doctors.filter(doctor => {
      const hasHospitalAssociations = doctor.hospitalAssociations.length > 0;
      
      if (!hasHospitalAssociations) return false;

      // Filter by hospital
      if (searchFilters.hospital) {
        const hasHospital = doctor.hospitalAssociations.some(assoc => 
          assoc.hospitalId === searchFilters.hospital
        );
        if (!hasHospital) return false;
      }

      // Filter by specialization
      if (searchFilters.specialization) {
        const hasSpecialization = doctor.specializations.includes(searchFilters.specialization);
        if (!hasSpecialization) return false;
      }

      return true;
    });

    setAvailableDoctors(filtered);
  }, [searchFilters, doctors]);

  // Get available slots for selected doctor
  useEffect(() => {
    if (selectedDoctor) {
      const slots = [];
      selectedDoctor.hospitalAssociations.forEach(assoc => {
        assoc.availability.forEach(slot => {
          if (!slot.isBooked) {
            const slotDate = new Date(slot.startTime);
            const filterDate = searchFilters.date ? new Date(searchFilters.date) : new Date();
            
            // Filter by date if specified
            if (!searchFilters.date || 
                slotDate.toDateString() === filterDate.toDateString()) {
              slots.push({
                ...slot,
                hospitalId: assoc.hospitalId,
                hospitalName: assoc.hospitalName,
                consultationFee: assoc.consultationFee,
                specializations: assoc.specializations
              });
            }
          }
        });
      });
      
      // Sort slots by date and time
      slots.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, searchFilters.date]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) return;

    setLoading(true);
    try {
      const appointmentData = {
        doctorId: selectedDoctor.id,
        hospitalId: selectedSlot.hospitalId,
        patientId: currentUser.id,
        timeSlot: selectedSlot,
        consultationFee: selectedSlot.consultationFee
      };

      const success = bookAppointment(appointmentData);
      if (success) {
        setSelectedDoctor(null);
        setSelectedSlot(null);
        setSearchFilters({
          hospital: '',
          specialization: '',
          date: ''
        });
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="book-appointment">
      <h3 className="mb-4">Book Appointment</h3>

      {/* Search Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">
            <FaSearch className="me-2" />
            Search for Doctors
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Hospital</label>
                <select
                  className="form-select"
                  value={searchFilters.hospital}
                  onChange={(e) => setSearchFilters(prev => ({
                    ...prev,
                    hospital: e.target.value
                  }))}
                >
                  <option value="">All Hospitals</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name} - {hospital.location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Specialization</label>
                <select
                  className="form-select"
                  value={searchFilters.specialization}
                  onChange={(e) => setSearchFilters(prev => ({
                    ...prev,
                    specialization: e.target.value
                  }))}
                >
                  <option value="">All Specializations</option>
                  {allSpecializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Preferred Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={searchFilters.date}
                  onChange={(e) => setSearchFilters(prev => ({
                    ...prev,
                    date: e.target.value
                  }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Available Doctors */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">
            <FaUserMd className="me-2" />
            Available Doctors ({availableDoctors.length})
          </h5>
        </div>
        <div className="card-body">
          {availableDoctors.length > 0 ? (
            <div className="row g-3">
              {availableDoctors.map(doctor => (
                <div key={doctor.id} className="col-md-6 col-lg-4">
                  <div className={`card border ${selectedDoctor?.id === doctor.id ? 'border-primary' : ''}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="mb-1">Dr. {doctor.name}</h6>
                          <small className="text-muted">
                            {doctor.qualifications} • {doctor.yearsOfExperience} years exp.
                          </small>
                        </div>
                        <button
                          className={`btn btn-sm ${selectedDoctor?.id === doctor.id ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          {selectedDoctor?.id === doctor.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                      
                      <div className="mb-3">
                        <strong>Specializations:</strong>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {doctor.specializations.map(spec => (
                            <span key={spec} className="badge bg-primary">{spec}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <strong>Hospitals:</strong>
                        <div className="mt-1">
                          {doctor.hospitalAssociations.map(assoc => (
                            <div key={assoc.hospitalId} className="small text-muted">
                              <FaHospital className="me-1" />
                              {assoc.hospitalName} - ₹{assoc.consultationFee}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <small className="text-success">
                          {doctor.totalConsultations} consultations completed
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <FaUserMd className="text-muted mb-3" size={50} />
              <h5>No Doctors Found</h5>
              <p className="text-muted">
                Try adjusting your search filters to find available doctors.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Available Slots */}
      {selectedDoctor && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-transparent">
            <h5 className="mb-0">
              <FaCalendarAlt className="me-2" />
              Available Time Slots for Dr. {selectedDoctor.name}
            </h5>
          </div>
          <div className="card-body">
            {availableSlots.length > 0 ? (
              <div className="row g-3">
                {availableSlots.map((slot, index) => (
                  <div key={index} className="col-md-6 col-lg-4">
                    <div className={`card border ${selectedSlot?.id === slot.id ? 'border-success' : ''}`}>
                      <div className="card-body text-center">
                        <div className="mb-2">
                          <FaCalendarAlt className="text-primary mb-2" size={24} />
                          <h6 className="mb-1">{formatDate(slot.startTime)}</h6>
                          <p className="mb-2">
                            <FaClock className="me-1" />
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </p>
                        </div>
                        
                        <div className="mb-3">
                          <span className="badge bg-primary me-2">{slot.hospitalName}</span>
                          <span className="badge bg-success">₹{slot.consultationFee}</span>
                        </div>
                        
                        <button
                          className={`btn btn-sm ${selectedSlot?.id === slot.id ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {selectedSlot?.id === slot.id ? 'Selected' : 'Select Slot'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <FaCalendarAlt className="text-muted mb-3" size={50} />
                <h5>No Available Slots</h5>
                <p className="text-muted">
                  This doctor has no available slots for the selected criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Summary */}
      {selectedSlot && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-transparent">
            <h5 className="mb-0">Booking Summary</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Appointment Details</h6>
                <ul className="list-unstyled">
                  <li><strong>Doctor:</strong> Dr. {selectedDoctor.name}</li>
                  <li><strong>Hospital:</strong> {selectedSlot.hospitalName}</li>
                  <li><strong>Date:</strong> {formatDate(selectedSlot.startTime)}</li>
                  <li><strong>Time:</strong> {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</li>
                  <li><strong>Specializations:</strong></li>
                  <li>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {selectedSlot.specializations.map(spec => (
                        <span key={spec} className="badge bg-primary">{spec}</span>
                      ))}
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <h6>Payment Details</h6>
                <ul className="list-unstyled">
                  <li><strong>Consultation Fee:</strong> ₹{selectedSlot.consultationFee}</li>
                  <li><strong>Payment Method:</strong> Pay at Hospital</li>
                  <li><strong>Booking Status:</strong> <span className="badge bg-warning">Pending</span></li>
                </ul>
                
                <div className="mt-3">
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleBookAppointment}
                    disabled={loading}
                  >
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment; 