import { useParams } from 'react-router-dom';
import api from '../services/api';
import FolderCreate from '../components/FolderCreate';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const Folders = () => {
  const [folders, setFolders] = useState([]);
  const { folderId } = useParams();
  useEffect(() => {
    const fetchFolders = async () => {
      const link = `/folders/${folderId}`;
      try {
        const response = await api.get(link);
        const currFolders = response.data.folders;
        setFolders(currFolders);
        const files = response.data.files;
      } catch (error) {
        console.log('Error fetching: ', error.response?.data || error.message);
      }
    };
    fetchFolders();
  }, [folders, setFolders]);
  return (
    <div>
      <div>
        <FolderCreate
          setCurrFolders={setFolders}
          currFolders={folders}
          parentFolderId={folderId}
        ></FolderCreate>
      </div>
      <div>
        <div>folders:</div>
        <ul>
          {folders &&
            folders.map((folder) => (
              <li key={folder._id}>
                <Link to={`/folders/${folder._id}`}>{folder.folder_name} </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
export default Folders;
