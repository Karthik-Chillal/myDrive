const FileList = ({
  files,
  handleDownloadFile,
  handleDeleteFile,
  handleViewFile,
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Files</h3>
      {files && files.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file._id}
              className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4 overflow-hidden">
                <svg
                  className="w-8 h-8 text-gray-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <button
                  className="font-medium text-gray-700 truncate hover:text-blue-600 focus:outline-none bg-transparent border-none p-0 cursor-pointer text-left"
                  title={file.file_name}
                  onClick={() => handleViewFile(file._id)}
                >
                  {file.file_name}
                </button>
              </div>
              <div className="flex justify-end gap-2 mt-auto">
                <button
                  onClick={() => handleDownloadFile(file._id, file.file_name)}
                  className="text-sm font-medium px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDeleteFile(file._id)}
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
          No files yet.
        </p>
      )}
    </div>
  );
};

export default FileList;
