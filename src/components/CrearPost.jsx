import React, { useState } from 'react';
import axios from 'axios';
import './CrearPost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleCreatePost = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const newPost = {
        userId: userId,
        title: title,
        content: content,
        likes: 0,
        dateTime: new Date().toISOString(),
      };

      const response = await axios.post('http://localhost:8080/api/v1/user/post/create', newPost);
      console.log(response.data);

      // Redireccionar a la página de inicio u otra página después de crear el post
      window.location.href = '/home';
    } catch (error) {
      console.error('Error creating post:', error);
      // Manejar cualquier error de creación de post
    }
  };


  return (
    <div className="create-post-container">
        <div className="create-post-wrapper">
            <h2>Crear Nuevo Post</h2>
            <div className="create-post-content">
                <label className="create-post-input-label">Título:</label>
                <input
                    className="create-post-input"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                />
                <label className="create-post-input-label">Contenido:</label>
                <textarea
                    className="create-post-input"
                    value={content}
                    onChange={handleContentChange}
                />
            </div>
            <div className="create-post-buttons">
                <button className="create-post-button" onClick={handleCreatePost}>
                    Crear Post
                </button>
            </div>
        </div>
    </div>
);
};

export default CreatePost;