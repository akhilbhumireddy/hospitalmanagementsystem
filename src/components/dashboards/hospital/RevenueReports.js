import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useData } from '../../../contexts/DataContext';
import { FaChartLine, FaChartBar, FaChartPie, FaCalendarAlt } from 'react-icons/fa';

const RevenueReports = () => {
  const { currentUser } = useAuth();
  const { hospitals, doctors, appointments } = useData();
  const [timeFilter, setTimeFilter] = useState('all');

  const hospital = hospitals.find(h => h.id === currentUser.id);
  const hospitalAppointments = appointments.filter(a => a.hospitalId === currentUser.id);

  const getFilteredAppointments = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    switch (timeFilter) {
      case '7days':
        return hospitalAppointments.filter(a => new Date(a.createdAt) >= sevenDaysAgo);
      case '30days':
        return hospitalAppointments.filter(a => new Date(a.createdAt) >= thirtyDaysAgo);
      default:
        return hospitalAppointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  const getRevenueStats = () => {
    const totalRevenue = filteredAppointments.reduce((sum, app) => sum + app.hospitalRevenue, 0);
    const totalConsultations = filteredAppointments.length;
    const avgRevenuePerConsultation = totalConsultations > 0 ? totalRevenue / totalConsultations : 0;

    return {
      totalRevenue,
      totalConsultations,
      avgRevenuePerConsultation
    };
  };

  const getDepartmentRevenue = () => {
    const deptRevenue = {};
    
    filteredAppointments.forEach(appointment => {
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      if (doctor) {
        const association = doctor.hospitalAssociations.find(a => a.hospitalId === currentUser.id);
        if (association) {
          association.specializations.forEach(spec => {
            deptRevenue[spec] = (deptRevenue[spec] || 0) + appointment.hospitalRevenue;
          });
        }
      }
    });

    return Object.entries(deptRevenue).map(([dept, revenue]) => ({
      department: dept,
      revenue,
      percentage: (revenue / getRevenueStats().totalRevenue * 100).toFixed(1)
    }));
  };

  const getDoctorRevenue = () => {
    const doctorRevenue = {};
    
    filteredAppointments.forEach(appointment => {
      const doctor = doctors.find(d => d.id === appointment.doctorId);
      if (doctor) {
        doctorRevenue[doctor.id] = {
          name: doctor.name,
          revenue: (doctorRevenue[doctor.id]?.revenue || 0) + appointment.hospitalRevenue,
          consultations: (doctorRevenue[doctor.id]?.consultations || 0) + 1
        };
      }
    });

    return Object.values(doctorRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  const getMonthlyRevenue = () => {
    const monthlyData = {};
    
    filteredAppointments.forEach(appointment => {
      const date = new Date(appointment.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + appointment.hospitalRevenue;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({
        month,
        revenue,
        label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }));
  };

  const revenueStats = getRevenueStats();
  const departmentRevenue = getDepartmentRevenue();
  const doctorRevenue = getDoctorRevenue();
  const monthlyRevenue = getMonthlyRevenue();

  return (
    <div className="revenue-reports">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Revenue Reports</h3>
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
              <h4 className="fw-bold text-primary">₹{revenueStats.totalRevenue.toLocaleString()}</h4>
              <p className="text-muted mb-0">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaCalendarAlt className="text-success mb-2" size={30} />
              <h4 className="fw-bold text-success">{revenueStats.totalConsultations}</h4>
              <p className="text-muted mb-0">Total Consultations</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <FaChartBar className="text-warning mb-2" size={30} />
              <h4 className="fw-bold text-warning">₹{revenueStats.avgRevenuePerConsultation.toFixed(0)}</h4>
              <p className="text-muted mb-0">Avg. Revenue per Consultation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Department Revenue */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">
                <FaChartPie className="me-2" />
                Revenue by Department
              </h5>
            </div>
            <div className="card-body">
              {departmentRevenue.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Revenue</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentRevenue.map(dept => (
                        <tr key={dept.department}>
                          <td>
                            <span className="badge bg-primary">{dept.department}</span>
                          </td>
                          <td>₹{dept.revenue.toLocaleString()}</td>
                          <td>{dept.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center">No revenue data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Doctors by Revenue */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">
                <FaChartBar className="me-2" />
                Top Doctors by Revenue
              </h5>
            </div>
            <div className="card-body">
              {doctorRevenue.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Doctor</th>
                        <th>Revenue</th>
                        <th>Consultations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorRevenue.map(doctor => (
                        <tr key={doctor.name}>
                          <td>
                            <div>
                              <h6 className="mb-0">{doctor.name}</h6>
                              <small className="text-muted">
                                ₹{(doctor.revenue / doctor.consultations).toFixed(0)} per consultation
                              </small>
                            </div>
                          </td>
                          <td>₹{doctor.revenue.toLocaleString()}</td>
                          <td>{doctor.consultations}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center">No doctor revenue data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Revenue Trend */}
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">
                <FaChartLine className="me-2" />
                Monthly Revenue Trend
              </h5>
            </div>
            <div className="card-body">
              {monthlyRevenue.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Revenue</th>
                        <th>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyRevenue.map((month, index) => {
                        const prevMonth = monthlyRevenue[index - 1];
                        const trend = prevMonth 
                          ? ((month.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(1)
                          : 0;
                        
                        return (
                          <tr key={month.month}>
                            <td>{month.label}</td>
                            <td>₹{month.revenue.toLocaleString()}</td>
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
                <p className="text-muted text-center">No monthly revenue data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-transparent">
          <h5 className="mb-0">Revenue Summary</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Revenue Distribution</h6>
              <ul className="list-unstyled">
                <li><strong>Hospital Share:</strong> 40% of consultation fees</li>
                <li><strong>Doctor Share:</strong> 60% of consultation fees</li>
                <li><strong>Total Revenue:</strong> ₹{revenueStats.totalRevenue.toLocaleString()}</li>
                <li><strong>Average per Consultation:</strong> ₹{revenueStats.avgRevenuePerConsultation.toFixed(0)}</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6>Performance Metrics</h6>
              <ul className="list-unstyled">
                <li><strong>Total Consultations:</strong> {revenueStats.totalConsultations}</li>
                <li><strong>Active Departments:</strong> {departmentRevenue.length}</li>
                <li><strong>Active Doctors:</strong> {doctorRevenue.length}</li>
                <li><strong>Revenue Period:</strong> {timeFilter === 'all' ? 'All Time' : timeFilter === '30days' ? 'Last 30 Days' : 'Last 7 Days'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReports; 