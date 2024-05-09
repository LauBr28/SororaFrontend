import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { List, Image, Button } from 'semantic-ui-react';
import "./Home.css";



const Home = () => {
  const [users, setUsers] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [amigas, setAmigas] = useState([]);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  // Modificar la estructura de cada post para incluir likes y estado de like
  const initialPostState = {
    postId: null,
    username: "",
    title: "",
    content: "",
    likes: 0,
    likedByUser: false,  // Nuevo estado para indicar si el usuario ha dado like
    commentCount: 0
  };
  useEffect(() => {
    // Reemplaza la entrada en el historial de navegación para evitar retroceder a la página de inicio de sesión
    window.history.replaceState(null, "", "/home");
    // Obtener todos los usuarios al cargar el componente
    fetchAllUsers();
    const userIdFromLocalStorage = localStorage.getItem('userId');
    if (userIdFromLocalStorage) {
      setLoggedInUserId(userIdFromLocalStorage);
      // Cargar los posts del usuario al iniciar sesión
      fetchAmigas(userIdFromLocalStorage);
      fetchAllPosts();
    }
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/user/posts/all");
      console.log('Posts:', response.data); // Imprimir los posts en la consola
  
      // Actualizar el estado de los posts con la cantidad de comentarios
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
      console.log('Users:', response.data); // Imprime los usuarios en la consola
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAmigas = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/user/friends?userId=${userId}`);
      console.log('Amigas:', response.data);
      setAmigas(response.data);
    } catch (error) {
      console.error('Error fetching amigas:', error);
    }
  };


  const handleConnect = async (friendId) => {
    try {
      // Realizar la solicitud POST para conectar usuarios como amigos
      await axios.post(`http://localhost:8080/api/v1/user/connect/${loggedInUserId}/${friendId}`);
  
      // Después de la conexión exitosa, obtener la lista actualizada de amigas
      fetchAmigas(loggedInUserId);
    } catch (error) {
      console.error('Error connecting with user:', error);
      // Manejar cualquier error de conexión o procesamiento de datos
    }
  };


  const handleLogout = () => {
    window.location.href = "/loginForm";
  };


const handleLike = async (postId) => {
  try {
    if (!likedPosts.includes(postId)) {
      // Enviar solicitud de like al servidor
      await axios.post(`http://localhost:8080/api/v1/user/post/like/${postId}`);
      // Actualizar el estado local para reflejar que el usuario ha dado like al post
      const updatedPosts = posts.map((p) => {
        if (p.postId === postId) {
          return { ...p, likes: p.likes + 1, likedByUser: true };
        }
        return p;
      });
      // Actualizar el estado de likedPosts
      setLikedPosts([...likedPosts, postId]);
      // Actualizar el estado de los posts
      setPosts(updatedPosts);
    }
  } catch (error) {
    console.error('Error dando like:', error);
    // Manejar cualquier error de conexión o procesamiento de datos
  }
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
                     {/* Botón de Comentarios y cantidad */}
                      <Link to={`/post/${post.postId}`} className="comment-button">
                        Comentarios
                      </Link>
                      <span className="comment-count">{post.commentCount}</span>
                                            
                      {/* Botón de Likes (corazón) */}
                      <button
                        className="like-button"
                        onClick={() => handleLike(post.postId)}
                        style={{ color: post.likedByUser ? "red" : "black" }}
                      >
                        ❤️
                      </button>
                      <span className="like-count">{post.likes}</span> {/* Mostrar cantidad de likes */}
     
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay posts disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
  
};


export default Home;