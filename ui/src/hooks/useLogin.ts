import axios from 'axios';
import { apiURL } from '../config';
import { setAuthTokenCookie, showToast } from '../utils';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${apiURL}/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        // Registration successful, you might want to perform additional actions
        showToast('success', 'Login successful');
        const { token } = response.data;
        // Set the token in a cookie with a strict policy and a lifetime of 30 minutes
        setAuthTokenCookie(token, 30);
        navigate('/dashboard');
      } else {
        // Handle unexpected status code
        showToast('error', 'Unable to Login');
      }
    } catch (error) {
      // Handle network errors or other issues
      showToast('error', 'Unable to Login');
    }
  };

  return { handleLogin };
};
