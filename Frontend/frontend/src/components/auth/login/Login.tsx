import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';  
import { loginUser } from '../../../controllers/auth/auth'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(formData); 
      console.log(response);
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh); 
      localStorage.setItem('email', response.email); 
      localStorage.setItem('email_verified', response.email_verified); 
      localStorage.setItem('user_id', response.user_id); 
      toast.success('Login successful!');

      if(response.email_verified == false){
        navigate('/accounts/register/verify');
      }else{
        navigate('/home');
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Log in to your account</h1>
        
        {loading ? (
          <div className="loading-screen">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            {/* <div className="oauth-buttons">
              <button className="oauth-button google-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.8 12.5c0-.9-.1-1.7-.3-2.5H12v4.7h5.5c-.2 1.1-.9 2.1-1.9 2.8v2.3h3.1c1.8-1.7 2.8-4.1 2.8-7.3z" />
                  <path d="M12 22c2.6 0 4.8-.9 6.4-2.3l-3.1-2.3c-.9.6-2 .9-3.3.9-2.5 0-4.6-1.7-5.4-3.9H3.5v2.4C5.1 19.7 8.3 22 12 22z" />
                  <path d="M6.6 14.1c-.2-.6-.3-1.2-.3-1.9 0-.7.1-1.3.3-1.9V8H3.5C2.9 9.2 2.5 10.6 2.5 12s.4 2.8 1 4l3.1-1.9z" />
                  <path d="M12 6.3c1.4 0 2.6.5 3.6 1.4l2.8-2.8C16.8 3.5 14.6 2.5 12 2.5c-3.7 0-6.9 2.3-8.5 5.5l3.1 2.4c.8-2.2 2.9-3.9 5.4-3.9z" />
                </svg>
                LOG IN WITH GOOGLE
              </button> 
              <button className="oauth-button github-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                LOG IN WITH GITHUB
              </button>
            </div>

            <div className="divider">
              <span>or</span>
            </div> */}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input 
                  type="text" 
                  id="username" 
                  name="username"
                  className="input-field" 
                  placeholder="username"
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="input-group">
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  className="input-field" 
                  placeholder="Password"
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <a href="#" className="forgot-password">Don't remember your password?</a>
              
              <button type="submit" className="login-button">Log In</button>
            </form>
            
            <div className="signup-link">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
          </>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default Login;