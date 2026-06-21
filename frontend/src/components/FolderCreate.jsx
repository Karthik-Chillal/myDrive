import api from '../services/api';
import { useHomeFoldersStore } from '../../zustand/store';
const FolderCreate = () => {
  const folders = useHomeFoldersStore((state) => state.folders);
  const setFolders = useHomeFoldersStore((state) => state.setFolders);
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
    <form onSubmit={handleCreateHomeFolder}>
      <label htmlFor="folder-name">Folder Name: </label>
      <input type="text" name="folder_name" id="folder-name" />
      <button>submit</button>
    </form>
  );
};

export default FolderCreate;
