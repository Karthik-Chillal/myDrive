import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
const Folders = () => {
  const { folderId } = useParams();
  const link = `/folders/${folderId}`;
  const response = api.get(link);
  console.log(response);
  const [subfolders, setSubfolders] = useState([]);
  const [files, setFiles] = useState([]);
  return <div></div>;
};
export default Folders;
