import { Link, useNavigate } from 'react-router-dom';

const FolderList = ({ folders, handleRename, handleDelete }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Folders</h3>
      {folders && folders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              onDoubleClick={() => navigate(`/folders/${folder._id}`)}
            >
              <div className="flex items-center gap-3 mb-4 overflow-hidden">
                <svg
                  className="w-8 h-8 text-blue-500 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                <Link
                  to={`/folders/${folder._id}`}
                  className="font-medium text-gray-700 hover:text-blue-600 truncate"
                >
                  {folder.folder_name}
                </Link>
              </div>
              <div className="flex justify-end gap-2 mt-auto">
                <button
                  onClick={() => handleRename(folder._id, folder.folder_name)}
                  className="text-sm font-medium px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Rename
                </button>
                <button
                  onClick={() => handleDelete(folder._id)}
                  className="text-sm font-medium px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm bg-gray-50 border border-gray-100 p-4 rounded-lg inline-block">
          No folders yet.
        </p>
      )}
    </div>
  );
};

export default FolderList;
