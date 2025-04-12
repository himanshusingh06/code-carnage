import { useState, ChangeEvent, KeyboardEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./verify.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyEmail } from '../../../controllers/auth/auth';

interface VerifyProps {
  preventDefaultBehaviour: boolean;
  customSubmission: (otpCode: string) => Promise<void>;
}

const Verify: React.FC<VerifyProps> = ({ preventDefaultBehaviour, customSubmission }) => {
  const accessToken = localStorage.getItem('accessToken');
  const email = localStorage.getItem('email');
  const email_verified = localStorage.getItem('email_verified');
  const user_id = localStorage.getItem('user_id')
  const account_type = localStorage.getItem('account_type')

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const navigate = useNavigate();
  const [verifyData, setVerifyData] = useState({
    email: "",
    verification_code: ""
  });

  useEffect(() => {
    if (!accessToken || !email) {
      console.log("Access token or email not found, redirecting to login.");
      navigate('/accounts/login');
      return;
    }
    if(email_verified && email_verified=='true'){
      navigate('/home');

    }
    setVerifyData({ ...verifyData, email: email });
  }, [accessToken, email, navigate]);

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);
      setVerifyData({ ...verifyData, verification_code: newOtp.join("") });

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (preventDefaultBehaviour) {
      event.preventDefault();
    }
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    try {
      await customSubmission(otpCode);
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h1 className="verify-title">Verify Your Email</h1>
        <p className="verify-instruction">Enter the 6-digit code sent to your email.</p>

        <form className="verify-form" onSubmit={handleSubmit}>
          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                className="otp-input"
                value={digit}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                maxLength={1}
                inputMode="numeric"
              />
            ))}
          </div>

          <button type="submit" className="verify-button">Verify</button>
        </form>

        <p className="resend-text">
          Didn't receive the code? <button className="resend-button">Resend</button>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Verify;
