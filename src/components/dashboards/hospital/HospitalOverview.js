import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useData } from '../../../contexts/DataContext';
import { FaUserMd, FaCalendarAlt, FaChartLine, FaHospital } from 'react-icons/fa';

const HospitalOverview = () => {
  const { currentUser } = useAuth();
  const { hospitals, doctors, appointments, patients } = useData();

  const hospital = hospitals.find(h => h.id === currentUser.id);
  const associatedDoctors = doctors.filter(d => 
    d.hospitalAssociations.some(assoc => assoc.hospitalId === currentUser.id)
  );
  const hospitalAppointments = appointments.filter(a => a.hospitalId === currentUser.id);
  const recentAppointments = hospitalAppointments.slice(-5).reverse();

  const metrics = [
    {
      title: 'Total Doctors',
      value: associatedDoctors.length,
      icon: <FaUserMd className="text-primary" />,
      color: 'primary'
    },
    {
      title: 'Total Consultations',
      value: hospital.totalConsultations,
      icon: <FaCalendarAlt className="text-success" />,
      color: 'success'
    },
    {
      title: 'Total Revenue',
      value: `₹${hospital.totalRevenue.toLocaleString()}`,
      icon: <FaChartLine className="text-warning" />,
      color: 'warning'
    },
    {
      title: 'Departments',
      value: hospital.departments.length,
      icon: <FaHospital className="text-info" />,
      color: 'info'
    }
  ];

  const getDepartmentStats = () => {
    const stats = {};
    hospital.departments.forEach(dept => {
      const deptDoctors = associatedDoctors.filter(d => 
        d.hospitalAssociations.some(assoc => 
          assoc.hospitalId === currentUser.id && 
          assoc.specializations.includes(dept)
        )
      );
      const deptAppointments = hospitalAppointments.filter(a => {
        const doctor = doctors.find(d => d.id === a.doctorId);
        return doctor && doctor.hospitalAssociations.some(assoc => 
          assoc.hospitalId === currentUser.id && 
          assoc.specializations.includes(dept)
        );
      });
      
      stats[dept] = {
        doctors: deptDoctors.length,
        appointments: deptAppointments.length,
        revenue: deptAppointments.reduce((sum, app) => sum + app.hospitalRevenue, 0)
      };
    });
    return stats;
  };

  const departmentStats = getDepartmentStats();

  return (
    <div className="hospital-overview">
      <h3 className="mb-4">Hospital Overview</h3>

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
        {/* Department Statistics */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">Department Statistics</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Doctors</th>
                      <th>Consultations</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(departmentStats).map(([dept, stats]) => (
                      <tr key={dept}>
                        <td>
                          <span className="badge bg-primary me-2">{dept}</span>
                        </td>
                        <td>{stats.doctors}</td>
                        <td>{stats.appointments}</td>
                        <td>₹{stats.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                    const doctor = doctors.find(d => d.id === appointment.doctorId);
                    const patient = patients.find(p => p.id === appointment.patientId);
                    return (
                      <div key={appointment.id} className="list-group-item border-0 px-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{doctor?.name}</h6>
                            <small className="text-muted">
                              Patient: {patient?.name}
                            </small>
                          </div>
                          <span className={`badge bg-${appointment.status === 'confirmed' ? 'success' : 'secondary'}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <small className="text-muted">
                          {new Date(appointment.timeSlot.startTime).toLocaleDateString()}
                        </small>
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
    </div>
  );
};

export default HospitalOverview; 