import axios from 'axios';

const JUDGE0_API_URL = 'https://api.judge0.com/submissions'; // Replace with the actual Judge0 API URL

export const executeCode = async (code: string) => {
    try {
        const response = await axios.post(JUDGE0_API_URL, {
            source_code: code,
            language_id: 63, // Example for JavaScript, change as needed
            stdin: '',
            expected_output: '',
        });

        const { token } = response.data;

        // Poll for the result
        const result = await getResult(token);
        return result;
    } catch (error) {
        console.error('Error executing code:', error);
        return 'Error executing code';
    }
};

const getResult = async (token: string) => {
    const response = await axios.get(`${JUDGE0_API_URL}/${token}`);
    return response.data;
};
