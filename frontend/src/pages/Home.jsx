import { useEffect } from 'react';
import api from '../services/api';
import { useHomeFoldersStore } from '../../zustand/store';

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
        console.log('Error fetching folders:', error.response?.data || error.message);
      }
    };
    fetchFolders();
  }, [setFolders]);
  const handleCreateHomeFolder = async (e) => {
    e.preventDefault();
    const folderName = e.target.folder_name.value;

    const response = await api.post('/folders/create', {
      folder_name: folderName,
    });
    const res = await api.get('/folders/');
    const fetchedFolders = res.data.contents.folders;
    setFolders(fetchedFolders);
    console.log(response.data);
  };
  return (
    <div>
      <div>
        <form onSubmit={handleCreateHomeFolder}>
          <label htmlFor="folder-name">Folder Name: </label>
          <input type="text" name="folder_name" id="folder-name" />
          <button>submit</button>
        </form>
      </div>
      <div>
        <h3>Folders:</h3>
        <ul>
          {folders && folders.map((folder) => (
            <li key={folder._id}>{folder.folder_name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
