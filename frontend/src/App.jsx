import { useEffect } from 'react';
import './App.css';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register';
import { Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import { useAuthStore } from './store.js';
const App = () => {
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const clearToken = useAuthStore((state) => state.clearToken);
  return (
    <div>
      <Login></Login>
      {/* <Router>
        <Routes>
          <Route></Route>
          <Route></Route>
          <Route></Route>
          <Route></Route>
        </Routes>
      </Router> */}
    </div>
  );
};

export default App;
