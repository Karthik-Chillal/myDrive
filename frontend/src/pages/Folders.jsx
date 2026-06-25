import { useParams } from 'react-router-dom';
import api from '../services/api';
import FolderCreate from '../components/FolderCreate';
import FileUpload from '../components/FileUpload';
import { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import { useLoadingStore } from '../../zustand/store';
import FolderList from '../components/FolderList';
import FileList from '../components/FileList';

const Folders = () => {
  const { setLoading } = useLoadingStore();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const { folderId } = useParams();

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      // If folderId exists, fetch specific folder, else fetch root folders
      const link = folderId ? `/folders/${folderId}` : '/folders';
      try {
        const response = await api.get(link);
        // The API returns differently based on the endpoint:
        // /folders -> response.data.contents.folders and .files
        // /folders/:id -> response.data.folders and .files
        const currFolders = folderId
          ? response.data.folders
          : response.data.contents?.folders;
        const currFiles = folderId
          ? response.data.files
          : response.data.contents?.files;

        if (currFolders) setFolders(currFolders);
        if (currFiles) setFiles(currFiles);
      } catch (error) {
        console.error(
          'Error fetching: ',
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, [folderId, setLoading]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this folder?')) return;
    setLoading(true);
    try {
      await api.delete(`/folders/${id}/delete`);
      setFolders((prev) => prev.filter((f) => f._id !== id));
    } catch (error) {
      console.error(
        'Error deleting folder:',
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (id, currentName) => {
    const newName = window.prompt('Enter new folder name:', currentName);
    if (!newName || newName.trim() === '' || newName === currentName) return;
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    setLoading(true);
    try {
      await api.delete(`/files/${id}/delete`);
      setFiles((prev) => prev.filter((f) => f._id !== id));
    } catch (error) {
      console.error(
        'Error deleting file:',
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (id, filename) => {
    setLoading(true);
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
      window.URL.revokeObjectURL(url); // Free the memory!
    } catch (error) {
      console.error(
        'Error downloading file:',
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewFile = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/files/${id}/view`, {
        responseType: 'blob',
      });
      console.log(response.data);
      const fileUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers['content-type'] })
      );
      window.open(fileUrl, '_blank');
      // Free the memory after a short delay to ensure the new tab had time to load it
      setTimeout(() => window.URL.revokeObjectURL(fileUrl), 1000);
    } catch (error) {
      console.error(
        'Error viewing file:',
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center w-full relative z-50">
        <BackButton />
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-5 h-5 transition-transform ${showActions ? 'rotate-45' : ''}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            {showActions ? 'Close Menu' : 'Add New'}
          </button>

          {showActions && (
            <div className="absolute top-12 right-0 w-125 max-w-[90vw] flex flex-col justify-center items-center gap-4 bg-white p-4 rounded-xl shadow-2xl border border-gray-200 transition-all animate-in fade-in zoom-in-95 duration-200">
              <FolderCreate
                setCurrFolders={setFolders}
                currFolders={folders}
                parentFolderId={folderId || null}
              />
              <FileUpload
                setCurrFiles={setFiles}
                parentFolderId={folderId || null}
              />
            </div>
          )}
        </div>
      </div>

      <FolderList
        folders={folders}
        handleRename={handleRename}
        handleDelete={handleDelete}
      />

      <FileList
        files={files}
        handleDownloadFile={handleDownloadFile}
        handleDeleteFile={handleDeleteFile}
        handleViewFile={handleViewFile}
      />
    </div>
  );
};
export default Folders;
