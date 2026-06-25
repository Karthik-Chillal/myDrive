import './App.css';
import Loader from './components/Loader';
import AppRoutes from './routes/AppRoutes.jsx';
import { useLoadingStore } from '../zustand/store';
const App = () => {
  const { loading } = useLoadingStore();

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader />
        </div>
      )}
      <AppRoutes></AppRoutes>
    </div>
  );
};

export default App;
