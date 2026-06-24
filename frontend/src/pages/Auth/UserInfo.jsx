import './UserInfo.css';
import { useAuthStore } from '../../../zustand/store';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginError from '@/components/LoginError';

const UserInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const isRegister = location.pathname === '/register';

  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    setErr(null);
    e.preventDefault();
    try {
      if (isRegister) {
        await api.post('/auth/register', { username, password });
        navigate('/login');
      } else {
        const response = await api.post('auth/login', { username, password });
        setToken(response.data.accessToken);
        navigate('/home');
      }
    } catch (error) {
      console.log(error.response?.data);
      setErr(
        error.response?.data?.message ||
          error.response?.data.error ||
          error.message,
        'Something went wong'
      );
    }
  };

  return (
    <div className="login-wrapper">
      <form className="form" onSubmit={handleSubmit}>
        <p className="form-title">
          {isRegister ? 'Create an account' : 'Log in to your account'}
        </p>
        <div className="input-container">
          <input
            placeholder="Enter username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span>
            <svg
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
        <div className="input-container">
          <input
            placeholder="Enter password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>
            <svg
              className="cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>

        {err && <LoginError err={err} setErr={setErr}></LoginError>}
        <button className="submit" type="submit">
          {isRegister ? 'Sign up' : 'Log in'}
        </button>
        <p className="signup-link">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <a onClick={() => navigate('/login')}>Log in</a>
            </>
          ) : (
            <>
              No account? <a onClick={() => navigate('/register')}>Sign up</a>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default UserInfo;
