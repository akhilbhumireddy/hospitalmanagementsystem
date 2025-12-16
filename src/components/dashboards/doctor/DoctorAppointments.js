import React from 'react';
import { useData } from '../../../contexts/DataContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from 'react-bootstrap';

const DoctorAppointments = () => {
  const { currentUser } = useAuth();
  const { appointments, patients, updateAppointmentStatus } = useData();

  const pendingAppointments = appointments.filter(
    a => a.doctorId === currentUser.id && a.status === 'pending'
  );

  return (
    <div>
      <h5>Pending Appointments</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingAppointments.map(app => {
            const patient = patients.find(p => p.id === app.patientId);
            return (
              <tr key={app.id}>
                <td>{patient?.name}</td>
                <td>{app.time}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => updateAppointmentStatus(app.id, 'accepted')}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => updateAppointmentStatus(app.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorAppointments;
