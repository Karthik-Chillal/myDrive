import api from '../../services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../zustand/store';
const Register = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', {
        username: username,
        password: password,
      });
      navigate('/login');
      console.log(response.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };
  return (
    <div>
      <form onSubmit={handleRegister}>
        <label htmlFor="username-register">Username</label>
        <input
          type="text"
          id="username-register"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password-register">Password</label>
        <input
          type="password"
          id="password-register"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <button onClick={() => navigate('/login')}>login</button>
    </div>
  );
};
export default Register;
