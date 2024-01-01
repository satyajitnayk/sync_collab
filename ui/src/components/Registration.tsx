import { useState } from 'react';
import '../css/Registration.css';
import { useRegister } from '../hooks/useRegister';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

export const Registration = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { handleRegister } = useRegister();

  return (
    <div className="registration-container">
      <h3 style={{ textAlign: 'center' }}>REGISTER</h3>
      <label htmlFor="">Name</label>
      <input
        type="text"
        id="name"
        placeholder="Enter Your Name"
        onChange={(e) => setName(e.target.value)}
      />
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
      <button onClick={() => handleRegister(name, email, password)}>
        Register
      </button>
      <p>
        already registered? <Link to="/login">login</Link>
      </p>
      <ToastContainer />
    </div>
  );
};
