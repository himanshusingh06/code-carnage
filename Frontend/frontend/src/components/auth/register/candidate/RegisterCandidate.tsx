
// function RegisterCandidate(){
//     return("register candidate");
// }

// export default RegisterCandidate

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./RegisterCandidate.css";
import { registerStudent } from "../../../../controllers/auth/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegisterCandidate() {
  const [formData, setFormData] = useState({
    dob: "",
    highest_qualification: "",
    cgpa_per: "",
    location: "",
    college_name: "",
    github: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email_verified = localStorage.getItem("email_verified");
    console.log(email_verified);
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.log("Access token not found Login again");
      navigate("/accounts/login");
    }
    if (email_verified == "false") {
      navigate("/accounts/register/verify");
    }
  });

  function handleChange(
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken"); // Retrieve access token from local storage

    try {
      const response = await registerStudent(formData, accessToken!); // Call the registerCompany function
      console.log(response);
      toast.success("Student registered successfully!");
      navigate("/home"); // Redirect to the home page after successful registration
    } catch (error) {
      console.error("Student registration failed:", error);
      toast.error("Student registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-company-container">
      <div className="register-form-section">
        <div className="title-container">
          <h1 className="register-title">Resigter as Candidate</h1>
        </div>

        {loading ? (
          <div className="loading-screen">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="register-form">
            <form onSubmit={handleSubmit}>

              <div className="form-row">
                <input
                  type="date"
                  placeholder="Date of Birth"
                  className="input-field"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  className="input-field select-field"
                  name="Qualification"
                  value={formData.highest_qualification}
                  onChange={handleChange}
                >
                  <option value="10+2">10+2</option>
                  <option value="PG">Postgraduate</option>
                  <option value="UG">Undergraduate</option>
                  <option value="Deg">Degree</option>
                </input>
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="College Name"
                  className="input-field"
                  name="CollegeName"
                  value={formData.college_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="CGPA / Percentage"
                  className="input-field"
                  name="CGPA"
                  value={formData.cgpa_per}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="Address"
                  className="input-field"
                  name="address"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="form-row">
                <input
                  type="url"
                  placeholder="GitHub (optional)"
                  className="input-field"
                  name="website"
                  value={formData.github}
                  onChange={handleChange}
                />
              </div>

              <div className="terms-text">
                By creating an account, I agree with the company's{" "}
                <a href="/privacy">Privacy Policy</a> and{" "}
                <a href="/terms">Terms of Service</a>.
              </div>

              <button type="submit" className="register-button outline">
                Register
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="register-illustration-section">
        <div className="illustration-container">
          <img
            src="./company.jpg"
            alt="company_image"
            className="office-illustration"
          />
          <div className="floating-icons">
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 10L61.8 35.6L90 40.3L70 60.4L75.6 88.6L50 75.3L24.4 88.6L30 60.4L10 40.3L38.2 35.6L50 10Z"
                stroke="#FF8A00"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="20"
                fill="transparent"
                stroke="#FF8A00"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default RegisterCandidate;