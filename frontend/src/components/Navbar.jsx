import LogoutButton from './LogoutButton';
const Navbar = () => {
  return (
    <nav className="w-full bg-blue-200 border-b border-gray-200 shadow-sm flex justify-between items-center transition-all duration-300 p-5">
      <div className="flex items-center gap-2 cursor-pointer select-none">
        <div className="text-5xl font-extrabold tracking-tight">
          <span className="text-green-500 ">my</span>
          <span className="text-black">Drive</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <LogoutButton></LogoutButton>
      </div>
    </nav>
  );
};

export default Navbar;
