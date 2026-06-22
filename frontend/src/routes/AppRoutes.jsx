import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import { Home } from '../pages/Home';
import Folders from '../pages/Folders';
import UserInfo from '../pages/Auth/UserInfo.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserInfo></UserInfo>}></Route>
      <Route path="/login" element={<UserInfo></UserInfo>}></Route>
      <Route path="/register" element={<UserInfo></UserInfo>}></Route>
      <Route path="/home" element={<Home></Home>}></Route>
      <Route path="/folders/:folderId" element={<Folders></Folders>}></Route>
    </Routes>
  );
};

export default AppRoutes;
