import axios from 'axios';

// export const baseURL = 'https://81e3-202-62-70-196.ngrok-free.app/'
export const baseURL = 'http://127.0.0.1:8000/'
// Define the type for user data
interface UserData {
  first_name: string;
  last_name: string;
  account_type: string;
  username: string;
  email: string;
  password: string;
}

interface DoctorData{
  name: string;
  specialization:string;
  experience:string;
  availibility:boolean;
  available_days:string;

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
    const response = await axios.post(  `${baseURL}accounts/register/`, userData);
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error);
    throw error; 
  }
};

export const registerDoctor = async (doctorData: DoctorData) => {
  try{
    const response = await axios.post(`${baseURL}clinic/doctor/`,doctorData);
    return response;
   }catch(error){
      console.error("Doctor Registation error",error);
      throw error;
    }
  }


// Function to log in a user
export const loginUser = async (loginData: LoginData) => {
  try {
    const response = await axios.post(`${baseURL}/accounts/login/`, loginData);
    return response.data; 
  } catch (error) {
    console.error("Login error:", error);
    throw error; 
  }
};

// Function to register a company
export const registerClinic = async (ClinicData: ClinicData , accessToken: string) => {
  try {
    const response = await axios.post(`${baseURL}/clinic/create/`, ClinicData, {
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
    const response = await axios.post(`${baseURL}/hirer/register/`, StudentData, {
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
    const response = await axios.put(`${baseURL}/accounts/verify-email/`, verifyEmailData, {
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