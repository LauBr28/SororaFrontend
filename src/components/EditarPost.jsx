import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditarPost.css';
import { useParams } from 'react-router-dom';

const EditarPost = () => {
  const { postId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    console.log('postId from useParams:', postId); // Log para verificar postId
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/user/post/${postId}`);
      console.log('Fetched post data:', response.data); // Log para verificar la respuesta
      const { title, content } = response.data;
      setTitle(title);
      setContent(content);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedPost = {
        title: title,
        content: content,
      };

      await axios.post(`http://localhost:8080/api/v1/user/post/update/${postId}`, updatedPost);
      window.location.href = '/home';
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="editar-post-container">
      <div className="editar-post-wrapper">
        <h2>Editar Post</h2>
        <div className="editar-post-content">
          <label className="editar-post-input-label">Título:</label>
          <input
            className="editar-post-input"
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
          <label className="editar-post-input-label">Contenido:</label>
          <textarea
            className="editar-post-input"
            value={content}
            onChange={handleContentChange}
          />
        </div>
        <div className="editar-post-buttons">
          <button className="editar-post-button" onClick={handleSaveChanges}>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarPost;
