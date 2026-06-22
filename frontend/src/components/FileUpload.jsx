import { useState } from 'react';
import api from '../services/api';
import { FileUpload as UIFileUpload } from '@/components/application/file-upload/file-upload-base';

const FileUpload = (props) => {
  const { setCurrFiles, parentFolderId } = props;
  const [uploadingFiles, setUploadingFiles] = useState([]);

  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    const newUploads = fileArray.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      failed: false,
    }));

    setUploadingFiles((prev) => [...prev, ...newUploads]);

    const uploadUrl = parentFolderId
      ? `/files/${parentFolderId}/upload`
      : '/files/home/upload';

    // Create an array of upload promises to run concurrently
    const uploadPromises = newUploads.map(async (uploadItem) => {
      const formData = new FormData();
      formData.append('ufile', uploadItem.file);

      try {
        await api.post(uploadUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadingFiles((prev) =>
                prev.map((item) =>
                  item.id === uploadItem.id
                    ? { ...item, progress: percentCompleted }
                    : item
                )
              );
            }
          },
        });

        // Automatically hide the progress bar 2 seconds after completion
        setTimeout(() => {
          setUploadingFiles((prev) =>
            prev.filter((item) => item.id !== uploadItem.id)
          );
        }, 2000);
      } catch (error) {
        console.error(
          'Error uploading file:',
          error.response?.data || error.message
        );
        setUploadingFiles((prev) =>
          prev.map((item) =>
            item.id === uploadItem.id ? { ...item, failed: true } : item
          )
        );
      }
    });

    // Wait for all uploads to finish
    await Promise.all(uploadPromises);

    try {
      let fetchedFiles;
      if (parentFolderId) {
        const res = await api.get(`/folders/${parentFolderId}`);
        fetchedFiles = res.data.files;
      } else {
        const res = await api.get('/folders/');
        fetchedFiles = res.data.contents.files;
      }
      setCurrFiles(fetchedFiles);
    } catch (e) {
      console.error(e);
    }
  };

  const removeUpload = (id) => {
    setUploadingFiles((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <UIFileUpload.Root className="w-full">
      <UIFileUpload.DropZone
        allowsMultiple={true}
        onDropFiles={handleUploadFiles}
        hint="Drag & drop or click to upload"
      />
      {uploadingFiles.length > 0 && (
        <UIFileUpload.List className="mt-4">
          {uploadingFiles.map((item) => (
            <UIFileUpload.ListItemProgressBar
              key={item.id}
              name={item.file.name}
              size={item.file.size}
              progress={item.progress}
              failed={item.failed}
              onDelete={() => removeUpload(item.id)}
              onRetry={() => {
                removeUpload(item.id);
                handleUploadFiles([item.file]);
              }}
            />
          ))}
        </UIFileUpload.List>
      )}
    </UIFileUpload.Root>
  );
};

export default FileUpload;
