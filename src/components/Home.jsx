import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { List, Image, Button, Modal } from 'semantic-ui-react'; // Agrega Modal aquí
import CrearPost from './CrearPost'; // Importa el componente CrearPost aquí
import CrearComentario from './CrearComentario';
import "./Home.css";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [amigas, setAmigas] = useState([]);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [pendingFriendRequests, setPendingFriendRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    window.history.replaceState(null, "", "/home");
    fetchAllUsers();
    const userIdFromLocalStorage = localStorage.getItem('userId');
    if (userIdFromLocalStorage) {
      setLoggedInUserId(userIdFromLocalStorage);
      fetchAmigas(userIdFromLocalStorage);
      fetchAllPosts();
      if (loggedInUserId) {
        fetchNotifications(loggedInUserId);
      }
    }
  },  [loggedInUserId]);

  const fetchNotifications = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/user/friendRequest/pending/${userId}`);
        const friendRequests = response.data.map(request => ({
            requestId: request.id,  // Asegúrate de mapear el id de la solicitud
            senderId: request.senderId,
            type: 'friend_request_received'
        }));
        setNotifications(friendRequests);
    } catch (error) {
        console.error('Error fetching notifications:', error);
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
  const fetchCommentsForPost = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/user/post/${postId}/comments`);
      console.log('Comments for post:', response.data);

      // Actualiza la lista de comentarios para el post específico
      const updatedPosts = posts.map(p => {
        if (p.postId === postId) {
          return { ...p, comments: response.data };
        }
        return p;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error fetching comments for post:', error);
    }
  };


  const handleConnect = async (friendId) => {
    try {
      await axios.post(`http://localhost:8080/api/v1/user/friendRequest/send/${loggedInUserId}/${friendId}`);
      setNotifications([...notifications, { type: 'friend_request_sent', userId: friendId }]);
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

  const handleOpenCommentModal = (postId) => {
    setSelectedPostId(postId);
    setShowCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPostId(null);
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
                      <Button className="connect-button" onClick={() => handleConnect(user.id)}>Conectar</Button>
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
                      <button className="comment-button" onClick={() => handleOpenCommentModal(post.postId)}>
                        Comentar
                      </button>
                      <span className="comment-count">{post.commentCount}</span>
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
                    {post.comments && (
                      <div className="comments-section">
                        <h5>Comentarios</h5>
                        {post.comments.map(comment => (
                          <div key={comment.commentId} className="comment-container">
                            <p>{comment.content}</p>
                          </div>
                        ))}
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
      <CrearPost parentId={selectedPostId} onPostCreated={handlePostCreated} />
      <Modal open={showCommentModal} onClose={handleCloseCommentModal}>
        <Modal.Header>Crear Comentario</Modal.Header>
        <Modal.Content>
          <CrearComentario postId={selectedPostId} onCommentCreated={fetchCommentsForPost} />
        </Modal.Content>
      </Modal>
        
         {/* Mostrar notificaciones */}
          {notifications.map(notification => (
                  <div key={notification.requestId}>
                    {notification.type === 'friend_request_received' && (
                      <div>
                        <span>Solicitud de amistad de {notification.senderId}</span>
                        <Button onClick={() => handleAcceptFriendRequest(notification.requestId, notification.senderId)}>Aceptar</Button>
                        <Button>Cancelar</Button>
                      </div>
                    )}
                  </div>
                ))}

        </div>
      );
      
}

export default Home;

