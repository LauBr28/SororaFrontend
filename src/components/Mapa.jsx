import React from "react";
import { Link } from "react-router-dom";
import "./Mapa.css";
import Maps from "../components/mapa/Maps";

const Mapa = () => {
  const handleLogout = () => {
    window.location.href = "/loginForm"; // Redirige al usuario al componente de inicio de sesión
  };

  return (
    <div className="mapa-container">
      <div className="transparent-square"></div>
      <div className="black-bar">
        <Link to="/profile" className="profile-link">
          Ir al perfil
        </Link>
        <Link to="/home" className="home-link">
          Home
        </Link>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
      <Maps />
    </div>
  );
};

export default Mapa;
