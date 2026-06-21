import { useEffect, useState } from 'react';
import api from '../services/api';
import FolderCreate from '../components/FolderCreate';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [currFolders, setCurrFolders] = useState([]);
  useEffect(() => {
    const fetchFolders = async () => {
      const response = await api.get('/folders');
      try {
        if (response.data?.contents) {
          const fetchedFolders = response.data.contents.folders;
          setCurrFolders(fetchedFolders);
          console.log('Folders:', fetchedFolders);
        }
      } catch (error) {
        console.log(
          'Error fetching folders:',
          error.response?.data || error.message
        );
      }
    };
    fetchFolders();
  }, [setCurrFolders]);

  // const getFolders = (e) => {
  //   e.preventDefault();
  //   const folder_id = null;
  // };
  return (
    <div>
      <div>
        <FolderCreate
          currFolders={currFolders}
          setCurrFolders={setCurrFolders}
          parentFolderId={null}
        ></FolderCreate>
      </div>
      <div>
        <h3>Folders:</h3>
        <ul>
          {currFolders &&
            currFolders.map((folder) => (
              <li key={folder._id}>
                <Link to={`/folders/${folder._id}`}>{folder.folder_name}</Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
