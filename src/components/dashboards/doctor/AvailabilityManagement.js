import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useData } from '../../../contexts/DataContext';
import { FaCalendarAlt, FaPlus, FaTrash, FaClock, FaHospital } from 'react-icons/fa';

const AvailabilityManagement = () => {
  const { currentUser } = useAuth();
  const { doctors, addDoctorAvailability } = useData();
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  const doctor = doctors.find(d => d.id === currentUser.id);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    if (!selectedHospital || !selectedDate || !startTime || !endTime) {
      return;
    }

    setLoading(true);
    try {
      const startDateTime = new Date(`${selectedDate}T${startTime}`);
      const endDateTime = new Date(`${selectedDate}T${endTime}`);

      if (startDateTime >= endDateTime) {
        alert('End time must be after start time');
        return;
      }

      if (startDateTime < new Date()) {
        alert('Cannot add availability for past dates');
        return;
      }

      const timeSlot = {
        id: Date.now().toString(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        isBooked: false
      };

      addDoctorAvailability(currentUser.id, selectedHospital, timeSlot);
      
      // Reset form
      setSelectedHospital('');
      setSelectedDate('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error('Error adding availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvailability = (hospitalId, slotId) => {
    if (window.confirm('Are you sure you want to remove this availability slot?')) {
      // In a real app, you would have a remove function
      alert('Availability removal functionality would be implemented here');
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

  const getAvailabilityStats = () => {
    const stats = {
      totalSlots: 0,
      availableSlots: 0,
      bookedSlots: 0,
      totalHospitals: doctor.hospitalAssociations.length
    };

    doctor.hospitalAssociations.forEach(assoc => {
      stats.totalSlots += assoc.availability.length;
      stats.availableSlots += assoc.availability.filter(slot => !slot.isBooked).length;
      stats.bookedSlots += assoc.availability.filter(slot => slot.isBooked).length;
    });

    return stats;
  };

  const stats = getAvailabilityStats();

  return (
    <div className="availability-management">
      <h3 className="mb-4">Availability Management</h3>

      {/* Statistics */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaCalendarAlt className="text-primary mb-2" size={30} />
              <h4 className="fw-bold text-primary">{stats.totalSlots}</h4>
              <p className="text-muted mb-0">Total Slots</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaClock className="text-success mb-2" size={30} />
              <h4 className="fw-bold text-success">{stats.availableSlots}</h4>
              <p className="text-muted mb-0">Available</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaCalendarAlt className="text-warning mb-2" size={30} />
              <h4 className="fw-bold text-warning">{stats.bookedSlots}</h4>
              <p className="text-muted mb-0">Booked</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaHospital className="text-info mb-2" size={30} />
              <h4 className="fw-bold text-info">{stats.totalHospitals}</h4>
              <p className="text-muted mb-0">Hospitals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Availability Form */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">
            <FaPlus className="me-2" />
            Add Availability
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddAvailability}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Hospital</label>
                <select
                  className="form-select"
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  required
                >
                  <option value="">Select Hospital</option>
                  {doctor.hospitalAssociations.map(assoc => (
                    <option key={assoc.hospitalId} value={assoc.hospitalId}>
                      {assoc.hospitalName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">&nbsp;</label>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || !selectedHospital || !selectedDate || !startTime || !endTime}
                >
                  {loading ? 'Adding...' : 'Add Slot'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Availability by Hospital */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Current Availability</h5>
        </div>
        <div className="card-body">
          {doctor.hospitalAssociations.length > 0 ? (
            <div className="row g-4">
              {doctor.hospitalAssociations.map(assoc => (
                <div key={assoc.hospitalId} className="col-12">
                  <div className="card border">
                    <div className="card-header bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">
                          <FaHospital className="me-2" />
                          {assoc.hospitalName}
                        </h6>
                        <div>
                          <span className="badge bg-primary me-2">
                            {assoc.availability.length} slots
                          </span>
                          <span className="badge bg-success">
                            {assoc.availability.filter(slot => !slot.isBooked).length} available
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      {assoc.availability.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {assoc.availability
                                .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                                .map(slot => (
                                  <tr key={slot.id}>
                                    <td>
                                      <strong>{formatDate(slot.startTime)}</strong>
                                    </td>
                                    <td>
                                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                    </td>
                                    <td>
                                      <span className={`badge ${slot.isBooked ? 'bg-danger' : 'bg-success'}`}>
                                        {slot.isBooked ? 'Booked' : 'Available'}
                                      </span>
                                    </td>
                                    <td>
                                      {!slot.isBooked && (
                                        <button
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => handleRemoveAvailability(assoc.hospitalId, slot.id)}
                                          title="Remove Slot"
                                        >
                                          <FaTrash />
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-muted mb-0">No availability slots added for this hospital.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <FaHospital className="text-muted mb-3" size={50} />
              <h5>No Hospital Associations</h5>
              <p className="text-muted">
                You need to associate with hospitals before you can manage availability.
              </p>
              <a href="/doctor/hospitals" className="btn btn-primary">
                Associate with Hospitals
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Availability Guidelines */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Availability Guidelines</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Best Practices</h6>
              <ul className="text-muted">
                <li>Add availability at least 24 hours in advance</li>
                <li>Keep consistent time slots for better patient scheduling</li>
                <li>Consider your consultation duration when setting time slots</li>
                <li>Regularly update your availability to reflect your schedule</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6>Time Slot Recommendations</h6>
              <ul className="text-muted">
                <li>Morning slots: 9:00 AM - 12:00 PM</li>
                <li>Afternoon slots: 2:00 PM - 5:00 PM</li>
                <li>Evening slots: 6:00 PM - 8:00 PM</li>
                <li>Slot duration: 30-60 minutes per patient</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManagement; 