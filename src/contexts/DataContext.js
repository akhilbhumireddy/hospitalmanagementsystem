import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Initialize data from localStorage or with default values
  const [hospitals, setHospitals] = useState(() => {
    const stored = localStorage.getItem('hospitals');
    return stored ? JSON.parse(stored) : [];
  });

  const [doctors, setDoctors] = useState(() => {
    const stored = localStorage.getItem('doctors');
    return stored ? JSON.parse(stored) : [];
  });

  const [patients, setPatients] = useState(() => {
    const stored = localStorage.getItem('patients');
    return stored ? JSON.parse(stored) : [];
  });

  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : [];
  });

  const [departments, setDepartments] = useState(() => {
    const stored = localStorage.getItem('departments');
    return stored ? JSON.parse(stored) : [
      'Cardiology',
      'Orthopedics',
      'Pediatrics',
      'Neurology',
      'Oncology',
      'Dermatology',
      'Psychiatry',
      'Emergency Medicine',
      'General Surgery',
      'Internal Medicine'
    ];
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('departments', JSON.stringify(departments));
  }, [departments]);

  // Hospital Management Functions
  const addHospital = (hospitalData) => {
    const newHospital = {
      id: Date.now().toString(),
      ...hospitalData,
      createdAt: new Date().toISOString(),
      departments: [],
      totalRevenue: 0,
      totalConsultations: 0
    };
    setHospitals(prev => [...prev, newHospital]);
    toast.success('Hospital registered successfully!');
    return newHospital;
  };

  const updateHospital = (id, updates) => {
    setHospitals(prev => prev.map(hospital => 
      hospital.id === id ? { ...hospital, ...updates } : hospital
    ));
    toast.success('Hospital updated successfully!');
  };

  const addDepartmentToHospital = (hospitalId, departmentName) => {
    setHospitals(prev => prev.map(hospital => 
      hospital.id === hospitalId 
        ? { ...hospital, departments: [...hospital.departments, departmentName] }
        : hospital
    ));
    toast.success('Department added successfully!');
  };

  // Doctor Management Functions
  const addDoctor = (doctorData) => {
    const newDoctor = {
      id: Date.now().toString(),
      ...doctorData,
      createdAt: new Date().toISOString(),
      hospitalAssociations: [],
      totalEarnings: 0,
      totalConsultations: 0
    };
    setDoctors(prev => [...prev, newDoctor]);
    toast.success('Doctor registered successfully!');
    return newDoctor;
  };

  const updateDoctor = (id, updates) => {
    setDoctors(prev => prev.map(doctor => 
      doctor.id === id ? { ...doctor, ...updates } : doctor
    ));
    toast.success('Doctor profile updated successfully!');
  };

  const associateDoctorWithHospital = (doctorId, hospitalId, specializations, consultationFee) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (!hospital || !doctor) {
      toast.error('Hospital or doctor not found!');
      return false;
    }

    // Check if doctor's specializations match hospital departments
    const matchingDepartments = doctor.specializations.filter(spec => 
      hospital.departments.includes(spec)
    );

    if (matchingDepartments.length === 0) {
      toast.error('Doctor specializations must match hospital departments!');
      return false;
    }

    const association = {
      hospitalId,
      hospitalName: hospital.name,
      specializations: matchingDepartments,
      consultationFee,
      availability: [],
      earnings: 0,
      consultations: 0
    };

    setDoctors(prev => prev.map(d => 
      d.id === doctorId 
        ? { ...d, hospitalAssociations: [...d.hospitalAssociations, association] }
        : d
    ));

    toast.success('Doctor associated with hospital successfully!');
    return true;
  };

  const addDoctorAvailability = (doctorId, hospitalId, timeSlot) => {
    setDoctors(prev => prev.map(doctor => {
      if (doctor.id === doctorId) {
        const updatedAssociations = doctor.hospitalAssociations.map(assoc => {
          if (assoc.hospitalId === hospitalId) {
            // Check for conflicts
            const hasConflict = assoc.availability.some(slot => 
              new Date(slot.startTime) < new Date(timeSlot.endTime) &&
              new Date(slot.endTime) > new Date(timeSlot.startTime)
            );

            if (hasConflict) {
              toast.error('Time slot conflicts with existing availability!');
              return assoc;
            }

            return {
              ...assoc,
              availability: [...assoc.availability, timeSlot]
            };
          }
          return assoc;
        });
        return { ...doctor, hospitalAssociations: updatedAssociations };
      }
      return doctor;
    }));
    toast.success('Availability added successfully!');
  };

  // Patient Management Functions
  const addPatient = (patientData) => {
    const newPatient = {
      id: Date.now().toString(),
      ...patientData,
      createdAt: new Date().toISOString(),
      totalConsultations: 0,
      totalSpent: 0
    };
    setPatients(prev => [...prev, newPatient]);
    toast.success('Patient registered successfully!');
    return newPatient;
  };

  const updatePatient = (id, updates) => {
    setPatients(prev => prev.map(patient => 
      patient.id === id ? { ...patient, ...updates } : patient
    ));
    toast.success('Patient profile updated successfully!');
  };

  // Appointment Management Functions
  const bookAppointment = (appointmentData) => {
    const { doctorId, hospitalId, patientId, timeSlot, consultationFee } = appointmentData;
    
    // Verify doctor availability
    const doctor = doctors.find(d => d.id === doctorId);
    const association = doctor?.hospitalAssociations.find(a => a.hospitalId === hospitalId);
    
    if (!association) {
      toast.error('Doctor is not associated with this hospital!');
      return false;
    }

    // Check if slot is available
    const isAvailable = association.availability.some(slot => 
      slot.id === timeSlot.id && !slot.isBooked
    );

    if (!isAvailable) {
      toast.error('Selected time slot is not available!');
      return false;
    }

    const newAppointment = {
      id: Date.now().toString(),
      ...appointmentData,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      doctorEarnings: consultationFee * 0.6,
      hospitalRevenue: consultationFee * 0.4
    };

    setAppointments(prev => [...prev, newAppointment]);

    // Update doctor's availability
    setDoctors(prev => prev.map(d => {
      if (d.id === doctorId) {
        const updatedAssociations = d.hospitalAssociations.map(assoc => {
          if (assoc.hospitalId === hospitalId) {
            const updatedAvailability = assoc.availability.map(slot => 
              slot.id === timeSlot.id ? { ...slot, isBooked: true } : slot
            );
            return {
              ...assoc,
              availability: updatedAvailability,
              earnings: assoc.earnings + newAppointment.doctorEarnings,
              consultations: assoc.consultations + 1
            };
          }
          return assoc;
        });
        return {
          ...d,
          hospitalAssociations: updatedAssociations,
          totalEarnings: d.totalEarnings + newAppointment.doctorEarnings,
          totalConsultations: d.totalConsultations + 1
        };
      }
      return d;
    }));

    // Update hospital revenue
    setHospitals(prev => prev.map(h => 
      h.id === hospitalId 
        ? { 
            ...h, 
            totalRevenue: h.totalRevenue + newAppointment.hospitalRevenue,
            totalConsultations: h.totalConsultations + 1
          }
        : h
    ));

    // Update patient stats
    setPatients(prev => prev.map(p => 
      p.id === patientId 
        ? { 
            ...p, 
            totalConsultations: p.totalConsultations + 1,
            totalSpent: p.totalSpent + consultationFee
          }
        : p
    ));

    toast.success('Appointment booked successfully!');
    return true;
  };

  const cancelAppointment = (appointmentId) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) {
      toast.error('Appointment not found!');
      return;
    }

    setAppointments(prev => prev.map(a => 
      a.id === appointmentId ? { ...a, status: 'cancelled' } : a
    ));

    toast.success('Appointment cancelled successfully!');
  };

  const updateAppointmentStatus = (appointmentId, status) => {
    setAppointments(prev => prev.map(a =>
      a.id === appointmentId ? { ...a, status } : a
    ));
    toast.success(`Appointment ${status === 'accepted' ? 'accepted' : 'rejected'}!`);
  };

  // Utility Functions
  const getDoctorById = (id) => doctors.find(d => d.id === id);
  const getHospitalById = (id) => hospitals.find(h => h.id === id);
  const getPatientById = (id) => patients.find(p => p.id === id);
  const getAppointmentsByDoctor = (doctorId) => appointments.filter(a => a.doctorId === doctorId);
  const getAppointmentsByHospital = (hospitalId) => appointments.filter(a => a.hospitalId === hospitalId);
  const getAppointmentsByPatient = (patientId) => appointments.filter(a => a.patientId === patientId);

  const value = {
    // Data
    hospitals,
    doctors,
    patients,
    appointments,
    departments,
    
    // Hospital Functions
    addHospital,
    updateHospital,
    addDepartmentToHospital,
    
    // Doctor Functions
    addDoctor,
    updateDoctor,
    associateDoctorWithHospital,
    addDoctorAvailability,
    
    // Patient Functions
    addPatient,
    updatePatient,
    
    // Appointment Functions
    bookAppointment,
    cancelAppointment,
    updateAppointmentStatus,
    
    // Utility Functions
    getDoctorById,
    getHospitalById,
    getPatientById,
    getAppointmentsByDoctor,
    getAppointmentsByHospital,
    getAppointmentsByPatient
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 