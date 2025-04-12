import React, { useState } from 'react';
import './addDoctor.css';
import { registerUser, registerDoctor } from '../../controllers/auth/auth'; // Adjust as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UserData {
    first_name: string;
    last_name: string;
    username: string;   
    email: string;
    password: string;
  }

interface DoctorData {
  name: string;
  specialization: string;
  experience: string;
  available_days: string;
}

const AddDoctor: React.FC = () => {
    const [userData, setUserData] = useState<UserData>({
        first_name: '',
        last_name: '',
        username: '',    
        email: '',
        password: ''
      });
      

  const [doctorData, setDoctorData] = useState<DoctorData>({
    name: '',
    specialization: '',
    experience: '',
    available_days: ''
  });

  const [accessToken, setAccessToken] = useState('');
  const [userSubmitted, setUserSubmitted] = useState(false);
  const [userSuccessMsg, setUserSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(true);
  const [showDoctorForm, setShowDoctorForm] = useState(false);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await registerUser(userData);
      setAccessToken(result.token); // assuming the token comes here
      setUserSubmitted(true);
      setUserSuccessMsg("✅ User registered successfully!");
      toast.success("User registered successfully!");
    } catch (err) {
      toast.error("User registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = {
        ...doctorData,
        availibility: true, // default
        clinic: "default_from_user_context" // backend should extract from user
      };
      await registerDoctor(data, accessToken);
      toast.success("Doctor registered successfully!");
    } catch (err) {
      toast.error("Doctor registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <ToastContainer />
      <div className="section">
        <div className="section-header" onClick={() => setShowUserForm(!showUserForm)}>
          <h2>User Registration</h2>
        </div>
        <div className={`collapsible-content ${showUserForm ? 'open' : ''}`}>
          {userSuccessMsg && (
            <div className="success-message">{userSuccessMsg}</div>
          )}
          <form onSubmit={handleUserSubmit}>
            {Object.entries(userData).map(([key, value]) => (
              <div key={key} className="form-row">
                <div className="field-label">
                  <strong>{key.replace('_', ' ')}</strong>
                  <p>Enter your {key.replace('_', ' ')}</p>
                </div>
                <input
                  type={key === "password" ? "password" : "text"}
                  value={value}
                  onChange={(e) => setUserData({ ...userData, [key]: e.target.value })}
                  required
                  disabled={userSubmitted}
                />
              </div>
            ))}
            <button
              type="submit"
              className="submit-btn"
              disabled={userSubmitted || isLoading}
            >
              {isLoading ? "Submitting..." : "Submit User"}
            </button>
          </form>
        </div>
      </div>

      <div className="section">
        <div className="section-header" onClick={() => setShowDoctorForm(!showDoctorForm)}>
          <h2>Doctor Registration</h2>
        </div>
        <div className={`collapsible-content ${showDoctorForm ? 'open' : ''}`}>
          <form onSubmit={handleDoctorSubmit}>
            {Object.entries(doctorData).map(([key, value]) => (
              <div key={key} className="form-row">
                <div className="field-label">
                  <strong>{key.replace('_', ' ')}</strong>
                  <p>Enter the doctor's {key.replace('_', ' ')}</p>
                </div>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setDoctorData({ ...doctorData, [key]: e.target.value })}
                  required
                  disabled={!userSubmitted || isLoading}
                />
              </div>
            ))}
            <button
              type="submit"
              className="submit-btn"
              disabled={!userSubmitted || isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Doctor"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
