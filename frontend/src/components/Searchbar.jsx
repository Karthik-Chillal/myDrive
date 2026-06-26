import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Searchbar.css';

const Searchbar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { folderId } = useParams();
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const searchFolderId = folderId || 'home';

    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await api.get(
        `/search/${searchFolderId}/search?search=${query}`
      );
      setResults(response.data);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result) => {
    setIsOpen(false);
    setQuery('');
    setHasSearched(false);
    if (result.type === 'folder') {
      navigate(`/folders/${result.data._id}`);
    } else if (result.type === 'file') {
      if (result.data.parent_folder_id) {
        navigate(`/folders/${result.data.parent_folder_id}`);
      }
    }
  };

  return (
    <div className="relative z-50" ref={searchRef}>
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center px-3 py-2 w-96 relative"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 text-gray-400 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          placeholder="Search files and folders..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none text-sm text-gray-700 bg-transparent w-full"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="ml-2 text-sm text-blue-600 font-medium hover:text-blue-800 disabled:opacity-50 transition-colors"
        >
          {isLoading ? '...' : 'Search'}
        </button>
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-100 flex flex-col py-2 animate-in fade-in zoom-in-95 duration-200">
          {results.map((result) => (
            <div
              key={result.data._id}
              onClick={() => handleResultClick(result)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-b-0"
            >
              {result.type === 'folder' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-blue-500"
                >
                  <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-gray-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM12.75 12a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V18a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V12z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {result.type === 'folder'
                    ? result.data.folder_name
                    : result.data.file_name}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {result.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && hasSearched && results.length === 0 && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-100 p-6 text-center">
          <p className="text-sm text-gray-500">
            No results found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
