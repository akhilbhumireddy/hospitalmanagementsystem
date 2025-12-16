import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useData } from '../../../contexts/DataContext';
import { FaHospital, FaCalendarAlt, FaChartLine, FaUser } from 'react-icons/fa';

const DoctorOverview = () => {
  const { currentUser } = useAuth();
  const { doctors, hospitals, appointments, patients } = useData();

  const doctor = doctors.find(d => d.id === currentUser.id);
  const doctorAppointments = appointments.filter(a => a.doctorId === currentUser.id);
  const recentAppointments = doctorAppointments.slice(-5).reverse();

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = doctorAppointments.filter(a => 
    a.status === 'confirmed' && 
    a.timeSlot && 
    new Date(a.timeSlot.startTime).toISOString().split('T')[0] === today
  );
  const todaysPatientsCount = todaysAppointments.length;

  const metrics = [
    {
      title: 'Associated Hospitals',
      value: doctor.hospitalAssociations.length,
      icon: <FaHospital className="text-primary" />,
      color: 'primary'
    },
    {
      title: 'Total Consultations',
      value: doctor.totalConsultations,
      icon: <FaCalendarAlt className="text-success" />,
      color: 'success'
    },
    {
      title: 'Total Earnings',
      value: `₹${doctor.totalEarnings.toLocaleString()}`,
      icon: <FaChartLine className="text-warning" />,
      color: 'warning'
    },
    {
      title: 'Available Slots',
      value: doctor.hospitalAssociations.reduce((sum, assoc) => 
        sum + assoc.availability.filter(slot => !slot.isBooked).length, 0
      ),
      icon: <FaUser className="text-info" />,
      color: 'info'
    }
  ];

  const getHospitalStats = () => {
    return doctor.hospitalAssociations.map(assoc => {
      const hospitalAppointments = doctorAppointments.filter(a => a.hospitalId === assoc.hospitalId);
      return {
        hospitalName: assoc.hospitalName,
        consultations: assoc.consultations,
        earnings: assoc.earnings,
        consultationFee: assoc.consultationFee,
        specializations: assoc.specializations,
        availableSlots: assoc.availability.filter(slot => !slot.isBooked).length
      };
    });
  };

  const hospitalStats = getHospitalStats();

  return (
    <div className="doctor-overview">
      <h3 className="mb-4">Doctor Overview</h3>

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
        {/* Patients Treated Today Card */}
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <FaUser className="text-success" />
              </div>
              <h4 className="fw-bold text-success">{todaysPatientsCount}</h4>
              <p className="text-muted mb-0">Patients Treated Today</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Hospital Performance */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">Hospital Performance</h5>
            </div>
            <div className="card-body">
              {hospitalStats.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Hospital</th>
                        <th>Specializations</th>
                        <th>Consultations</th>
                        <th>Earnings</th>
                        <th>Available Slots</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hospitalStats.map((hospital, index) => (
                        <tr key={index}>
                          <td>
                            <h6 className="mb-1">{hospital.hospitalName}</h6>
                            <small className="text-muted">
                              Fee: ₹{hospital.consultationFee}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {hospital.specializations.map(spec => (
                                <span key={spec} className="badge bg-primary">{spec}</span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-success">{hospital.consultations}</span>
                          </td>
                          <td>
                            <strong>₹{hospital.earnings.toLocaleString()}</strong>
                          </td>
                          <td>
                            <span className="badge bg-info">{hospital.availableSlots}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <FaHospital className="text-muted mb-3" size={50} />
                  <h5>No Hospital Associations</h5>
                  <p className="text-muted">
                    Associate with hospitals to start seeing your performance metrics.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">Recent Appointments</h5>
            </div>
            <div className="card-body">
              {recentAppointments.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentAppointments.map(appointment => {
                    const hospital = hospitals.find(h => h.id === appointment.hospitalId);
                    const patient = patients.find(p => p.id === appointment.patientId);
                    return (
                      <div key={appointment.id} className="list-group-item border-0 px-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{patient?.name}</h6>
                            <small className="text-muted">
                              {hospital?.name}
                            </small>
                          </div>
                          <span className={`badge bg-${appointment.status === 'confirmed' ? 'success' : 'secondary'}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <small className="text-muted">
                          {new Date(appointment.timeSlot.startTime).toLocaleDateString()}
                        </small>
                        <div className="mt-1">
                          <small className="text-success">
                            Earnings: ₹{appointment.doctorEarnings}
                          </small>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted text-center">No recent appointments</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Specializations Summary */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Specializations Summary</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Your Specializations</h6>
              <div className="d-flex flex-wrap gap-2">
                {doctor.specializations.map(spec => (
                  <span key={spec} className="badge bg-primary fs-6">{spec}</span>
                ))}
              </div>
            </div>
            <div className="col-md-6">
              <h6>Performance Highlights</h6>
              <ul className="list-unstyled">
                <li><strong>Total Experience:</strong> {doctor.yearsOfExperience} years</li>
                <li><strong>Qualifications:</strong> {doctor.qualifications}</li>
                <li><strong>Average Earnings per Consultation:</strong> 
                  ₹{doctor.totalConsultations > 0 ? (doctor.totalEarnings / doctor.totalConsultations).toFixed(0) : 0}
                </li>
                <li><strong>Active Hospitals:</strong> {doctor.hospitalAssociations.length}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorOverview; 