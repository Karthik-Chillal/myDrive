const Storage = () => {
  return (
    <div>
      <h2>Storage</h2>
      <p>Usage: 0 bytes of 15 GB used</p>
      <div
        style={{
          width: '300px',
          height: '20px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          overflow: 'hidden',
          marginTop: '10px',
        }}
      >
        <div
          style={{ width: '0%', height: '100%', backgroundColor: '#4caf50' }}
        ></div>
      </div>
    </div>
  );
};

export default Storage;
