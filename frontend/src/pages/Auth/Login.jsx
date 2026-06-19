import { useAuthStore } from '../../../zustand/store';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.setToken);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    if (token) {
      navigate('/home');
    }
    console.log(token);
  }, [token, navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        const response = await api.post('auth/login', {
          username: username,
          password: password,
        });
        login(response.data.token);
      }
      navigate('/home');
    } catch (error) {
      console.log(error.response?.data);
    }
  };
  return (
    <div>
      <form method="POST" onSubmit={handleLogin}>
        <label htmlFor="username-login">Username: </label>
        <input
          type="text"
          id="username-login"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password-login">Password: </label>
        <input
          type="password"
          id="password-login"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>
      <div>
        <button onClick={() => navigate('/register')}>sign up</button>
      </div>
    </div>
  );
};

export default Login;
