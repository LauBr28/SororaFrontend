import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { List, Image, Button } from 'semantic-ui-react';
import "./Home.css";
const uniquifier = Math.random().toString(36).substring(7);


const Home = () => {
  const [users, setUsers] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [amigas, setAmigas] = useState([]);


  useEffect(() => {
    // Reemplaza la entrada en el historial de navegación para evitar retroceder a la página de inicio de sesión
    window.history.replaceState(null, "", "/home");
    // Obtener todos los usuarios al cargar el componente
    fetchAllUsers();
    const userIdFromLocalStorage = localStorage.getItem('userId');
    if (userIdFromLocalStorage) {
      setLoggedInUserId(userIdFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    // Reemplaza la entrada en el historial de navegación para evitar retroceder a la página de inicio de sesión
    window.history.replaceState(null, "", "/home");

    // Obtener todos los usuarios al cargar el componente
    fetchAllUsers();

    const userIdFromLocalStorage = localStorage.getItem('userId');
    if (userIdFromLocalStorage) {
      setLoggedInUserId(userIdFromLocalStorage);

      // Cargar la lista de amigas al iniciar sesión
      fetchAmigas(userIdFromLocalStorage);
    }
  }, []);


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


  const handleLogout = () => {
    window.location.href = "/loginForm";
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



  const filteredUsers = users.filter(user => user.id !== parseInt(loggedInUserId));
  const amigos = users.filter(user => amigas.some(amiga => amiga.id === user.id));
  const noAmigos = users.filter(user => !amigas.some(amiga => amiga.id === user.id) && user.id !== parseInt(loggedInUserId));
  const combinedList = [...amigos, ...noAmigos];

  return (
    <div className="home-container">
      <div className="home-bar">
        <Link to="/profile" className="profile-link">
          Mi perfil
        </Link>
        <Link to="/mapa" className="map-link">
          Mapa
        </Link>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
      <div className="custom-list">
        <h3 className={`h3-home honk-${uniquifier}`}>SisterHood  </h3>

        <List divided relaxed>
          {combinedList.map(user => (
            <List.Item key={user.id} className="profile-item">
              <List.Content>
                <div className="container-datos">
                  <div className="left-div">
                    <Image avatar src={user.userProfileDto.profilePictureUrl} alt={user.username} />
                  </div>
                  <div className="right-div">
                    <List.Header className="user-fuente">{user.username}</List.Header>
                    <List.Description className="descrip-fuente">{user.userProfileDto.description}</List.Description>
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
      <div className="Foro">
        <h1>Foro</h1>
      </div>
    </div>
  );
};


export default Home;