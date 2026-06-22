import { useParams } from 'react-router-dom';
import api from '../services/api';
import FolderCreate from '../components/FolderCreate';
import FileUpload from '../components/FileUpload';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Folders = () => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const { folderId } = useParams();

  useEffect(() => {
    const fetchFolders = async () => {
      const link = `/folders/${folderId}`;
      try {
        const response = await api.get(link);
        const currFolders = response.data.folders;
        setFolders(currFolders);
        const currFiles = response.data.files;
        setFiles(currFiles);
      } catch (error) {
        console.log('Error fetching: ', error.response?.data || error.message);
      }
    };
    fetchFolders();
  }, [folderId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this folder?')) return;
    try {
      await api.delete(`/folders/${id}/delete`);
      setFolders((prev) => prev.filter((f) => f._id !== id));
    } catch (error) {
      console.error(
        'Error deleting folder:',
        error.response?.data || error.message
      );
    }
  };

  const handleRename = async (id, currentName) => {
    const newName = window.prompt('Enter new folder name:', currentName);
    if (!newName || newName.trim() === '' || newName === currentName) return;
    try {
      await api.put(`/folders/${id}/rename`, { folder_name: newName });
      setFolders((prev) =>
        prev.map((f) => (f._id === id ? { ...f, folder_name: newName } : f))
      );
    } catch (error) {
      console.error(
        'Error renaming folder:',
        error.response?.data || error.message
      );
    }
  };

  const handleDeleteFile = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await api.delete(`/files/${id}/delete`);
      setFiles((prev) => prev.filter((f) => f._id !== id));
    } catch (error) {
      console.error(
        'Error deleting file:',
        error.response?.data || error.message
      );
    }
  };

  const handleDownloadFile = async (id, filename) => {
    try {
      const response = await api.get(`/files/${id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(
        'Error downloading file:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      {/* Action Toolbar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <FolderCreate
          setCurrFolders={setFolders}
          currFolders={folders}
          parentFolderId={folderId}
        />
        <FileUpload
          setCurrFiles={setFiles}
          parentFolderId={folderId}
        />
      </div>

      {/* Folders Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Folders</h3>
        {folders && folders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <div key={folder._id} className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4 overflow-hidden">
                  <svg className="w-8 h-8 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  <Link to={`/folders/${folder._id}`} className="font-medium text-gray-700 hover:text-blue-600 truncate">
                    {folder.folder_name}
                  </Link>
                </div>
                <div className="flex justify-end gap-2 mt-auto">
                  <button onClick={() => handleRename(folder._id, folder.folder_name)} className="text-sm font-medium px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
                    Rename
                  </button>
                  <button onClick={() => handleDelete(folder._id)} className="text-sm font-medium px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm bg-gray-50 border border-gray-100 p-4 rounded-lg inline-block">No folders yet.</p>
        )}
      </div>

      {/* Files Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Files</h3>
        {files && files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map((file) => (
              <div key={file._id} className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4 overflow-hidden">
                  <svg className="w-8 h-8 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium text-gray-700 truncate" title={file.file_name}>
                    {file.file_name}
                  </span>
                </div>
                <div className="flex justify-end gap-2 mt-auto">
                  <button onClick={() => handleDownloadFile(file._id, file.file_name)} className="text-sm font-medium px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                    Download
                  </button>
                  <button onClick={() => handleDeleteFile(file._id)} className="text-sm font-medium px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm bg-gray-50 border border-gray-100 p-4 rounded-lg inline-block">No files yet.</p>
        )}
      </div>
    </div>
  );
};
export default Folders;
