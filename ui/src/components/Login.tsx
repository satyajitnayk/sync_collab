import { useState } from 'react';
import '../css/Login.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLogin } from '../hooks/useLogin';
import { Link } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { handleLogin } = useLogin();

  return (
    <div className="login-container">
      <h3 style={{ textAlign: 'center' }}>LOGIN</h3>

      <label htmlFor="">Email</label>
      <input
        type="text"
        id="email"
        placeholder="Enter Your Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="">Password</label>
      <input
        type="password"
        id="password"
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => handleLogin(email, password)}>Login</button>
      <p>
        new user? <Link to="/signup">register</Link>
      </p>
      <ToastContainer />
    </div>
  );
};
