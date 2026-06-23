import { Routes, Route } from 'react-router-dom';

import Folders from '../pages/Folders';
import UserInfo from '../pages/Auth/UserInfo.jsx';
import Layout from '../components/Layout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserInfo></UserInfo>}></Route>
      <Route path="/login" element={<UserInfo></UserInfo>}></Route>
      <Route path="/register" element={<UserInfo></UserInfo>}></Route>
      <Route
        path="/home"
        element={
          <Layout>
            <Folders></Folders>
          </Layout>
        }
      ></Route>
      <Route
        path="/folders/:folderId"
        element={
          <Layout>
            <Folders></Folders>
          </Layout>
        }
      ></Route>
    </Routes>
  );
};

export default AppRoutes;
