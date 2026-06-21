import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import { Home } from '../pages/Home';
import Folders from '../pages/Folders';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login></Login>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/register" element={<Register></Register>}></Route>
      <Route path="/home" element={<Home></Home>}></Route>
      <Route path="/folders/:folderId" element={<Folders></Folders>}></Route>
    </Routes>
  );
};

export default AppRoutes;
