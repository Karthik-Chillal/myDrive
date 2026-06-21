import { useEffect, useState } from 'react';
import api from '../services/api';
import FolderCreate from '../components/FolderCreate';
import FileUpload from '../components/FileUpload';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [currFolders, setCurrFolders] = useState([]);
  const [currFiles, setCurrFiles] = useState([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const response = await api.get('/folders');
      try {
        if (response.data?.contents) {
          const fetchedFolders = response.data.contents.folders;
          const fetchedFiles = response.data.contents.files;
          setCurrFolders(fetchedFolders);
          setCurrFiles(fetchedFiles);
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this folder?')) return;
    try {
      await api.delete(`/folders/${id}/delete`);
      setCurrFolders((prev) => prev.filter((f) => f._id !== id));
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
      setCurrFolders((prev) =>
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
      setCurrFiles((prev) => prev.filter((f) => f._id !== id));
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
          currFolders={currFolders}
          setCurrFolders={setCurrFolders}
          parentFolderId={null}
        ></FolderCreate>
        <FileUpload
          setCurrFiles={setCurrFiles}
          parentFolderId={null}
        ></FileUpload>
      </div>
      <div>
        <h3>Folders:</h3>
        <ul>
          {currFolders &&
            currFolders.map((folder) => (
              <li key={folder._id} style={{ marginBottom: '8px' }}>
                <Link to={`/folders/${folder._id}`}>{folder.folder_name}</Link>
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
        <h3>Files:</h3>
        <ul>
          {currFiles &&
            currFiles.map((file) => (
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
