import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useData } from '../../../contexts/DataContext';
import { FaHospital, FaPlus, FaTrash, FaEye } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';

const HospitalAssociations = () => {
  const { currentUser } = useAuth();
  const { hospitals, doctors, associateDoctorWithHospital } = useData();
  const [selectedHospital, setSelectedHospital] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const doctor = doctors.find(d => d.id === currentUser.id);
  
  // Get hospitals that have departments matching doctor's specializations
  const availableHospitals = hospitals.filter(hospital => {
    const matchingDepartments = hospital.departments.filter(dept => 
      doctor.specializations.includes(dept)
    );
    return matchingDepartments.length > 0 && 
           !doctor.hospitalAssociations.some(assoc => assoc.hospitalId === hospital.id);
  });

  const handleAssociation = async (e) => {
    e.preventDefault();
    if (!selectedHospital || !consultationFee || selectedSpecializations.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const success = associateDoctorWithHospital(
        currentUser.id,
        selectedHospital,
        selectedSpecializations,
        parseFloat(consultationFee)
      );
      
      if (success) {
        setSelectedHospital('');
        setConsultationFee('');
        setSelectedSpecializations([]);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error associating with hospital:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializationChange = (specialization) => {
    setSelectedSpecializations(prev => {
      if (prev.includes(specialization)) {
        return prev.filter(spec => spec !== specialization);
      } else {
        return [...prev, specialization];
      }
    });
  };

  const getMatchingDepartments = (hospital) => {
    return hospital.departments.filter(dept => 
      doctor.specializations.includes(dept)
    );
  };

  return (
    <div className="hospital-associations">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Hospital Associations</h3>
        <Button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Associate with Hospital
        </Button>
      </div>

      {/* Current Associations */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Current Associations ({doctor.hospitalAssociations.length})</h5>
        </div>
        <div className="card-body">
          {doctor.hospitalAssociations.length > 0 ? (
            <div className="row g-3">
              {doctor.hospitalAssociations.map((assoc, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="card border">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="mb-1">{assoc.hospitalName}</h6>
                          <small className="text-muted">Active Association</small>
                        </div>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            title="Remove Association"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong>Consultation Fee:</strong> ₹{assoc.consultationFee}
                      </div>
                      <strong>Specializations:</strong>
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {assoc.specializations.map(spec => (
                          <span key={spec} className="badge bg-primary">{spec}</span>
                        ))}
                      </div>
                      <div className="row text-center mt-2">
                        <div className="col-6">
                          <div className="border-end">
                            <h6 className="mb-0 text-success">{assoc.consultations}</h6>
                            <small className="text-muted">Consultations</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <h6 className="mb-0 text-warning">₹{assoc.earnings.toLocaleString()}</h6>
                          <small className="text-muted">Earnings</small>
                        </div>
                      </div>
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
                Associate with hospitals to start practicing and earning.
              </p>
              <Button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <FaPlus className="me-2" />
                Associate with Your First Hospital
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Available Hospitals */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Available Hospitals</h5>
        </div>
        <div className="card-body">
          {availableHospitals.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Hospital</th>
                    <th>Location</th>
                    <th>Matching Departments</th>
                    <th>Your Specializations</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {availableHospitals.map(hospital => {
                    const matchingDepts = getMatchingDepartments(hospital);
                    return (
                      <tr key={hospital.id}>
                        <td>
                          <h6 className="mb-1">{hospital.name}</h6>
                          <small className="text-muted">
                            {hospital.totalConsultations} consultations
                          </small>
                        </td>
                        <td>{hospital.location}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {matchingDepts.map(dept => (
                              <span key={dept} className="badge bg-success">{dept}</span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {doctor.specializations.map(spec => (
                              <span key={spec} className={`badge ${matchingDepts.includes(spec) ? 'bg-primary' : 'bg-secondary'}`}>{spec}</span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => {
                              setSelectedHospital(hospital.id);
                              setSelectedSpecializations(matchingDepts);
                              setShowModal(true);
                            }}
                          >
                            <FaPlus className="me-1" />
                            Associate
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">
                No available hospitals found that match your specializations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Associate Hospital Modal (React-Bootstrap) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <form onSubmit={handleAssociation}>
          <Modal.Header closeButton>
            <Modal.Title>Associate with Hospital</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Hospital</label>
              <select
                className="form-select"
                value={selectedHospital}
                onChange={(e) => {
                  setSelectedHospital(e.target.value);
                  // When hospital changes, update selectedSpecializations to only those matching the new hospital
                  const hospital = hospitals.find(h => h.id === e.target.value);
                  if (hospital) {
                    setSelectedSpecializations(doctor.specializations.filter(spec => hospital.departments.includes(spec)));
                  } else {
                    setSelectedSpecializations([]);
                  }
                }}
                required
              >
                <option value="">Select a hospital</option>
                {hospitals.map(hospital => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name} - {hospital.location}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Specializations</label>
              <div className="d-flex flex-wrap gap-2">
                {doctor.specializations.map(spec => {
                  const hospital = hospitals.find(h => h.id === selectedHospital);
                  const isAvailable = hospital && hospital.departments.includes(spec);
                  return (
                    <div key={spec} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`spec-${spec}`}
                        checked={selectedSpecializations.includes(spec)}
                        onChange={() => handleSpecializationChange(spec)}
                        disabled={!isAvailable}
                      />
                      <label className="form-check-label" htmlFor={`spec-${spec}`}>
                        <span className={`badge ${isAvailable ? 'bg-primary' : 'bg-secondary'}`}>{spec}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
              <small className="text-muted">
                Only specializations that match hospital departments are available
              </small>
            </div>
            <div className="mb-3">
              <label className="form-label">Consultation Fee (₹)</label>
              <input
                type="number"
                className="form-control"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                placeholder="Enter consultation fee"
                min="0"
                step="0.01"
                required
              />
              <small className="text-muted">
                You will receive 60% of this fee for each consultation
              </small>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !selectedHospital || !consultationFee || selectedSpecializations.length === 0}
            >
              {loading ? 'Associating...' : 'Associate'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default HospitalAssociations; 