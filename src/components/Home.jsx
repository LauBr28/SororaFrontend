import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "./Home.css";

const Home = () => {
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  useEffect(() => {
    // Reemplaza la entrada en el historial de navegación para evitar retroceder a la página de inicio de sesión
    window.history.replaceState(null, "", "/home");
    
    // Obtener la imagen del perfil al cargar el componente
    fetchProfilePicture();
  }, []);

  const fetchProfilePicture = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/user/profile/picture`);
      console.log('Response:', response); // Imprime la respuesta en la consola
      const profilePictureUrl = response.data.profilePictureUrl;
      setProfilePictureUrl(profilePictureUrl);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };
  

  const handleLogout = () => {
    window.location.href = "/loginForm";
  };

  return (
    <div className="home-container">
      <div className="transparent-square"></div>
      <div className="black-bar">
        <Link to="/profile" className="profile-link">
          <img src={profilePictureUrl} className="profile-button-image" />
          Go to profile
        </Link>
        <Link to="/mapa" className="map-link">
          Mapa
        </Link>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Home;
