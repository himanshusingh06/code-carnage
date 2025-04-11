import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./registerAccount.css";
import { registerUser, loginUser } from "../../../../controllers/auth/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    account_type: "DOCTOR",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await registerUser(formData);
      console.log(response);
      toast.success("Registration successful!");

      const loginData = {
        username: formData.username,
        password: formData.password,
      };
      const loginResponse = await loginUser(loginData);
      console.log(loginResponse);

      localStorage.setItem('accessToken', loginResponse.access);
      localStorage.setItem('refreshToken', loginResponse.refresh);
      localStorage.setItem('email_verified', loginResponse.email_verified);
      localStorage.setItem('email', loginResponse.email);
      localStorage.setItem('user_id', loginResponse.user_id);
      localStorage.setItem('account_type', loginResponse.account_type)


      if (localStorage.getItem('email_verified') == "false"){
        navigate('/accounts/register/verify')
        console.log("email not verified!! redirecting to verify email page")
      }
      else{
          navigate('/accounts/register/clinic');
      }
    } catch (error) {
      console.error("Registration or login failed:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Create Your Account</h1>

        {loading ? (
          <div className="loading-screen">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <p className="account-type-text">
              What kind of account would you like to create?
            </p>

            <div className="account-type-select">
              <select
                id="account_type"
                name="account_type"
                value={formData.account_type}
                onChange={handleChange}
              >
                <option value="CLINIC">CLINIC</option>
                <option value="DOCTOR">DOCTOR</option>
              </select>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="input-group half-width">
                  <label className="input-label" htmlFor="first_name">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="input-field"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group half-width">
                  <label className="input-label" htmlFor="last_name">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className="input-field"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="input-field"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-field"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="input-field"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="input-field"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="register-button outline">
                Register
              </button>
            </form>

            <div className="login-link">
              Already have an account? <Link to="/login">Log in</Link>
            </div>
          </>
        )}
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

export default Register;
