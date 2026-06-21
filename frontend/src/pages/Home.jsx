import { useEffect } from 'react';
import api from '../services/api';
import { useHomeFoldersStore } from '../../zustand/store';
import FolderCreate from '../components/FolderCreate';

export const Home = () => {
  const folders = useHomeFoldersStore((state) => state.folders);
  const setFolders = useHomeFoldersStore((state) => state.setFolders);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await api.get('/folders');
        console.log('Response data:', response.data);
        if (response.data?.contents) {
          const fetchedFolders = response.data.contents.folders;
          setFolders(fetchedFolders);
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
  }, [setFolders]);

  // const getFolders = (e) => {
  //   e.preventDefault();
  //   const folder_id = null;
  // };
  return (
    <div>
      <div>
        <FolderCreate></FolderCreate>
      </div>
      <div>
        <h3>Folders:</h3>
        <ul>
          {folders &&
            folders.map((folder) => (
              <li>
                <a href={`/folders/${folder._id}`} key={folder._id}>
                  {folder.folder_name}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
