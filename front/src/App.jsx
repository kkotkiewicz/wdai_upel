import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    console.log(formData)

    try {
      await axios.post('http://localhost:3000/upload', formData);
      alert('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to upload image');
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileInputChange} />
        <button type="submit">Upload</button>
      </form>
    </>
  );
};

export default App;