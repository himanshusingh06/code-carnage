import axios from 'axios';
import { startHiring } from '../../controllers/hirer/hirer'; // Import the startHiring function

// Function to get hirer data and job opportunities
export const getHirerData = async (accessToken: string) => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/hirer/all/', {
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


