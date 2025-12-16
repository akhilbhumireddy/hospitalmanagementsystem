import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useData } from '../../../contexts/DataContext';
import { FaChartLine, FaChartBar, FaChartPie, FaCalendarAlt, FaHospital } from 'react-icons/fa';

const EarningsReports = () => {
  const { currentUser } = useAuth();
  const { doctors, appointments } = useData();
  const [timeFilter, setTimeFilter] = useState('all');

  const doctor = doctors.find(d => d.id === currentUser.id);
  const doctorAppointments = appointments.filter(a => a.doctorId === currentUser.id);

  const getFilteredAppointments = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    switch (timeFilter) {
      case '7days':
        return doctorAppointments.filter(a => new Date(a.createdAt) >= sevenDaysAgo);
      case '30days':
        return doctorAppointments.filter(a => new Date(a.createdAt) >= thirtyDaysAgo);
      default:
        return doctorAppointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  const getEarningsStats = () => {
    const totalEarnings = filteredAppointments.reduce((sum, app) => sum + app.doctorEarnings, 0);
    const totalConsultations = filteredAppointments.length;
    const avgEarningsPerConsultation = totalConsultations > 0 ? totalEarnings / totalConsultations : 0;

    return {
      totalEarnings,
      totalConsultations,
      avgEarningsPerConsultation
    };
  };

  const getHospitalEarnings = () => {
    const hospitalEarnings = {};
    
    filteredAppointments.forEach(appointment => {
      const hospitalId = appointment.hospitalId;
      if (!hospitalEarnings[hospitalId]) {
        hospitalEarnings[hospitalId] = {
          hospitalName: appointment.hospitalName || 'Unknown Hospital',
          earnings: 0,
          consultations: 0
        };
      }
      hospitalEarnings[hospitalId].earnings += appointment.doctorEarnings;
      hospitalEarnings[hospitalId].consultations += 1;
    });

    return Object.values(hospitalEarnings)
      .sort((a, b) => b.earnings - a.earnings);
  };

  const getMonthlyEarnings = () => {
    const monthlyData = {};
    
    filteredAppointments.forEach(appointment => {
      const date = new Date(appointment.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + appointment.doctorEarnings;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, earnings]) => ({
        month,
        earnings,
        label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }));
  };

  const getSpecializationEarnings = () => {
    const specEarnings = {};
    
    doctor.hospitalAssociations.forEach(assoc => {
      assoc.specializations.forEach(spec => {
        if (!specEarnings[spec]) {
          specEarnings[spec] = {
            specialization: spec,
            earnings: 0,
            consultations: 0
          };
        }
        
        // Get appointments for this hospital and add earnings
        const hospitalAppointments = filteredAppointments.filter(a => a.hospitalId === assoc.hospitalId);
        specEarnings[spec].earnings += hospitalAppointments.reduce((sum, app) => sum + app.doctorEarnings, 0);
        specEarnings[spec].consultations += hospitalAppointments.length;
      });
    });

    return Object.values(specEarnings)
      .sort((a, b) => b.earnings - a.earnings);
  };

  const earningsStats = getEarningsStats();
  const hospitalEarnings = getHospitalEarnings();
  const monthlyEarnings = getMonthlyEarnings();
  const specializationEarnings = getSpecializationEarnings();

  return (
    <div className="earnings-reports">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Earnings Reports</h3>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="30days">Last 30 Days</option>
            <option value="7days">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaChartLine className="text-primary mb-2" size={30} />
              <h4 className="fw-bold text-primary">₹{earningsStats.totalEarnings.toLocaleString()}</h4>
              <p className="text-muted mb-0">Total Earnings</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaCalendarAlt className="text-success mb-2" size={30} />
              <h4 className="fw-bold text-success">{earningsStats.totalConsultations}</h4>
              <p className="text-muted mb-0">Total Consultations</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaChartBar className="text-warning mb-2" size={30} />
              <h4 className="fw-bold text-warning">₹{earningsStats.avgEarningsPerConsultation.toFixed(0)}</h4>
              <p className="text-muted mb-0">Avg. Earnings per Consultation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Hospital Earnings */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">
                <FaHospital className="me-2" />
                Earnings by Hospital
              </h5>
            </div>
            <div className="card-body">
              {hospitalEarnings.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Hospital</th>
                        <th>Consultations</th>
                        <th>Earnings</th>
                        <th>Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hospitalEarnings.map(hospital => (
                        <tr key={hospital.hospitalName}>
                          <td>
                            <div>
                              <h6 className="mb-0">{hospital.hospitalName}</h6>
                              <small className="text-muted">
                                {((hospital.earnings / earningsStats.totalEarnings) * 100).toFixed(1)}% of total
                              </small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-success">{hospital.consultations}</span>
                          </td>
                          <td>
                            <strong>₹{hospital.earnings.toLocaleString()}</strong>
                          </td>
                          <td>
                            ₹{hospital.consultations > 0 ? (hospital.earnings / hospital.consultations).toFixed(0) : 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center">No earnings data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Specialization Earnings */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">
                <FaChartPie className="me-2" />
                Earnings by Specialization
              </h5>
            </div>
            <div className="card-body">
              {specializationEarnings.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Specialization</th>
                        <th>Consultations</th>
                        <th>Earnings</th>
                        <th>Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {specializationEarnings.map(spec => (
                        <tr key={spec.specialization}>
                          <td>
                            <div>
                              <span className="badge bg-primary me-2">{spec.specialization}</span>
                              <small className="text-muted">
                                {((spec.earnings / earningsStats.totalEarnings) * 100).toFixed(1)}% of total
                              </small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info">{spec.consultations}</span>
                          </td>
                          <td>
                            <strong>₹{spec.earnings.toLocaleString()}</strong>
                          </td>
                          <td>
                            ₹{spec.consultations > 0 ? (spec.earnings / spec.consultations).toFixed(0) : 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center">No specialization earnings data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Earnings Trend */}
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">
                <FaChartLine className="me-2" />
                Monthly Earnings Trend
              </h5>
            </div>
            <div className="card-body">
              {monthlyEarnings.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Earnings</th>
                        <th>Consultations</th>
                        <th>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyEarnings.map((month, index) => {
                        const prevMonth = monthlyEarnings[index - 1];
                        const trend = prevMonth 
                          ? ((month.earnings - prevMonth.earnings) / prevMonth.earnings * 100).toFixed(1)
                          : 0;
                        
                        // Count consultations for this month
                        const monthConsultations = filteredAppointments.filter(app => {
                          const appDate = new Date(app.createdAt);
                          const appMonth = `${appDate.getFullYear()}-${String(appDate.getMonth() + 1).padStart(2, '0')}`;
                          return appMonth === month.month;
                        }).length;
                        
                        return (
                          <tr key={month.month}>
                            <td>{month.label}</td>
                            <td>₹{month.earnings.toLocaleString()}</td>
                            <td>{monthConsultations}</td>
                            <td>
                              {index > 0 && (
                                <span className={`badge ${trend >= 0 ? 'bg-success' : 'bg-danger'}`}>
                                  {trend >= 0 ? '+' : ''}{trend}%
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center">No monthly earnings data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Earnings Summary</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Revenue Distribution</h6>
              <ul className="list-unstyled">
                <li><strong>Your Share:</strong> 60% of consultation fees</li>
                <li><strong>Hospital Share:</strong> 40% of consultation fees</li>
                <li><strong>Total Earnings:</strong> ₹{earningsStats.totalEarnings.toLocaleString()}</li>
                <li><strong>Average per Consultation:</strong> ₹{earningsStats.avgEarningsPerConsultation.toFixed(0)}</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6>Performance Metrics</h6>
              <ul className="list-unstyled">
                <li><strong>Total Consultations:</strong> {earningsStats.totalConsultations}</li>
                <li><strong>Active Hospitals:</strong> {hospitalEarnings.length}</li>
                <li><strong>Specializations:</strong> {specializationEarnings.length}</li>
                <li><strong>Earnings Period:</strong> {timeFilter === 'all' ? 'All Time' : timeFilter === '30days' ? 'Last 30 Days' : 'Last 7 Days'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Earnings */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Recent Earnings</h5>
        </div>
        <div className="card-body">
          {filteredAppointments.slice(-10).reverse().length > 0 ? (
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Hospital</th>
                    <th>Patient</th>
                    <th>Consultation Fee</th>
                    <th>Your Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.slice(-10).reverse().map(appointment => (
                    <tr key={appointment.id}>
                      <td>{new Date(appointment.createdAt).toLocaleDateString()}</td>
                      <td>{appointment.hospitalName || 'Unknown Hospital'}</td>
                      <td>Patient #{appointment.patientId.slice(-4)}</td>
                      <td>₹{appointment.consultationFee}</td>
                      <td>
                        <strong className="text-success">₹{appointment.doctorEarnings}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted text-center">No recent earnings data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningsReports; 