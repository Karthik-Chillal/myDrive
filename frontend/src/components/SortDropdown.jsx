import React from 'react';

const SortDropdown = (props) => {
  const { folders, setFolders, files, setFiles } = props;

  const handleSortChange = (e) => {
    const criteria = e.target.value;
    if (!criteria) return;

    if (folders && setFolders) {
      const sortedFolders = [...folders].sort((a, b) => {
        if (criteria === 'name-asc') {
          return a.folder_name.localeCompare(b.folder_name);
        } else if (criteria === 'name-desc') {
          return b.folder_name.localeCompare(a.folder_name);
        } else if (criteria === 'date-asc') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (criteria === 'date-desc') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });
      setFolders(sortedFolders);
    }

    if (files && setFiles) {
      const sortedFiles = [...files].sort((a, b) => {
        if (criteria === 'name-asc') {
          return a.file_name.localeCompare(b.file_name);
        } else if (criteria === 'name-desc') {
          return b.file_name.localeCompare(a.file_name);
        } else if (criteria === 'date-asc') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (criteria === 'date-desc') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });
      setFiles(sortedFiles);
    }
  };

  return (
    <div>
      <label htmlFor="sort-select">Sort by: </label>
      <select id="sort-select" onChange={handleSortChange} defaultValue="">
        <option value="" disabled>
          Select option
        </option>
        <option value="name-asc">Alphabetically (A to Z)</option>
        <option value="name-desc">Alphabetically (Z to A)</option>
        <option value="date-asc">Date Added (Oldest first)</option>
        <option value="date-desc">Date Added (Newest first)</option>
      </select>
    </div>
  );
};

export default SortDropdown;
