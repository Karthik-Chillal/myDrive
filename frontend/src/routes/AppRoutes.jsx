import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import { Home } from '../pages/Home';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login></Login>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/register" element={<Register></Register>}></Route>
      <Route path="/home" element={<Home></Home>}></Route>
    </Routes>
  );
};

export default AppRoutes;
