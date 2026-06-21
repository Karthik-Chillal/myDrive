import api from '../services/api';
const FileUpload = (props) => {
  const { setCurrFiles, parentFolderId } = props;
  const handleUploadFile = async (e) => {
    e.preventDefault();
    const fileInput = e.target.ufile.files[0];
    if (!fileInput) return;
    const formData = new FormData();
    formData.append('ufile', fileInput);

    const uploadUrl = parentFolderId
      ? `/files/${parentFolderId}/upload`
      : '/files/home/upload';
    try {
      const response = await api.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let fetchedFiles;
      if (parentFolderId) {
        const res = await api.get(`/folders/${parentFolderId}`);
        fetchedFiles = res.data.files;
      } else {
        const res = await api.get('/folders/');
        fetchedFiles = res.data.contents.files;
      }
      setCurrFiles(fetchedFiles);
      console.log(response.data);
      e.target.reset();
    } catch (error) {
      console.error(
        'Error uploading file:',
        error.response?.data || error.message
      );
    }
  };
  return (
    <form onSubmit={handleUploadFile} style={{ marginTop: '10px' }}>
      <label htmlFor="file-upload">Upload File: </label>
      <input type="file" name="ufile" id="file-upload" required />
      <button type="submit">submit</button>
    </form>
  );
};

export default FileUpload;
