import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Mapa.css";
import Maps from "../components/mapa/maps";
import axios from 'axios';


const Mapa = () => {
    const [userLocations, setUserLocations] = useState([]);
    const userIdFromLocalStorage = Number(localStorage.getItem('userId'));
    const currentDate = new Date();
    const currentDateTime = currentDate.toISOString();

    useEffect(() => {

        const saveUserLocationToDatabase = async (userIdFromLocalStorage,latitude, longitude, currentDateTime) => {
            try {
                console.log("id: ",userIdFromLocalStorage);
                console.log("Latitude:", latitude);
                console.log("Longitude:", longitude);
                console.log("Current Time:",typeof currentDateTime );
                const userLocationData = {
                    userId: userIdFromLocalStorage,
                    longitud: longitude,
                    latitud: latitude,
                    dateTime: currentDateTime
                  };
                const response = await axios.post("http://localhost:8080/api/v1/user/location", userLocationData);
                console.log(response.data); // Puedes manejar la respuesta del backend aquí
            } catch (error) {
                console.error("Error al guardar la ubicación:", error);
            }
        };

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        saveUserLocationToDatabase(userIdFromLocalStorage,latitude, longitude,currentDateTime);
                    },
                    (error) => {
                        console.error("Error al obtener la ubicación:", error);
                    }
                );
            } else {
                console.error("Geolocalización no es soportada por este navegador.");
            }
        };

        getLocation();
    }, []);

    useEffect(() => {

        // Función para obtener la ubicación de todos los usuarios desde el backend
        const fetchUserLocations = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/v1/user/mapa/details");
                if (response.ok) {
                    const data = await response.json();
                    setUserLocations(data);
                    console.log(data); // Actualiza el estado con la ubicación de los usuarios
                } else {
                    console.error("Error al obtener la ubicación de los usuarios");
                }
            } catch (error) {
                console.error("Error de red:", error);
            }
        };

        fetchUserLocations(); // Llama a la función al cargar el componente
    }, []);
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
            <Maps userLocations={userLocations} userId={userIdFromLocalStorage}/>
        </div>
    );
};

export default Mapa;