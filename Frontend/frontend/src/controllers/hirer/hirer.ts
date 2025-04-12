import axios from 'axios';
import { startHiring } from '../../controllers/hirer/hirer'; // Import the startHiring function

// export const baseURL = 'https://81e3-202-62-70-196.ngrok-free.app/'
export const baseURL = 'http://127.0.0.1:8000/'

// Function to get hirer data and job opportunities
export const getClinicData = async (accessToken: string) => {
  try {
    const response = await axios.get(`${baseURL}clinic/create/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching hirer data:", error);
    throw error; 
  }
};

// Function to start hiring
export const startHiring = async (accessToken: string, jobData: JobFormData) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/hirer/start-hiring/', jobData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error starting hiring process:", error);
    throw error; 
  }
};

// Function to get test details for a specific job opportunity
export const getTestDetails = async (accessToken: string, jobOpportunityId: number, bodyData: any) => {
  try {
    const response = await axios.post(`http://127.0.0.1:8000/test-details/${jobOpportunityId}/`, bodyData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching test details:", error);
    throw error; 
  }
};


