import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const currentDate = new Date(); // Obtiene la fecha y hora actual del sistema
const formattedDate = currentDate.toISOString(); // Convierte la fecha a formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)


  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleCreatePost = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Obtener userId del localStorage
      const newPost = {
        user: {
          id: userId,
        },
        content: content,
        likes: 0,
        createdAt: new Date().toISOString(), // Obtener la fecha y hora actual
      };
      const response = await axios.post('http://localhost:8080/api/v1/user/addPost', newPost);
      console.log(response.data); // Manejar la respuesta según sea necesario
      // Redireccionar a la página de inicio u otra página después de crear el post
      window.location.href = '/home';
    } catch (error) {
      console.error('Error creating post:', error);
      // Manejar cualquier error de creación de post
    }
  };

  return (
    <div className="create-post-wrapper">
      <h2>Crear Nuevo Post</h2>
      <label>Contenido:</label>
      <textarea value={content} onChange={handleContentChange} />
      <button onClick={handleCreatePost}>Crear Post</button>
    </div>
  );
};

export default CreatePost;
