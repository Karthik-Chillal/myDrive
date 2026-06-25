import { Routes, Route, Navigate } from 'react-router-dom';

import Folders from '../pages/Folders';
import UserInfo from '../pages/Auth/UserInfo.jsx';
import Layout from '../components/Layout';
import { useAuthStore } from '../../zustand/store';

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserInfo></UserInfo>}></Route>
      <Route path="/login" element={<UserInfo></UserInfo>}></Route>
      <Route path="/register" element={<UserInfo></UserInfo>}></Route>
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Layout>
              <Folders></Folders>
            </Layout>
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/folders/:folderId"
        element={
          <ProtectedRoute>
            <Layout>
              <Folders></Folders>
            </Layout>
          </ProtectedRoute>
        }
      ></Route>
    </Routes>
  );
};

export default AppRoutes;
