import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { List, Image,Button } from 'semantic-ui-react';
import "./Home.css";

const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Reemplaza la entrada en el historial de navegación para evitar retroceder a la página de inicio de sesión
    window.history.replaceState(null, "", "/home");
    // Obtener todos los usuarios al cargar el componente
    fetchAllUsers();
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

  const handleLogout = () => {
    window.location.href = "/loginForm";
  };

  const handleConnect = async (friendId) => {

  }

  return (
    <div className="home-container">
      <div className="transparent-square"></div>
      <div className="home-bar">
        <Link to="/profile" className="profile-link">
          Go to profile
        </Link>
        <Link to="/mapa" className="map-link">
          Mapa
        </Link>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
      <div className="custom-list">
        <List divided relaxed >
          {users.map(user => (
            <List.Item key={user.id} className="profile-item">

              <List.Content>

                <div class="container-datos">
                  <div class="left-div">
                    <Image avatar src={user.userProfileDto.profilePictureUrl} alt={user.username} />
                  </div>
                  <div class="right-div">
                    <List.Header className="fuente">{user.username}</List.Header>
                    <List.Description className="fuente">{user.userProfileDto.description}</List.Description>
                    <Button className="connect-button">Conectar</Button>
                  </div>
                </div>

                <div>
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