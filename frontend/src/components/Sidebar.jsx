import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Home', path: '/home' },
    { name: 'Bin', path: '/bin' },
    { name: 'Storage', path: '/storage' },
  ];

  return (
    <div className="flex flex-col w-full h-full p-4 space-y-2 text-base bg-blue-200">
      <ul className="flex flex-col gap-1 w-full mt-4">
        {links.map((link) => (
          <li key={link.name} className="w-full">
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `block w-full px-4 py-3 rounded-lg transition-colors duration-200 font-medium ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
