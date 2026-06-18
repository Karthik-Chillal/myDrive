import api from '../../services/api';

const Register = () => {
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.setToken);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register');
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form action="http://localhost:3000/auth/register" method="POST">
        <label htmlFor="username-register">Username</label>
        <input type="text" id="username-register" name="username" />
        <label htmlFor="password-register">Password</label>
        <input type="password" id="password-register" name="password" />
        <button type="submit">Register</button>
      </form>
      <div>login</div>
    </div>
  );
};
export default Register;
