# Hospital & Appointment Management System

## Interview Assignment: Comprehensive Hospital & Appointment Management System Design

### Objective
Design and implement a simplified, yet robust, Hospital & Appointment Management System. This project demonstrates proficiency in system design, data modeling, and practical development using modern tools (React, Context API, etc.).

---

## Scenario
You are tasked with building the core components of a system that facilitates the registration and management of hospitals, doctors, and patients, enabling seamless appointment booking and revenue tracking.

---

## Core Entities, User Roles, and Interactions

### System Users & Registration

#### 1. Hospital Admin
- Register a new hospital (name, location).
- Define and manage departments within their hospital.
- View all associated doctors.
- View total consultations and revenue for the hospital.
- View revenue per doctor and per department.

#### 2. Doctor
- Register with name, qualifications, specializations (multiple), and years of experience.
- Associate with hospitals (only if hospital has matching departments).
- Register availability time slots per hospital (no overlapping/conflicting slots).
- Set consultation fee per hospital.
- View total earnings, total consultations, and earnings per hospital.
- View patients treated today and manage appointment requests (accept/reject).

#### 3. Patient (User)
- Register with name, gender, date of birth, and unique ID (e.g., Aadhar, Passport).
- Search/filter doctors by specialization, hospital, and availability.
- View and book available time slots with doctors at chosen hospitals.
- View complete consultation history across all hospitals and doctors.

---

## Hospitals
- Unique name and location.
- Multiple departments (e.g., Cardiology, Orthopedics, Pediatrics).
- Multiple doctors can be affiliated with each department.

## Doctors
- Unique specializations, qualifications, and experience.
- Availability defined by time slots per hospital.
- Consultation fee set per hospital.
- Revenue sharing: 60% to doctor, 40% to hospital per consultation.

## Patient Flow & Booking
- Patients can search/filter doctors and view available slots.
- Patients book a slot; once booked, it becomes unavailable.
- No payment gateway: patient enters consultation amount when booking.

---

## Viewing & Reporting Capabilities

### Hospital Admin Dashboard
- List of all associated doctors.
- Total consultations and revenue for the hospital.
- Revenue per doctor and per department.

### Doctor Dashboard
- Total earnings from consultations (across all hospitals).
- Total number of consultations.
- Earnings broken down by each associated hospital.
- Patients treated today.
- Manage appointment requests (accept/reject).

### Patient Dashboard
- Complete consultation records across all hospitals and doctors.

---

## Running the Project

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm start
   ```
3. **Open in browser:**
   Visit [http://localhost:3004](http://localhost:3004)

---

## Demo Accounts
- **Hospital Admin:** admin@hospital.com / any password
- **Doctor:** doctor@example.com / any password
- **Patient:** patient@example.com / any password

---

## Notes
- Built with React, Context API, and React Router.
- All data is stored in localStorage for demo purposes.
- No payment gateway is implemented; booking records the entered amount.

---

**This project demonstrates a full workflow for hospital, doctor, and patient management, including appointment booking, availability, and revenue tracking.** 