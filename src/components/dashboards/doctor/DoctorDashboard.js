import React from 'react';
import { useData } from '../../../contexts/DataContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useState } from 'react';

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const { doctors, appointments, patients, updateAppointmentStatus } = useData();

  const doctor = doctors.find(d => d.id === currentUser.id);

  // Get today's date in YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);

  // Get today's appointments for this doctor
  const todaysAppointments = appointments.filter(app =>
    app.doctorId === doctor.id &&
    app.date === today
  );

  return (
    <div>
      <h3>Welcome, Dr. {doctor.name}</h3>
      <div className="mb-3">
        <strong>You treated {todaysAppointments.filter(a => a.status === 'accepted').length} patients today.</strong>
      </div>
      <div>
        <h5>Today's Appointments</h5>
        <table className="table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todaysAppointments.map(app => {
              const patient = patients.find(p => p.id === app.patientId);
              return (
                <tr key={app.id}>
                  <td>{patient ? patient.name : 'Unknown'}</td>
                  <td>{app.time}</td>
                  <td>
                    {app.status === 'pending' && <span className="badge bg-warning">Pending</span>}
                    {app.status === 'accepted' && <span className="badge bg-success">Accepted</span>}
                    {app.status === 'rejected' && <span className="badge bg-danger">Rejected</span>}
                  </td>
                  <td>
                    {app.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => updateAppointmentStatus(app.id, 'accepted')}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => updateAppointmentStatus(app.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;