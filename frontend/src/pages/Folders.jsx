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
    <div>
      <div>
        <FolderCreate
          setCurrFolders={setFolders}
          currFolders={folders}
          parentFolderId={folderId}
        ></FolderCreate>
        <FileUpload
          setCurrFiles={setFiles}
          parentFolderId={folderId}
        ></FileUpload>
      </div>
      <div>
        <div>folders:</div>
        <ul>
          {folders &&
            folders.map((folder) => (
              <li key={folder._id} style={{ marginBottom: '8px' }}>
                <Link to={`/folders/${folder._id}`}>{folder.folder_name} </Link>
                <button
                  style={{ marginLeft: '10px' }}
                  onClick={() => handleRename(folder._id, folder.folder_name)}
                >
                  Rename
                </button>
                <button
                  style={{ marginLeft: '10px' }}
                  onClick={() => handleDelete(folder._id)}
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div>
        <div>files:</div>
        <ul>
          {files &&
            files.map((file) => (
              <li key={file._id} style={{ marginBottom: '8px' }}>
                <span>{file.file_name}</span>
                <button
                  style={{ marginLeft: '10px' }}
                  onClick={() => handleDownloadFile(file._id, file.file_name)}
                >
                  Download
                </button>
                <button
                  style={{ marginLeft: '10px' }}
                  onClick={() => handleDeleteFile(file._id)}
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
export default Folders;
