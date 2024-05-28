import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'semantic-ui-react';

const CrearComentario = ({ postId, onCommentCreated }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    try {
      if (content.trim() === '') {
        return; // Evitar enviar un comentario vacío
      }

      const response = await axios.post(`http://localhost:8080/api/v1/user/post/${postId}/comment`, {
        content: content
      });

      // Llamar a la función de devolución de llamada cuando se crea el comentario exitosamente
      if (response.status === 200) {
        onCommentCreated(postId);
        setContent('');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div className="crear-comentario">
      <Form onSubmit={handleSubmit}>
        <Form.TextArea
          placeholder="Escribe tu comentario..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit" primary>Enviar</Button>
      </Form>
    </div>
  );
};

export default CrearComentario;
