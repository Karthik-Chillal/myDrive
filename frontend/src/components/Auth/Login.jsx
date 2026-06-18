import { useAuthStore } from '../../store';
import { useEffect, useState } from 'react';
import api from '../../services/api';

const Login = () => {
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.setToken);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    console.log(token);
  }, [token]);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('auth/login', {
        username: username,
        password: password,
      });

      login(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form method="POST" onSubmit={handleLogin}>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>
      <div>
        <button>sign up</button>
      </div>
    </div>
  );
};

export default Login;
