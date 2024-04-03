import React from "react";
import { Link } from "react-router-dom";
import "./Mapa.css";

const Mapa = () => {
  const handleLogout = () => {
    window.location.href = "/loginForm"; // Redirige al usuario al componente de inicio de sesión
  };

  return (
    <div className="mapa-container">
      <div className="transparent-square"></div>
      <div className="black-bar">
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
      <h1>This is the Mapa component</h1>
    </div>
  );
};

export default Mapa;
