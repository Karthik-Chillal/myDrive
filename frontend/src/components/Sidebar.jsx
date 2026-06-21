import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div
      style={{
        width: '200px',
        borderRight: '1px solid #ccc',
        padding: '10px',
        height: '100vh',
      }}
    >
      <h3>My Drive</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/bin">Bin</Link>
        </li>
        <li>
          <Link to="/storage">Storage</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
