import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useData } from '../../../contexts/DataContext';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';

const DepartmentManagement = () => {
  const { currentUser } = useAuth();
  const { hospitals, addDepartmentToHospital, departments } = useData();
  const [newDepartment, setNewDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const hospital = hospitals.find(h => h.id === currentUser.id);
  const availableDepartments = departments.filter(dept => 
    !hospital.departments.includes(dept)
  );

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartment.trim()) return;
    setLoading(true);
    try {
      addDepartmentToHospital(currentUser.id, newDepartment);
      setNewDepartment('');
      setShowModal(false);
    } catch (error) {
      console.error('Error adding department:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDepartment = (departmentName) => {
    if (window.confirm(`Are you sure you want to remove ${departmentName}?`)) {
      alert('Department removal functionality would be implemented here');
    }
  };

  return (
    <div className="department-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Department Management</h3>
        <Button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Add Department
        </Button>
      </div>

      {/* Current Departments */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Current Departments ({hospital.departments.length})</h5>
        </div>
        <div className="card-body">
          {hospital.departments.length > 0 ? (
            <div className="row g-3">
              {hospital.departments.map((dept, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="card border">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{dept}</h6>
                          <small className="text-muted">Active Department</small>
                        </div>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            title="Edit Department"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            title="Remove Department"
                            onClick={() => handleRemoveDepartment(dept)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No departments added yet.</p>
              <Button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <FaPlus className="me-2" />
                Add Your First Department
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Department Modal (React-Bootstrap) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <form onSubmit={handleAddDepartment}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Department</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Department Name</label>
              <select
                className="form-select"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                required
              >
                <option value="">Select a department</option>
                {availableDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <small className="text-muted">
                Choose from our predefined list of medical departments
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
              disabled={loading || !newDepartment}
            >
              {loading ? 'Adding...' : 'Add Department'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Department Information */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Department Information</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Available Departments</h6>
              <ul className="list-unstyled">
                {departments.map(dept => (
                  <li key={dept} className="mb-2">
                    <span className={`badge ${
                      hospital.departments.includes(dept) 
                        ? 'bg-success' 
                        : 'bg-secondary'
                    }`}>
                      {dept}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-6">
              <h6>Department Guidelines</h6>
              <ul className="text-muted">
                <li>Departments help organize doctors by specialization</li>
                <li>Doctors can only be associated with matching departments</li>
                <li>Each department can have multiple doctors</li>
                <li>Revenue is tracked per department</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement; 