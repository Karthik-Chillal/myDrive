import Folders from '../models/Folders.js';
import Files from '../models/Files.js';

export const search = async (req, res) => {
  try {
    const { search } = req.query;
    const { folderId } = req.params;

    if (!search) {
      return res.status(400).json({
        error: 'Search query is required',
      });
    }

    const query = search.trim().toLowerCase();

    // Fetch all folders and files belonging to the user
    const folders = await Folders.find({
      user: req.userId,
    });

    const files = await Files.find({
      user: req.userId,
    });

    // folderId -> folder
    const folderMap = new Map();

    for (const folder of folders) {
      folderMap.set(folder._id.toString(), folder);
    }

    // parentFolderId -> child folders
    const childrenMap = new Map();

    for (const folder of folders) {
      const parentId = folder.parent_folder_id
        ? folder.parent_folder_id.toString()
        : null;

      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, []);
      }

      childrenMap.get(parentId).push(folder);
    }

    // folderId -> files
    const fileMap = new Map();

    for (const file of files) {
      const parentId = file.parent_folder_id
        ? file.parent_folder_id.toString()
        : null;

      if (!fileMap.has(parentId)) {
        fileMap.set(parentId, []);
      }

      fileMap.get(parentId).push(file);
    }

    const results = [];

    function dfs(currentFolderId) {
      const folder = folderMap.get(currentFolderId);

      if (!folder) return;

      // Search folder name
      if (folder.folder_name.toLowerCase().includes(query)) {
        results.push({
          type: 'folder',
          data: folder,
        });
      }

      // Search files inside current folder
      const currentFiles = fileMap.get(currentFolderId) || [];

      for (const file of currentFiles) {
        if (file.file_name.toLowerCase().includes(query)) {
          results.push({
            type: 'file',
            data: file,
          });
        }
      }

      // Visit child folders
      const children = childrenMap.get(currentFolderId) || [];

      for (const child of children) {
        dfs(child._id.toString());
      }
    }

    // Verify starting folder exists
    if (!folderMap.has(folderId)) {
      return res.status(404).json({
        error: 'Folder not found',
      });
    }

    dfs(folderId);

    return res.status(200).json(results);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};
