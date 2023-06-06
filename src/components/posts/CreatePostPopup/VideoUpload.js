import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = ({ user, onVideoUploaded }) => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('video', file);
    formData.append('user', user);
    formData.append('text', text);

    try {
      const response = await axios.post('http://localhost:8000/videopost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.videoUrl) {
        onVideoUploaded(response.data.videoUrl);
      }

  alert('Video uploaded successfully!');
} catch (error) {
  alert('Failed to upload video');
}
// ...

  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="video/*" onChange={handleFileChange} required />
      <textarea onChange={handleTextChange} value={text} placeholder="Add a description..." required />
      <button type="submit">Upload</button>
    </form>
  );
}

export default VideoUpload;
