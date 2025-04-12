import React, { useState } from 'react';
import './AppointmentDashboard.css';
import { Check, X } from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  status: 'completed' | 'pending' | 'requested';
}

const AppointmentDashboard: React.FC = () => {
  // Sample data - this would be replaced with API data later
  const appointmentData: Appointment[] = [
    { id: '1', date: '2025-04-12', time: '09:00 AM', patientName: 'John Doe', status: 'completed' },
    { id: '2', date: '2025-04-12', time: '10:30 AM', patientName: 'Jane Smith', status: 'pending' },
    { id: '3', date: '2025-04-12', time: '11:45 AM', patientName: 'Robert Johnson', status: 'pending' },
    { id: '4', date: '2025-04-13', time: '09:15 AM', patientName: 'Emily Davis', status: 'requested' },
    { id: '5', date: '2025-04-13', time: '02:00 PM', patientName: 'Michael Brown', status: 'requested' },
    { id: '6', date: '2025-04-14', time: '03:30 PM', patientName: 'Sarah Wilson', status: 'requested' },
  ];

  // States
  const [activeTab, setActiveTab] = useState<'today' | 'requested'>('today');
  
  // Derived counts
  const totalAppointments = appointmentData.length;
  const completedAppointments = appointmentData.filter(appointment => appointment.status === 'completed').length;
  const requestedAppointments = appointmentData.filter(appointment => appointment.status === 'requested').length;
  
  // Filter appointments based on active tab
  const filteredAppointments = appointmentData.filter(appointment => {
    if (activeTab === 'today') {
      return appointment.status === 'pending' || appointment.status === 'completed';
    } else {
      return appointment.status === 'requested';
    }
  });
  
  // Handle appointment acceptance
  const handleAccept = (id: string) => {
    console.log(`Appointment ${id} accepted`);
    // Here you would make an API call to update the status
  };
  
  // Handle appointment rejection
  const handleReject = (id: string) => {
    console.log(`Appointment ${id} rejected`);
    // Here you would make an API call to update the status
  };

  return (
    <div className="appointment-dashboard">
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Appointments</h3>
          <div className="stat-number">{totalAppointments}</div>
        </div>
        <div className="stat-card">
          <h3>Completed Appointments</h3>
          <div className="stat-number">{completedAppointments}</div>
        </div>
        <div className="stat-card">
          <h3>Requested Appointments</h3>
          <div className="stat-number">{requestedAppointments}</div>
        </div>
      </div>
      
      <div className="table-container">
        <div className="table-header">
          <h2>Appointments</h2>
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'today' ? 'active' : ''}`}
              onClick={() => setActiveTab('today')}
            >
              Today's Appointments
            </button>
            <button 
              className={`tab-button ${activeTab === 'requested' ? 'active' : ''}`}
              onClick={() => setActiveTab('requested')}
            >
              Requested Appointments
            </button>
          </div>
        </div>
        
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Patient Name</th>
              {activeTab === 'requested' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{`${appointment.date} | ${appointment.time}`}</td>
                <td>{appointment.patientName}</td>
                {activeTab === 'requested' && (
                  <td className="action-buttons">
                    <button 
                      className="accept-button"
                      onClick={() => handleAccept(appointment.id)}
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      className="reject-button"
                      onClick={() => handleReject(appointment.id)}
                    >
                      <X size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan={activeTab === 'requested' ? 3 : 2} className="no-appointments">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentDashboard;