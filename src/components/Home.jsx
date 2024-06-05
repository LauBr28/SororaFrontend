import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { List, Image, Button, Modal } from 'semantic-ui-react'; // Agrega Modal aquí
import CrearPost from './CrearPost'; // Importa el componente CrearPost aquí
import "./Home.css";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [amigas, setAmigas] = useState([]);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [pendingFriendRequests, setPendingFriendRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [comments, setComments] = useState({});
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentBeingEdited, setCommentBeingEdited] = useState(null);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [requestedUsers, setRequestedUsers] = useState([]);


  useEffect(() => {
    window.history.replaceState(null, "", "/home");
    fetchAllUsers();
    const userIdFromLocalStorage = localStorage.getItem('userId');
    if (userIdFromLocalStorage) {  
      setLoggedInUserId(userIdFromLocalStorage);
      fetchAmigas(userIdFromLocalStorage);
      fetchAllPosts();
      fetchUsername(userIdFromLocalStorage);
      if (loggedInUserId) {
        fetchNotifications(loggedInUserId);
      }
    }
    console.log("LoggedInUsername:", loggedInUsername);
  }, [loggedInUserId, loggedInUsername]);
  

  const fetchNotifications = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/user/friendRequest/pending/${userId}`);
        const friendRequests = response.data.map(async (request) => {
            const senderResponse = await axios.get(`http://localhost:8080/api/v1/user/username/${request.senderId}`);
            return {
                requestId: request.id,
                senderId: request.senderId,
                senderUsername: senderResponse.data,
                type: 'friend_request_received'
            };
        });
        const resolvedRequests = await Promise.all(friendRequests);
        setNotifications(resolvedRequests);
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};


const fetchUsername = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/user/username/${userId}`);
    setLoggedInUsername(response.data);
    localStorage.setItem('username', response.data); // Store the username in local storage
  } catch (error) {
    console.error('Error fetching username:', error);
  }
};

  

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/user/posts/all");
      const updatedPosts = response.data.map(post => ({
        ...post,
        username: post.username,
        commentCount: post.comments ? post.comments.length : 0
      }));
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/user/all");
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAmigas = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/user/friends?userId=${userId}`);
      setAmigas(response.data);
    } catch (error) {
      console.error('Error fetching amigas:', error);
    }
  };

  const handleConnect = async (friendId) => {
    try {
      await axios.post(`http://localhost:8080/api/v1/user/friendRequest/send/${loggedInUserId}/${friendId}`);
      setNotifications([...notifications, { type: 'friend_request_sent', userId: friendId }]);
      setRequestedUsers([...requestedUsers, friendId]);
      setConnectionMessage("Solicitud enviada");
      setTimeout(() => {
        setConnectionMessage(""); // Oculta el mensaje después de 3 segundos
      }, 3000);
    } catch (error) {
      console.error('Error connecting with user:', error);
    }
  };
  
  
  const handleLogout = () => {
    window.location.href = "/loginForm";
  };

  const handleLike = async (postId) => {
    try {
      if (!likedPosts.includes(postId)) {
        await axios.post(`http://localhost:8080/api/v1/user/post/like/${postId}`);
        const updatedPosts = posts.map((p) => {
          if (p.postId === postId) {
            return { ...p, likes: p.likes + 1, likedByUser: true };
          }
          return p;
        });
        setLikedPosts([...likedPosts, postId]);
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Error dando like:', error);
    }
  };


  const handleAcceptFriendRequest = async (requestId, senderId) => {

    try {
        const response = await axios.post(`http://localhost:8080/api/v1/user/friendRequest/accept/${requestId}`);
        console.log('Friend request accepted:', response.data);

        // Filtrar la notificación aceptada y actualizar el estado
        setNotifications(notifications.filter(notification => notification.requestId !== requestId));

        // Actualizar la lista de amigas
        fetchAmigas(loggedInUserId);
    } catch (error) {
        console.error('Error accepting friend request:', error.response ? error.response.data : error.message);
    }
};

  
  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/user/post/delete/${postId}`);
      setPosts(posts.filter(post => post.postId !== postId));
    } catch (error) {
      console.error('Error eliminando el post:', error);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([...posts, newPost]);
  };

  const openCommentForm = (postId) => {
    setSelectedPostId(postId);
    setIsCommentFormOpen(true);
    fetchComments(postId);
  };
  
  const closeCommentForm = () => {
    setIsCommentFormOpen(false);
    setSelectedPostId(null);
    setNewCommentContent("");
    setIsEditingComment(false);
    setCommentBeingEdited(null);
  };

    // Función para obtener los comentarios de un post desde el backend
    const fetchComments = async (postId) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/user/comments/${selectedPostId}`);
        // Actualizar el estado de los comentarios para el post seleccionado
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: response.data,
        }));
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
  
  const handleCommentContentChange = (e) => {
    setNewCommentContent(e.target.value);
  };

  const handleSubmitComment = async () => {
    try {
      console.log("LoggedInUsername in handleSubmitComment:", loggedInUsername);
      if (isEditingComment) {
        // Actualiza el comentario existente
        await axios.put(`http://localhost:8080/api/v1/user/comment/update/${commentBeingEdited.commentId}`, {
          content: newCommentContent,
        });
        setIsEditingComment(false);
        setCommentBeingEdited(null);
      } else {
        // Envía el comentario al backend
        await axios.post(`http://localhost:8080/api/v1/user/comment/create/${selectedPostId}`, {
          userId: loggedInUserId,
          username: loggedInUsername,
          content: newCommentContent,
        });
      }
      fetchComments(selectedPostId);
      setNewCommentContent("");
    } catch (error) {
      console.error("Error al crear/actualizar el comentario:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/user/comment/delete/${commentId}`);
      // Eliminar el comentario eliminado del estado de los comentarios
      setComments((prevComments) => {
        const updatedComments = { ...prevComments };
        // Filtrar el comentario eliminado del estado
        updatedComments[selectedPostId] = updatedComments[selectedPostId].filter(comment => comment.commentId !== commentId);
        return updatedComments;
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = (comment) => {
    setNewCommentContent(comment.content);
    setIsEditingComment(true);
    setCommentBeingEdited(comment);
    setIsCommentFormOpen(true);
  };

  
  const filteredUsers = users.filter(user => user.id !== parseInt(loggedInUserId));
  const amigos = users.filter(user => amigas.some(amiga => amiga.id === user.id));
  const noAmigos = users.filter(user => !amigas.some(amiga => amiga.id === user.id) && user.id !== parseInt(loggedInUserId));
  const combinedList = [...amigos, ...noAmigos];

  return (
    <div className="home-container">
      <div className="home-bar">
        <Link to="/profile" className="profile-link">Mi perfil</Link>
        <Link to="/mapa" className="map-link">Mapa</Link>
        <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
      </div>
  
      <div className="custom-list">
        <h3 className="h3-home">SisterHood</h3>
        <List divided relaxed>
          {combinedList.map(user => (
            <List.Item key={user.id} className="profile-item">
              <List.Content>
                <div className="container-datos">
                  <div className="left-div">
                    <Image avatar src={user.userProfileDto?.profilePictureUrl} alt={user.username} />
                  </div>
                  <div className="right-div">
                    <List.Header className="user-fuente">{user.username}</List.Header>
                    <List.Description className="descrip-fuente">{user.userProfileDto?.description}</List.Description>
                    {amigos.includes(user) ? (
                      <span className="amiga-tag">Amiga</span>
                    ) : (
                      <Button
                        className={`connect-button ${requestedUsers.includes(user.id) ? 'requested' : ''}`}
                        onClick={() => handleConnect(user.id)}
                      >
                        {requestedUsers.includes(user.id) ? 'Solicitud enviada' : 'Conectar'}
                      </Button>
                    )}
                  </div>
                </div>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </div>
  
      <div className="foro-container">
        <div className="foro-header">
          <h1>Foro</h1>
        </div>
        <Link to="/crearPost" className="crear-post-link">
          <button className="crear-post-button">Crear Post</button>
        </Link>
  
        <div className="posts-list">
          <h3 className="post-section-title">Últimos Posts</h3>
          {posts.length > 0 ? (
            <div className="post-items">
              {posts.map(post => (
                <div key={post.postId} className="post-container">
                  <div className="post-header">
                    <span className="post-username">{post.username}</span>
                  </div>
                  <div className="post-content">
                    <h4 className="post-title">{post.title}</h4>
                    <p>{post.content}</p>
                    <div className="post-actions">
                      <button className="comment-button" onClick={() => openCommentForm(post.postId)}>Comentar</button>
                      <button
                        className="like-button"
                        onClick={() => handleLike(post.postId)}
                        style={{ color: post.likedByUser ? "red" : "black" }}
                      >
                        ❤️
                      </button>
                      <span className="like-count">{post.likes}</span>
                      {post.userId === parseInt(loggedInUserId) && (
                        <div>
                          <Link to={`/editarPost/${post.postId}`} className="editar-post-link">
                            <button className="editar-post-button">Editar</button>
                          </Link>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(post.postId)}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
  
                    {isCommentFormOpen && selectedPostId === post.postId && (
                      <div className="comment-form">
                        {comments[selectedPostId] && comments[selectedPostId].map((comment, index) => (
                          <div key={index} className="comment-item">
                            <p>{comment.content}</p>
                            <span>Por: {comment.username}</span>
                            {parseInt(comment.userId) === parseInt(loggedInUserId) && (
                              <div>
                                <Button className="edit-button" onClick={() => handleEditComment(comment)}>Editar</Button>
                                <Button className="delete2-button" onClick={() => handleDeleteComment(comment.commentId)}>Eliminar</Button>
                              </div>
                            )}
                          </div>
                        ))}
                        <textarea
                          value={newCommentContent}
                          onChange={handleCommentContentChange}
                          placeholder="Escribe tu comentario aquí..."
                        ></textarea>
                        <button onClick={handleSubmitComment}>
                          {isEditingComment ? "Actualizar" : "Enviar"}
                        </button>
                        <button onClick={closeCommentForm}>Cancelar</button>
                      </div>
                    )}
  
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay posts disponibles.</p>
          )}
        </div>
      </div>
  
      <div className="notifications-container">
        {notifications.map(notification => (
          <div key={notification.requestId} className="notification-item">
            {notification.type === 'friend_request_received' && (
              <div className="friend-request-notification">
                <span>Solicitud de amistad de {notification.senderId}</span>
                <Button className="accept-button" onClick={() => handleAcceptFriendRequest(notification.requestId, notification.senderId)}>Aceptar</Button>
                <Button className="cancel-button">Cancelar</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
  
}
export default Home;

