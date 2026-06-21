import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', textAlign: 'left' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>{children}</div>
    </div>
  );
};

export default Layout;
