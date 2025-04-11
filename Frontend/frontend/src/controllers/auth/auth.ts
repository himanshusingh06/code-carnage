import axios from 'axios';

// Define the type for user data
interface UserData {
  first_name: string;
  last_name: string;
  account_type: string;
  username: string;
  email: string;
  password: string;
}

// Define the type for login data
interface LoginData {
  username: string;
  password: string;
}

// Define the type for company registration data
interface ClinicData {
  name: string;
  description: string;
  address: string; 
}

interface StudentData {
  first_name: string;
  last_name: string;
  dob: string;
  highest_qualification: string; 
  cgpa_per: string; 
  location: string;
  college_name: string;
  github?: string; 
}

interface verifyEmailData{
  user_id: string
  email: string;
  verification_code:string;
}


// Function to register a user
export const registerUser = async (userData: UserData) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/accounts/register/', userData);
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error);
    throw error; 
  }
};

// Function to log in a user
export const loginUser = async (loginData: LoginData) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/accounts/login/', loginData);
    return response.data; 
  } catch (error) {
    console.error("Login error:", error);
    throw error; 
  }
};

// Function to register a company
export const registerClinic = async (ClinicData: ClinicData , accessToken: string) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/clinic/create/', ClinicData, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Company registration error:", error);
    throw error; 
  }
};

export const registerStudent = async (StudentData: StudentData, accessToken: string) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/hirer/register/', StudentData, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Student registration error:", error);
    throw error; 
  }
};


export const verifyEmail = async (verifyEmailData: verifyEmailData, accessToken: string) => {
  try {
    const response = await axios.put('http://127.0.0.1:8000/accounts/verify-email/', verifyEmailData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Email verification error:", error);
    throw error;
  }
};