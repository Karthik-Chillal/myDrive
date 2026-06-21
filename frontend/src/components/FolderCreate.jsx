import api from '../services/api';
const FolderCreate = (props) => {
  const { setCurrFolders, parentFolderId } = props;
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    const folderName = e.target.folder_name.value;
    const createUrl = parentFolderId
      ? `/folders/${parentFolderId}/create`
      : '/folders/create';
    try {
      const response = await api.post(createUrl, {
        folder_name: folderName,
      });

      let fetchedFolders;
      if (parentFolderId) {
        const res = await api.get(`/folders/${parentFolderId}`);
        fetchedFolders = res.data.folders;
      } else {
        const res = await api.get('/folders/');
        fetchedFolders = res.data.contents.folders;
      }
      setCurrFolders(fetchedFolders);
      console.log(response.data);
      e.target.reset();
    } catch (error) {
      console.error(
        'Error creating folder:',
        error.response?.data || error.message
      );
    }
  };
  return (
    <form onSubmit={handleCreateFolder}>
      <label htmlFor="folder-name">Folder Name: </label>
      <input type="text" name="folder_name" id="folder-name" required />
      <button type="submit">submit</button>
    </form>
  );
};

export default FolderCreate;
