import React, { useState } from 'react';
import axios from 'axios';

const CrearPost = ({ parentId = null, onPostCreated }) => {
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
        parentId: parentId, // Identificador del post padre, si existe
        dateTime: new Date().toISOString(),
      };

      const response = await axios.post('http://localhost:8080/api/v1/user/post/create', newPost);
      console.log(response.data);

      // Llamar a la función de devolución de llamada para manejar el post creado
      if (onPostCreated) {
        onPostCreated(response.data);
      }

      // Limpiar los campos después de crear el post
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
      // Manejar cualquier error de creación de post
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-wrapper">
        <h2>Crear Nuevo {parentId ? 'Comentario' : 'Post'}</h2>
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
            Crear {parentId ? 'Comentario' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearPost;
