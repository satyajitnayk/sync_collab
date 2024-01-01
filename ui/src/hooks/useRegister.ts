import axios from 'axios';
import { apiURL } from '../config';
import { showToast } from '../utils';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
  const navigate = useNavigate();

  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await axios.post(`${apiURL}/register`, {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        // Registration successful, you might want to perform additional actions
        showToast('success', 'Registration successful');
        navigate('/login');
      } else {
        // Handle unexpected status code
        showToast('error', 'Unable to register');
      }
    } catch (error) {
      // Handle network errors or other issues
      showToast('error', 'Unable to register');
    }
  };

  return { handleRegister };
};
