import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="grid grid-cols-[240px_1fr] grid-rows-[auto_1fr] min-h-screen bg-gray-50">
      <div className="col-span-2">
        <Navbar />
      </div>
      <div className="border-r border-gray-200 bg-white">
        <Sidebar />
      </div>
      <main className="p-6 overflow-auto">{children}</main>
    </div>
  );
};

export default Layout;
