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
    <form onSubmit={handleCreateFolder} className="flex items-center gap-3">
      <input
        required
        autoComplete="off"
        name="folder_name"
        placeholder="New folder name..."
        type="text"
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create Folder
      </button>
    </form>
  );
};

export default FolderCreate;
